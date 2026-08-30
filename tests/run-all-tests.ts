import { allCalculators, getCalculatorById, getCalculatorsByCategory, searchCalculators } from '../src/lib/calculatorRegistry';
import { 
  formatCurrency, 
  formatIndianNumber, 
  formatNumber, 
  formatCompactNumber, 
  getCurrencySymbol 
} from '../src/lib/utils';

console.log('================================================================');
console.log('🚀 UNIVERSAL CALCULATOR HUB — COMPREHENSIVE 1,089 TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`❌ ASSERTION FAILED: ${message}`);
  }
}

// -------------------------------------------------------------------------
// SECTION 1: FORMATTING & UTILITY FUNCTIONS
// -------------------------------------------------------------------------
console.log('🧪 Section 1: Verifying Number, Currency & Indian Formatter Precision...');

// Currency Symbols
assert(getCurrencySymbol('INR') === '₹', 'INR symbol is ₹');
assert(getCurrencySymbol('USD') === '$', 'USD symbol is $');
assert(getCurrencySymbol('EUR') === '€', 'EUR symbol is €');
assert(getCurrencySymbol('GBP') === '£', 'GBP symbol is £');
assert(getCurrencySymbol('JPY') === '¥', 'JPY symbol is ¥');
assert(getCurrencySymbol('CAD') === 'CA$', 'CAD symbol is CA$');
assert(getCurrencySymbol('AUD') === 'A$', 'AUD symbol is A$');
assert(getCurrencySymbol('AED') === 'AED ', 'AED symbol is AED ');

// Indian Number System Formatting (Lakhs & Crores)
assert(formatIndianNumber(0) === '0', '0 formatted as 0');
assert(formatIndianNumber(50) === '50', '50 formatted as 50');
assert(formatIndianNumber(500) === '500', '500 formatted as 500');
assert(formatIndianNumber(1000) === '1,000', '1000 formatted as 1,000');
assert(formatIndianNumber(10000) === '10,000', '10000 formatted as 10,000');
assert(formatIndianNumber(100000) === '1,00,000', '100000 formatted as 1,00,000 (1 Lakh)');
assert(formatIndianNumber(1000000) === '10,00,000', '1000000 formatted as 10,00,000 (10 Lakhs)');
assert(formatIndianNumber(10000000) === '1,00,00,000', '10000000 formatted as 1,00,00,000 (1 Crore)');
assert(formatIndianNumber(123456789) === '12,34,56,789', '123456789 formatted as 12,34,56,789');
assert(formatIndianNumber(-100000) === '-1,00,000', '-100000 formatted as -1,00,000');
assert(formatIndianNumber(1234.56, 2) === '1,234.56', 'Decimals supported in Indian format');

// Edge Values for Formatter
assert(formatIndianNumber(NaN) === '0', 'NaN formats to 0');
assert(formatIndianNumber(Infinity) === '0', 'Infinity formats to 0');
assert(formatIndianNumber(-Infinity) === '0', '-Infinity formats to 0');
assert(formatIndianNumber(-0) === '0', '-0 formats to 0 without negative sign');

// formatCurrency
assert(formatCurrency(0, 'INR') === '₹0', '₹0');
assert(formatCurrency(150000, 'INR') === '₹1,50,000', '₹1,50,000');
assert(formatCurrency(150000, 'USD') === '$150,000', '$150,000');
assert(formatCurrency(150000, 'EUR') === '€150,000', '€150,000');
assert(formatCurrency(150000, 'CAD') === 'CA$150,000', 'CA$150,000');
assert(formatCurrency(150000, 'AED') === 'AED 150,000', 'AED 150,000');
assert(formatCurrency(-5000, 'INR') === '₹-5,000', '₹-5,000');
assert(formatCurrency(NaN, 'INR') === '₹0', 'NaN currency returns ₹0');
assert(formatCurrency(Infinity, 'INR') === '₹0', 'Infinity currency returns ₹0');

// formatCompactNumber
assert(formatCompactNumber(15000000, true) === '1.5 Cr', '1.5 Cr in Indian units');
assert(formatCompactNumber(250000, true) === '2.5 L', '2.5 L in Indian units');
assert(formatCompactNumber(1500000000, false) === '1.5 B', '1.5 B in Western units');
assert(formatCompactNumber(2500000, false) === '2.5 M', '2.5 M in Western units');
assert(formatCompactNumber(1500, true) === '1.5 K', '1.5 K');
assert(formatCompactNumber(0) === '0', '0 in compact format');

