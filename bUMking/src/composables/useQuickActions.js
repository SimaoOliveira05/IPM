import { ref, computed } from 'vue'

export function useQuickActions() {
  const showDownload = ref(false)
  const showShare = ref(false)

  const shareLink = computed(() => window.location.href)

  const executeDownload = ({ filename, type, data }) => {
    if (!data) {
      console.log(`Download triggered: ${filename}.${type} (Simulated - no data)`)
      return
    }

    let content, mimeType, extension

    if (type === 'json') {
      content = JSON.stringify(data, null, 2)
      mimeType = 'text/json;charset=utf-8'
      extension = 'json'
    } else if (type === 'txt') {
      content = formatDataAsTxt(data)
      mimeType = 'text/plain;charset=utf-8'
      extension = 'txt'
    } else {
      console.log(`Unknown file type: ${type}`)
      return
    }

    const dataStr = `data:${mimeType},` + encodeURIComponent(content)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${filename}.${extension}`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  // Helper function to format data as plain text
  const formatDataAsTxt = (data, indent = 0) => {
    const lines = []
    const prefix = '  '.repeat(indent)
    
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        lines.push(`${prefix}${key}: -`)
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        lines.push(`${prefix}${key}:`)
        lines.push(formatDataAsTxt(value, indent + 1))
      } else if (Array.isArray(value)) {
        lines.push(`${prefix}${key}: [${value.length} items]`)
        value.slice(0, 5).forEach((item, i) => {
          if (typeof item === 'object') {
            lines.push(`${prefix}  [${i}]:`)
            lines.push(formatDataAsTxt(item, indent + 2))
          } else {
            lines.push(`${prefix}  - ${item}`)
          }
        })
        if (value.length > 5) lines.push(`${prefix}  ... e mais ${value.length - 5} items`)
      } else {
        lines.push(`${prefix}${key}: ${value}`)
      }
    }
    return lines.join('\n')
  }

  return {
    showDownload,
    showShare,
    shareLink,
    executeDownload
  }
}
