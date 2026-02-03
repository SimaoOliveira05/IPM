import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILE = path.resolve(__dirname, '../src/utils/architectureData.json');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'assets' && f !== 'locales') { // Skip non-code dirs
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

function extractInfo(content, filePath) {
  const info = {
    name: path.basename(filePath, '.vue'),
    path: path.relative(SRC_DIR, filePath),
    props: [],
    emits: [],
    stores: [],
    composables: [],
    children: []
  };

  // Extract Props (simple regex for defineProps keys)
  const propsMatch = content.match(/defineProps\(\s*({[\s\S]*?})\s*\)/) || content.match(/defineProps\(\s*(\[[^\]]*\])\s*\)/);
  if (propsMatch) {
    const rawIds = propsMatch[1];
    // Simple key extraction from object syntax { key: ... }
    const keys = rawIds.match(/(\w+)\s*:/g);
    if (keys) {
      info.props = keys.map(k => k.replace(':', '').trim());
    } else {
       // Array syntax ['key']
       const arrayKeys = rawIds.match(/'(\w+)'|'(\w+)'/g);
       if (arrayKeys) info.props = arrayKeys.map(k => k.replace(/['"]/g, ''));
    }
  }

  // Extract Emits
  const emitsMatch = content.match(/defineEmits\(\s*(\[[^\]]*\])\s*\)/);
  if (emitsMatch) {
    const rawEmits = emitsMatch[1];
    const emitKeys = rawEmits.match(/['"](\w+)['"]/g);
    if (emitKeys) {
        info.emits = emitKeys.map(k => k.replace(/['"]/g, ''));
    }
  }

  // Extract Stores
  // Look for import { useUserStore } from ...
  const storeImports = content.match(/import\s+{([^}]*)}\s+from\s+['"]@\/stores\/[^'"]+['"]/g);
  if (storeImports) {
    storeImports.forEach(imp => {
      const match = imp.match(/use\w+Store/g);
      if (match) info.stores.push(...match);
    });
  }
  // Also valid: import useUserStore from ...
  // Or usage in code if auto-imported (unlikely in this setup but possible).
  // Let's stick to regex on imports + usage check.
  const storeUsage = content.match(/use(\w+)Store/g);
  if (storeUsage) {
      // deduplicate
      storeUsage.forEach(s => {
          if (!info.stores.includes(s)) info.stores.push(s);
      });
  }

  // Extract Composables
  // Look for useX imports that are NOT stores
  // Matches: import { useMarketStats } from '@/composables/...'
  // Just scan for useX usage that isn't a store?
  // Better: Scan imports from '@/composables/...'
  const compImportFull = content.match(/import\s+{?([^}]+)}?\s+from\s+['"]@\/composables\/[^'"]+['"]/g);
  if (compImportFull) {
     compImportFull.forEach(line => {
        const matches = line.match(/use\w+/g);
        if (matches) {
            matches.forEach(m => {
                 if (!info.stores.includes(m) && !info.composables.includes(m)) {
                     info.composables.push(m);
                 }
            });
        }
     });
  }

  // Extract Children Components 
  // Matches: import X from '@/...' or import X from './...'
  const componentImports = content.match(/import\s+(\w+)\s+from\s+['"](@\/|\.\/|\.\.\/)[^'"]+\.vue['"]/g);
  
  if (componentImports) {
    componentImports.forEach(imp => {
      const match = imp.match(/import\s+(\w+)/);
      if (match) info.children.push(match[1]);
    });
  }

  // Special handling for router-view in App.vue or others context
  // If the component contains <router-view>, we might want to hint that it connects to Views
  if (content.includes('<router-view') || content.includes('<RouterView')) {
      // Logic to add all top-level Views as potential children would be cool but complex.
      // For now, let's just make sure imports are caught.
  }

  return info;
}

const components = [];

walkDir(SRC_DIR, (filePath) => {
  if (filePath.endsWith('.vue')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = extractInfo(content, filePath);
    components.push(data);
  }
});

// Post-processing: Connect App to Views manually because of router-view
const appComponent = components.find(c => c.name === 'App');
if (appComponent) {
    const views = components.filter(c => c.path.startsWith('views/') && c.name !== 'App' && !c.name.includes('Overlay'));
    views.forEach(v => {
        if (!appComponent.children.includes(v.name)) {
            appComponent.children.push(v.name);
        }
    });
}


// Create map
const map = {};
components.forEach(c => map[c.name] = c);

// Write
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(components, null, 2));
console.log(`Generated architecture data for ${components.length} components.`);