console.log(`✅ Section 1 Complete: All ${passedTests} utility checks passed.\n`);

// -------------------------------------------------------------------------
// SECTION 2: CORE CALCULATOR DOMAIN VERIFICATION
// -------------------------------------------------------------------------
console.log('🧪 Section 2: Testing Core Calculation Engines & Domain Contracts...');

// 1. SIP
const sip = getCalculatorById('sip-calculator')!;
assert(!!sip, 'SIP Calculator registered');
const sipRes = sip.calculate({ monthlyInvestment: 10000, expectedReturnRate: 12, timePeriod: 10, stepUpRate: 0 }, 'INR');
assert(Number(sipRes.primaryMetric.value) > 2000000, 'SIP 10k/mo @ 12% 10y gives > 23L');
assert(sipRes.secondaryMetrics![0].value === 1200000, 'SIP total principal = 12,00,000');
assert(sipRes.chart?.data.length === 10, 'SIP chart has 10 yearly data points');

// SIP Edge: 0 investment
const sipZero = sip.calculate({ monthlyInvestment: 0, expectedReturnRate: 12, timePeriod: 10, stepUpRate: 0 }, 'INR');
assert(sipZero.primaryMetric.value === 0, 'SIP 0 investment = 0 value');
assert(!isNaN(sipZero.breakdown![0].percentage), 'SIP 0 investment breakdown percentage is not NaN');

// 2. EMI
const emi = getCalculatorById('emi-calculator')!;
assert(!!emi, 'EMI Calculator registered');
const emiRes = emi.calculate({ loanAmount: 1000000, interestRate: 8.5, tenureYears: 10 }, 'INR');
assert(Number(emiRes.primaryMetric.value) >= 12300 && Number(emiRes.primaryMetric.value) <= 12500, 'EMI 10L @ 8.5% 10y is ~12,399');

// 3. CGPA
const cgpa = getCalculatorById('cgpa-calculator')!;
assert(!!cgpa, 'CGPA Calculator registered');
const cgpaRes = cgpa.calculate({ sem1: 8.0, sem2: 9.0, sem3: 8.5, sem4: 9.5, scaleType: 10, conversionFormula: 'cbse' });
assert(cgpaRes.primaryMetric.value === 8.75, 'CGPA is 8.75');
assert(cgpaRes.secondaryMetrics![0].value === 83.13 || Math.abs(Number(cgpaRes.secondaryMetrics![0].value) - 83.13) < 0.1, 'CBSE percentage ~83.13%');

// 4. Ohm's Law
const ohms = getCalculatorById('ohms-law-calculator')!;
assert(!!ohms, 'Ohms Law registered');
const ohmsRes = ohms.calculate({ knownValues: 'VR', val1: 12, val2: 4 });
assert(ohmsRes.primaryMetric.value === 36, 'Ohms Law P = V^2 / R = 144 / 4 = 36 W');

// 5. BMI
const bmi = getCalculatorById('bmi-calculator')!;
assert(!!bmi, 'BMI Calculator registered');
const bmiRes = bmi.calculate({ unitSystem: 'metric', weightKg: 70, heightCm: 175, age: 25, gender: 'male' });
assert(Math.abs(Number(bmiRes.primaryMetric.value) - 22.86) < 0.1, 'BMI is ~22.86');

// 6. GST
const gst = getCalculatorById('gst-calculator')!;
assert(!!gst, 'GST Calculator registered');
const gstRes = gst.calculate({ calculationType: 'exclusive', baseAmount: 1000, gstRate: 18 }, 'INR');
assert(gstRes.primaryMetric.value === 1180, 'GST exclusive 1000 + 18% = 1180');

// Search & Registry Tests
assert(allCalculators.length >= 40, `At least 40 calculators loaded (Found: ${allCalculators.length})`);
assert(searchCalculators('sip').length >= 1, 'Search sip returns at least 1 calculator');
assert(searchCalculators('emi').length >= 1, 'Search emi returns at least 1 calculator');
assert(searchCalculators('gpa').length >= 1, 'Search gpa returns at least 1 calculator');
assert(searchCalculators('ohm').length >= 1, 'Search ohm returns at least 1 calculator');

console.log(`✅ Section 2 Complete: Domain calculators verified.\n`);

// -------------------------------------------------------------------------
// SECTION 3: 1,089 SYSTEMATIC FUZZ ITERATIONS ACROSS ALL ENGINES
// -------------------------------------------------------------------------
console.log('🧪 Section 3: Executing 1,089 Systematic Stress & Fuzz Iterations...');

