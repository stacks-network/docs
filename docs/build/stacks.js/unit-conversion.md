# Unit Conversion

Learn how to convert between different unit denominations in Stacks. Stacks uses microSTX as its base unit, where 1 STX = 1,000,000 microSTX. Proper unit conversion is essential for displaying amounts to users and processing transactions.

## Basic conversions

Convert between STX and microSTX using simple conversion functions.

{% code title="basic-conversions.ts" %}
```ts
// Convert STX to microSTX
function stxToMicroStx(stx: number | string): bigint {
  const stxAmount = typeof stx === 'string' ? parseFloat(stx) : stx;
  return BigInt(Math.floor(stxAmount * 1_000_000));
}

// Convert microSTX to STX
function microStxToStx(microStx: number | bigint | string): string {
  const amount = BigInt(microStx);
  const stx = Number(amount) / 1_000_000;
  return stx.toFixed(6).replace(/\.?0+$/, '');
}

// Usage examples
const microStx = stxToMicroStx(1.5);      // 1500000n
const stx = microStxToStx(1500000);       // "1.5"
```
{% endcode %}

## Precision-safe handling

Handle large numbers without precision loss using BigInt operations.

{% code title="precision-safe.ts" %}
```ts
class StxConverter {
  static readonly MICROSTX_PER_STX = 1_000_000n;
  
  static toMicroStx(amount: string | number, decimals = 6): bigint {
    const amountStr = amount.toString();
    const [whole, decimal = ''] = amountStr.split('.');
    const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(whole + paddedDecimal);
  }
  
  static toStx(microStx: bigint | string | number): string {
    const amount = BigInt(microStx);
    const isNegative = amount < 0n;
    const absoluteAmount = isNegative ? -amount : amount;
    
    const str = absoluteAmount.toString().padStart(7, '0');
    const whole = str.slice(0, -6) || '0';
    const decimal = str.slice(-6);
    
    let result = `${whole}.${decimal}`.replace(/\.?0+$/, '');
    return isNegative ? `-${result}` : result;
  }
}

// Precise conversion examples
const precise1 = StxConverter.toMicroStx('123.456789'); // 123456789n
const precise2 = StxConverter.toStx(123456789n);        // "123.456789"
```
{% endcode %}

## Token conversions

Handle tokens with different decimal places using a flexible converter class.

{% code title="token-converter.ts" %}
```ts
interface TokenInfo {
  decimals: number;
  symbol: string;
  name: string;
}

class TokenConverter {
  constructor(private tokenInfo: TokenInfo) {}
  
  toSmallestUnit(amount: string | number): bigint {
    if (typeof amount === 'string') {
      const [whole, decimal = ''] = amount.split('.');
      const paddedDecimal = decimal
        .padEnd(this.tokenInfo.decimals, '0')
        .slice(0, this.tokenInfo.decimals);
      return BigInt(whole + paddedDecimal);
    }
    
    const multiplier = 10n ** BigInt(this.tokenInfo.decimals);
    return BigInt(Math.floor(amount * Number(multiplier)));
  }
  
  fromSmallestUnit(amount: bigint | string): string {
    const value = BigInt(amount);
    const divisor = 10n ** BigInt(this.tokenInfo.decimals);
    const whole = value / divisor;
    const remainder = value % divisor;
    
    if (remainder === 0n) return whole.toString();
    
    const decimal = remainder
      .toString()
      .padStart(this.tokenInfo.decimals, '0')
      .replace(/0+$/, '');
    
    return `${whole}.${decimal}`;
  }
}

// Different token examples
const usdc = new TokenConverter({ decimals: 6, symbol: 'USDC', name: 'USD Coin' });
const btc = new TokenConverter({ decimals: 8, symbol: 'BTC', name: 'Bitcoin' });

const usdcAmount = usdc.toSmallestUnit('100.50');     // 100500000n
const btcAmount = btc.toSmallestUnit('0.00123456');   // 123456n
```
{% endcode %}

## Display formatting

Format amounts for user interfaces with localization support.

{% code title="stx-formatter.ts" %}
```ts
class StxFormatter {
  static format(microStx: bigint, options?: {
    decimals?: number;
    locale?: string;
    symbol?: boolean;
  }): string {
    const stx = StxConverter.toStx(microStx);
    const number = parseFloat(stx);
    
    const formatted = new Intl.NumberFormat(options?.locale || 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: options?.decimals ?? 6,
    }).format(number);
    
    return options?.symbol ? `${formatted} STX` : formatted;
  }
  
  static compact(microStx: bigint): string {
    const stx = Number(StxConverter.toStx(microStx));
    
    if (stx >= 1_000_000) {
      return `${(stx / 1_000_000).toFixed(2)}M STX`;
    } else if (stx >= 1_000) {
      return `${(stx / 1_000).toFixed(2)}K STX`;
    }
    
    return this.format(microStx, { decimals: 6, symbol: true });
  }
}

// Formatting examples
const formatted = StxFormatter.format(123456789n, {
  decimals: 2,
  symbol: true
}); // "123.46 STX"

const compact = StxFormatter.compact(1234567890000n); // "1.23K STX"
```
{% endcode %}
