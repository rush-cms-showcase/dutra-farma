import type { Unit } from '../types'
import { units } from '../data/units'

// We will load Leaflet lazily to boost PageSpeed
let isLeafletLoaded = false

const loadLeafletDynamically = async () => {
	// @ts-ignore
	if (isLeafletLoaded) return window.L

	await import('leaflet/dist/leaflet.css')
	const leafletModule = await import('leaflet')
	// @ts-ignore
	window.L = leafletModule.default || leafletModule
	isLeafletLoaded = true

	// @ts-ignore
	return window.L
}

export const initMap = async () => {
	const mapElement = document.getElementById('hero-map')
	if (!mapElement || mapElement.dataset.initialized === 'true') return

	mapElement.dataset.initialized = 'true'

	const L = await loadLeafletDynamically()

	const map = L.map('hero-map', {
		attributionControl: false,
		scrollWheelZoom: false,
	}).setView([-23.665, -45.418], 12)

	L.tileLayer(
		'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
		{
			attribution: '&copy; OpenStreetMap &copy; CARTO',
			subdomains: 'abcd',
			maxZoom: 19,
		},
	).addTo(map)

	const customIcon = L.divIcon({
		className: 'custom-div-icon',
		html: `
      <div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
      </div>
    `,
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32],
	})

	units.forEach((unit: Unit) => {
		const [lat, lng] = unit.coordinates

		const popupContent = `
      <div class="p-1 min-w-[200px] font-sans">
        <h3 class="font-bold text-slate-900 text-sm mb-1">${unit.name}</h3>
        <p class="text-xs text-slate-600 mb-2 leading-tight">${unit.address} - ${unit.city}</p>
        <div class="flex items-center gap-1 text-red-600 font-semibold text-xs mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.8 3.08 1.23 4.79 1.23c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.03zM12.04 19.78c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.79.97c-.15.17-.3.19-.55.07c-.55-.25-1.52-.56-2.58-1.51c-.82-.74-1.38-1.65-1.54-1.9c-.16-.25-.02-.38.11-.5c.11-.11.25-.29.37-.44c.12-.15.16-.25.24-.42c.08-.17.04-.32-.02-.44c-.06-.12-.56-1.35-.77-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.45.06-.69.32c-.24.25-.91.89-.91 2.17s.94 2.51 1.07 2.68c.13.17 1.83 2.79 4.43 3.91c2.19.94 3.02 1.07 3.53.91c.64-.2 1.47-.6 1.68-1.18c.2-.58.2-.1.2-.1z"/></svg>
          ${unit.phone}
        </div>
        <div class="flex flex-col gap-1.5 mt-1">
          <a href="${unit.maps_url || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}" target="_blank" rel="noopener noreferrer" class="block w-full text-center bg-slate-900 text-white! hover:bg-slate-800 transition-colors py-2 rounded text-xs font-bold">
            Como chegar
          </a>
          ${
				unit.whatsapp
					? `<a href="https://wa.me/${unit.whatsapp}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1 w-full bg-[#20bd5a] text-white! hover:bg-green-700 transition-colors py-2 rounded text-xs font-bold shadow-sm shadow-[#25D366]/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.8 3.08 1.23 4.79 1.23c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.03zM12.04 19.78c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.79.97c-.15.17-.3.19-.55.07c-.55-.25-1.52-.56-2.58-1.51c-.82-.74-1.38-1.65-1.54-1.9c-.16-.25-.02-.38.11-.5c.11-.11.25-.29.37-.44c.12-.15.16-.25.24-.42c.08-.17.04-.32-.02-.44c-.06-.12-.56-1.35-.77-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.45.06-.69.32c-.24.25-.91.89-.91 2.17s.94 2.51 1.07 2.68c.13.17 1.83 2.79 4.43 3.91c2.19.94 3.02 1.07 3.53.91c.64-.2 1.47-.6 1.68-1.18c.2-.58.2-.1.2-.1z"/></svg>
            WhatsApp
          </a>`
					: ''
			}
          <a href="/lojas/${unit.id}" class="block w-full text-center bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-wider">
            Página da loja
          </a>
        </div>
      </div>
    `

		L.marker([lat, lng], { icon: customIcon })
			.addTo(map)
			.bindPopup(popupContent, {
				closeButton: false,
				className: 'custom-popup font-sans',
			})
	})
}

export const setupHeroMapObserver = () => {
	const mapElement = document.getElementById('hero-map')
	if (!mapElement) return

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					initMap()
					observer.disconnect()
				}
			})
		},
		{ rootMargin: '200px' },
	)

	observer.observe(mapElement)
}

setupHeroMapObserver()
document.addEventListener('astro:page-load', setupHeroMapObserver)
