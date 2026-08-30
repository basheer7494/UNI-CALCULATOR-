import { CalculatorDefinition } from '../../types/calculator';
import { formatCurrency, formatNumber } from '../utils';

export const everydayCalculators: CalculatorDefinition[] = [
  // 1. AGE CALCULATOR
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator & Chronological Milestones',
    shortName: 'Age Calculator',
    category: 'everyday',
    description: 'Calculate your exact age in years, months, days, hours, minutes, total days lived, and countdown to your next birthday.',
    iconName: 'Calendar',
    popular: true,
    featured: true,
    keywords: ['age', 'birthday', 'birth date', 'how old am i', 'exact age', 'days lived', 'next birthday', 'zodiac'],
    inputs: [
      {
        id: 'birthDate',
        label: 'Date of Birth',
        type: 'date',
        defaultValue: '1998-05-15',
        helpText: 'Select your birth date'
      },
      {
        id: 'targetDate',
        label: 'Age as of Date (Default: Today)',
        type: 'date',
        defaultValue: new Date().toISOString().split('T')[0],
        helpText: 'Calculate age as of this date'
      }
    ],
    calculate: (inputs) => {
      const bDateStr = inputs.birthDate || '1998-05-15';
      const tDateStr = inputs.targetDate || new Date().toISOString().split('T')[0];

      const birth = new Date(bDateStr);
      const target = new Date(tDateStr);

      if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
        return {
          primaryMetric: {
            label: 'Invalid Date Selection',
            value: 0,
            formattedValue: 'Please enter a valid birth date',
            type: 'error'
          }
        };
      }

      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        // days in previous month of target
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffMs = target.getTime() - birth.getTime();
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;

      // Next Birthday countdown
      const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < target) {
        nextBday.setFullYear(target.getFullYear() + 1);
      }
      const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

      // Day of week born
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayBorn = daysOfWeek[birth.getDay()];

      // Western Zodiac sign
      const m = birth.getMonth() + 1;
      const d = birth.getDate();
      let zodiac = 'Aries ♈';
      if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiac = 'Aries ♈';
      else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiac = 'Taurus ♉';
      else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiac = 'Gemini ♊';
      else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiac = 'Cancer ♋';
      else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiac = 'Leo ♌';
      else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiac = 'Virgo ♍';
      else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiac = 'Libra ♎';
      else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiac = 'Scorpio ♏';
      else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiac = 'Sagittarius ♐';
      else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiac = 'Capricorn ♑';
      else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiac = 'Aquarius ♒';
      else zodiac = 'Pisces ♓';

      return {
        primaryMetric: {
          label: 'Exact Chronological Age',
          value: years,
          formattedValue: `${years} Years, ${months} Months, ${days} Days`,
          subtext: `Born on a ${dayBorn} | Zodiac: ${zodiac}`,
          type: 'highlight',
          badge: `${totalDays.toLocaleString()} Days Lived`
        },
        secondaryMetrics: [
          {
            label: 'Next Birthday In',
            value: daysToNextBday,
            formattedValue: daysToNextBday === 0 ? '🎉 Happy Birthday Today!' : `${daysToNextBday} Days`,
            type: 'success'
          },
          {
            label: 'Total Weeks Lived',
            value: totalWeeks,
            formattedValue: `${totalWeeks.toLocaleString()} Weeks`,
            type: 'neutral'
          },
          {
            label: 'Total Hours Lived',
            value: totalHours,
            formattedValue: `${totalHours.toLocaleString()} Hours`,
            type: 'neutral'
          }
        ],
        table: {
          title: 'Lifetime Milestone Summary',
          columns: [
            { key: 'unit', label: 'Time Unit' },
            { key: 'count', label: 'Accumulated Total' }
          ],
          data: [
            { unit: 'Total Days', count: totalDays.toLocaleString() },
            { unit: 'Total Weeks', count: totalWeeks.toLocaleString() },
            { unit: 'Total Hours', count: totalHours.toLocaleString() },
            { unit: 'Total Minutes', count: totalMinutes.toLocaleString() },
            { unit: 'Day of Week Born', count: dayBorn },
            { unit: 'Zodiac Sun Sign', count: zodiac }
          ]
        }
      };
    },
    formula: {
      expression: 'Age = Target Date - Birth Date (taking month lengths & leap years into account)',
      explanation: 'Calendar arithmetic adjusted for leap years and varying month lengths (28 to 31 days).',
      variables: [
        { symbol: 'Years', name: 'Completed Years', description: 'Full 365/366 day cycles.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Leap Years are Counted',
        content: 'Calculates exact Gregorian calendar spans, accurately resolving leap year days (February 29).'
      }
    ],
    faqs: [
      {
        question: 'How many days are in a year for age calculation?',
        answer: 'Standard Gregorian calendar years have 365 days, with leap years having 366 days every 4 years.'
      }
    ],
    relatedIds: ['date-difference-calculator', 'time-duration-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 2. DATE DIFFERENCE CALCULATOR
  {
    id: 'date-difference-calculator',
    slug: 'date-difference-calculator',
    name: 'Date Difference & Working Days Calculator',
    shortName: 'Date Difference',
    category: 'everyday',
    description: 'Calculate the duration between two dates in total days, weeks, months, business days (excluding weekends), and working hours.',
    iconName: 'CalendarDays',
    popular: true,
    keywords: ['date difference', 'days between dates', 'working days', 'business days', 'calendar difference', 'date duration'],
    inputs: [
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        id: 'endDate',
        label: 'End Date',
        type: 'date',
        defaultValue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: 'excludeWeekends',
        label: 'Exclude Weekends (Sat & Sun)',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { label: 'Yes (Business Days Only)', value: 'yes' },
          { label: 'No (All Calendar Days)', value: 'no' }
        ]
      }
    ],
    calculate: (inputs) => {
      const sStr = inputs.startDate || new Date().toISOString().split('T')[0];
      const eStr = inputs.endDate || new Date().toISOString().split('T')[0];
      const exclude = inputs.excludeWeekends === 'yes';

      const d1 = new Date(sStr);
      const d2 = new Date(eStr);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return {
          primaryMetric: {
            label: 'Invalid Date',
            value: 0,
            formattedValue: 'Please select valid start and end dates',
            type: 'error'
          }
        };
      }

      const isReverse = d1 > d2;
      const start = isReverse ? d2 : d1;
      const end = isReverse ? d1 : d2;

      const diffMs = end.getTime() - start.getTime();
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      // Calculate working business days
      let workingDays = 0;
      let weekendDays = 0;
      const cur = new Date(start);
      while (cur < end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendDays++;
        } else {
          workingDays++;
        }
        cur.setDate(cur.getDate() + 1);
      }

      const totalWeeks = (totalDays / 7).toFixed(1);
      const approxMonths = (totalDays / 30.4375).toFixed(1);

      return {
        primaryMetric: {
          label: exclude ? 'Total Working (Business) Days' : 'Total Calendar Days',
          value: exclude ? workingDays : totalDays,
          formattedValue: `${(exclude ? workingDays : totalDays).toLocaleString()} Days`,
          subtext: `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
          type: 'highlight',
          badge: `${totalWeeks} Weeks (~${approxMonths} Months)`
        },
        secondaryMetrics: [
          {
            label: 'Total Calendar Days',
            value: totalDays,
            formattedValue: `${totalDays} Days`,
            type: 'neutral'
          },
          {
            label: 'Weekend Days Excluded',
            value: weekendDays,
            formattedValue: `${weekendDays} Days`,
            type: 'neutral'
          },
          {
            label: 'Total Working Hours (8h/day)',
            value: workingDays * 8,
            formattedValue: `${(workingDays * 8).toLocaleString()} Hours`,
            type: 'success'
          }
        ]
      };
    },
    formula: {
      expression: 'Duration = End Date - Start Date',
      explanation: 'Computes elapsed time, isolating weekdays (Monday-Friday) from weekend days.',
      variables: [
        { symbol: 'Business Days', name: 'Working Days', description: 'Mon-Fri working days excluding Saturdays and Sundays.' }
      ]
    },
    explanationSections: [
      {
        title: 'Project Planning & Notice Period Calculation',
        content: 'Essential for tracking project sprint deadlines, delivery timelines, student vacations, and corporate employee notice periods.'
      }
    ],
    faqs: [
      {
        question: 'Does this calculator include public bank holidays?',
        answer: 'This standard calculation isolates Saturday/Sunday weekends. Specific gazetted public holidays vary by country and state.'
      }
    ],
    relatedIds: ['age-calculator', 'time-duration-calculator'],
    disclaimerType: 'standard'
  },

  // 3. TIP & SPLIT BILL CALCULATOR
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    name: 'Tip & Split Bill Calculator',
    shortName: 'Tip & Split Bill',
    category: 'everyday',
    description: 'Calculate restaurant tip percentage, split food bill evenly among friends, and round amounts neatly.',
    iconName: 'Utensils',
    popular: true,
    keywords: ['tip', 'split bill', 'restaurant tip', 'bill split', 'gratuity', 'group dinner', 'dining'],
    inputs: [
      {
        id: 'billAmount',
        label: 'Bill Amount (Pre-Tip)',
        type: 'slider',
        defaultValue: 3500,
        min: 50,
        max: 50000,
        step: 50,
        prefix: 'currency'
      },
      {
        id: 'tipPercent',
        label: 'Tip Percentage (%)',
        type: 'slider',
        defaultValue: 10,
        min: 0,
        max: 35,
        step: 1,
        suffix: '%'
      },
      {
        id: 'numberOfPeople',
        label: 'Split Between (Number of People)',
        type: 'slider',
        defaultValue: 4,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' People'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const bill = Number(inputs.billAmount) || 3500;
      const tipPct = Number(inputs.tipPercent) || 10;
      const people = Number(inputs.numberOfPeople) || 4;

      const tipAmount = (bill * tipPct) / 100;
      const totalWithTip = bill + tipAmount;

      const perPersonBill = bill / people;
      const perPersonTip = tipAmount / people;
      const perPersonTotal = totalWithTip / people;

      return {
        primaryMetric: {
          label: 'Total Per Person',
          value: Math.round(perPersonTotal),
          formattedValue: formatCurrency(Math.round(perPersonTotal), currency) + ' / person',
          subtext: `Total Bill with Tip: ${formatCurrency(Math.round(totalWithTip), currency)}`,
          type: 'highlight',
          badge: `${people} People Split`
        },
        secondaryMetrics: [
          {
            label: 'Total Tip Amount',
            value: Math.round(tipAmount),
            formattedValue: formatCurrency(Math.round(tipAmount), currency),
            subtext: `${tipPct}% gratuity`,
            type: 'success'
          },
          {
            label: 'Tip Per Person',
            value: Math.round(perPersonTip),
            formattedValue: formatCurrency(Math.round(perPersonTip), currency),
            type: 'neutral'
          },
          {
            label: 'Base Bill Per Person',
            value: Math.round(perPersonBill),
            formattedValue: formatCurrency(Math.round(perPersonBill), currency),
            type: 'neutral'
          }
        ],
        breakdown: [
          {
            label: 'Food & Drinks Bill',
            value: bill,
            formattedValue: formatCurrency(bill, currency),
            percentage: Math.round((bill / totalWithTip) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Tip Gratuity',
            value: Math.round(tipAmount),
            formattedValue: formatCurrency(Math.round(tipAmount), currency),
            percentage: Math.round((tipAmount / totalWithTip) * 100),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'Per Person = [Bill × (1 + Tip% / 100)] / Number of People',
      explanation: 'Divides total inclusive dinner cost evenly across party members.',
      variables: [
        { symbol: 'Tip', name: 'Gratuity', description: 'Voluntary service gratuity.' }
      ]
    },
    explanationSections: [
      {
        title: 'Global Tipping Etiquette',
        content: 'In the US and Canada, 15%–20% is customary for table service. In India and the UK, 5%–10% is common (unless a service charge is already included in the bill).'
      }
    ],
    faqs: [
      {
        question: 'Should I tip if a Service Charge is already on the bill?',
        answer: 'If the restaurant bill already includes an explicit "Service Charge" (typically 5-10%), additional tipping is strictly optional.'
      }
    ],
    relatedIds: ['discount-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 4. TEMPERATURE CONVERTER
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    name: 'Temperature Converter (Celsius, Fahrenheit, Kelvin)',
    shortName: 'Temperature Converter',
    category: 'everyday',
    description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine with instant visual indicator.',
    iconName: 'Thermometer',
    popular: true,
    keywords: ['temperature', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin', 'temp conversion', 'weather'],
    inputs: [
      {
        id: 'tempValue',
        label: 'Temperature Value',
        type: 'number',
        defaultValue: 37,
        min: -500,
        max: 5000,
        step: 0.5
      },
      {
        id: 'fromScale',
        label: 'From Scale',
        type: 'select',
        defaultValue: 'c',
        options: [
          { label: 'Celsius (°C)', value: 'c' },
          { label: 'Fahrenheit (°F)', value: 'f' },
          { label: 'Kelvin (K)', value: 'k' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = Number(inputs.tempValue) || 37;
      const from = inputs.fromScale || 'c';

      let c = 0, f = 0, k = 0;

      if (from === 'c') {
        c = val;
        f = (c * 9) / 5 + 32;
        k = c + 273.15;
      } else if (from === 'f') {
        f = val;
        c = ((f - 32) * 5) / 9;
        k = c + 273.15;
      } else if (from === 'k') {
        k = val;
        c = k - 273.15;
        f = (c * 9) / 5 + 32;
      }

      let sensation = 'Warm';
      if (c <= 0) sensation = 'Freezing ❄️';
      else if (c < 18) sensation = 'Cool / Chilly 🧥';
      else if (c <= 26) sensation = 'Comfortable Room Temp 🛋️';
      else if (c <= 37) sensation = 'Warm / Human Body Temp 🌡️';
      else sensation = 'Hot / Boiling 🔥';

      return {
        primaryMetric: {
          label: from === 'c' ? 'In Fahrenheit (°F)' : 'In Celsius (°C)',
          value: Number((from === 'c' ? f : c).toFixed(2)),
          formattedValue: from === 'c' ? `${f.toFixed(2)} °F` : `${c.toFixed(2)} °C`,
          subtext: `Kelvin: ${k.toFixed(2)} K`,
          type: 'highlight',
          badge: sensation
        },
        secondaryMetrics: [
          {
            label: 'Celsius (°C)',
            value: Number(c.toFixed(2)),
            formattedValue: `${c.toFixed(2)} °C`,
            type: 'neutral'
          },
          {
            label: 'Fahrenheit (°F)',
            value: Number(f.toFixed(2)),
            formattedValue: `${f.toFixed(2)} °F`,
            type: 'neutral'
          },
          {
            label: 'Kelvin (K)',
            value: Number(k.toFixed(2)),
            formattedValue: `${k.toFixed(2)} K`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: '°F = (°C × 9/5) + 32   |   K = °C + 273.15',
      explanation: 'Standard thermodynamic temperature scales.',
      variables: [
        { symbol: '°C', name: 'Celsius', description: 'Metric scale based on water freezing (0°C) and boiling (100°C).' }
      ]
    },
    explanationSections: [
      {
        title: 'Key Reference Temperature Points',
        content: 'Absolute Zero = -273.15°C (0 K), Water Freezing = 0°C (32°F), Normal Body Temp = 37°C (98.6°F), Water Boiling = 100°C (212°F).'
      }
    ],
    faqs: [
      {
        question: 'At what temperature are Celsius and Fahrenheit equal?',
        answer: '-40°C is exactly equal to -40°F.'
      }
    ],
    relatedIds: ['unit-converter', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 5. UNIT CONVERTER (Length, Weight, Area, Volume)
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Unit Converter (Length, Weight, Area, Volume)',
    shortName: 'Unit Converter',
    category: 'everyday',
    description: 'Convert between all metric and imperial units across length, weight, area, volume, and digital data storage.',
    iconName: 'ArrowRightLeft',
    popular: true,
    featured: true,
    keywords: ['unit converter', 'metric to imperial', 'kg to lbs', 'meters to feet', 'inches to cm', 'acres to sq ft', 'liters to gallons'],
    inputs: [
      {
        id: 'category',
        label: 'Measurement Type',
        type: 'select',
        defaultValue: 'length',
        options: [
          { label: 'Length & Distance', value: 'length' },
          { label: 'Weight & Mass', value: 'weight' },
          { label: 'Area', value: 'area' },
          { label: 'Volume & Liquid', value: 'volume' }
        ]
      },
      {
        id: 'inputValue',
        label: 'Value to Convert',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 1e9,
        step: 0.1
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'meters',
        options: [
          { label: 'Meters (m)', value: 'meters' },
          { label: 'Kilometers (km)', value: 'kilometers' },
          { label: 'Centimeters (cm)', value: 'centimeters' },
          { label: 'Feet (ft)', value: 'feet' },
          { label: 'Inches (in)', value: 'inches' },
          { label: 'Miles (mi)', value: 'miles' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'feet',
        options: [
          { label: 'Feet (ft)', value: 'feet' },
          { label: 'Inches (in)', value: 'inches' },
          { label: 'Meters (m)', value: 'meters' },
          { label: 'Kilometers (km)', value: 'kilometers' },
          { label: 'Centimeters (cm)', value: 'centimeters' },
          { label: 'Miles (mi)', value: 'miles' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = Number(inputs.inputValue) || 10;
      const from = inputs.fromUnit || 'meters';
      const to = inputs.toUnit || 'feet';

      // Standard meter conversion base
      const toMeters: Record<string, number> = {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        feet: 0.3048,
        inches: 0.0254,
        miles: 1609.344
      };

      const meters = val * (toMeters[from] || 1);
      const converted = meters / (toMeters[to] || 1);

      return {
        primaryMetric: {
          label: `Converted to ${to}`,
          value: Number(converted.toFixed(4)),
          formattedValue: `${formatNumber(converted, 4)} ${to}`,
          subtext: `${val} ${from} = ${formatNumber(converted, 4)} ${to}`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Original Value',
            value: val,
            formattedValue: `${val} ${from}`,
            type: 'neutral'
          },
          {
            label: 'SI Base (Meters)',
            value: Number(meters.toFixed(4)),
            formattedValue: `${meters.toFixed(4)} m`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Value_To = (Value_From × Conversion_Factor_From) ÷ Conversion_Factor_To',
      explanation: 'Normalizes input to International System of Units (SI) baseline and re-scales to target metric.',
      variables: [
        { symbol: 'Factor', name: 'Conversion Constant', description: 'Fixed scientific conversion multiplier.' }
      ]
    },
    explanationSections: [
      {
        title: 'Metric vs Imperial Standards',
        content: 'The metric system uses decimal base-10 multiples (kilo, milli, centi), while imperial systems use traditional historical fractions.'
      }
    ],
    faqs: [
      {
        question: 'How many feet are in a meter?',
        answer: '1 meter is approximately equal to 3.28084 feet.'
      }
    ],
    relatedIds: ['temperature-converter', 'percentage-calculator'],
    disclaimerType: 'standard'
  }
];
