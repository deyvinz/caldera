export interface OptionLine {
  id: string;
  name: string;
  price: number;
  qty?: number;
}

export interface PricingBreakdown {
  base: number;
  options: OptionLine[];
  discount: number;
  taxes: number;
}

export interface PricingResult {
  currency: 'USD';
  breakdown: PricingBreakdown;
  total: number;
  travelers: number;
}

export function calcTotal(opts: {
  basePrice: number;
  discountPercent?: number;
  selectedOptions?: OptionLine[];
  travelers: number;
}): PricingResult {
  const { basePrice, discountPercent = 0, selectedOptions = [], travelers } = opts;
  
  // Base price per package
  const base = basePrice;
  
  // Calculate options total
  const options = selectedOptions.reduce((acc, option) => {
    const qty = option.qty ?? 1;
    return acc + (option.price * qty);
  }, 0);
  
  // Calculate subtotal
  const subtotal = base + options;
  
  // Apply discount (ensure it doesn't exceed subtotal)
  const discount = Math.min(
    Math.round((subtotal * discountPercent) / 100 * 100) / 100,
    subtotal
  );
  
  // Calculate final total (minimum 0)
  const total = Math.max(subtotal - discount, 0);
  
  return {
    currency: 'USD',
    breakdown: {
      base,
      options: selectedOptions,
      discount,
      taxes: 0, // MVP: no taxes
    },
    total: Number(total.toFixed(2)),
    travelers,
  };
}

export function calculatePerPersonPrice(totalPrice: number, travelers: number): number {
  if (travelers <= 0) return 0;
  return Number((totalPrice / travelers).toFixed(2));
}

export function applySeasonalMultiplier(basePrice: number, multiplier: number): number {
  return Number((basePrice * multiplier).toFixed(2));
}

export function calculateGroupDiscount(basePrice: number, travelers: number): number {
  // MVP: Simple group discount logic
  if (travelers >= 10) return 15; // 15% off for 10+ travelers
  if (travelers >= 6) return 10;  // 10% off for 6+ travelers
  if (travelers >= 4) return 5;   // 5% off for 4+ travelers
  return 0;
}
