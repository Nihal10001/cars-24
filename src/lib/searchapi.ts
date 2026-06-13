export interface Car {
  id: number;
  name: string;
  brand: string;
  fuel: "Petrol" | "Diesel" | "Electric" | "CNG";
  transmission: "Manual" | "Automatic";
  year: number;
  mileage: number; 
  price: number;
  popularity: number; 
}
 
export interface Filters {
  fuel?: string;
  transmission?: string;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
}

export const cars: Car[] = [
  { id: 1, name: "Maruti Swift", brand: "Maruti", fuel: "Petrol", transmission: "Manual", year: 2021, mileage: 23, price: 650000, popularity: 9 },
  { id: 2, name: "Maruti Baleno", brand: "Maruti", fuel: "Petrol", transmission: "Automatic", year: 2022, mileage: 22, price: 780000, popularity: 8 },
  { id: 3, name: "Hyundai Creta", brand: "Hyundai", fuel: "Diesel", transmission: "Automatic", year: 2023, mileage: 21, price: 1400000, popularity: 10 },
  { id: 4, name: "Hyundai i20", brand: "Hyundai", fuel: "Petrol", transmission: "Manual", year: 2020, mileage: 20, price: 850000, popularity: 7 },
  { id: 5, name: "Tata Nexon", brand: "Tata", fuel: "Diesel", transmission: "Manual", year: 2021, mileage: 17, price: 950000, popularity: 8 },
  { id: 6, name: "Tata Nexon EV", brand: "Tata", fuel: "Electric", transmission: "Automatic", year: 2023, mileage: 30, price: 1600000, popularity: 9 },
  { id: 7, name: "Honda City", brand: "Honda", fuel: "Petrol", transmission: "Automatic", year: 2022, mileage: 18, price: 1200000, popularity: 8 },
  { id: 8, name: "Maruti Brezza", brand: "Maruti", fuel: "Petrol", transmission: "Automatic", year: 2023, mileage: 19, price: 1100000, popularity: 9 },
  { id: 9, name: "Hyundai Venue", brand: "Hyundai", fuel: "CNG", transmission: "Manual", year: 2021, mileage: 28, price: 900000, popularity: 7 },
  { id: 10, name: "Tata Harrier", brand: "Tata", fuel: "Diesel", transmission: "Automatic", year: 2022, mileage: 14, price: 1800000, popularity: 6 },
];
 
// Fuzzy match
function fuzzyMatch(query: string, target: string): boolean {
  query = query.toLowerCase();
  target = target.toLowerCase();
  let i = 0;
  for (const ch of target) {
    if (ch === query[i]) i++;
    if (i === query.length) return true;
  }
  return false;
}
 
function scorecar(car: Car, query: string): number {
  let score = 0;
  const q = query.toLowerCase();
  const name = car.name.toLowerCase();
 
  if (name.includes(q)) score += 10;           
  else if (fuzzyMatch(q, name)) score += 5;    
  if (name.startsWith(q)) score += 3;          
  score += car.popularity;                     
  score += (car.year - 2018);                  
 
  return score;
}
 
export function getSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  return cars
    .filter((c) => fuzzyMatch(query, c.name) || fuzzyMatch(query, c.brand))
    .map((c) => c.name)
    .slice(0, 5);
}
 
export function searchCars(query: string, filters: Filters): Car[] {
  return cars
    .filter((c) => {
      if (query && !fuzzyMatch(query, c.name) && !fuzzyMatch(query, c.brand)) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.transmission && c.transmission !== filters.transmission) return false;
      if (filters.yearMin && c.year < filters.yearMin) return false;
      if (filters.yearMax && c.year > filters.yearMax) return false;
      if (filters.mileageMin && c.mileage < filters.mileageMin) return false;
      if (filters.mileageMax && c.mileage > filters.mileageMax) return false;
      return true;
    })
    .sort((a, b) => scorecar(b, query) - scorecar(a, query));
}