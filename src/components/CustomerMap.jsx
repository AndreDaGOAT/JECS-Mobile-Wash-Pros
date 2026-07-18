import React, { useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { createClient } from '@supabase/supabase-js'

// Fix leaflet's default icon path issue (if needed)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

// Supabase client: prefer env vars; fallback to the provided URL
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://mylqkbpclcrqorjctjxn.supabase.co'
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function ViewportListener({ onBoundsChange }) {
  useMapEvents({
    moveend: (ev) => {
      const map = ev.target
      onBoundsChange(map.getBounds())
    },
    zoomend: (ev) => {
      const map = ev.target
      onBoundsChange(map.getBounds())
    },
  })
  return null
}

export default function CustomerMap({ initialCenter = [39.5, -98.35], initialZoom = 4 }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchIdRef = useRef(0)
  const debounceRef = useRef(null)

  const fetchCustomers = useCallback(async (bounds) => {
    // Debounce quick moves
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const fetchId = ++fetchIdRef.current
      setLoading(true)
      const minLat = bounds.getSouth()
      const maxLat = bounds.getNorth()
      const minLon = bounds.getWest()
      const maxLon = bounds.getEast()

      const { data, error } = await supabase
        .from('customers')
        .select('customer_id,full_name,email,latitude,longitude,formatted_address')
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLon)
        .lte('longitude', maxLon)
        .limit(1000)

      // ensure this result is the latest
      if (fetchId !== fetchIdRef.current) return
      setLoading(false)
      if (error) {
        console.error('Supabase error fetching customers:', error)
        setCustomers([])
        return
      }
      setCustomers(data || [])
    }, 250) // 250ms debounce
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        {loading ? <span>Loading customers…</span> : <span>{customers.length} customers visible</span>}
      </div>

      <MapContainer center={initialCenter} zoom={initialZoom} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ViewportListener onBoundsChange={fetchCustomers} />
        {customers.map((c) => {
          if (c.latitude == null || c.longitude == null) return null
          const lat = parseFloat(c.latitude)
          const lon = parseFloat(c.longitude)
          if (Number.isNaN(lat) || Number.isNaN(lon)) return null
          return (
            <Marker key={c.customer_id} position={[lat, lon]}>
              <Popup>
                <div>
                  <strong>{c.full_name}</strong>
                  <div>{c.formatted_address || c.email}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
