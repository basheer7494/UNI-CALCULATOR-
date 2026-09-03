import { CalculatorDefinition } from '../../../types/calculator';

export const electricalCalculators: CalculatorDefinition[] = [
  // 1. OHM'S LAW CALCULATOR (FLAGSHIP)
  {
    id: 'ohms-law-calculator',
    slug: 'ohms-law-calculator',
    name: "Ohm's Law Calculator",
    shortName: "Ohm's Law",
    category: 'engineering',
    description: "Calculate Voltage (V), Current (I), Resistance (R), and Power (P) using Ohm's Law triangle formulas.",
    iconName: 'Zap',
    popular: true,
    featured: true,
    keywords: ['ohms law', 'voltage', 'current', 'resistance', 'power', 'watts', 'amperes', 'volts', 'ohms', 'circuit', 'ece'],
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
            value: Number(V.toFixed(2)),
            formattedValue: `${V.toFixed(2)} V`,
            type: 'neutral'
          },
          {
            label: 'Current (I)',
            value: Number(I.toFixed(3)),
            formattedValue: `${I >= 1 ? I.toFixed(3) + ' A' : (I * 1000).toFixed(1) + ' mA'}`,
            type: 'neutral'
          },
          {
            label: 'Resistance (R)',
            value: Number(R.toFixed(2)),
            formattedValue: `${R >= 1000 ? (R/1000).toFixed(2) + ' kΩ' : R.toFixed(2) + ' Ω'}`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Potential Difference (V)', value: V, formattedValue: `${V.toFixed(2)} Volts` },
          { label: 'Current Flow (I)', value: I, formattedValue: `${(I * 1000).toFixed(1)} mA` },
          { label: 'Circuit Resistance (R)', value: R, formattedValue: `${R.toFixed(2)} Ω` },
          { label: 'Dissipated Power (P = V×I)', value: P, formattedValue: `${P.toFixed(3)} Watts` }
        ],
        summaryText: `Calculated from ${mode}: V = ${V.toFixed(2)}V, I = ${I.toFixed(3)}A, R = ${R.toFixed(2)}Ω, P = ${P.toFixed(3)}W.`
      };
    },
    formula: {
      expression: 'V = I × R   |   P = V × I = I² × R = V² / R',
      explanation: "Ohm's law states that current through a conductor between two points is directly proportional to the voltage across the two points.",
      variables: [
        { symbol: 'V', name: 'Voltage', description: 'Electric potential difference in Volts (V).' },
        { symbol: 'I', name: 'Current', description: 'Electric current in Amperes (A).' },
        { symbol: 'R', name: 'Resistance', description: 'Electrical resistance in Ohms (Ω).' },
        { symbol: 'P', name: 'Power', description: 'Rate of energy consumption in Watts (W).' }
      ]
    },
    explanationSections: [
      {
        title: "How to Use Ohm's Law",
        content: "Select any two known circuit parameters (such as 12V supply and 4Ω load resistor) and the calculator will automatically solve for the remaining two values using standard SI electrical equations."
      }
    ],
    faqs: [
      {
        question: 'What is the Ohm’s law pie chart?',
        answer: 'The Ohm’s Law wheel displays 12 distinct formulas relating V, I, R, and P (e.g. V = √(P×R), I = P/V, R = V²/P).'
      }
    ],
    relatedIds: ['electrical-power-calculator', 'voltage-divider-calculator', 'current-divider-calculator', 'series-resistance-calculator'],
    disclaimerType: 'standard'
  },

  // 2. ELECTRICAL POWER CALCULATOR
  {
    id: 'electrical-power-calculator',
    slug: 'electrical-power-calculator',
    name: 'Electrical Power Calculator',
    shortName: 'Electrical Power',
    category: 'engineering',
    description: 'Calculate real power (Watts), energy consumption in kWh, daily/monthly electricity cost, and power dissipation from voltage, current, or resistance.',
    iconName: 'Gauge',
    popular: true,
    keywords: ['electrical power calculator', 'power in watts', 'p = vi', 'kwh calculator', 'electricity bill', 'power consumption', 'dc power', 'watts to amps'],
    inputs: [
      {
        id: 'voltage',
        label: 'Voltage (V in Volts)',
        type: 'number',
        defaultValue: 230,
        min: 0.1,
        max: 50000,
        step: 1
      },
      {
        id: 'current',
        label: 'Current (I in Amperes)',
        type: 'number',
        defaultValue: 5,
        min: 0.001,
        max: 1000,
        step: 0.1
      },
      {
        id: 'hoursPerDay',
        label: 'Operating Hours per Day',
        type: 'slider',
        defaultValue: 8,
        min: 0.5,
        max: 24,
        step: 0.5,
        suffix: ' hrs'
      },
      {
        id: 'costPerKwh',
        label: 'Electricity Rate ($/kWh or ₹/kWh)',
        type: 'number',
        defaultValue: 0.15,
        min: 0.01,
        max: 5,
        step: 0.01
      }
    ],
    calculate: (inputs) => {
      const v = Number(inputs.voltage) || 230;
      const i = Number(inputs.current) || 5;
      const hours = Number(inputs.hoursPerDay) || 8;
      const rate = Number(inputs.costPerKwh) || 0.15;

      const powerWatts = v * i;
      const powerKw = powerWatts / 1000;
      const dailyKwh = powerKw * hours;
      const monthlyKwh = dailyKwh * 30;
      const dailyCost = dailyKwh * rate;
      const monthlyCost = monthlyKwh * rate;
      const equivalentR = i > 0 ? v / i : 0;

      return {
        primaryMetric: {
          label: 'Active Electrical Power',
          value: Number(powerWatts.toFixed(1)),
          formattedValue: `${powerWatts >= 1000 ? (powerKw).toFixed(2) + ' kW' : powerWatts.toFixed(1) + ' Watts'}`,
          subtext: `Daily Energy: ${dailyKwh.toFixed(2)} kWh (${monthlyKwh.toFixed(1)} kWh/mo)`,
          type: 'highlight',
          badge: `${powerKw.toFixed(2)} kW`
        },
        secondaryMetrics: [
          {
            label: 'Monthly Electricity Cost',
            value: Number(monthlyCost.toFixed(2)),
            formattedValue: `$${monthlyCost.toFixed(2)}`,
            type: 'neutral'
          },
          {
            label: 'Daily Electricity Cost',
            value: Number(dailyCost.toFixed(2)),
            formattedValue: `$${dailyCost.toFixed(2)}`,
            type: 'neutral'
          },
          {
            label: 'Equivalent Load Resistance',
            value: Number(equivalentR.toFixed(2)),
            formattedValue: `${equivalentR.toFixed(2)} Ω`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Instantaneous Power (P = V×I)', value: powerWatts, formattedValue: `${powerWatts.toFixed(1)} W` },
          { label: 'Daily Energy Used', value: dailyKwh, formattedValue: `${dailyKwh.toFixed(2)} kWh` },
          { label: 'Monthly Energy Used (30 Days)', value: monthlyKwh, formattedValue: `${monthlyKwh.toFixed(1)} kWh` },
          { label: 'Estimated Monthly Cost', value: monthlyCost, formattedValue: `$${monthlyCost.toFixed(2)}` }
        ],
        summaryText: `At ${v}V and ${i}A, device consumes ${powerWatts.toFixed(1)}W. Running ${hours} hours/day uses ${monthlyKwh.toFixed(1)} kWh/month costing ~$${monthlyCost.toFixed(2)}.`
      };
    },
    formula: {
      expression: 'P = V × I   |   Energy (kWh) = (Watts × Hours) / 1000',
      explanation: 'Electrical power represents the rate of electrical energy transfer per unit time.',
      variables: [
        { symbol: 'P', name: 'Power', description: 'Work done in Joules per second (Watts).' },
        { symbol: 'kWh', name: 'Kilowatt-Hour', description: 'Standard billing unit for 1,000 Watts consumed for 1 hour.' }
      ]
    },
    explanationSections: [
      {
        title: 'Difference Between Power (Watts) and Energy (kWh)',
        content: 'Power is the instantaneous speed of electricity consumption (like speed in km/h), while Energy (kWh) is the cumulative volume consumed over time (like distance traveled in km).'
      }
    ],
    faqs: [
      {
        question: 'How many Watts is 1 Horsepower (HP)?',
        answer: '1 mechanical horsepower equals approximately 745.7 Watts.'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'ac-power-calculator', 'series-resistance-calculator'],
    disclaimerType: 'standard'
  },

  // 3. VOLTAGE DIVIDER CALCULATOR
  {
    id: 'voltage-divider-calculator',
    slug: 'voltage-divider-calculator',
    name: 'Voltage Divider Calculator',
    shortName: 'Voltage Divider',
    category: 'engineering',
    description: 'Calculate output voltage (Vout) across R2, loaded voltage divider with load resistance (RL), divider current, and power dissipation.',
    iconName: 'GitCommit',
    popular: true,
    keywords: ['voltage divider', 'vout calculator', 'resistive divider', 'potentiometer', 'loaded voltage divider', 'r1 r2', 'attenuator'],
    inputs: [
      {
        id: 'vin',
        label: 'Input Supply Voltage (Vin)',
        type: 'number',
        defaultValue: 12,
        min: 0.1,
        max: 1000,
        step: 0.1,
        suffix: ' V'
      },
      {
        id: 'r1',
        label: 'Top Resistor R1 (Ω)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 10000000,
        step: 100,
        suffix: ' Ω'
      },
      {
        id: 'r2',
        label: 'Bottom Resistor R2 (Ω)',
        type: 'number',
        defaultValue: 5000,
        min: 1,
        max: 10000000,
        step: 100,
        suffix: ' Ω'
      },
      {
        id: 'rLoad',
        label: 'Load Resistor RL (Ω) (Optional, 0 for Unloaded)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 10000000,
        step: 100,
        suffix: ' Ω'
      }
    ],
    calculate: (inputs) => {
      const vin = Number(inputs.vin) || 12;
      const r1 = Number(inputs.r1) || 10000;
      const r2 = Number(inputs.r2) || 5000;
      const rLoad = Number(inputs.rLoad) || 0;

      // Unloaded Vout
      const voutUnloaded = vin * (r2 / (r1 + r2));
      const dividerRatio = r2 / (r1 + r2);

      let voutLoaded = voutUnloaded;
      let effectiveR2 = r2;
      if (rLoad > 0) {
        effectiveR2 = (r2 * rLoad) / (r2 + rLoad);
        voutLoaded = vin * (effectiveR2 / (r1 + effectiveR2));
      }

      const totalR = r1 + effectiveR2;
      const currentI = vin / totalR;
      const powerR1 = (vin - voutLoaded) * currentI;
      const powerR2 = (voutLoaded * voutLoaded) / r2;

      return {
        primaryMetric: {
          label: rLoad > 0 ? 'Loaded Output Voltage (Vout)' : 'Output Voltage (Vout)',
          value: Number(voutLoaded.toFixed(3)),
          formattedValue: `${voutLoaded.toFixed(3)} V`,
          subtext: `Divider Ratio: ${(dividerRatio * 100).toFixed(1)}% of Vin (${voutUnloaded.toFixed(3)}V Unloaded)`,
          type: 'highlight',
          badge: `${(dividerRatio * 100).toFixed(1)}% Vin`
        },
        secondaryMetrics: [
          {
            label: 'Divider Quiescent Current',
            value: Number((currentI * 1000).toFixed(3)),
            formattedValue: `${(currentI * 1000).toFixed(3)} mA`,
            type: 'neutral'
          },
          {
            label: 'Power Dissipated in R1',
            value: Number((powerR1 * 1000).toFixed(1)),
            formattedValue: `${powerR1 >= 1 ? powerR1.toFixed(2) + ' W' : (powerR1 * 1000).toFixed(1) + ' mW'}`,
            type: 'neutral'
          },
          {
            label: 'Power Dissipated in R2',
            value: Number((powerR2 * 1000).toFixed(1)),
            formattedValue: `${powerR2 >= 1 ? powerR2.toFixed(2) + ' W' : (powerR2 * 1000).toFixed(1) + ' mW'}`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Unloaded Vout (No Load)', value: voutUnloaded, formattedValue: `${voutUnloaded.toFixed(3)} V` },
          { label: 'Loaded Vout (with RL)', value: voutLoaded, formattedValue: `${voutLoaded.toFixed(3)} V` },
          { label: 'Effective R2 || RL', value: effectiveR2, formattedValue: `${effectiveR2.toFixed(1)} Ω` },
          { label: 'Total Current from Vin', value: currentI, formattedValue: `${(currentI * 1000).toFixed(3)} mA` }
        ],
        summaryText: `Vin = ${vin}V divided across R1 (${r1}Ω) and R2 (${r2}Ω) produces Vout = ${voutLoaded.toFixed(3)}V with a quiescent current of ${(currentI * 1000).toFixed(3)} mA.`
      };
    },
    formula: {
      expression: 'Vout = Vin × [ R2 / (R1 + R2) ]   |   Loaded: R2_eff = (R2 × RL) / (R2 + RL)',
      explanation: 'Produces an output voltage that is a fraction of its input voltage based on the ratio of the two series resistors.',
      variables: [
        { symbol: 'Vout', name: 'Output Voltage', description: 'Fractional voltage taken across R2.' },
        { symbol: 'RL', name: 'Load Resistance', description: 'Resistance placed in parallel with R2.' }
      ]
    },
    explanationSections: [
      {
        title: 'The Loading Effect in Voltage Dividers',
        content: 'When an external load RL is connected across R2, it acts in parallel with R2, lowering the effective resistance and causing Vout to sag. For stable output, choose R2 to be at least 10× smaller than RL.'
      }
    ],
    faqs: [
      {
        question: 'Why should voltage dividers not be used as power supplies?',
        answer: 'Voltage dividers waste quiescent current and have poor voltage regulation under varying load currents. Use linear LDOs or switching buck converters for powering circuits.'
      }
    ],
    relatedIds: ['current-divider-calculator', 'ohms-law-calculator', 'series-resistance-calculator'],
    disclaimerType: 'standard'
  },

  // 4. CURRENT DIVIDER CALCULATOR
  {
    id: 'current-divider-calculator',
    slug: 'current-divider-calculator',
    name: 'Current Divider Calculator',
    shortName: 'Current Divider',
    category: 'engineering',
    description: 'Calculate individual branch currents for parallel resistors from a total incoming current source using the dual current divider rule.',
    iconName: 'Split',
    popular: true,
    keywords: ['current divider', 'branch current', 'parallel current divider', 'i1 i2', 'current divider rule', 'circuit theory'],
    inputs: [
      {
        id: 'totalCurrent',
        label: 'Total Source Current (Itotal in mA)',
        type: 'number',
        defaultValue: 100,
        min: 0.01,
        max: 100000,
        step: 1,
        suffix: ' mA'
      },
      {
        id: 'r1',
        label: 'Branch 1 Resistor R1 (Ω)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        max: 1000000,
        step: 10,
        suffix: ' Ω'
      },
      {
        id: 'r2',
        label: 'Branch 2 Resistor R2 (Ω)',
        type: 'number',
        defaultValue: 200,
        min: 1,
        max: 1000000,
        step: 10,
        suffix: ' Ω'
      }
    ],
    calculate: (inputs) => {
      const itotalMa = Number(inputs.totalCurrent) || 100;
      const itotal = itotalMa / 1000; // Amperes
      const r1 = Number(inputs.r1) || 100;
      const r2 = Number(inputs.r2) || 200;

      // Current divider rule: I1 = Itotal * (R2 / (R1 + R2))
      const i1 = itotal * (r2 / (r1 + r2));
      const i2 = itotal * (r1 / (r1 + r2));
      const req = (r1 * r2) / (r1 + r2);
      const vDrop = itotal * req;

      const p1 = i1 * i1 * r1;
      const p2 = i2 * i2 * r2;

      return {
        primaryMetric: {
          label: 'Branch 1 Current (I1 through R1)',
          value: Number((i1 * 1000).toFixed(2)),
          formattedValue: `${(i1 * 1000).toFixed(2)} mA`,
          subtext: `Branch 2 Current (I2 through R2): ${(i2 * 1000).toFixed(2)} mA`,
          type: 'highlight',
          badge: `${((i1 / itotal) * 100).toFixed(1)}% of Itotal`
        },
        secondaryMetrics: [
          {
            label: 'Branch 2 Current (I2)',
            value: Number((i2 * 1000).toFixed(2)),
            formattedValue: `${(i2 * 1000).toFixed(2)} mA`,
            type: 'neutral'
          },
          {
            label: 'Parallel Voltage Drop (V)',
            value: Number(vDrop.toFixed(3)),
            formattedValue: `${vDrop.toFixed(3)} V`,
            type: 'neutral'
          },
          {
            label: 'Equivalent Parallel Resistance (Req)',
            value: Number(req.toFixed(2)),
            formattedValue: `${req.toFixed(2)} Ω`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'I1 through R1', value: i1 * 1000, formattedValue: `${(i1 * 1000).toFixed(2)} mA` },
          { label: 'I2 through R2', value: i2 * 1000, formattedValue: `${(i2 * 1000).toFixed(2)} mA` },
          { label: 'Power in R1', value: p1, formattedValue: `${(p1 * 1000).toFixed(1)} mW` },
          { label: 'Power in R2', value: p2, formattedValue: `${(p2 * 1000).toFixed(1)} mW` }
        ],
        summaryText: `Incoming ${itotalMa} mA splits into ${(i1 * 1000).toFixed(2)} mA through R1 (${r1}Ω) and ${(i2 * 1000).toFixed(2)} mA through R2 (${r2}Ω).`
      };
    },
    formula: {
      expression: 'I1 = Itotal × [ R2 / (R1 + R2) ]   |   I2 = Itotal × [ R1 / (R1 + R2) ]',
      explanation: 'The current through any branch in a parallel circuit is inversely proportional to its resistance (smaller resistance carries larger current).',
      variables: [
        { symbol: 'I1', name: 'Current in R1', description: 'Fraction of total current passing through branch 1.' },
        { symbol: 'Req', name: 'Equivalent Resistance', description: 'R1 × R2 / (R1 + R2)' }
      ]
    },
    explanationSections: [
      {
        title: 'Current Follows the Path of Least Resistance',
        content: 'Notice that in the current divider equation for I1, the numerator contains the OPPOSITE resistor R2. This is because lower resistance branches draw a greater share of the total current.'
      }
    ],
    faqs: [
      {
        question: 'Does the current divider rule work for AC circuits?',
        answer: 'Yes, by substituting complex impedances (Z1, Z2) in place of resistances (R1, R2).'
      }
    ],
    relatedIds: ['voltage-divider-calculator', 'parallel-resistance-calculator', 'ohms-law-calculator'],
    disclaimerType: 'standard'
  },

  // 5. SERIES RESISTANCE CALCULATOR
  {
    id: 'series-resistance-calculator',
    slug: 'series-resistance-calculator',
    name: 'Series Resistance Calculator',
    shortName: 'Series Resistance',
    category: 'engineering',
    description: 'Calculate total equivalent series resistance (Req = R1 + R2 + ... + Rn), voltage drops per resistor, and individual power dissipations.',
    iconName: 'ArrowRight',
    popular: true,
    keywords: ['series resistance', 'resistors in series', 'req series', 'voltage drop series', 'circuit theory', 'resistor calculator'],
    inputs: [
      { id: 'r1', label: 'Resistor R1 (Ω)', type: 'number', defaultValue: 100, min: 0.1, max: 10000000 },
      { id: 'r2', label: 'Resistor R2 (Ω)', type: 'number', defaultValue: 220, min: 0.1, max: 10000000 },
      { id: 'r3', label: 'Resistor R3 (Ω) (Optional)', type: 'number', defaultValue: 470, min: 0, max: 10000000 },
      { id: 'r4', label: 'Resistor R4 (Ω) (Optional)', type: 'number', defaultValue: 0, min: 0, max: 10000000 },
      { id: 'appliedVoltage', label: 'Applied Supply Voltage (V)', type: 'number', defaultValue: 12, min: 0, max: 1000 }
    ],
    calculate: (inputs) => {
      const r1 = Number(inputs.r1) || 100;
      const r2 = Number(inputs.r2) || 220;
      const r3 = Number(inputs.r3) || 0;
      const r4 = Number(inputs.r4) || 0;
      const v = Number(inputs.appliedVoltage) || 12;

      const activeResistors = [
        { name: 'R1', val: r1 },
        { name: 'R2', val: r2 },
        { name: 'R3', val: r3 },
        { name: 'R4', val: r4 }
      ].filter(item => item.val > 0);

      const rTotal = activeResistors.reduce((acc, item) => acc + item.val, 0);
      const current = rTotal > 0 ? v / rTotal : 0;
      const totalPower = v * current;

      const breakdown = activeResistors.map(item => {
        const drop = current * item.val;
        const power = current * current * item.val;
        return {
          label: `${item.name} (${item.val} Ω)`,
          value: drop,
          formattedValue: `Drop: ${drop.toFixed(2)} V | Dissipation: ${(power * 1000).toFixed(1)} mW`
        };
      });

      return {
        primaryMetric: {
          label: 'Total Series Resistance (R_total)',
          value: Number(rTotal.toFixed(2)),
          formattedValue: `${rTotal >= 1000 ? (rTotal / 1000).toFixed(2) + ' kΩ' : rTotal.toFixed(2) + ' Ω'}`,
          subtext: `Total Current: ${(current * 1000).toFixed(2)} mA at ${v}V Applied`,
          type: 'highlight',
          badge: `${activeResistors.length} Resistors`
        },
        secondaryMetrics: [
          {
            label: 'Series Circuit Current',
            value: Number((current * 1000).toFixed(2)),
            formattedValue: `${(current * 1000).toFixed(2)} mA`,
            type: 'neutral'
          },
          {
            label: 'Total Circuit Power',
            value: Number(totalPower.toFixed(3)),
            formattedValue: `${totalPower >= 1 ? totalPower.toFixed(2) + ' W' : (totalPower * 1000).toFixed(1) + ' mW'}`,
            type: 'neutral'
          }
        ],
        breakdown,
        summaryText: `Total series resistance across ${activeResistors.length} resistors is ${rTotal.toFixed(2)} Ω, drawing ${(current * 1000).toFixed(2)} mA at ${v}V.`
      };
    },
    formula: {
      expression: 'R_total = R1 + R2 + R3 + ... + Rn   |   I = V / R_total',
      explanation: 'In a series circuit, resistors are connected end-to-end so the identical current flows through every element and the individual voltages add up to the total supply voltage.',
      variables: [
        { symbol: 'R_total', name: 'Series Resistance', description: 'Direct arithmetic sum of individual resistors.' }
      ]
    },
    explanationSections: [
      {
        title: 'Key Series Circuit Laws',
        content: '1. Current is constant everywhere along a single series loop. 2. Total equivalent resistance is strictly greater than the largest individual resistor. 3. Kirchhoff’s Voltage Law (KVL): sum of voltage drops equals source voltage.'
      }
    ],
    faqs: [
      {
        question: 'What happens if one series resistor burns out (opens)?',
        answer: 'If any resistor in a series chain opens, the circuit path is broken and total current immediately drops to 0 Amperes.'
      }
    ],
    relatedIds: ['parallel-resistance-calculator', 'voltage-divider-calculator', 'ohms-law-calculator'],
    disclaimerType: 'standard'
  },

  // 6. PARALLEL RESISTANCE CALCULATOR
  {
    id: 'parallel-resistance-calculator',
    slug: 'parallel-resistance-calculator',
    name: 'Parallel Resistance Calculator',
    shortName: 'Parallel Resistance',
    category: 'engineering',
    description: 'Calculate equivalent parallel resistance (1/Req = 1/R1 + 1/R2 + ...), total conductance in Siemens (mho), and branch currents.',
    iconName: 'Columns',
    popular: true,
    keywords: ['parallel resistance', 'resistors in parallel', 'req parallel', 'conductance calculator', 'reciprocal resistance', 'circuit analysis'],
    inputs: [
      { id: 'r1', label: 'Resistor R1 (Ω)', type: 'number', defaultValue: 100, min: 0.1, max: 10000000 },
      { id: 'r2', label: 'Resistor R2 (Ω)', type: 'number', defaultValue: 220, min: 0.1, max: 10000000 },
      { id: 'r3', label: 'Resistor R3 (Ω) (Optional)', type: 'number', defaultValue: 470, min: 0, max: 10000000 },
      { id: 'r4', label: 'Resistor R4 (Ω) (Optional)', type: 'number', defaultValue: 0, min: 0, max: 10000000 },
      { id: 'appliedVoltage', label: 'Applied Bus Voltage (V)', type: 'number', defaultValue: 12, min: 0, max: 1000 }
    ],
    calculate: (inputs) => {
      const r1 = Number(inputs.r1) || 100;
      const r2 = Number(inputs.r2) || 220;
      const r3 = Number(inputs.r3) || 0;
      const r4 = Number(inputs.r4) || 0;
      const v = Number(inputs.appliedVoltage) || 12;

      const activeResistors = [
        { name: 'R1', val: r1 },
        { name: 'R2', val: r2 },
        { name: 'R3', val: r3 },
        { name: 'R4', val: r4 }
      ].filter(item => item.val > 0);

      const conductanceG = activeResistors.reduce((acc, item) => acc + (1 / item.val), 0);
      const req = conductanceG > 0 ? 1 / conductanceG : 0;
      const totalCurrent = v * conductanceG;

      const breakdown = activeResistors.map(item => {
        const branchI = item.val > 0 ? v / item.val : 0;
        const branchP = branchI * v;
        return {
          label: `${item.name} (${item.val} Ω)`,
          value: branchI,
          formattedValue: `Current: ${(branchI * 1000).toFixed(1)} mA | Power: ${(branchP * 1000).toFixed(1)} mW`
        };
      });

      return {
        primaryMetric: {
          label: 'Equivalent Parallel Resistance (Req)',
          value: Number(req.toFixed(2)),
          formattedValue: `${req.toFixed(2)} Ω`,
          subtext: `Conductance: ${(conductanceG * 1000).toFixed(3)} mS (milliSiemens)`,
          type: 'highlight',
          badge: `${activeResistors.length} Branches`
        },
        secondaryMetrics: [
          {
            label: 'Total Bus Current (Itotal)',
            value: Number((totalCurrent * 1000).toFixed(1)),
            formattedValue: `${(totalCurrent * 1000).toFixed(1)} mA`,
            type: 'neutral'
          },
          {
            label: 'Total Power Dissipated',
            value: Number((v * totalCurrent).toFixed(2)),
            formattedValue: `${(v * totalCurrent).toFixed(2)} W`,
            type: 'neutral'
          }
        ],
        breakdown,
        summaryText: `Equivalent parallel resistance is ${req.toFixed(2)} Ω, which is smaller than the smallest branch resistor (${Math.min(...activeResistors.map(a => a.val))} Ω). Total current drawn at ${v}V is ${(totalCurrent * 1000).toFixed(1)} mA.`
      };
    },
    formula: {
      expression: '1 / Req = 1/R1 + 1/R2 + 1/R3 + ... + 1/Rn   |   G_total = Σ Gi',
      explanation: 'In parallel circuits, conductances add together. The total equivalent resistance is always strictly smaller than the smallest branch resistor.',
      variables: [
        { symbol: 'Req', name: 'Equivalent Resistance', description: 'Combined parallel resistance.' },
        { symbol: 'G', name: 'Conductance', description: 'Siemens (S) = 1 / Ω' }
      ]
    },
    explanationSections: [
      {
        title: 'Shortcut for Two Parallel Resistors',
        content: 'Product over Sum rule: Req = (R1 × R2) / (R1 + R2). For identical resistors of value R in parallel with n branches: Req = R / n.'
      }
    ],
    faqs: [
      {
        question: 'Why are household appliances connected in parallel?',
        answer: 'Parallel connection ensures every appliance receives the full mains voltage (e.g. 120V or 230V) and if one device is turned off or burns out, all other devices continue working independently.'
      }
    ],
    relatedIds: ['series-resistance-calculator', 'current-divider-calculator', 'ohms-law-calculator'],
    disclaimerType: 'standard'
  },

  // 7. RESISTOR COLOR CODE CALCULATOR
  {
    id: 'resistor-color-code-calculator',
    slug: 'resistor-color-code-calculator',
    name: 'Resistor Color Code Calculator',
    shortName: 'Resistor Color Code',
    category: 'engineering',
    description: 'Decode 4-band and 5-band axial resistor color bands into exact resistance value, tolerance, and minimum/maximum range.',
    iconName: 'Activity',
    popular: true,
    featured: true,
    keywords: ['resistor color code', 'resistor bands', 'ohms', 'electronics', 'color code', 'tolerance', '4 band resistor', '5 band resistor'],
    inputs: [
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
        ],
        summaryText: `Decoded ${inputs.band1}-${inputs.band2}-${inputs.multiplier} resistor yields nominal ${formattedNominal} with ±${tol}% manufacturing tolerance.`
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
    relatedIds: ['ohms-law-calculator', 'led-resistor-calculator'],
    disclaimerType: 'standard'
  },

  // 8. RC TIME CONSTANT CALCULATOR
  {
    id: 'rc-time-constant-calculator',
    slug: 'rc-time-constant-calculator',
    name: 'RC Time Constant Calculator',
    shortName: 'RC Time Constant',
    category: 'engineering',
    description: 'Calculate RC circuit time constant (τ = R × C), cutoff frequency, and capacitor voltage over 5 time constants.',
    iconName: 'Timer',
    popular: true,
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
          badge: `5τ Full Charge = ${(tau * 5 >= 1 ? (tau * 5).toFixed(2) + 's' : (tau * 5000).toFixed(1) + 'ms')}`
        },
        secondaryMetrics: [
          {
            label: '3dB Cutoff Frequency (fc)',
            value: Number(cutoffFreq.toFixed(2)),
            formattedValue: `${cutoffFreq >= 1000 ? (cutoffFreq / 1000).toFixed(2) + ' kHz' : cutoffFreq.toFixed(2) + ' Hz'}`,
            type: 'neutral'
          },
          {
            label: 'Initial Inrush Current (I₀ = Vs/R)',
            value: Number(((Vs / R_ohms) * 1000).toFixed(2)),
            formattedValue: `${((Vs / R_ohms) * 1000).toFixed(2)} mA`,
            type: 'neutral'
          }
        ],
        chart: {
          type: 'line',
          title: 'Capacitor Transient Charging Curve Vc(t)',
          data: chartData,
          series: [
            { key: 'Capacitor Voltage (V)', name: 'Voltage (V)', color: '#3b82f6' }
          ]
        },
        breakdown: [
          { label: '1τ (63.2% charge)', value: Vs * 0.632, formattedValue: `${(Vs * 0.632).toFixed(2)} V` },
          { label: '2τ (86.5% charge)', value: Vs * 0.865, formattedValue: `${(Vs * 0.865).toFixed(2)} V` },
          { label: '3τ (95.0% charge)', value: Vs * 0.950, formattedValue: `${(Vs * 0.950).toFixed(2)} V` },
          { label: '5τ (99.3% steady state)', value: Vs * 0.993, formattedValue: `${(Vs * 0.993).toFixed(2)} V` }
        ],
        summaryText: `RC circuit charges with time constant τ = ${tau >= 1 ? tau.toFixed(2) + 's' : (tau * 1000).toFixed(1) + 'ms'}. Full charge (~99.3%) is reached after 5τ = ${(tau * 5).toFixed(2)}s.`
      };
    },
    formula: {
      expression: 'τ = R × C   |   Vc(t) = Vs × (1 - e^(-t / τ))   |   fc = 1 / (2πRC)',
      explanation: 'The time constant τ represents the duration required for a capacitor to charge to approximately 63.2% of its maximum step voltage.',
      variables: [
        { symbol: 'τ', name: 'Time Constant', description: 'Duration in seconds for 63.2% charge/discharge.' },
        { symbol: 'fc', name: 'Cutoff Frequency', description: '-3dB corner frequency for low-pass filter.' }
      ]
    },
    explanationSections: [
      {
        title: 'Transient Response Across 5 Time Constants',
        content: 'After 1τ: 63.2%, 2τ: 86.5%, 3τ: 95.0%, 4τ: 98.2%, and 5τ: 99.3%. In engineering, circuits are considered to have reached steady-state after 5τ.'
      }
    ],
    faqs: [
      {
        question: 'What is the discharge equation?',
        answer: 'During discharge: Vc(t) = V₀ × e^(-t / τ). After 1τ, the capacitor has lost 63.2% of its charge and retains 36.8% of its initial voltage.'
      }
    ],
    relatedIds: ['rl-time-constant-calculator', 'capacitive-reactance-calculator', 'resonant-frequency-calculator'],
    disclaimerType: 'standard'
  },

  // 9. RL TIME CONSTANT CALCULATOR
  {
    id: 'rl-time-constant-calculator',
    slug: 'rl-time-constant-calculator',
    name: 'RL Time Constant Calculator',
    shortName: 'RL Time Constant',
    category: 'engineering',
    description: 'Calculate RL circuit time constant (τ = L / R), inductor current rise/decay, 5τ steady-state settling time, stored magnetic energy, and cutoff frequency.',
    iconName: 'Activity',
    popular: true,
    keywords: ['rl time constant', 'inductor time constant', 'tau = l/r', 'magnetic energy', 'inductor transient', 'cutoff frequency rl', 'electronics ece'],
    inputs: [
      {
        id: 'inductanceMh',
        label: 'Inductance (L in mH)',
        type: 'number',
        defaultValue: 50,
        min: 0.001,
        max: 100000,
        step: 1,
        suffix: ' mH'
      },
      {
        id: 'resistance',
        label: 'Series Resistance (R in Ω)',
        type: 'number',
        defaultValue: 100,
        min: 0.1,
        max: 1000000,
        step: 1,
        suffix: ' Ω'
      },
      {
        id: 'supplyVoltage',
        label: 'Step Voltage (Vs in Volts)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        max: 1000,
        step: 0.5,
        suffix: ' V'
      }
    ],
    calculate: (inputs) => {
      const lH = (Number(inputs.inductanceMh) || 50) * 1e-3;
      const r = Number(inputs.resistance) || 100;
      const vs = Number(inputs.supplyVoltage) || 10;

      const tau = r > 0 ? lH / r : 0; // seconds
      const iMax = r > 0 ? vs / r : 0; // Amperes
      const energyJoules = 0.5 * lH * iMax * iMax;
      const cutoffFreq = r > 0 && lH > 0 ? r / (2 * Math.PI * lH) : 0;

      const tauMs = tau * 1000;
      const tau5Ms = tauMs * 5;

      return {
        primaryMetric: {
          label: 'RL Time Constant (τ = L / R)',
          value: Number(tau.toFixed(6)),
          formattedValue: tau >= 1 ? `${tau.toFixed(3)} s` : `${tauMs.toFixed(3)} ms`,
          subtext: `Max Steady-State Current: ${(iMax * 1000).toFixed(1)} mA (5τ = ${tau5Ms.toFixed(2)} ms)`,
          type: 'highlight',
          badge: `τ = ${tauMs.toFixed(2)} ms`
        },
        secondaryMetrics: [
          {
            label: 'Steady-State Current (I_max = Vs/R)',
            value: Number((iMax * 1000).toFixed(1)),
            formattedValue: `${(iMax * 1000).toFixed(1)} mA`,
            type: 'neutral'
          },
          {
            label: 'Stored Magnetic Energy (E = ½LI²)',
            value: Number((energyJoules * 1000).toFixed(3)),
            formattedValue: energyJoules < 0.001 ? `${(energyJoules * 1e6).toFixed(1)} µJ` : `${(energyJoules * 1000).toFixed(3)} mJ`,
            type: 'neutral'
          },
          {
            label: 'Cutoff Frequency (-3dB fc)',
            value: Number(cutoffFreq.toFixed(1)),
            formattedValue: cutoffFreq >= 1000 ? `${(cutoffFreq / 1000).toFixed(2)} kHz` : `${cutoffFreq.toFixed(1)} Hz`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Current at 1τ (63.2% I_max)', value: iMax * 0.632 * 1000, formattedValue: `${(iMax * 0.632 * 1000).toFixed(2)} mA` },
          { label: 'Current at 2τ (86.5% I_max)', value: iMax * 0.865 * 1000, formattedValue: `${(iMax * 0.865 * 1000).toFixed(2)} mA` },
          { label: 'Current at 3τ (95.0% I_max)', value: iMax * 0.950 * 1000, formattedValue: `${(iMax * 0.950 * 1000).toFixed(2)} mA` },
          { label: 'Current at 5τ (99.3% steady-state)', value: iMax * 0.993 * 1000, formattedValue: `${(iMax * 0.993 * 1000).toFixed(2)} mA` }
        ],
        summaryText: `RL time constant τ is ${tauMs.toFixed(3)} ms. Inductor current rises to 63.2% (${(iMax * 0.632 * 1000).toFixed(1)} mA) in 1τ and settles at ${(iMax * 1000).toFixed(1)} mA in ${tau5Ms.toFixed(2)} ms.`
      };
    },
    formula: {
      expression: 'τ = L / R   |   I(t) = (Vs / R) × (1 - e^(-t / τ))   |   E = ½ × L × I²',
      explanation: 'An inductor resists instantaneous changes in current by generating back-EMF. The time constant τ governs the exponential current ramp.',
      variables: [
        { symbol: 'L', name: 'Inductance', description: 'Henry (H)' },
        { symbol: 'R', name: 'Resistance', description: 'Ohms (Ω)' },
        { symbol: 'E', name: 'Magnetic Energy', description: 'Joules stored in the magnetic field core.' }
      ]
    },
    explanationSections: [
      {
        title: 'Flyback Voltage in Inductive Loads',
        content: 'When an inductive circuit is suddenly disconnected, the magnetic field rapidly collapses, producing a sharp high-voltage spike (flyback back-EMF) governed by V = -L(di/dt). Flyback diodes are placed across relay coils and motors to protect switching transistors.'
      }
    ],
    faqs: [
      {
        question: 'Why does a larger inductance increase the time constant?',
        answer: 'Inductance measures magnetic inertia; larger inductance creates stronger opposition to changes in current, prolonging the rise time (τ = L/R).'
      }
    ],
    relatedIds: ['rc-time-constant-calculator', 'inductive-reactance-calculator', 'resonant-frequency-calculator'],
    disclaimerType: 'standard'
  },

  // 10. RESONANT FREQUENCY CALCULATOR
  {
    id: 'resonant-frequency-calculator',
    slug: 'resonant-frequency-calculator',
    name: 'Resonant Frequency Calculator',
    shortName: 'Resonant Frequency',
    category: 'engineering',
    description: 'Calculate LC tank resonant frequency (f₀ = 1 / (2π√LC)), angular frequency (ω₀), characteristic impedance (Z₀), and Quality Factor (Q).',
    iconName: 'Radio',
    popular: true,
    keywords: ['resonant frequency', 'lc resonance', 'tank circuit', 'quality factor q', 'bandwidth rlc', 'angular frequency', 'rf tuner'],
    inputs: [
      {
        id: 'inductanceMh',
        label: 'Inductance (L in mH)',
        type: 'number',
        defaultValue: 10,
        min: 0.0001,
        max: 100000,
        step: 0.1,
        suffix: ' mH'
      },
      {
        id: 'capacitanceNf',
        label: 'Capacitance (C in nF)',
        type: 'number',
        defaultValue: 100,
        min: 0.0001,
        max: 100000,
        step: 1,
        suffix: ' nF'
      },
      {
        id: 'seriesResistance',
        label: 'Series Damping Resistance (R in Ω)',
        type: 'number',
        defaultValue: 10,
        min: 0.01,
        max: 100000,
        step: 1,
        suffix: ' Ω'
      }
    ],
    calculate: (inputs) => {
      const l = (Number(inputs.inductanceMh) || 10) * 1e-3; // Henry
      const c = (Number(inputs.capacitanceNf) || 100) * 1e-9; // Farad
      const r = Number(inputs.seriesResistance) || 10;

      const f0 = 1 / (2 * Math.PI * Math.sqrt(l * c));
      const omega0 = 2 * Math.PI * f0;
      const z0 = Math.sqrt(l / c); // Characteristic impedance
      const q = r > 0 ? (omega0 * l) / r : 0;
      const bw = q > 0 ? f0 / q : 0;

      let formattedF0 = '';
      if (f0 >= 1e6) formattedF0 = `${(f0 / 1e6).toFixed(3)} MHz`;
      else if (f0 >= 1e3) formattedF0 = `${(f0 / 1e3).toFixed(2)} kHz`;
      else formattedF0 = `${f0.toFixed(1)} Hz`;

      return {
        primaryMetric: {
          label: 'Resonant Frequency (f₀)',
          value: Number(f0.toFixed(2)),
          formattedValue: formattedF0,
          subtext: `Angular Velocity ω₀ = ${omega0.toFixed(0)} rad/s`,
          type: 'highlight',
          badge: f0 >= 1e6 ? `${(f0/1e6).toFixed(2)} MHz` : `${(f0/1e3).toFixed(1)} kHz`
        },
        secondaryMetrics: [
          {
            label: 'Quality Factor (Q)',
            value: Number(q.toFixed(2)),
            formattedValue: `Q = ${q.toFixed(2)}`,
            type: q > 10 ? 'success' : 'neutral'
          },
          {
            label: 'Bandwidth (BW = f₀ / Q)',
            value: Number(bw.toFixed(1)),
            formattedValue: bw >= 1000 ? `${(bw / 1000).toFixed(2)} kHz` : `${bw.toFixed(1)} Hz`,
            type: 'neutral'
          },
          {
            label: 'Characteristic Impedance (Z₀)',
            value: Number(z0.toFixed(2)),
            formattedValue: `${z0.toFixed(1)} Ω`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Inductive Reactance at f₀ (X_L)', value: 2 * Math.PI * f0 * l, formattedValue: `${(2 * Math.PI * f0 * l).toFixed(1)} Ω` },
          { label: 'Capacitive Reactance at f₀ (Xc)', value: 1 / (2 * Math.PI * f0 * c), formattedValue: `${(1 / (2 * Math.PI * f0 * c)).toFixed(1)} Ω` },
          { label: 'Net Reactance at Resonance', value: 0, formattedValue: '0 Ω (Purely Resistive)' },
          { label: 'Half-Power Bandwidth', value: bw, formattedValue: `${bw.toFixed(1)} Hz` }
        ],
        summaryText: `LC tank with L = ${inputs.inductanceMh} mH and C = ${inputs.capacitanceNf} nF resonates at ${formattedF0}. At f₀, inductive and capacitive reactances cancel exactly (X_L = Xc = ${z0.toFixed(1)}Ω).`
      };
    },
    formula: {
      expression: 'f₀ = 1 / (2 × π × √(L × C))   |   Q = (1 / R) × √(L / C)   |   BW = f₀ / Q',
      explanation: 'Resonance occurs when inductive reactance X_L equals capacitive reactance Xc, causing their reactive impedances to cancel each other out.',
      variables: [
        { symbol: 'f₀', name: 'Resonant Frequency', description: 'Hertz (Hz)' },
        { symbol: 'Q', name: 'Quality Factor', description: 'Sharpness of the resonant frequency peak.' },
        { symbol: 'BW', name: 'Bandwidth', description: 'Frequency range between -3dB cutoff points.' }
      ]
    },
    explanationSections: [
      {
        title: 'Series vs Parallel Resonance',
        content: 'In series RLC resonance, total impedance reaches a minimum (Z = R) resulting in maximum current. In parallel RLC resonance, impedance reaches a maximum, rejecting current at resonance.'
      }
    ],
    faqs: [
      {
        question: 'What is a good Q factor in radio tuning?',
        answer: 'High-Q circuits (Q > 50 to 100) offer sharp selectivity and narrow bandwidth, allowing radio receivers to isolate a single carrier station while rejecting adjacent frequencies.'
      }
    ],
    relatedIds: ['capacitive-reactance-calculator', 'inductive-reactance-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 11. CAPACITIVE REACTANCE CALCULATOR
  {
    id: 'capacitive-reactance-calculator',
    slug: 'capacitive-reactance-calculator',
    name: 'Capacitive Reactance Calculator',
    shortName: 'Capacitive Reactance',
    category: 'engineering',
    description: 'Calculate capacitor AC impedance (Xc = 1 / (2πfC)), AC RMS current draw for given voltage, and -90° current-leading phase relationship.',
    iconName: 'Zap',
    popular: true,
    keywords: ['capacitive reactance', 'xc calculator', 'capacitor impedance', 'ac capacitance', 'ohms reactance', 'filter design'],
    inputs: [
      {
        id: 'frequency',
        label: 'Signal Frequency (f in Hz / kHz)',
        type: 'number',
        defaultValue: 1000,
        min: 0.1,
        max: 1e9,
        step: 10,
        suffix: ' Hz'
      },
      {
        id: 'capacitanceUf',
        label: 'Capacitance (C in µF)',
        type: 'number',
        defaultValue: 10,
        min: 0.0001,
        max: 100000,
        step: 0.1,
        suffix: ' µF'
      },
      {
        id: 'acVoltage',
        label: 'Applied AC RMS Voltage (V)',
        type: 'number',
        defaultValue: 12,
        min: 0.1,
        max: 1000,
        step: 0.5,
        suffix: ' V'
      }
    ],
    calculate: (inputs) => {
      const f = Number(inputs.frequency) || 1000;
      const cFarads = (Number(inputs.capacitanceUf) || 10) * 1e-6;
      const v = Number(inputs.acVoltage) || 12;

      const xc = 1 / (2 * Math.PI * f * cFarads);
      const current = xc > 0 ? v / xc : 0;
      const reactivePowerVar = v * current;

      let formattedXc = '';
      if (xc >= 1000000) formattedXc = `${(xc / 1000000).toFixed(2)} MΩ`;
      else if (xc >= 1000) formattedXc = `${(xc / 1000).toFixed(2)} kΩ`;
      else formattedXc = `${xc.toFixed(2)} Ω`;

      return {
        primaryMetric: {
          label: 'Capacitive Reactance (Xc)',
          value: Number(xc.toFixed(2)),
          formattedValue: formattedXc,
          subtext: `Current leads voltage by 90° (Phase angle: -90°)`,
          type: 'highlight',
          badge: formattedXc
        },
        secondaryMetrics: [
          {
            label: 'AC RMS Current Draw',
            value: Number((current * 1000).toFixed(2)),
            formattedValue: current >= 1 ? `${current.toFixed(3)} A` : `${(current * 1000).toFixed(2)} mA`,
            type: 'neutral'
          },
          {
            label: 'Reactive Power (Qc)',
            value: Number(reactivePowerVar.toFixed(2)),
            formattedValue: `${reactivePowerVar.toFixed(2)} VAR`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Reactance at 100 Hz', value: 1 / (2 * Math.PI * 100 * cFarads), formattedValue: `${(1 / (2 * Math.PI * 100 * cFarads)).toFixed(1)} Ω` },
          { label: `Reactance at ${f} Hz`, value: xc, formattedValue: formattedXc },
          { label: 'Reactance at 10 kHz', value: 1 / (2 * Math.PI * 10000 * cFarads), formattedValue: `${(1 / (2 * Math.PI * 10000 * cFarads)).toFixed(2)} Ω` }
        ],
        summaryText: `At ${f} Hz, a ${inputs.capacitanceUf} µF capacitor exhibits ${formattedXc} of reactance, drawing ${(current * 1000).toFixed(2)} mA RMS current at ${v}V.`
      };
    },
    formula: {
      expression: 'Xc = 1 / (2 × π × f × C)   |   I_ac = V / Xc',
      explanation: 'Capacitive reactance is inversely proportional to frequency: capacitors pass high frequencies (low Xc) and block DC (infinite Xc).',
      variables: [
        { symbol: 'Xc', name: 'Capacitive Reactance', description: 'Opposition to alternating current in Ohms (Ω).' },
        { symbol: 'f', name: 'Frequency', description: 'Hertz (Hz)' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Capacitors Block Direct Current (DC)',
        content: 'At DC (f = 0 Hz), 1 / (2π × 0 × C) approaches infinity. Therefore, a capacitor acts as an open circuit to direct current once fully charged.'
      }
    ],
    faqs: [
      {
        question: 'What is the ICE mnemonic in electronics?',
        answer: '"ICE" stands for Current (I) leads EMF/Voltage (E) in a Capacitor (C).'
      }
    ],
    relatedIds: ['inductive-reactance-calculator', 'resonant-frequency-calculator', 'rc-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 12. INDUCTIVE REACTANCE CALCULATOR
  {
    id: 'inductive-reactance-calculator',
    slug: 'inductive-reactance-calculator',
    name: 'Inductive Reactance Calculator',
    shortName: 'Inductive Reactance',
    category: 'engineering',
    description: 'Calculate inductor AC impedance (X_L = 2πfL), AC current draw, and +90° voltage-leading phase relationship.',
    iconName: 'Zap',
    popular: true,
    keywords: ['inductive reactance', 'xl calculator', 'inductor impedance', 'ac inductance', 'choke coil impedance', 'rf choke'],
    inputs: [
      {
        id: 'frequency',
        label: 'Signal Frequency (f in Hz / kHz)',
        type: 'number',
        defaultValue: 1000,
        min: 0.1,
        max: 1e9,
        step: 10,
        suffix: ' Hz'
      },
      {
        id: 'inductanceMh',
        label: 'Inductance (L in mH)',
        type: 'number',
        defaultValue: 10,
        min: 0.001,
        max: 100000,
        step: 0.1,
        suffix: ' mH'
      },
      {
        id: 'acVoltage',
        label: 'Applied AC RMS Voltage (V)',
        type: 'number',
        defaultValue: 12,
        min: 0.1,
        max: 1000,
        step: 0.5,
        suffix: ' V'
      }
    ],
    calculate: (inputs) => {
      const f = Number(inputs.frequency) || 1000;
      const lHenry = (Number(inputs.inductanceMh) || 10) * 1e-3;
      const v = Number(inputs.acVoltage) || 12;

      const xl = 2 * Math.PI * f * lHenry;
      const current = xl > 0 ? v / xl : 0;
      const reactivePowerVar = v * current;

      let formattedXl = '';
      if (xl >= 1000000) formattedXl = `${(xl / 1000000).toFixed(2)} MΩ`;
      else if (xl >= 1000) formattedXl = `${(xl / 1000).toFixed(2)} kΩ`;
      else formattedXl = `${xl.toFixed(2)} Ω`;

      return {
        primaryMetric: {
          label: 'Inductive Reactance (X_L)',
          value: Number(xl.toFixed(2)),
          formattedValue: formattedXl,
          subtext: `Voltage leads current by 90° (Phase angle: +90°)`,
          type: 'highlight',
          badge: formattedXl
        },
        secondaryMetrics: [
          {
            label: 'AC RMS Current Draw',
            value: Number((current * 1000).toFixed(2)),
            formattedValue: current >= 1 ? `${current.toFixed(3)} A` : `${(current * 1000).toFixed(2)} mA`,
            type: 'neutral'
          },
          {
            label: 'Reactive Power (Q_L)',
            value: Number(reactivePowerVar.toFixed(2)),
            formattedValue: `${reactivePowerVar.toFixed(2)} VAR`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Reactance at 100 Hz', value: 2 * Math.PI * 100 * lHenry, formattedValue: `${(2 * Math.PI * 100 * lHenry).toFixed(2)} Ω` },
          { label: `Reactance at ${f} Hz`, value: xl, formattedValue: formattedXl },
          { label: 'Reactance at 100 kHz', value: 2 * Math.PI * 100000 * lHenry, formattedValue: `${(2 * Math.PI * 100000 * lHenry / 1000).toFixed(2)} kΩ` }
        ],
        summaryText: `At ${f} Hz, an inductor of ${inputs.inductanceMh} mH generates ${formattedXl} of inductive reactance, restricting AC current to ${(current * 1000).toFixed(2)} mA.`
      };
    },
    formula: {
      expression: 'X_L = 2 × π × f × L   |   I_ac = V / X_L',
      explanation: 'Inductive reactance is directly proportional to frequency: inductors pass low frequencies / DC with zero impedance and block high frequencies.',
      variables: [
        { symbol: 'X_L', name: 'Inductive Reactance', description: 'Opposition to alternating current in Ohms (Ω).' },
        { symbol: 'L', name: 'Inductance', description: 'Henry (H)' }
      ]
    },
    explanationSections: [
      {
        title: 'ELI Mnemonic in Electronics',
        content: '"ELI" stands for Voltage (E) leads Current (I) in an Inductor (L).'
      }
    ],
    faqs: [
      {
        question: 'Why are inductors used as RF chokes?',
        answer: 'Because X_L scales linearly with frequency, an inductor presents low resistance to DC bias power while presenting massive impedance to high-frequency RF signals, effectively isolating the RF path.'
      }
    ],
    relatedIds: ['capacitive-reactance-calculator', 'resonant-frequency-calculator', 'rl-time-constant-calculator'],
    disclaimerType: 'standard'
  },

  // 13. FREQUENCY ↔ TIME PERIOD CALCULATOR
  {
    id: 'frequency-time-period-calculator',
    slug: 'frequency-time-period-calculator',
    name: 'Frequency ↔ Time Period Calculator',
    shortName: 'Frequency ↔ Period',
    category: 'engineering',
    description: 'Convert between Frequency (Hz, kHz, MHz, GHz) and Time Period (seconds, milliseconds, microseconds, nanoseconds) with angular velocity (ω) and RPM.',
    iconName: 'Clock',
    popular: true,
    keywords: ['frequency to period', 'period to frequency', 'f = 1/t', 't = 1/f', 'angular frequency', 'rpm to hz', 'hertz to seconds'],
    inputs: [
      {
        id: 'calcMode',
        label: 'Calculation Direction',
        type: 'select',
        defaultValue: 'f_to_t',
        options: [
          { label: 'Enter Frequency (f) → Calculate Period (T)', value: 'f_to_t' },
          { label: 'Enter Period (T) → Calculate Frequency (f)', value: 't_to_f' }
        ]
      },
      {
        id: 'frequencyValue',
        label: 'Frequency (Hz)',
        type: 'number',
        defaultValue: 50,
        min: 0.000001,
        max: 1e12,
        step: 1,
        suffix: ' Hz'
      },
      {
        id: 'periodValueMs',
        label: 'Time Period (ms)',
        type: 'number',
        defaultValue: 20,
        min: 0.000001,
        max: 1e9,
        step: 0.1,
        suffix: ' ms'
      }
    ],
    calculate: (inputs) => {
      const mode = inputs.calcMode || 'f_to_t';
      let f = 50;
      let tSec = 0.02;

      if (mode === 'f_to_t') {
        f = Number(inputs.frequencyValue) || 50;
        tSec = f > 0 ? 1 / f : 0;
      } else {
        const pMs = Number(inputs.periodValueMs) || 20;
        tSec = pMs / 1000;
        f = tSec > 0 ? 1 / tSec : 0;
      }

      const omega = 2 * Math.PI * f;
      const rpm = f * 60;

      let formattedPeriod = '';
      if (tSec >= 1) formattedPeriod = `${tSec.toFixed(3)} s`;
      else if (tSec >= 1e-3) formattedPeriod = `${(tSec * 1000).toFixed(3)} ms`;
      else if (tSec >= 1e-6) formattedPeriod = `${(tSec * 1e6).toFixed(3)} µs`;
      else formattedPeriod = `${(tSec * 1e9).toFixed(3)} ns`;

      let formattedFreq = '';
      if (f >= 1e9) formattedFreq = `${(f / 1e9).toFixed(3)} GHz`;
      else if (f >= 1e6) formattedFreq = `${(f / 1e6).toFixed(3)} MHz`;
      else if (f >= 1e3) formattedFreq = `${(f / 1e3).toFixed(2)} kHz`;
      else formattedFreq = `${f.toFixed(2)} Hz`;

      return {
        primaryMetric: {
          label: mode === 'f_to_t' ? 'Calculated Time Period (T = 1/f)' : 'Calculated Frequency (f = 1/T)',
          value: mode === 'f_to_t' ? Number(tSec.toExponential(3)) : Number(f.toFixed(2)),
          formattedValue: mode === 'f_to_t' ? formattedPeriod : formattedFreq,
          subtext: `Angular Velocity: ${omega.toFixed(1)} rad/s (${rpm.toLocaleString()} RPM)`,
          type: 'highlight',
          badge: mode === 'f_to_t' ? formattedPeriod : formattedFreq
        },
        secondaryMetrics: [
          {
            label: 'Angular Frequency (ω = 2πf)',
            value: Number(omega.toFixed(1)),
            formattedValue: `${omega.toLocaleString()} rad/s`,
            type: 'neutral'
          },
          {
            label: 'Rotational Speed (RPM)',
            value: Number(rpm.toFixed(1)),
            formattedValue: `${rpm.toLocaleString()} RPM`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Oscillation Frequency', value: f, formattedValue: formattedFreq },
          { label: 'Full Cycle Duration', value: tSec, formattedValue: formattedPeriod },
          { label: 'Quarter Cycle (90° Phase)', value: tSec / 4, formattedValue: `${((tSec / 4) * 1000).toFixed(3)} ms` },
          { label: 'Half Cycle (180° Phase)', value: tSec / 2, formattedValue: `${((tSec / 2) * 1000).toFixed(3)} ms` }
        ],
        summaryText: `Frequency of ${formattedFreq} corresponds to a full cycle period of ${formattedPeriod} (ω = ${omega.toFixed(1)} rad/s).`
      };
    },
    formula: {
      expression: 'f = 1 / T   |   T = 1 / f   |   ω = 2 × π × f   |   RPM = f × 60',
      explanation: 'Frequency describes the number of recurring waveform cycles per second; Period is the duration of one single oscillation cycle.',
      variables: [
        { symbol: 'f', name: 'Frequency', description: 'Hertz (Hz)' },
        { symbol: 'T', name: 'Time Period', description: 'Seconds (s)' },
        { symbol: 'ω', name: 'Angular Frequency', description: 'Radians per second (rad/s)' }
      ]
    },
    explanationSections: [
      {
        title: 'Mains AC Frequencies Worldwide',
        content: 'Standard power grids run at either 50 Hz (period T = 20.0 ms, common in Europe, India, UK) or 60 Hz (period T = 16.67 ms, standard in North America).'
      }
    ],
    faqs: [
      {
        question: 'What is the period of a 1 GHz computer processor clock?',
        answer: 'At 1 GHz (10⁹ Hz), each clock cycle period T = 1 / 10⁹ = 1.0 nanosecond (1 ns).'
      }
    ],
    relatedIds: ['wavelength-calculator', 'frequency-calculator', 'resonant-frequency-calculator'],
    disclaimerType: 'standard'
  },

  // 14. WAVELENGTH CALCULATOR
  {
    id: 'wavelength-calculator',
    slug: 'wavelength-calculator',
    name: 'Wavelength Calculator',
    shortName: 'Wavelength',
    category: 'engineering',
    description: 'Calculate spatial wavelength (λ = v / f), wavenumber (k), and velocity factor propagation delay across vacuum, optical fiber, coax, and acoustics.',
    iconName: 'Radio',
    popular: true,
    keywords: ['wavelength calculator', 'lambda = v/f', 'wave velocity', 'radio band', 'optical fiber wavelength', 'coaxial cable velocity factor', 'sound wavelength'],
    inputs: [
      {
        id: 'frequency',
        label: 'Signal Frequency',
        type: 'number',
        defaultValue: 2400000000, // 2.4 GHz
        min: 0.1,
        max: 1e15,
        step: 1000,
        suffix: ' Hz'
      },
      {
        id: 'medium',
        label: 'Propagation Medium & Velocity Factor',
        type: 'select',
        defaultValue: 'c_vacuum',
        options: [
          { label: 'Free Space / Vacuum / Air (c = 3.00 × 10⁸ m/s)', value: 'c_vacuum' },
          { label: 'Coaxial Cable RG-58 (VF = 0.66c ≈ 1.98 × 10⁸ m/s)', value: 'coax' },
          { label: 'Optical Fiber Silica Glass (n = 1.47, VF = 0.68c)', value: 'fiber' },
          { label: 'FR4 PCB Copper Trace (VF ≈ 0.50c ≈ 1.50 × 10⁸ m/s)', value: 'pcb' },
          { label: 'Acoustic Sound in Air (20°C: 343 m/s)', value: 'sound_air' }
        ]
      }
    ],
    calculate: (inputs) => {
      const f = Number(inputs.frequency) || 2400000000;
      const medium = inputs.medium || 'c_vacuum';

      let v = 299792458; // m/s
      if (medium === 'coax') v = 299792458 * 0.66;
      if (medium === 'fiber') v = 299792458 * 0.68;
      if (medium === 'pcb') v = 299792458 * 0.50;
      if (medium === 'sound_air') v = 343;

      const lambda = f > 0 ? v / f : 0;
      const k = lambda > 0 ? (2 * Math.PI) / lambda : 0; // wavenumber

      let formattedWavelength = '';
      if (lambda >= 1000) formattedWavelength = `${(lambda / 1000).toFixed(2)} km`;
      else if (lambda >= 1) formattedWavelength = `${lambda.toFixed(3)} meters`;
      else if (lambda >= 0.01) formattedWavelength = `${(lambda * 100).toFixed(2)} cm`;
      else if (lambda >= 1e-3) formattedWavelength = `${(lambda * 1000).toFixed(2)} mm`;
      else formattedWavelength = `${(lambda * 1e6).toFixed(2)} µm`;

      let bandName = 'RF Spectrum';
      if (f >= 3e11) bandName = 'Infrared / Optical';
      else if (f >= 3e10) bandName = 'EHF (Extremely High Frequency / Millimeter Wave)';
      else if (f >= 3e9) bandName = 'SHF (Super High Frequency / Microwaves)';
      else if (f >= 3e8) bandName = 'UHF (Ultra High Frequency / Wi-Fi, 5G)';
      else if (f >= 3e7) bandName = 'VHF (Very High Frequency / FM Radio)';
      else if (f >= 3e6) bandName = 'HF (High Frequency / Shortwave)';

      return {
        primaryMetric: {
          label: 'Wavelength (λ = v / f)',
          value: Number(lambda.toFixed(4)),
          formattedValue: formattedWavelength,
          subtext: `Propagation Velocity: ${(v / 1e6).toFixed(1)} × 10⁶ m/s (${bandName})`,
          type: 'highlight',
          badge: formattedWavelength
        },
        secondaryMetrics: [
          {
            label: 'Half-Wavelength (λ / 2 Dipole)',
            value: Number((lambda / 2).toFixed(4)),
            formattedValue: lambda / 2 >= 1 ? `${(lambda / 2).toFixed(3)} m` : `${((lambda / 2) * 100).toFixed(2)} cm`,
            type: 'neutral'
          },
          {
            label: 'Quarter-Wavelength (λ / 4 Monopole)',
            value: Number((lambda / 4).toFixed(4)),
            formattedValue: lambda / 4 >= 1 ? `${(lambda / 4).toFixed(3)} m` : `${((lambda / 4) * 100).toFixed(2)} cm`,
            type: 'neutral'
          },
          {
            label: 'Angular Wavenumber (k = 2π/λ)',
            value: Number(k.toFixed(2)),
            formattedValue: `${k.toFixed(2)} rad/m`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Full Wavelength (λ)', value: lambda, formattedValue: formattedWavelength },
          { label: 'Half-Wave (λ/2)', value: lambda / 2, formattedValue: `${((lambda / 2) * 100).toFixed(2)} cm` },
          { label: 'Quarter-Wave (λ/4)', value: lambda / 4, formattedValue: `${((lambda / 4) * 100).toFixed(2)} cm` }
        ],
        summaryText: `At ${(f / 1e6).toFixed(2)} MHz, wavelength λ is ${formattedWavelength} in the chosen medium.`
      };
    },
    formula: {
      expression: 'λ = v / f   |   k = 2 × π / λ   |   v = c × VF',
      explanation: 'Wavelength is the physical distance between consecutive peaks of a repeating waveform traveling at velocity v.',
      variables: [
        { symbol: 'λ', name: 'Wavelength', description: 'Distance in meters (m).' },
        { symbol: 'v', name: 'Wave Velocity', description: 'Speed of propagation in the medium (m/s).' },
        { symbol: 'VF', name: 'Velocity Factor', description: 'Fraction of the speed of light in vacuum.' }
      ]
    },
    explanationSections: [
      {
        title: 'Velocity Factor in Cables and PCB Traces',
        content: 'Signals do not travel at the full speed of light inside transmission lines. Due to dielectric permittivity (εr), electrical waves slow down to ~66% of c in coaxial cable and ~50% of c in PCB microstrips.'
      }
    ],
    faqs: [
      {
        question: 'What is the wavelength of 2.4 GHz Wi-Fi in air?',
        answer: 'λ = (3 × 10⁸ m/s) / (2.4 × 10⁹ Hz) = 0.125 meters = 12.5 cm (about 5 inches).'
      }
    ],
    relatedIds: ['antenna-wavelength-calculator', 'frequency-time-period-calculator', 'frequency-calculator'],
    disclaimerType: 'standard'
  },

  // 15. DECIBEL (dB) CALCULATOR
  {
    id: 'decibel-calculator',
    slug: 'decibel-calculator',
    name: 'Decibel (dB) Calculator',
    shortName: 'Decibel (dB)',
    category: 'engineering',
    description: 'Calculate power ratios (10 log P2/P1), voltage/current ratios (20 log V2/V1), and convert between Watts, milliwatts, dBm, and dBW.',
    iconName: 'Volume2',
    popular: true,
    keywords: ['decibel calculator', 'db calculator', 'dbm to watts', 'watts to dbm', 'voltage ratio db', 'power gain db', 'rf attenuation'],
    inputs: [
      {
        id: 'ratioType',
        label: 'Conversion Mode',
        type: 'select',
        defaultValue: 'power_db',
        options: [
          { label: 'Power Ratio Gain / Loss (P2 / P1 → dB)', value: 'power_db' },
          { label: 'Voltage Ratio Gain / Loss (V2 / V1 → dB)', value: 'voltage_db' },
          { label: 'Watts to dBm & dBW', value: 'watts_to_dbm' },
          { label: 'dBm to Watts & mW', value: 'dbm_to_watts' }
        ]
      },
      {
        id: 'val1',
        label: 'Output Value (P2 or V2 or Watts or dBm)',
        type: 'number',
        defaultValue: 100,
        min: 0.000001,
        max: 1e9,
        step: 1
      },
      {
        id: 'val2',
        label: 'Input / Reference Value (P1 or V1)',
        type: 'number',
        defaultValue: 10,
        min: 0.000001,
        max: 1e9,
        step: 1
      }
    ],
    calculate: (inputs) => {
      const mode = inputs.ratioType || 'power_db';
      const a = Number(inputs.val1) || 100;
      const b = Number(inputs.val2) || 10;

      let primaryVal = 0;
      let primaryFormatted = '';
      let secondaryLabel = '';
      let secondaryFormatted = '';

      if (mode === 'power_db') {
        const ratio = a / b;
        primaryVal = 10 * Math.log10(ratio);
        primaryFormatted = `${primaryVal.toFixed(2)} dB`;
        secondaryLabel = 'Linear Power Ratio';
        secondaryFormatted = `${ratio.toFixed(2)}×`;
      } else if (mode === 'voltage_db') {
        const ratio = a / b;
        primaryVal = 20 * Math.log10(ratio);
        primaryFormatted = `${primaryVal.toFixed(2)} dB`;
        secondaryLabel = 'Linear Voltage Ratio';
        secondaryFormatted = `${ratio.toFixed(2)}×`;
      } else if (mode === 'watts_to_dbm') {
        const watts = a;
        const mw = watts * 1000;
        primaryVal = 10 * Math.log10(mw);
        const dbw = 10 * Math.log10(watts);
        primaryFormatted = `${primaryVal.toFixed(2)} dBm`;
        secondaryLabel = 'Equivalent in dBW';
        secondaryFormatted = `${dbw.toFixed(2)} dBW`;
      } else if (mode === 'dbm_to_watts') {
        const dbm = a;
        const mw = Math.pow(10, dbm / 10);
        const watts = mw / 1000;
        primaryVal = watts;
        primaryFormatted = watts >= 1 ? `${watts.toFixed(3)} W` : `${mw.toFixed(3)} mW`;
        secondaryLabel = 'Decibels relative to 1 Watt';
        secondaryFormatted = `${(dbm - 30).toFixed(2)} dBW`;
      }

      return {
        primaryMetric: {
          label: 'Calculated Decibel Metric',
          value: Number(primaryVal.toFixed(3)),
          formattedValue: primaryFormatted,
          subtext: `${secondaryLabel}: ${secondaryFormatted}`,
          type: 'highlight',
          badge: primaryFormatted
        },
        secondaryMetrics: [
          {
            label: secondaryLabel,
            value: secondaryFormatted,
            formattedValue: secondaryFormatted,
            type: 'neutral'
          },
          {
            label: '+3 dB Power Rule',
            value: '2× Power',
            formattedValue: '+3 dB = Double Power',
            type: 'neutral'
          },
          {
            label: '+6 dB Voltage Rule',
            value: '2× Voltage',
            formattedValue: '+6 dB = Double Voltage',
            type: 'neutral'
          }
        ],
        summaryText: `Calculated ${primaryFormatted} for ${mode.replace(/_/g, ' ')}.`
      };
    },
    formula: {
      expression: 'Power: dB = 10 × log₁₀(P₂ / P₁)   |   Voltage: dB = 20 × log₁₀(V₂ / V₁)   |   dBm = 10 × log₁₀(P_mW)',
      explanation: 'Decibels represent logarithmic ratios widely used in RF engineering, telecommunications, acoustics, and audio systems.',
      variables: [
        { symbol: 'dBm', name: 'dB relative to 1 milliwatt', description: '0 dBm = 1.0 mW, 30 dBm = 1.0 Watt' },
        { symbol: 'dBW', name: 'dB relative to 1 Watt', description: '0 dBW = 1.0 Watt = 30 dBm' }
      ]
    },
    explanationSections: [
      {
        title: 'Key Decibel Rules of Thumb',
        content: '+3 dB represents doubling of power (2×). +10 dB represents 10× power increase. +20 dB represents 100× power (or 10× voltage increase). -3 dB represents half-power (the cutoff threshold).'
      }
    ],
    faqs: [
      {
        question: 'What is 0 dBm in Watts?',
        answer: '0 dBm is exactly 1.0 milliwatt (0.001 Watt).'
      }
    ],
    relatedIds: ['free-space-path-loss-calculator', 'electrical-power-calculator'],
    disclaimerType: 'standard'
  },

  // 16. LED RESISTOR CALCULATOR
  {
    id: 'led-resistor-calculator',
    slug: 'led-resistor-calculator',
    name: 'LED Resistor Calculator',
    shortName: 'LED Resistor',
    category: 'engineering',
    description: 'Calculate the exact current-limiting series resistor, nearest standard E12/E24 resistor, and resistor power dissipation for single or series LEDs.',
    iconName: 'Lightbulb',
    popular: true,
    keywords: ['led resistor calculator', 'current limiting resistor', 'led forward voltage', 'e24 resistor', 'led circuit', 'arduino led'],
    inputs: [
      {
        id: 'supplyVoltage',
        label: 'Source Supply Voltage (Vs in Volts)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 48,
        step: 0.1,
        suffix: ' V'
      },
      {
        id: 'ledColor',
        label: 'LED Color Profile (Forward Voltage Vf)',
        type: 'select',
        defaultValue: 'red_2v',
        options: [
          { label: 'Red LED (~2.0 V)', value: 'red_2v' },
          { label: 'Green LED (~2.2 V)', value: 'green_2v2' },
          { label: 'Yellow / Amber LED (~2.1 V)', value: 'yellow_2v1' },
          { label: 'Blue LED (~3.2 V)', value: 'blue_3v2' },
          { label: 'White LED (~3.2 V)', value: 'white_3v2' },
          { label: 'Infrared LED (~1.5 V)', value: 'ir_1v5' },
          { label: 'UV / Ultraviolet LED (~3.6 V)', value: 'uv_3v6' }
        ]
      },
      {
        id: 'ledCurrentMa',
        label: 'Target Forward Current (If in mA)',
        type: 'slider',
        defaultValue: 20,
        min: 1,
        max: 100,
        step: 1,
        suffix: ' mA'
      },
      {
        id: 'ledCount',
        label: 'Number of LEDs in Series',
        type: 'slider',
        defaultValue: 1,
        min: 1,
        max: 10,
        step: 1
      }
    ],
    calculate: (inputs) => {
      const vs = Number(inputs.supplyVoltage) || 5;
      const count = Number(inputs.ledCount) || 1;
      const ifMa = Number(inputs.ledCurrentMa) || 20;
      const ifA = ifMa / 1000;

      const vfMap: Record<string, number> = {
        red_2v: 2.0,
        green_2v2: 2.2,
        yellow_2v1: 2.1,
        blue_3v2: 3.2,
        white_3v2: 3.2,
        ir_1v5: 1.5,
        uv_3v6: 3.6
      };

      const vf = vfMap[inputs.ledColor] || 2.0;
      const totalVf = vf * count;

      if (totalVf >= vs) {
        return {
          primaryMetric: {
            label: 'Insufficient Supply Voltage',
            value: 0,
            formattedValue: 'Vs < Total Vf',
            subtext: `Total LED Vf is ${totalVf.toFixed(1)}V which exceeds supply ${vs}V!`,
            type: 'error',
            badge: 'Increase Supply'
          },
          secondaryMetrics: [
            { label: 'Required Supply', value: `${(totalVf + 1).toFixed(1)}V`, formattedValue: `Min ${(totalVf + 1).toFixed(1)}V recommended`, type: 'warning' }
          ]
        };
      }

      const vDropResistor = vs - totalVf;
      const exactR = vDropResistor / ifA;

      // Standard E24 values lookup
      const e24 = [100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910];
      let standardR = exactR;
      // find closest scale
      const magnitude = Math.pow(10, Math.floor(Math.log10(exactR)));
      const normalized = exactR / magnitude;
      const closestE24 = e24.find(v => (v / 100) >= normalized) || 1000;
      standardR = (closestE24 / 100) * magnitude;

      const powerW = vDropResistor * ifA;
      const powerMw = powerW * 1000;
      let recommendedRating = '1/4 Watt (0.25W)';
      if (powerW > 0.5) recommendedRating = '1 Watt (1.0W)';
      else if (powerW > 0.25) recommendedRating = '1/2 Watt (0.50W)';

      return {
        primaryMetric: {
          label: 'Required Series Resistor',
          value: Number(exactR.toFixed(1)),
          formattedValue: `${exactR.toFixed(1)} Ω`,
          subtext: `Nearest Standard E24: ${standardR.toFixed(0)} Ω (${recommendedRating})`,
          type: 'highlight',
          badge: `${standardR.toFixed(0)} Ω Standard`
        },
        secondaryMetrics: [
          {
            label: 'Resistor Power Dissipation',
            value: Number(powerMw.toFixed(1)),
            formattedValue: `${powerMw.toFixed(1)} mW`,
            type: 'neutral'
          },
          {
            label: 'Recommended Resistor Rating',
            value: recommendedRating,
            formattedValue: recommendedRating,
            type: 'neutral'
          },
          {
            label: 'Total LED Voltage Drop',
            value: totalVf,
            formattedValue: `${totalVf.toFixed(1)} V (${count} × ${vf}V)`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Voltage across LEDs', value: totalVf, formattedValue: `${totalVf.toFixed(1)} V` },
          { label: 'Voltage dropped across Resistor', value: vDropResistor, formattedValue: `${vDropResistor.toFixed(2)} V` },
          { label: 'Circuit Forward Current', value: ifMa, formattedValue: `${ifMa} mA` },
          { label: 'Resistor Heat Dissipation', value: powerMw, formattedValue: `${powerMw.toFixed(1)} mW` }
        ],
        summaryText: `For ${count} LED(s) at ${vs}V supply, use a ${standardR.toFixed(0)} Ω resistor (${recommendedRating}) to safely set current to ${ifMa} mA.`
      };
    },
    formula: {
      expression: 'R = (Vs - n × Vf) / If   |   P_resistor = (Vs - n × Vf) × If',
      explanation: 'LEDs are current-driven diodes with negative temperature coefficients; a series resistor prevents runaway current and burning out.',
      variables: [
        { symbol: 'Vs', name: 'Supply Voltage', description: 'Volts' },
        { symbol: 'Vf', name: 'Forward Voltage Drop', description: 'Color-dependent diode barrier potential (e.g. 2.0V Red, 3.2V Blue).' },
        { symbol: 'If', name: 'Forward Current', description: 'Nominal operating current (typically 15-20 mA for standard 5mm LEDs).' }
      ]
    },
    explanationSections: [
      {
        title: 'Why LEDs Require Current Limiting',
        content: 'Unlike resistors, LEDs have a non-linear exponential I-V diode curve. A slight voltage increase past Vf causes current to spike exponentially, causing thermal destruction without a series ballast resistor.'
      }
    ],
    faqs: [
      {
        question: 'Can I connect multiple LEDs in parallel with one single resistor?',
        answer: 'Not recommended. Manufacturing variances in Vf will cause one LED with lower Vf to hog all current (thermal runaway) and burn out.'
      }
    ],
    relatedIds: ['ohms-law-calculator', 'resistor-color-code-calculator'],
    disclaimerType: 'standard'
  },

  // 17. TRANSFORMER CALCULATOR
  {
    id: 'transformer-calculator',
    slug: 'transformer-calculator',
    name: 'Transformer Calculator',
    shortName: 'Transformer',
    category: 'engineering',
    description: 'Calculate transformer turns ratio (Np/Ns), primary and secondary voltages, currents, power rating in kVA, and step-up vs step-down operation.',
    iconName: 'Repeat',
    popular: true,
    keywords: ['transformer calculator', 'turns ratio', 'step up transformer', 'step down transformer', 'np ns', 'primary secondary voltage', 'kva rating'],
    inputs: [
      {
        id: 'primaryVoltage',
        label: 'Primary Voltage (Vp in Volts)',
        type: 'number',
        defaultValue: 230,
        min: 1,
        max: 500000,
        step: 1,
        suffix: ' V'
      },
      {
        id: 'secondaryVoltage',
        label: 'Secondary Voltage (Vs in Volts)',
        type: 'number',
        defaultValue: 12,
        min: 0.1,
        max: 500000,
        step: 0.5,
        suffix: ' V'
      },
      {
        id: 'secondaryCurrent',
        label: 'Secondary Load Current (Is in Amps)',
        type: 'number',
        defaultValue: 5,
        min: 0.01,
        max: 10000,
        step: 0.1,
        suffix: ' A'
      },
      {
        id: 'efficiency',
        label: 'Transformer Efficiency (%)',
        type: 'slider',
        defaultValue: 95,
        min: 70,
        max: 100,
        step: 1,
        suffix: ' %'
      }
    ],
    calculate: (inputs) => {
      const vp = Number(inputs.primaryVoltage) || 230;
      const vs = Number(inputs.secondaryVoltage) || 12;
      const is = Number(inputs.secondaryCurrent) || 5;
      const eff = (Number(inputs.efficiency) || 95) / 100;

      const turnsRatio = vs > 0 ? vp / vs : 1; // Np / Ns
      const secPowerVA = vs * is;
      const primPowerVA = eff > 0 ? secPowerVA / eff : secPowerVA;
      const ip = vp > 0 ? primPowerVA / vp : 0;

      const isStepDown = vp > vs;
      const kva = secPowerVA / 1000;

      return {
        primaryMetric: {
          label: 'Transformer Turns Ratio (Np : Ns)',
          value: Number(turnsRatio.toFixed(2)),
          formattedValue: `${turnsRatio.toFixed(2)} : 1`,
          subtext: `${isStepDown ? 'Step-Down Transformer' : 'Step-Up Transformer'} (${(eff * 100).toFixed(0)}% Efficiency)`,
          type: 'highlight',
          badge: isStepDown ? 'Step-Down' : 'Step-Up'
        },
        secondaryMetrics: [
          {
            label: 'Primary Current (Ip)',
            value: Number(ip.toFixed(3)),
            formattedValue: ip >= 1 ? `${ip.toFixed(2)} A` : `${(ip * 1000).toFixed(1)} mA`,
            type: 'neutral'
          },
          {
            label: 'Power Rating (kVA)',
            value: Number(kva.toFixed(3)),
            formattedValue: kva >= 1 ? `${kva.toFixed(2)} kVA` : `${secPowerVA.toFixed(1)} VA`,
            type: 'neutral'
          },
          {
            label: 'Secondary Output Power',
            value: Number(secPowerVA.toFixed(1)),
            formattedValue: `${secPowerVA.toFixed(1)} VA (Watts at pf=1)`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'Primary Voltage (Vp)', value: vp, formattedValue: `${vp} V` },
          { label: 'Secondary Voltage (Vs)', value: vs, formattedValue: `${vs} V` },
          { label: 'Primary Current (Ip)', value: ip, formattedValue: `${ip.toFixed(3)} A` },
          { label: 'Secondary Current (Is)', value: is, formattedValue: `${is.toFixed(2)} A` },
          { label: 'Efficiency Loss', value: primPowerVA - secPowerVA, formattedValue: `${(primPowerVA - secPowerVA).toFixed(1)} W` }
        ],
        summaryText: `Turns ratio is ${turnsRatio.toFixed(2)}:1. Transforming ${vp}V to ${vs}V at ${is}A requires ${ip.toFixed(3)}A primary current with a ${kva.toFixed(2)} kVA transformer.`
      };
    },
    formula: {
      expression: 'Np / Ns = Vp / Vs = Is / Ip   |   S (kVA) = (V × I) / 1000',
      explanation: 'Based on Faraday’s law of mutual electromagnetic induction between primary and secondary copper windings linked by a magnetic core.',
      variables: [
        { symbol: 'Np/Ns', name: 'Turns Ratio', description: 'Ratio of primary to secondary wire turns.' },
        { symbol: 'S', name: 'Apparent Power', description: 'Volt-Amperes (VA).' }
      ]
    },
    explanationSections: [
      {
        title: 'Conservation of Energy in Transformers',
        content: 'When voltage is stepped down, current is proportionately stepped up so that power in equals power out (less winding copper and core eddy-current losses).'
      }
    ],
    faqs: [
      {
        question: 'Can transformers work on Direct Current (DC)?',
        answer: 'No! Transformers rely on changing magnetic flux dΦ/dt. Constant DC produces zero induced secondary voltage and will burn out the primary winding due to lack of inductive reactance.'
      }
    ],
    relatedIds: ['ac-power-calculator', 'electrical-power-calculator', 'ohms-law-calculator'],
    disclaimerType: 'standard'
  },

  // 18. AC POWER CALCULATOR
  {
    id: 'ac-power-calculator',
    slug: 'ac-power-calculator',
    name: 'AC Power Calculator',
    shortName: 'AC Power',
    category: 'engineering',
    description: 'Calculate Real Power (Watts), Reactive Power (VAR), Apparent Power (VA), Power Factor (cos φ), and power factor correction capacitor value.',
    iconName: 'Zap',
    popular: true,
    keywords: ['ac power calculator', 'real power', 'reactive power var', 'apparent power va', 'power factor cos phi', 'power factor correction capacitor', 'power triangle'],
    inputs: [
      {
        id: 'voltageRms',
        label: 'RMS Voltage (V in Volts)',
        type: 'number',
        defaultValue: 230,
        min: 1,
        max: 50000,
        step: 1,
        suffix: ' V'
      },
      {
        id: 'currentRms',
        label: 'RMS Current (I in Amperes)',
        type: 'number',
        defaultValue: 10,
        min: 0.01,
        max: 5000,
        step: 0.1,
        suffix: ' A'
      },
      {
        id: 'powerFactor',
        label: 'Power Factor (cos φ, 0 to 1.0)',
        type: 'slider',
        defaultValue: 0.8,
        min: 0.1,
        max: 1.0,
        step: 0.02
      },
      {
        id: 'frequencyHz',
        label: 'Grid Frequency (Hz)',
        type: 'select',
        defaultValue: '50',
        options: [
          { label: '50 Hz (Europe, Asia, India, UK)', value: '50' },
          { label: '60 Hz (USA, Canada, Americas)', value: '60' }
        ]
      }
    ],
    calculate: (inputs) => {
      const v = Number(inputs.voltageRms) || 230;
      const i = Number(inputs.currentRms) || 10;
      const pf = Number(inputs.powerFactor) || 0.8;
      const f = Number(inputs.frequencyHz) || 50;

      const s = v * i; // Apparent power in VA
      const p = s * pf; // Real power in Watts
      const phiRad = Math.acos(Math.min(pf, 1.0));
      const phiDeg = (phiRad * 180) / Math.PI;
      const q = s * Math.sin(phiRad); // Reactive power in VAR

      // Target power factor correction to 0.95
      const targetPf = 0.95;
      const targetPhiRad = Math.acos(targetPf);
      const targetQ = p * Math.tan(targetPhiRad);
      const requiredQc = Math.max(0, q - targetQ); // VAR needed
      // C = Qc / (2 * pi * f * V^2)
      const cFarads = requiredQc > 0 ? requiredQc / (2 * Math.PI * f * v * v) : 0;
      const cUf = cFarads * 1e6;

      return {
        primaryMetric: {
          label: 'Real Active Power (P)',
          value: Number(p.toFixed(1)),
          formattedValue: p >= 1000 ? `${(p / 1000).toFixed(2)} kW` : `${p.toFixed(1)} W`,
          subtext: `Apparent Power S = ${(s / 1000).toFixed(2)} kVA | Reactive Q = ${(q / 1000).toFixed(2)} kVAR`,
          type: 'highlight',
          badge: `PF = ${pf.toFixed(2)} (Lagging)`
        },
        secondaryMetrics: [
          {
            label: 'Apparent Power (S = V × I)',
            value: Number((s / 1000).toFixed(2)),
            formattedValue: `${(s / 1000).toFixed(2)} kVA`,
            type: 'neutral'
          },
          {
            label: 'Reactive Power (Q = S sin φ)',
            value: Number((q / 1000).toFixed(2)),
            formattedValue: `${(q / 1000).toFixed(2)} kVAR`,
            type: 'neutral'
          },
          {
            label: 'Phase Angle (φ)',
            value: Number(phiDeg.toFixed(1)),
            formattedValue: `${phiDeg.toFixed(1)}°`,
            type: 'neutral'
          },
          {
            label: 'Capacitor for PF → 0.95',
            value: Number(cUf.toFixed(1)),
            formattedValue: `${cUf.toFixed(1)} µF (${(requiredQc / 1000).toFixed(2)} kVAR)`,
            type: 'success'
          }
        ],
        breakdown: [
          { label: 'Real Power P (Useful Work)', value: p, formattedValue: `${(p / 1000).toFixed(2)} kW` },
          { label: 'Reactive Power Q (Magnetizing)', value: q, formattedValue: `${(q / 1000).toFixed(2)} kVAR` },
          { label: 'Total Apparent Power S', value: s, formattedValue: `${(s / 1000).toFixed(2)} kVA` },
          { label: 'Phase Shift Angle φ', value: phiDeg, formattedValue: `${phiDeg.toFixed(1)}° Lagging` }
        ],
        summaryText: `AC load at ${v}V and ${i}A with PF ${pf} consumes ${(p/1000).toFixed(2)} kW real power and ${(q/1000).toFixed(2)} kVAR reactive power. Adding a ${cUf.toFixed(1)} µF capacitor corrects PF to 0.95.`
      };
    },
    formula: {
      expression: 'P = V × I × cos φ   |   Q = V × I × sin φ   |   S = V × I = √(P² + Q²)',
      explanation: 'The AC Power Triangle relates Real Active Power (Watts), Reactive Power (VAR), and Apparent Power (VA).',
      variables: [
        { symbol: 'P', name: 'Real Power', description: 'Actual work converted into heat or mechanical energy (Watts).' },
        { symbol: 'Q', name: 'Reactive Power', description: 'Stored and returned energy in magnetic/electric fields (VAR).' },
        { symbol: 'cos φ', name: 'Power Factor', description: 'Ratio of Real Power to Apparent Power (P / S).' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Power Factor Correction is Crucial in ECE',
        content: 'Low power factors (due to inductive electric motors, transformers, and chokes) draw excessive reactive current through utility cables, causing I²R transmission losses and utility penalty surcharges.'
      }
    ],
    faqs: [
      {
        question: 'What is the ideal power factor?',
        answer: 'Unity power factor (1.0), meaning voltage and current are exactly in phase and 100% of apparent power is converted into useful active work.'
      }
    ],
    relatedIds: ['electrical-power-calculator', 'transformer-calculator', 'ohms-law-calculator'],
    disclaimerType: 'standard'
  }
];
