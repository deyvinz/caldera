import { calcTotal, calculatePerPersonPrice, calculateGroupDiscount } from '../src/lib/price';

describe('Price Calculations', () => {
  describe('calcTotal', () => {
    it('should calculate total with base price only', () => {
      const result = calcTotal({
        basePrice: 1000,
        travelers: 2,
      });

      expect(result.total).toBe(1000);
      expect(result.currency).toBe('USD');
      expect(result.travelers).toBe(2);
      expect(result.breakdown.base).toBe(1000);
      expect(result.breakdown.options).toEqual([]);
      expect(result.breakdown.discount).toBe(0);
      expect(result.breakdown.taxes).toBe(0);
    });

    it('should calculate total with options', () => {
      const result = calcTotal({
        basePrice: 1000,
        selectedOptions: [
          { id: '1', name: 'Upgrade', price: 200, qty: 1 },
          { id: '2', name: 'Insurance', price: 50, qty: 2 },
        ],
        travelers: 2,
      });

      expect(result.total).toBe(1300);
      expect(result.breakdown.options).toHaveLength(2);
      expect(result.breakdown.options[0].price).toBe(200);
      expect(result.breakdown.options[1].price).toBe(50);
    });

    it('should apply discount percentage', () => {
      const result = calcTotal({
        basePrice: 1000,
        discountPercent: 20,
        travelers: 2,
      });

      expect(result.total).toBe(800);
      expect(result.breakdown.discount).toBe(200);
    });

    it('should handle zero discount', () => {
      const result = calcTotal({
        basePrice: 1000,
        discountPercent: 0,
        travelers: 2,
      });

      expect(result.total).toBe(1000);
      expect(result.breakdown.discount).toBe(0);
    });

    it('should handle 100% discount (minimum total is 0)', () => {
      const result = calcTotal({
        basePrice: 1000,
        discountPercent: 100,
        travelers: 2,
      });

      expect(result.total).toBe(0);
      expect(result.breakdown.discount).toBe(1000);
    });

    it('should handle discount greater than 100% (minimum total is 0)', () => {
      const result = calcTotal({
        basePrice: 1000,
        discountPercent: 150,
        travelers: 2,
      });

      expect(result.total).toBe(0);
      expect(result.breakdown.discount).toBe(1000);
    });

    it('should calculate with options and discount', () => {
      const result = calcTotal({
        basePrice: 1000,
        discountPercent: 10,
        selectedOptions: [
          { id: '1', name: 'Upgrade', price: 200, qty: 1 },
        ],
        travelers: 2,
      });

      // Base: 1000, Options: 200, Subtotal: 1200, Discount: 120, Total: 1080
      expect(result.total).toBe(1080);
      expect(result.breakdown.discount).toBe(120);
    });

    it('should handle options with quantities', () => {
      const result = calcTotal({
        basePrice: 1000,
        selectedOptions: [
          { id: '1', name: 'Upgrade', price: 100, qty: 3 },
        ],
        travelers: 2,
      });

      expect(result.total).toBe(1300);
      expect(result.breakdown.options[0].qty).toBe(3);
    });

    it('should default option quantity to 1', () => {
      const result = calcTotal({
        basePrice: 1000,
        selectedOptions: [
          { id: '1', name: 'Upgrade', price: 100 },
        ],
        travelers: 2,
      });

      expect(result.total).toBe(1100);
      expect(result.breakdown.options[0].qty).toBe(1);
    });
  });

  describe('calculatePerPersonPrice', () => {
    it('should calculate per person price correctly', () => {
      const result = calculatePerPersonPrice(1000, 4);
      expect(result).toBe(250);
    });

    it('should handle single traveler', () => {
      const result = calculatePerPersonPrice(1000, 1);
      expect(result).toBe(1000);
    });

    it('should return 0 for invalid traveler count', () => {
      const result = calculatePerPersonPrice(1000, 0);
      expect(result).toBe(0);
    });

    it('should return 0 for negative traveler count', () => {
      const result = calculatePerPersonPrice(1000, -1);
      expect(result).toBe(0);
    });
  });

  describe('calculateGroupDiscount', () => {
    it('should return 0 for small groups', () => {
      expect(calculateGroupDiscount(1000, 1)).toBe(0);
      expect(calculateGroupDiscount(1000, 2)).toBe(0);
      expect(calculateGroupDiscount(1000, 3)).toBe(0);
    });

    it('should return 5% for 4-5 travelers', () => {
      expect(calculateGroupDiscount(1000, 4)).toBe(5);
      expect(calculateGroupDiscount(1000, 5)).toBe(5);
    });

    it('should return 10% for 6-9 travelers', () => {
      expect(calculateGroupDiscount(1000, 6)).toBe(10);
      expect(calculateGroupDiscount(1000, 9)).toBe(10);
    });

    it('should return 15% for 10+ travelers', () => {
      expect(calculateGroupDiscount(1000, 10)).toBe(15);
      expect(calculateGroupDiscount(1000, 20)).toBe(15);
    });
  });
});