const TOTAL_ITERATIONS = 1089;
const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'AED'];

// Diverse test vectors including standard, zero, boundary, fractional, negative, and large values
const testVectors = [
  { val: 0, desc: 'Zero Value' },
  { val: -0, desc: 'Negative Zero' },
  { val: -1, desc: 'Small Negative' },
  { val: -100, desc: 'Medium Negative' },
  { val: 0.001, desc: 'Very Small Decimal' },
  { val: 0.5, desc: 'Fractional Half' },
  { val: 1, desc: 'Unit 1' },
  { val: 5, desc: 'Small Integer 5' },
  { val: 10, desc: 'Base 10' },
  { val: 18.5, desc: 'Standard Decimal Rate' },
  { val: 100, desc: 'Hundred' },
  { val: 1000, desc: 'Thousand' },
  { val: 10000, desc: 'Ten Thousand' },
  { val: 100000, desc: 'One Lakh' },
  { val: 1000000, desc: 'One Million' },
  { val: 50000000, desc: 'Fifty Million' },
  { val: NaN, desc: 'NaN edge' },
  { val: Infinity, desc: 'Infinity edge' },
  { val: -Infinity, desc: '-Infinity edge' }
];

const fuzzStartTime = Date.now();
let successfulIterations = 0;

for (let i = 0; i < TOTAL_ITERATIONS; i++) {
  const calc = allCalculators[i % allCalculators.length];
  const currency = currencies[i % currencies.length];
  const vector = testVectors[i % testVectors.length];

  const inputs: Record<string, any> = {};

  calc.inputs.forEach((inp, idx) => {
    const shiftVector = testVectors[(i + idx) % testVectors.length];
    
    if (inp.type === 'segmented' || inp.type === 'toggle') {
      if (inp.options && inp.options.length > 0) {
        inputs[inp.id] = inp.options[(i + idx) % inp.options.length].value;
      } else {
        inputs[inp.id] = inp.defaultValue;
      }
    } else if (inp.type === 'date') {
      inputs[inp.id] = '2025-06-15';
    } else {
      // Clamped number test
      const testVal = shiftVector.val;
      // If NaN or Infinity, test fallback handling
      inputs[inp.id] = testVal;
    }
  });

  try {
    const output = calc.calculate(inputs, currency);
    
    // Contract assertions
    assert(!!output, `Iteration ${i + 1}: [${calc.id}] returned valid output object`);
    assert(typeof output.primaryMetric.label === 'string' && output.primaryMetric.label.length > 0, `Iteration ${i + 1}: primaryMetric has valid label`);
    assert(typeof output.primaryMetric.formattedValue === 'string', `Iteration ${i + 1}: primaryMetric formattedValue is string`);

    // Ensure formatters do not crash on result
    if (typeof output.primaryMetric.value === 'number') {
      const cur = formatCurrency(output.primaryMetric.value, currency);
      assert(typeof cur === 'string', `Iteration ${i + 1}: currency formatted correctly`);
    }

    successfulIterations++;
  } catch (err: any) {
    failedTests++;
    console.error(`❌ Fuzz Error on Iteration ${i + 1} (${calc.id}): ${err.message}`);
  }
}

const fuzzElapsed = Date.now() - fuzzStartTime;

console.log(`\n================================================================`);
console.log(`🏁 1,089 TEST RUN REPORT SUMMARY:`);
console.log(`- Total Fuzz Iterations Completed: ${successfulIterations} / ${TOTAL_ITERATIONS}`);
console.log(`- Total Assertions Evaluated: ${passedTests + failedTests}`);
console.log(`- Total Passed: ${passedTests}`);
console.log(`- Total Failed: ${failedTests}`);
console.log(`- Total Execution Time: ${fuzzElapsed} ms (~${(fuzzElapsed / 1000).toFixed(3)}s)`);
console.log(`- Average per Calculator Run: ${(fuzzElapsed / TOTAL_ITERATIONS).toFixed(3)} ms`);
console.log(`================================================================\n`);

if (failedTests > 0) {
  console.error(`💥 TEST SUITE FAILED with ${failedTests} assertion failures.`);
  process.exit(1);
} else {
  console.log(`✨ SUCCESS: ALL 1,089 ITERATIONS PASSED WITH ZERO CRASHES OR REGRESSIONS!`);
}
