<script setup>
import { computed, onMounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  /**
   * Array of location objects: { lat, lng, label?, id?, price?, rating? }
   * For single location, pass array with 1 item
   */
  locations: {
    type: Array,
    default: () => []
  },
  /**
   * Override auto-centering with specific coordinates
   */
  center: {
    type: Object, // { lat, lng }
    default: null
  },
  /**
   * Initial zoom level
   */
  zoom: {
    type: Number,
    default: 13
  },
  /**
   * Map height (CSS value)
   */
  height: {
    type: String,
    default: '300px'
  },
  /**
   * Allow user interaction (zoom, pan)
   */
  interactive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['marker-click'])

const mapRef = ref(null)

// CartoDB Positron - minimalist light style
const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Compute map center from locations or use provided center
const mapCenter = computed(() => {
  if (props.center) {
    return [props.center.lat, props.center.lng]
  }
  
  if (props.locations.length === 0) {
    // Default to Porto center
    return [41.1579, -8.6291]
  }
  
  if (props.locations.length === 1) {
    return [props.locations[0].lat, props.locations[0].lng]
  }
  
  // Calculate centroid of all locations
  const sumLat = props.locations.reduce((acc, loc) => acc + loc.lat, 0)
  const sumLng = props.locations.reduce((acc, loc) => acc + loc.lng, 0)
  return [sumLat / props.locations.length, sumLng / props.locations.length]
})

// Compute zoom based on number of locations
const mapZoom = computed(() => {
  if (props.locations.length > 1) {
    return 11 // Zoom out a bit to show all markers
  }
  return props.zoom
})

const handleMarkerClick = (location) => {
  emit('marker-click', location)
}

// Fix Leaflet default marker icon issue with bundlers
onMounted(async () => {
  const L = await import('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  })
})
</script>

<template>
  <div class="base-map-container" :style="{ height }">
    <LMap
      ref="mapRef"
      :zoom="mapZoom"
      :center="mapCenter"
      :use-global-leaflet="false"
      :options="{
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive
      }"
    >
      <LTileLayer
        :url="tileUrl"
        :attribution="tileAttribution"
        layer-type="base"
      />
      
      <LMarker
        v-for="(location, index) in locations"
        :key="location.id || index"
        :lat-lng="[location.lat, location.lng]"
        @click="handleMarkerClick(location)"
      >
        <LTooltip 
          v-if="location.label || location.price"
          :options="{ permanent: false, direction: 'top', offset: [0, -20] }"
        >
          <div class="marker-tooltip">
            <strong v-if="location.label" class="tooltip-title">{{ location.label }}</strong>
            <div class="tooltip-details">
              <span v-if="location.price" class="tooltip-price">{{ location.price }}€</span>
              <span v-if="location.rating" class="tooltip-rating">★ {{ location.rating.toFixed ? location.rating.toFixed(1) : location.rating }}</span>
            </div>
            <span class="tooltip-hint">Clique para ver detalhes</span>
          </div>
        </LTooltip>
      </LMarker>
    </LMap>
  </div>
</template>

<style scoped>
.base-map-container {
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 16px var(--color-primary-08);
}

/* Override Leaflet container styles */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  font-family: inherit;
  border-radius: 1rem;
}

/* Tooltip styling */
.marker-tooltip {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 140px;
  max-width: 220px;
}

.tooltip-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary, #0a2540);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tooltip-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.tooltip-price {
  font-weight: 700;
  color: var(--color-accent, #635bff);
}

.tooltip-rating {
  color: var(--text-secondary, #5a7184);
}

.tooltip-hint {
  font-size: 0.7rem;
  color: var(--color-primary-50, #8898aa);
  margin-top: 0.15rem;
}

:deep(.leaflet-tooltip) {
  background: white;
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  padding: 0.65rem 0.85rem;
}

:deep(.leaflet-tooltip-top:before) {
  border-top-color: white;
}
</style>
