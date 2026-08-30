import { CalculatorDefinition } from '../../types/calculator';
import { formatNumber } from '../utils';

export const engineeringCalculators: CalculatorDefinition[] = [
  // 1. OHM'S LAW CALCULATOR
  {
    id: 'ohms-law-calculator',
    slug: 'ohms-law-calculator',
    name: "Ohm's Law & Electrical Power Calculator",
    shortName: "Ohm's Law",
    category: 'engineering',
    description: "Calculate Voltage (V), Current (I), Resistance (R), and Power (P) using Ohm's Law triangle formulas.",
    iconName: 'Zap',
    popular: true,
    featured: true,
    keywords: ['ohms law', 'voltage', 'current', 'resistance', 'power', 'watts', 'amperes', 'volts', 'ohms', 'circuit'],
    inputs: [
      {
        id: 'knownValues',
        label: 'Select Two Known Parameters',
        type: 'select',
        defaultValue: 'VR',
        options: [
          { label: 'Voltage (V) and Resistance (R)', value: 'VR' },
          { label: 'Voltage (V) and Current (I)', value: 'VI' },
          { label: 'Current (I) and Resistance (R)', value: 'IR' },
          { label: 'Power (P) and Voltage (V)', value: 'PV' },
          { label: 'Power (P) and Current (I)', value: 'PI' },
          { label: 'Power (P) and Resistance (R)', value: 'PR' }
        ]
      },
      {
        id: 'val1',
        label: 'First Value',
        type: 'number',
        defaultValue: 12,
        min: 0.001,
        max: 1000000,
        step: 0.1,
        helpText: 'e.g. Voltage = 12 Volts'
      },
      {
        id: 'val2',
        label: 'Second Value',
        type: 'number',
        defaultValue: 4,
        min: 0.001,
        max: 1000000,
        step: 0.1,
        helpText: 'e.g. Resistance = 4 Ohms'
      }
    ],
    calculate: (inputs) => {
      const mode = inputs.knownValues || 'VR';
      const a = Number(inputs.val1) || 12;
      const b = Number(inputs.val2) || 4;

      let V = 0, I = 0, R = 0, P = 0;

      if (mode === 'VR') {
        V = a;
        R = b;
        I = R > 0 ? V / R : 0;
        P = V * I;
      } else if (mode === 'VI') {
        V = a;
        I = b;
        R = I > 0 ? V / I : 0;
        P = V * I;
      } else if (mode === 'IR') {
        I = a;
        R = b;
        V = I * R;
        P = I * I * R;
      } else if (mode === 'PV') {
        P = a;
        V = b;
        I = V > 0 ? P / V : 0;
        R = I > 0 ? V / I : 0;
      } else if (mode === 'PI') {
        P = a;
        I = b;
        V = I > 0 ? P / I : 0;
        R = I > 0 ? V / I : 0;
      } else if (mode === 'PR') {
        P = a;
        R = b;
        I = Math.sqrt(P / (R || 1));
        V = I * R;
      }

      return {
        primaryMetric: {
          label: 'Calculated Electrical Power (P)',
          value: Number(P.toFixed(3)),
          formattedValue: `${P.toFixed(3)} W (Watts)`,
          subtext: `Voltage: ${V.toFixed(2)} V | Current: ${I.toFixed(3)} A | Resistance: ${R.toFixed(2)} Ω`,
          type: 'highlight',
          badge: `${P > 1000 ? (P/1000).toFixed(2) + ' kW' : P.toFixed(2) + ' W'}`
        },
        secondaryMetrics: [
          {
            label: 'Voltage (V)',
            value: Number(V.toFixed(3)),
            formattedValue: `${V.toFixed(3)} Volts (V)`,
            type: 'neutral'
          },
          {
            label: 'Current (I)',
            value: Number(I.toFixed(4)),
            formattedValue: `${I.toFixed(4)} Amperes (A)`,
            type: 'success',
            subtext: `${(I * 1000).toFixed(1)} mA`
          },
          {
            label: 'Resistance (R)',
            value: Number(R.toFixed(3)),
            formattedValue: `${R.toFixed(3)} Ohms (Ω)`,
            type: 'neutral'
          }
        ],
        summaryText: `With Voltage = ${V.toFixed(2)}V and Resistance = ${R.toFixed(2)}Ω, the circuit draws ${I.toFixed(3)}A of current and dissipates ${P.toFixed(2)}W of power.`
      };
    },
    formula: {
      expression: 'V = I × R   |   P = V × I = I² × R = V² / R',
      explanation: "Ohm's Law states that current through a conductor between two points is directly proportional to voltage across the points and inversely proportional to resistance.",
      variables: [
        { symbol: 'V', name: 'Voltage', description: 'Electric potential difference measured in Volts (V).' },
        { symbol: 'I', name: 'Current', description: 'Electric current flow measured in Amperes (A).' },
        { symbol: 'R', name: 'Resistance', description: 'Opposition to current flow in Ohms (Ω).' },
        { symbol: 'P', name: 'Power', description: 'Rate of electrical energy dissipation in Watts (W).' }
      ]
    },
    explanationSections: [
      {
        title: "Understanding Ohm's Triangle",
        content: 'Cover the unknown variable on the Ohm’s law triangle (V on top, I and R on bottom) to reveal its formula: V = I × R, I = V / R, and R = V / I.'
      }
    ],
    faqs: [
      {
        question: 'Does Ohm’s law apply to AC circuits?',
        answer: "Yes, but resistance (R) is replaced by impedance (Z), taking into account capacitive and inductive reactance alongside phase angle."
      }
    ],
    relatedIds: ['electrical-power-calculator', 'resistor-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 2. RESISTOR COLOR CODE CALCULATOR
  {
    id: 'resistor-color-code-calculator',
    slug: 'resistor-color-code-calculator',
    name: 'Resistor Color Code Calculator (4 & 5 Band)',
    shortName: 'Resistor Color Code',
    category: 'engineering',
    description: 'Decode 4-band and 5-band axial resistor color bands into exact resistance value, tolerance, and minimum/maximum range.',
    iconName: 'Activity',
    popular: true,
    featured: true,
    keywords: ['resistor color code', 'resistor bands', 'ohms', 'electronics', 'color code', 'tolerance', '4 band resistor', '5 band resistor'],
    inputs: [
      {
        id: 'bandCount',
        label: 'Resistor Band Type',
        type: 'select',
        defaultValue: '4',
        options: [
          { label: '4-Band Resistor (Standard)', value: '4' },
          { label: '5-Band Resistor (Precision 1%)', value: '5' }
        ]
      },
      {
        id: 'band1',
        label: '1st Band (1st Digit)',
        type: 'select',
        defaultValue: 'brown',
        options: [
          { label: 'Brown (1)', value: 'brown' },
          { label: 'Red (2)', value: 'red' },
          { label: 'Orange (3)', value: 'orange' },
          { label: 'Yellow (4)', value: 'yellow' },
          { label: 'Green (5)', value: 'green' },
          { label: 'Blue (6)', value: 'blue' },
          { label: 'Violet (7)', value: 'violet' },
          { label: 'Grey (8)', value: 'grey' },
          { label: 'White (9)', value: 'white' }
        ]
      },
      {
        id: 'band2',
        label: '2nd Band (2nd Digit)',
        type: 'select',
        defaultValue: 'black',
        options: [
          { label: 'Black (0)', value: 'black' },
          { label: 'Brown (1)', value: 'brown' },
          { label: 'Red (2)', value: 'red' },
          { label: 'Orange (3)', value: 'orange' },
          { label: 'Yellow (4)', value: 'yellow' },
          { label: 'Green (5)', value: 'green' },
          { label: 'Blue (6)', value: 'blue' },
          { label: 'Violet (7)', value: 'violet' },
          { label: 'Grey (8)', value: 'grey' },
          { label: 'White (9)', value: 'white' }
        ]
      },
      {
        id: 'multiplier',
        label: 'Multiplier Band',
        type: 'select',
        defaultValue: 'orange',
        options: [
          { label: 'Black (×1 Ω)', value: 'black' },
          { label: 'Brown (×10 Ω)', value: 'brown' },
          { label: 'Red (×100 Ω)', value: 'red' },
          { label: 'Orange (×1 kΩ)', value: 'orange' },
          { label: 'Yellow (×10 kΩ)', value: 'yellow' },
          { label: 'Green (×100 kΩ)', value: 'green' },
          { label: 'Blue (×1 MΩ)', value: 'blue' },
          { label: 'Gold (×0.1 Ω)', value: 'gold' },
          { label: 'Silver (×0.01 Ω)', value: 'silver' }
        ]
      },
      {
        id: 'tolerance',
        label: 'Tolerance Band',
        type: 'select',
        defaultValue: 'gold',
        options: [
          { label: 'Gold (±5%)', value: 'gold' },
          { label: 'Silver (±10%)', value: 'silver' },
          { label: 'Brown (±1%)', value: 'brown' },
          { label: 'Red (±2%)', value: 'red' },
          { label: 'Green (±0.5%)', value: 'green' }
        ]
      }
    ],
    calculate: (inputs) => {
      const colorDigits: Record<string, number> = {
        black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
        green: 5, blue: 6, violet: 7, grey: 8, white: 9
      };

      const multValues: Record<string, number> = {
        black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
        green: 100000, blue: 1000000, gold: 0.1, silver: 0.01
      };

      const tolValues: Record<string, number> = {
        gold: 5, silver: 10, brown: 1, red: 2, green: 0.5
      };

      const d1 = colorDigits[inputs.band1] ?? 1;
      const d2 = colorDigits[inputs.band2] ?? 0;
      const mult = multValues[inputs.multiplier] ?? 1000;
      const tol = tolValues[inputs.tolerance] ?? 5;

      const baseVal = (d1 * 10 + d2) * mult;
      const tolRange = (baseVal * tol) / 100;
      const minVal = baseVal - tolRange;
      const maxVal = baseVal + tolRange;

      let formattedNominal = '';
      if (baseVal >= 1000000) {
        formattedNominal = `${(baseVal / 1000000).toFixed(2)} MΩ`;
      } else if (baseVal >= 1000) {
        formattedNominal = `${(baseVal / 1000).toFixed(2)} kΩ`;
      } else {
        formattedNominal = `${baseVal.toFixed(1)} Ω`;
      }

      return {
        primaryMetric: {
          label: 'Decoded Resistance Value',
          value: baseVal,
          formattedValue: `${formattedNominal} ±${tol}%`,
          subtext: `Range: ${minVal.toFixed(1)} Ω to ${maxVal.toFixed(1)} Ω`,
          type: 'highlight',
          badge: `Tolerance: ±${tol}%`
        },
        secondaryMetrics: [
          {
            label: 'Minimum Resistance',
            value: Number(minVal.toFixed(1)),
            formattedValue: `${minVal.toFixed(1)} Ω`,
            type: 'neutral'
          },
          {
            label: 'Maximum Resistance',
            value: Number(maxVal.toFixed(1)),
            formattedValue: `${maxVal.toFixed(1)} Ω`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Resistance = (Digit1 Digit2) × Multiplier ± Tolerance%',
      explanation: 'Axial leaded through-hole resistors use colored bands printed around the cylindrical ceramic body.',
      variables: [
        { symbol: 'Multiplier', name: 'Factor', description: 'Power of 10 to multiply digit prefix.' },
        { symbol: 'Tolerance', name: 'Manufacturing Margin', description: 'Maximum deviation in percentage from nominal resistance.' }
      ]
    },
    explanationSections: [
      {
        title: 'Mnemonic to Remember Resistor Colors',
        content: '"BB ROY of Great Britain had a Very Good Wife" represents Black(0), Brown(1), Red(2), Orange(3), Yellow(4), Green(5), Blue(6), Violet(7), Grey(8), White(9).'
      }
    ],
    faqs: [
      {
        question: 'Which end of the resistor do I read first?',
        answer: 'Look for the tolerance band (usually Gold or Silver); it is spaced slightly further apart from the other bands. Read from the opposite end toward the tolerance band.'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'resistor-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 3. RESISTOR SERIES & PARALLEL CALCULATOR
  {
    id: 'resistor-calculator',
    slug: 'resistor-calculator',
    name: 'Series & Parallel Resistor Calculator',
    shortName: 'Resistor Calculator',
    category: 'engineering',
    description: 'Calculate equivalent resistance for multiple resistors connected in series or parallel circuits.',
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

      // Series = R1 + R2 + R3
      const rSeries = activeResistors.reduce((a, b) => a + b, 0);

      // Parallel = 1 / (1/R1 + 1/R2 + 1/R3)
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
    relatedIds: ['ohms-law-calculator', 'capacitor-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 4. RC TIME CONSTANT CALCULATOR
  {
    id: 'rc-time-constant-calculator',
    slug: 'rc-time-constant-calculator',
    name: 'RC Time Constant & Charging Calculator',
    shortName: 'RC Time Constant',
    category: 'engineering',
    description: 'Calculate RC circuit time constant (τ = R × C), cutoff frequency, and capacitor voltage over 5 time constants.',
    iconName: 'Timer',
    keywords: ['rc time constant', 'tau', 'capacitor charging', 'cutoff frequency', 'filter', 'low pass filter'],
    inputs: [
      {
        id: 'resistance',
        label: 'Resistance (R in kΩ)',
        type: 'slider',
        defaultValue: 10,
        min: 0.1,
        max: 1000,
        step: 0.5,
        suffix: ' kΩ'
      },
      {
        id: 'capacitance',
        label: 'Capacitance (C in µF)',
        type: 'slider',
        defaultValue: 100,
        min: 0.1,
        max: 4700,
        step: 1,
        suffix: ' µF'
      },
      {
        id: 'supplyVoltage',
        label: 'Supply Step Voltage (Vs)',
        type: 'slider',
        defaultValue: 5,
        min: 1,
        max: 48,
        step: 0.5,
        suffix: ' V'
      }
    ],
    calculate: (inputs) => {
      const R_ohms = (Number(inputs.resistance) || 10) * 1000;
      const C_farads = (Number(inputs.capacitance) || 100) * 1e-6;
      const Vs = Number(inputs.supplyVoltage) || 5;

      const tau = R_ohms * C_farads; // seconds
      const cutoffFreq = 1 / (2 * Math.PI * R_ohms * C_farads);

      const chartData = [
        { name: '0τ (0s)', 'Capacitor Voltage (V)': 0, 'Charge %': 0 },
        { name: '1τ', 'Capacitor Voltage (V)': Number((Vs * 0.632).toFixed(2)), 'Charge %': 63.2 },
        { name: '2τ', 'Capacitor Voltage (V)': Number((Vs * 0.865).toFixed(2)), 'Charge %': 86.5 },
        { name: '3τ', 'Capacitor Voltage (V)': Number((Vs * 0.950).toFixed(2)), 'Charge %': 95.0 },
        { name: '4τ', 'Capacitor Voltage (V)': Number((Vs * 0.982).toFixed(2)), 'Charge %': 98.2 },
        { name: '5τ (Full)', 'Capacitor Voltage (V)': Number((Vs * 0.993).toFixed(2)), 'Charge %': 99.3 }
      ];

      return {
        primaryMetric: {
          label: 'RC Time Constant (τ)',
          value: Number(tau.toFixed(4)),
          formattedValue: `${tau >= 1 ? tau.toFixed(2) + ' s' : (tau * 1000).toFixed(1) + ' ms'}`,
          subtext: `Charges to 63.2% (${(Vs * 0.632).toFixed(2)}V) in 1τ`,
          type: 'highlight',
          badge: `Full Charge (5τ) ≈ ${(tau * 5).toFixed(2)} s`
        },
        secondaryMetrics: [
          {
            label: 'Cutoff Frequency (-3dB fc)',
            value: Number(cutoffFreq.toFixed(2)),
            formattedValue: `${cutoffFreq >= 1000 ? (cutoffFreq / 1000).toFixed(2) + ' kHz' : cutoffFreq.toFixed(2) + ' Hz'}`,
            type: 'neutral'
          },
          {
            label: 'Voltage at 1τ (63.2%)',
            value: Number((Vs * 0.632).toFixed(2)),
            formattedValue: `${(Vs * 0.632).toFixed(2)} V`,
            type: 'success'
          }
        ],
        chart: {
          type: 'line',
          title: 'Capacitor Charging Curve (0τ to 5τ)',
          data: chartData,
          series: [
            { key: 'Capacitor Voltage (V)', name: 'Capacitor Voltage', color: '#3b82f6' }
          ]
        }
      };
    },
    formula: {
      expression: 'τ = R × C   |   V(t) = Vs × (1 - e^(-t / τ))',
      explanation: 'Tau represents the time required for a capacitor to charge from 0V to 63.2% of its maximum supply voltage.',
      variables: [
        { symbol: 'τ', name: 'Time Constant', description: 'Product of resistance in ohms and capacitance in farads.' }
      ]
    },
    explanationSections: [
      {
        title: 'The 5τ Full Charge Rule',
        content: 'In practical electronic circuit design, a capacitor is considered 99.3% fully charged after five time constants (5τ).'
      }
    ],
    faqs: [
      {
        question: 'What is the cutoff frequency of an RC low-pass filter?',
        answer: 'fc = 1 / (2 × π × R × C). At this frequency, output signal power is attenuated by half (-3dB).'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'resistor-calculator', 'frequency-calculator'],
    disclaimerType: 'standard'
  },

  // 5. FREQUENCY & WAVELENGTH CALCULATOR
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
    relatedIds: ['ohms-law-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 6. BINARY & HEXADECIMAL CONVERTER
  {
    id: 'binary-converter',
    slug: 'binary-converter',
    name: 'Binary, Decimal & Hexadecimal Radix Converter',
    shortName: 'Binary / Hex Converter',
    category: 'engineering',
    description: 'Convert numbers instantly between Binary (Base 2), Decimal (Base 10), Hexadecimal (Base 16), and Octal (Base 8).',
    iconName: 'Binary',
    popular: true,
    keywords: ['binary converter', 'hex converter', 'decimal to binary', 'hex to decimal', 'base 16', 'bitwise', 'computer science'],
    inputs: [
      {
        id: 'inputBase',
        label: 'Input Number Format',
        type: 'select',
        defaultValue: 'decimal',
        options: [
          { label: 'Decimal (Base 10)', value: 'decimal' },
          { label: 'Binary (Base 2)', value: 'binary' },
          { label: 'Hexadecimal (Base 16)', value: 'hex' },
          { label: 'Octal (Base 8)', value: 'octal' }
        ]
      },
      {
        id: 'inputValue',
        label: 'Enter Value',
        type: 'text',
        defaultValue: '255',
        placeholder: 'e.g. 255 or 11111111 or FF'
      }
    ],
    calculate: (inputs) => {
      const base = inputs.inputBase || 'decimal';
      const raw = String(inputs.inputValue || '255').trim();

      let decimal = 0;
      try {
        if (base === 'decimal') decimal = parseInt(raw, 10);
        else if (base === 'binary') decimal = parseInt(raw, 2);
        else if (base === 'hex') decimal = parseInt(raw, 16);
        else if (base === 'octal') decimal = parseInt(raw, 8);
      } catch (e) {
        decimal = 0;
      }

      if (isNaN(decimal)) decimal = 0;

      const bin = decimal.toString(2);
      const hex = decimal.toString(16).toUpperCase();
      const oct = decimal.toString(8);

      return {
        primaryMetric: {
          label: 'Binary (Base 2)',
          value: bin,
          formattedValue: `0b${bin.padStart(8, '0')}`,
          subtext: `Decimal: ${decimal} | Hex: 0x${hex}`,
          type: 'highlight',
          badge: `${bin.length} Bits`
        },
        secondaryMetrics: [
          {
            label: 'Decimal (Base 10)',
            value: decimal,
            formattedValue: decimal.toLocaleString(),
            type: 'neutral'
          },
          {
            label: 'Hexadecimal (Base 16)',
            value: hex,
            formattedValue: `0x${hex}`,
            type: 'success'
          },
          {
            label: 'Octal (Base 8)',
            value: oct,
            formattedValue: `0o${oct}`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Decimal = Σ (digit × Base^position)',
      explanation: 'Positional numeral system conversion mapping polynomial powers of 2, 8, 10, and 16.',
      variables: [
        { symbol: 'Base 2', name: 'Binary', description: 'Composed of 0 and 1.' },
        { symbol: 'Base 16', name: 'Hexadecimal', description: 'Digits 0-9 and letters A-F (representing 10-15).' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Computers Use Binary and Hex',
        content: 'Transistors in computer silicon represent binary states (0 = off, 1 = on). Hexadecimal is used by programmers as a compact, human-readable shorthand where each hex digit represents exactly 4 binary bits (a nibble).'
      }
    ],
    faqs: [
      {
        question: 'What is 255 in hex and binary?',
        answer: 'Decimal 255 is 0xFF in hexadecimal and 11111111 in binary (1 full byte of all ones).'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'frequency-calculator'],
    disclaimerType: 'standard'
  }
];
