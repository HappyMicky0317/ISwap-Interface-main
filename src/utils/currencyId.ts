import { Currency, ETHER, Token } from '@intercroneswap/swap-sdk';

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'TRX';
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}
