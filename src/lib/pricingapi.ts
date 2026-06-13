const regionType: Record<string, "hilly" | "metro" | "normal"> = {
  Shimla: "hilly", Manali: "hilly", Dehradun: "hilly", Darjeeling: "hilly",
  Mumbai: "metro", Delhi: "metro", Bangalore: "metro", Chennai: "metro", Hyderabad: "metro",
  Pune: "normal", Jaipur: "normal", Lucknow: "normal", Bhopal: "normal",
};
 
function getSeason(): "monsoon" | "winter" | "summer" {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return "monsoon";
  if (month >= 11 || month <= 2) return "winter";
  return "summer";
}
 
export function getRecommendedPrice(basePrice: number, carType: "suv" | "hatchback" | "sedan", region: string) {
  const rType = regionType[region] ?? "normal";
  const season = getSeason();
  let multiplier = 1;
 
  if (carType === "suv") {
    if (season === "monsoon") multiplier += 0.08;
    if (rType === "hilly") multiplier += 0.07;
  }
 
  if (carType === "hatchback") {
    if (rType === "metro" && season === "summer") multiplier -= 0.05;
  }
 
  if (carType === "sedan") {
    if (rType === "metro") multiplier += 0.03;
  }
 
  const recommended = Math.round(basePrice * multiplier);
  const diff = recommended - basePrice;
  const reason =
    carType === "suv" && season === "monsoon" ? "SUV demand rises in monsoon season"
    : carType === "suv" && rType === "hilly" ? "High SUV demand in hilly regions"
    : carType === "hatchback" && rType === "metro" && season === "summer" ? "Lower hatchback value in metros during fuel price spikes"
    : carType === "sedan" && rType === "metro" ? "Sedan demand higher in metro cities"
    : "Stable market conditions";
 
  return { recommended, diff, multiplier, season, region, reason };
}
 
export const regions = Object.keys(regionType);
 