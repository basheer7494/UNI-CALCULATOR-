import { describe, it, expect } from 'vitest';
import { allCalculators } from '../src/lib/calculatorRegistry';
import { formatCurrency, formatIndianNumber, formatNumber, formatCompactNumber } from '../src/lib/utils';

describe('1089-Iteration Systematic Stress & Fuzz Test Suite', () => {
  const TOTAL_TEST_ITERATIONS = 1089;
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'AED'];

  it(`executes ${TOTAL_TEST_ITERATIONS} edge-case calculations across all registered engines without crashing`, () => {
    let executedCount = 0;
    const errors: string[] = [];

    // Base edge value vectors
    const edgeValues = [
      0,
      -0,
      -1,
      -100,
      -999999,
      0.000001,
      1,
      2,
      5,
      10,
      100,
      1000,
      10000,
      100000,
      1000000,
      10000000,
      1e9,
      0.5,
      0.33333,
      -0.5,
      Number.MAX_SAFE_INTEGER,
      NaN,
      Infinity,
      -Infinity
    ];

    for (let i = 0; i < TOTAL_TEST_ITERATIONS; i++) {
      const calcIndex = i % allCalculators.length;
      const calc = allCalculators[calcIndex];
      const currency = currencies[i % currencies.length];

      // Build inputs for this iteration
      const simulatedInputs: Record<string, any> = {};

      calc.inputs.forEach((input, inputIdx) => {
        const edgeVal = edgeValues[(i + inputIdx) % edgeValues.length];

        if (input.type === 'segmented' || input.type === 'toggle') {
          // Choose from valid options or test edge fallback
          if (input.options && input.options.length > 0) {
            simulatedInputs[input.id] = input.options[(i + inputIdx) % input.options.length].value;
          } else {
            simulatedInputs[input.id] = input.defaultValue;
          }
        } else if (input.type === 'date') {
          simulatedInputs[input.id] = '2025-01-01';
        } else {
          // Slider or Number input: cycle through edge values
          simulatedInputs[input.id] = edgeVal;
        }
      });

      try {
        const result = calc.calculate(simulatedInputs, currency);

        // Assert contract rules
        expect(result).toBeDefined();
        expect(result.primaryMetric).toBeDefined();
        expect(typeof result.primaryMetric.label).toBe('string');
        expect(result.primaryMetric.label.length).toBeGreaterThan(0);
        expect(typeof result.primaryMetric.formattedValue).toBe('string');

        // Formatter tests on metrics
        if (typeof result.primaryMetric.value === 'number') {
          const formatted = formatCurrency(result.primaryMetric.value, currency);
          expect(typeof formatted).toBe('string');
          const compact = formatCompactNumber(result.primaryMetric.value);
          expect(typeof compact).toBe('string');
        }

        // Validate secondary metrics if present
        if (result.secondaryMetrics) {
          expect(Array.isArray(result.secondaryMetrics)).toBe(true);
          result.secondaryMetrics.forEach(m => {
            expect(typeof m.label).toBe('string');
            expect(typeof m.formattedValue).toBe('string');
          });
        }

        // Validate breakdown if present
        if (result.breakdown) {
          expect(Array.isArray(result.breakdown)).toBe(true);
          result.breakdown.forEach(b => {
            expect(typeof b.label).toBe('string');
            expect(typeof b.percentage).toBe('number');
          });
        }

        executedCount++;
      } catch (err: any) {
        errors.push(`Iteration ${i} failed on [${calc.id}]: ${err.message}`);
      }
    }

    if (errors.length > 0) {
      console.error(`Encountered ${errors.length} errors during 1089 fuzz test:`, errors.slice(0, 5));
    }

    expect(errors.length).toBe(0);
    expect(executedCount).toBe(TOTAL_TEST_ITERATIONS);
  });
});
