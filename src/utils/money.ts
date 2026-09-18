import { KHR_PER_USD } from '@/constants/app';
import type { CurrencyCode, Money } from '@/types';

const FORMATTERS: Record<CurrencyCode, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }),
  KHR: new Intl.NumberFormat('km-KH', {
    style: 'currency',
    currency: 'KHR',
    maximumFractionDigits: 0,
  }),
};

export function formatMoney(money: Money): string {
  if (money.currency === 'KHR') {
    return `៛${Math.round(money.amount).toLocaleString('en-US')}`;
  }
  return FORMATTERS[money.currency].format(money.amount);
}

export function convertMoney(money: Money, currency: CurrencyCode): Money {
  if (money.currency === currency) {
    return money;
  }
  if (money.currency === 'USD' && currency === 'KHR') {
    return { amount: Math.round(money.amount * KHR_PER_USD), currency };
  }
  return { amount: money.amount / KHR_PER_USD, currency };
}

export function money(amount: number, currency: CurrencyCode = 'USD'): Money {
  return { amount, currency };
}
