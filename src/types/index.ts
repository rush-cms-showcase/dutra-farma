export interface Unit {
	id: string
	name: string
	address: string
	neighborhood: string
	city: string
	state: string
	phone: string
	whatsapp?: string
	coordinates: [number, number]
	maps_url?: string
}
