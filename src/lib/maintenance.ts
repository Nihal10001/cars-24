const baseCosts: Record<string, number> = {
  "Maruti Swift": 1800,
  "Maruti Baleno": 2000,
  "Maruti Brezza": 2200,
  "Hyundai i20": 2200,
  "Hyundai Creta": 2800,
  "Hyundai Venue": 2400,
  "Tata Nexon": 2300,
  "Tata Harrier": 3000,
  "Tata Tiago": 1900,
};

export function estimateMaintenance(carKey: string, age: number, km: number) {
  const base = baseCosts[carKey] ?? 2000;

  let multiplier = 1;
  if (age >= 6 && km >= 80000) multiplier = 1.6;
  else if (age >= 4 || km >= 50000) multiplier = 1.3;

  const monthly = Math.round(base * multiplier);
  const rating = multiplier >= 1.6 ? "High Maintenance Expected" : multiplier >= 1.3 ? "Moderate Maintenance" : "Low Maintenance";

  const insights : string[] = [];
  const nextService = 10000 - (km % 10000);
  insights.push(`Next major service due in ${nextService.toLocaleString()} km`);
  if (km > 40000) insights.push("Brake pads likely to need replacement soon");
  if (km > 45000) insights.push("Tire replacement expected in the near future");

  return { monthly, yearly: monthly * 12, rating, insights };
}

export const brands: Record<string, string[]> = {
  Maruti: ["Swift", "Baleno", "Brezza"],
  Hyundai: ["i20", "Creta", "Venue"],
  Tata: ["Nexon", "Harrier", "Tiago"],
};