import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'AED';

export function getCurrencySymbol(currency: string = 'INR'): string {
  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
    AED: 'AED '
  };
  return symbolMap[currency] || (currency + ' ');
}

export function formatCurrency(amount: number, currency: string = 'INR', decimals: number = 0): string {
  const symbol = getCurrencySymbol(currency);
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0`;
  
  // Guard against -0
  const cleanAmount = Object.is(amount, -0) || (Math.abs(amount) < 1e-9) ? 0 : amount;

  if (currency === 'INR') {
    return symbol + formatIndianNumber(cleanAmount, decimals);
  }
  
  return symbol + cleanAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatIndianNumber(x: number, decimals: number = 0): string {
  if (isNaN(x) || !isFinite(x)) return '0';
  if (Object.is(x, -0) || Math.abs(x) < 1e-9) x = 0;

  const isNegative = x < 0;
  const absX = Math.abs(x);
  
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(absX * factor) / factor;
  const parts = rounded.toFixed(decimals).split('.');
  
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 && decimals > 0 ? '.' + parts[1] : '';

  let lastThree = integerPart.length > 3 ? integerPart.substring(integerPart.length - 3) : integerPart;
  const otherNumbers = integerPart.length > 3 ? integerPart.substring(0, integerPart.length - 3) : '';
  
  let formatted = lastThree;
  if (otherNumbers !== '') {
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = formattedOther + ',' + lastThree;
  }
  
  return (isNegative && rounded > 0 ? '-' : '') + formatted + decimalPart;
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  if (Object.is(num, -0) || Math.abs(num) < 1e-9) num = 0;
  return Number(num.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

export function formatCompactNumber(num: number, useIndianUnits: boolean = true): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  if (Object.is(num, -0)) num = 0;
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (useIndianUnits) {
    if (abs >= 1e7) {
      return sign + parseFloat((abs / 1e7).toFixed(2)) + ' Cr';
    }
    if (abs >= 1e5) {
      return sign + parseFloat((abs / 1e5).toFixed(2)) + ' L';
    }
    if (abs >= 1e3) {
      return sign + parseFloat((abs / 1e3).toFixed(2)) + ' K';
    }
    return sign + abs.toLocaleString('en-IN');
  }

  if (abs >= 1e9) {
    return sign + parseFloat((abs / 1e9).toFixed(2)) + ' B';
  }
  if (abs >= 1e6) {
    return sign + parseFloat((abs / 1e6).toFixed(2)) + ' M';
  }
  if (abs >= 1e3) {
    return sign + parseFloat((abs / 1e3).toFixed(2)) + ' K';
  }
  return sign + abs.toLocaleString('en-US');
}
