export interface Listing {
  id: number;
  name: string;
  city: string;
  price: number;
  type: string;
}
 
export interface ServiceCenter {
  name: string;
  city: string;
  lat: number;
  lng: number;
}
 
export const listings: Listing[] = [
  { id: 1, name: "Maruti Swift 2021", city: "Mumbai", price: 650000, type: "Hatchback" },
  { id: 2, name: "Hyundai Creta 2023", city: "Mumbai", price: 1400000, type: "SUV" },
  { id: 3, name: "Tata Nexon 2022", city: "Delhi", price: 950000, type: "SUV" },
  { id: 4, name: "Honda City 2022", city: "Delhi", price: 1200000, type: "Sedan" },
  { id: 5, name: "Maruti Baleno 2022", city: "Bangalore", price: 780000, type: "Hatchback" },
  { id: 6, name: "Tata Nexon EV 2023", city: "Bangalore", price: 1600000, type: "SUV" },
  { id: 7, name: "Hyundai i20 2021", city: "Chennai", price: 850000, type: "Hatchback" },
  { id: 8, name: "Maruti Brezza 2023", city: "Chennai", price: 1100000, type: "SUV" },
];
 
export const serviceCenters: ServiceCenter[] = [
  { name: "Cars24 Hub - Andheri", city: "Mumbai", lat: 19.1136, lng: 72.8697 },
  { name: "Cars24 Hub - Powai", city: "Mumbai", lat: 19.1176, lng: 72.9060 },
  { name: "Cars24 Hub - Dwarka", city: "Delhi", lat: 28.5921, lng: 77.0460 },
  { name: "Cars24 Hub - Lajpat Nagar", city: "Delhi", lat: 28.5677, lng: 77.2433 },
  { name: "Cars24 Hub - Koramangala", city: "Bangalore", lat: 12.9352, lng: 77.6245 },
  { name: "Cars24 Hub - Whitefield", city: "Bangalore", lat: 12.9698, lng: 77.7499 },
  { name: "Cars24 Hub - Adyar", city: "Chennai", lat: 13.0012, lng: 80.2565 },
  { name: "Cars24 Hub - Anna Nagar", city: "Chennai", lat: 13.0850, lng: 80.2101 },
];
 
// City centers for map default view
export const cityCenters: Record<string, { lat: number; lng: number }> = {
  Mumbai:    { lat: 19.0760, lng: 72.8777 },
  Delhi:     { lat: 28.6139, lng: 77.2090 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai:   { lat: 13.0827, lng: 80.2707 },
};
 
export const cities = Object.keys(cityCenters);
 
export const getListingsByCity = (city: string) => listings.filter((l) => l.city === city);
export const getCentersByCity = (city: string) => serviceCenters.filter((s) => s.city === city);