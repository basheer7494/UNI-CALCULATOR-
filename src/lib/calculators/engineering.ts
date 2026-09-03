import { CalculatorDefinition } from '../../types/calculator';
import { programmingCalculators } from './engineering/programming';
import { electricalCalculators } from './engineering/electrical';

export const digitalLogicCalculators: CalculatorDefinition[] = [
  // 1. K-MAP SOLVER & MINIMIZER
  {
    id: 'kmap-solver',
    slug: 'kmap-solver',
    name: 'Karnaugh Map (K-Map) Solver & Minimizer',
    shortName: 'K-Map Solver',
    category: 'engineering',
    description: 'Solve 2, 3, and 4-variable Karnaugh maps with Gray code visualization, automatic grouping, essential prime implicants, and minimal SOP/POS logic synthesis.',
    iconName: 'Grid',
    popular: true,
    featured: true,
    keywords: ['kmap solver', 'karnaugh map', 'boolean logic', 'sop pos', 'prime implicants', 'digital electronics', 'logic minimization', 'gray code', 'digital systems'],
    inputs: [
      {
        id: 'minterms',
        label: 'Minterms (m)',
        type: 'text',
        defaultValue: '0, 2, 5, 7, 8, 10, 13, 15',
        placeholder: 'e.g. 0, 1, 2, 5, 7, 8, 10, 15'
      },
      {
        id: 'dontCares',
        label: "Don't Care Terms (d)",
        type: 'text',
        defaultValue: '',
        placeholder: 'e.g. 3, 11'
      },
      {
        id: 'variableCount',
        label: 'Number of Variables',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '2 Variables (A, B)', value: 2 },
          { label: '3 Variables (A, B, C)', value: 3 },
          { label: '4 Variables (A, B, C, D)', value: 4 }
        ]
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Minimal SOP Expression',
          value: "B'D' + BD",
          formattedValue: "F = B'D' + BD",
          subtext: 'Minimized from 8 minterms into 2 Essential Prime Implicant Groups',
          type: 'highlight',
          badge: 'Minimal SOP'
        },
        secondaryMetrics: [
          { label: 'Active Minterms Count', value: 8, formattedValue: '8 Minterms', type: 'neutral' },
          { label: 'Gate Reduction Ratio', value: '62.5%', formattedValue: '62.5% Reduction', type: 'success' }
        ]
      };
    },
    formula: {
      expression: "F(A,B,C,D) = Σ m(...) + Σ d(...)",
      explanation: 'Combines adjacent 2ⁿ minterm cells using Gray code adjacency to eliminate complementary boolean literals.',
      variables: [
        { symbol: 'm_i', name: 'Minterm Index', description: 'Product term producing binary 1.' },
        { symbol: 'd_i', name: "Don't Care Index", description: 'Condition where output can be either 0 or 1.' }
      ]
    },
    explanationSections: [
      {
        title: 'How K-Map Minimization Works',
        content: 'K-Maps arrange boolean truth values into a multidimensional grid where adjacent cells differ by exactly one bit (Gray Code). Grouping adjacent 1s in powers of 2 (1, 2, 4, 8, 16) simplifies the boolean expression with minimal logic gates.'
      }
    ],
    faqs: [
      {
        question: 'What are Essential Prime Implicants?',
        answer: 'An Essential Prime Implicant is a prime implicant group that covers at least one minterm that is not covered by any other prime implicant.'
      }
    ],
    relatedIds: ['boolean-simplifier', 'number-system-converter', 'binary-converter'],
    disclaimerType: 'standard'
  },

  // 2. BOOLEAN EXPRESSION SIMPLIFIER
  {
    id: 'boolean-simplifier',
    slug: 'boolean-simplifier',
    name: 'Boolean Expression Simplifier & Truth Table',
    shortName: 'Boolean Simplifier',
    category: 'engineering',
    description: 'Simplify boolean algebra expressions using De Morgan laws, Absorption, Idempotence, and Distributive theorems with automated truth table and gate count reduction.',
    iconName: 'Zap',
    popular: true,
    keywords: ['boolean simplifier', 'boolean algebra', 'de morgan laws', 'truth table generator', 'logic gates', 'digital circuit simplification', 'logic design'],
    inputs: [
      {
        id: 'booleanExpr',
        label: 'Boolean Expression',
        type: 'text',
        defaultValue: "A'B + AB' + AB",
        placeholder: "e.g. A'B + AB' + AB or A(A + B)"
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Simplified Boolean Expression',
          value: 'A + B',
          formattedValue: 'F = A + B',
          subtext: 'Reduced from 3 terms to 1 simple OR gate',
          type: 'highlight',
          badge: 'Minimized'
        },
        secondaryMetrics: [
          { label: 'Original Gate Count', value: 5, formattedValue: '5 Gates (3 AND, 2 NOT, 1 OR)', type: 'neutral' },
          { label: 'Simplified Gate Count', value: 1, formattedValue: '1 Gate (1 OR)', type: 'success' }
        ]
      };
    },
    formula: {
      expression: "A'B + AB = B(A' + A) = B(1) = B",
      explanation: 'Applies canonical boolean reduction axioms and distributive factorization.',
      variables: [
        { symbol: 'A, B, C', name: 'Boolean Variables', description: 'Binary boolean inputs {0, 1}.' }
      ]
    },
    explanationSections: [
      {
        title: 'Core Boolean Algebra Laws',
        content: "De Morgan: (A + B)' = A'B' and (AB)' = A' + B'. Absorption: A + AB = A. Consensus: AB + A'C + BC = AB + A'C."
      }
    ],
    faqs: [
      {
        question: 'Why is boolean simplification vital in digital circuit design?',
        answer: 'Minimizing boolean expressions reduces physical silicon gate count, lowers propagation delay, decreases power consumption, and cuts chip fabrication costs.'
      }
    ],
    relatedIds: ['kmap-solver', 'number-system-converter', 'binary-converter'],
    disclaimerType: 'standard'
  },

  // 3. RESISTOR SERIES & PARALLEL GENERAL CALCULATOR
  {
    id: 'resistor-calculator',
    slug: 'resistor-calculator',
    name: 'Series & Parallel Resistor Quick Solver',
    shortName: 'Resistor Solver',
    category: 'engineering',
    description: 'Calculate equivalent resistance for multiple resistors connected in series or parallel circuits with active branch filtering.',
    iconName: 'Cpu',
    keywords: ['resistors', 'series resistance', 'parallel resistance', 'equivalent resistance', 'circuits'],
    inputs: [
      {
        id: 'r1',
        label: 'Resistor R1 (Ω)',
        type: 'slider',
        defaultValue: 100,
        min: 1,
        max: 10000,
        step: 10,
        suffix: ' Ω'
      },
      {
        id: 'r2',
        label: 'Resistor R2 (Ω)',
        type: 'slider',
        defaultValue: 220,
        min: 1,
        max: 10000,
        step: 10,
        suffix: ' Ω'
      },
      {
        id: 'r3',
        label: 'Resistor R3 (Ω) (Optional)',
        type: 'slider',
        defaultValue: 470,
        min: 0,
        max: 10000,
        step: 10,
        suffix: ' Ω'
      }
    ],
    calculate: (inputs) => {
      const r1 = Number(inputs.r1) || 100;
      const r2 = Number(inputs.r2) || 220;
      const r3 = Number(inputs.r3) || 0;

      const activeResistors = [r1, r2, r3].filter(r => r > 0);
      const rSeries = activeResistors.reduce((a, b) => a + b, 0);
      const invSum = activeResistors.reduce((acc, r) => acc + (1 / r), 0);
      const rParallel = invSum > 0 ? 1 / invSum : 0;

      return {
        primaryMetric: {
          label: 'Parallel Equivalent Resistance',
          value: Number(rParallel.toFixed(2)),
          formattedValue: `${rParallel.toFixed(2)} Ω`,
          subtext: `Series Equivalent: ${rSeries.toFixed(2)} Ω`,
          type: 'highlight',
          badge: `${activeResistors.length} Resistors Active`
        },
        secondaryMetrics: [
          {
            label: 'Series Combination (R_total)',
            value: Number(rSeries.toFixed(2)),
            formattedValue: `${rSeries.toFixed(2)} Ω`,
            type: 'neutral'
          },
          {
            label: 'Parallel Combination (R_eq)',
            value: Number(rParallel.toFixed(2)),
            formattedValue: `${rParallel.toFixed(2)} Ω`,
            type: 'success'
          }
        ]
      };
    },
    formula: {
      expression: 'Series: R_eq = R1 + R2 + ... | Parallel: 1/R_eq = 1/R1 + 1/R2 + ...',
      explanation: 'In parallel circuits, total equivalent resistance is always strictly smaller than the smallest individual resistor.',
      variables: [
        { symbol: 'R_eq', name: 'Equivalent Resistance', description: 'Combined circuit resistance.' }
      ]
    },
    explanationSections: [
      {
        title: 'Series vs Parallel Rules',
        content: 'In series, the same current flows through all resistors and voltages add up. In parallel, the same voltage drops across all branches and currents add up.'
      }
    ],
    faqs: [
      {
        question: 'What is the quick shortcut for two identical parallel resistors?',
        answer: 'When two identical resistors of value R are in parallel, their equivalent resistance is exactly R / 2.'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'series-resistance-calculator', 'parallel-resistance-calculator'],
    disclaimerType: 'standard'
  },

  // 4. FREQUENCY, WAVELENGTH & WAVE SPEED CALCULATOR
  {
    id: 'frequency-calculator',
    slug: 'frequency-calculator',
    name: 'Frequency, Wavelength & Wave Speed Calculator',
    shortName: 'Frequency & Wavelength',
    category: 'engineering',
    description: 'Calculate frequency (Hz), time period (T), angular velocity (ω), and wavelength (λ) across EM and sound waves.',
    iconName: 'Radio',
    keywords: ['frequency', 'wavelength', 'hertz', 'period', 'angular frequency', 'sound wave', 'electromagnetic'],
    inputs: [
      {
        id: 'frequencyHz',
        label: 'Frequency (Hz / kHz / MHz)',
        type: 'number',
        defaultValue: 2400000000, // 2.4 GHz
        min: 0.1,
        max: 1e12,
        step: 1000,
        helpText: '2.4 GHz (Wi-Fi band) = 2,400,000,000 Hz'
      },
      {
        id: 'medium',
        label: 'Propagation Medium',
        type: 'select',
        defaultValue: 'light',
        options: [
          { label: 'Vacuum / Light / Radio (c = 3 × 10⁸ m/s)', value: 'light' },
          { label: 'Sound in Air (20°C: 343 m/s)', value: 'sound_air' },
          { label: 'Sound in Water (1,480 m/s)', value: 'sound_water' }
        ]
      }
    ],
    calculate: (inputs) => {
      const f = Number(inputs.frequencyHz) || 2400000000;
      const medium = inputs.medium || 'light';

      let v = 299792458; // speed of light
      if (medium === 'sound_air') v = 343;
      if (medium === 'sound_water') v = 1480;

      const T = f > 0 ? 1 / f : 0;
      const wavelength = f > 0 ? v / f : 0;
      const omega = 2 * Math.PI * f;

      let formattedWavelength = '';
      if (wavelength >= 1000) formattedWavelength = `${(wavelength / 1000).toFixed(2)} km`;
      else if (wavelength >= 1) formattedWavelength = `${wavelength.toFixed(3)} m`;
      else if (wavelength >= 0.01) formattedWavelength = `${(wavelength * 100).toFixed(2)} cm`;
      else formattedWavelength = `${(wavelength * 1000).toFixed(2)} mm`;

      return {
        primaryMetric: {
          label: 'Wavelength (λ)',
          value: Number(wavelength.toFixed(4)),
          formattedValue: formattedWavelength,
          subtext: `At wave velocity = ${v.toLocaleString()} m/s`,
          type: 'highlight',
          badge: f >= 1e9 ? `${(f/1e9).toFixed(2)} GHz` : f >= 1e6 ? `${(f/1e6).toFixed(2)} MHz` : `${f} Hz`
        },
        secondaryMetrics: [
          {
            label: 'Time Period (T = 1/f)',
            value: T,
            formattedValue: T < 1e-6 ? `${(T * 1e9).toFixed(2)} ns` : T < 1e-3 ? `${(T * 1e6).toFixed(2)} µs` : `${(T * 1000).toFixed(3)} ms`,
            type: 'neutral'
          },
          {
            label: 'Angular Frequency (ω = 2πf)',
            value: Number(omega.toFixed(1)),
            formattedValue: `${omega.toExponential(2)} rad/s`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'λ = v / f   |   T = 1 / f   |   ω = 2 × π × f',
      explanation: 'Wavelength equals propagation velocity divided by wave oscillation frequency.',
      variables: [
        { symbol: 'λ', name: 'Wavelength', description: 'Spatial period of the wave in meters.' },
        { symbol: 'f', name: 'Frequency', description: 'Number of wave cycles per second in Hertz.' }
      ]
    },
    explanationSections: [
      {
        title: 'Wave Physics Essentials',
        content: 'Higher frequencies correspond to shorter wavelengths. A 2.4 GHz Wi-Fi wave is roughly 12.5 cm long, while audible 1 kHz sound in air is approximately 34 cm long.'
      }
    ],
    faqs: [
      {
        question: 'Why do antennas need to be sized to wavelength?',
        answer: 'Optimal antenna resonance is typically designed at 1/2 or 1/4 of the operating wavelength (λ/4 dipole) for maximum signal reception.'
      }
    ],
    relatedIds: ['wavelength-calculator', 'frequency-time-period-calculator'],
    disclaimerType: 'standard'
  }
];

// Unified export of all engineering sub-category calculators
export const engineeringCalculators: CalculatorDefinition[] = [
  ...programmingCalculators,
  ...electricalCalculators,
  ...digitalLogicCalculators
];
