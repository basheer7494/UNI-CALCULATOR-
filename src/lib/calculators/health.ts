import { CalculatorDefinition } from '../../types/calculator';
import { formatNumber } from '../utils';

export const healthCalculators: CalculatorDefinition[] = [
  // 1. BMI CALCULATOR
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator (Body Mass Index & Healthy Weight Range)',
    shortName: 'BMI Calculator',
    category: 'health',
    description: 'Calculate your Body Mass Index (BMI), WHO weight category classification, and ideal healthy weight range.',
    iconName: 'Heart',
    popular: true,
    featured: true,
    keywords: ['bmi', 'body mass index', 'ideal weight', 'weight category', 'obesity', 'underweight', 'overweight', 'fitness'],
    inputs: [
      {
        id: 'heightCm',
        label: 'Height (in Centimeters)',
        type: 'slider',
        defaultValue: 175,
        min: 100,
        max: 230,
        step: 1,
        suffix: ' cm'
      },
      {
        id: 'weightKg',
        label: 'Weight (in Kilograms)',
        type: 'slider',
        defaultValue: 70,
        min: 30,
        max: 200,
        step: 0.5,
        suffix: ' kg'
      },
      {
        id: 'gender',
        label: 'Biological Sex',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      }
    ],
    calculate: (inputs) => {
      const hCm = Number(inputs.heightCm) || 175;
      const wKg = Number(inputs.weightKg) || 70;

      const hM = hCm / 100;
      const bmi = hM > 0 ? wKg / (hM * hM) : 0;

      let category = 'Normal Weight';
      let statusType: 'success' | 'warning' | 'error' = 'success';
      let color = '#10b981';

      if (bmi < 18.5) {
        category = 'Underweight (<18.5)';
        statusType = 'warning';
        color = '#f59e0b';
      } else if (bmi <= 24.9) {
        category = 'Normal / Healthy Weight (18.5 - 24.9)';
        statusType = 'success';
        color = '#10b981';
      } else if (bmi <= 29.9) {
        category = 'Overweight (25.0 - 29.9)';
        statusType = 'warning';
        color = '#f97316';
      } else if (bmi <= 34.9) {
        category = 'Obese Class I (30.0 - 34.9)';
        statusType = 'error';
        color = '#ef4444';
      } else {
        category = 'Obese Class II / III (35.0+)';
        statusType = 'error';
        color = '#b91c1c';
      }

      // Healthy weight range (BMI 18.5 to 24.9)
      const minHealthyKg = 18.5 * (hM * hM);
      const maxHealthyKg = 24.9 * (hM * hM);

      const chartData = [
        { name: 'Underweight', range: 18.5, active: bmi < 18.5 ? bmi : 0 },
        { name: 'Normal', range: 24.9, active: bmi >= 18.5 && bmi <= 24.9 ? bmi : 0 },
        { name: 'Overweight', range: 29.9, active: bmi > 24.9 && bmi <= 29.9 ? bmi : 0 },
        { name: 'Obese', range: 40, active: bmi > 29.9 ? bmi : 0 }
      ];

      return {
        primaryMetric: {
          label: 'Your Body Mass Index (BMI)',
          value: Number(bmi.toFixed(1)),
          formattedValue: `${bmi.toFixed(1)} kg/m²`,
          subtext: `Classification: ${category}`,
          type: statusType === 'success' ? 'highlight' : statusType === 'warning' ? 'warning' : 'error',
          badge: category
        },
        secondaryMetrics: [
          {
            label: 'Healthy Weight Range for Your Height',
            value: `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`,
            formattedValue: `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`,
            type: 'neutral',
            subtext: `At height ${hCm} cm`
          },
          {
            label: 'Current Weight Status',
            value: category,
            formattedValue: category,
            type: statusType
          }
        ],
        chart: {
          type: 'bar',
          title: 'WHO BMI Classification Categories',
          data: chartData,
          series: [
            { key: 'range', name: 'Threshold', color: '#94a3b8' },
            { key: 'active', name: 'Your Score', color: color }
          ]
        },
        summaryText: `At a height of ${hCm} cm and weight of ${wKg} kg, your BMI is ${bmi.toFixed(1)}, which falls into the ${category} classification. The recommended healthy weight span for this height is ${minHealthyKg.toFixed(1)} kg to ${maxHealthyKg.toFixed(1)} kg.`
      };
    },
    formula: {
      expression: 'BMI = Weight (kg) / [Height (m)]²',
      explanation: 'World Health Organization (WHO) international standard for assessing body weight categories.',
      variables: [
        { symbol: 'BMI', name: 'Body Mass Index', description: 'Ratio of mass in kilograms to square of height in meters.' }
      ]
    },
    explanationSections: [
      {
        title: 'What BMI Does and Does Not Measure',
        content: 'BMI is a useful general screening tool for body weight categories across large populations. However, it does not differentiate between body fat and lean muscle mass (athletes and bodybuilders often register as overweight on BMI scales due to high muscle density).'
      }
    ],
    faqs: [
      {
        question: 'What is considered a normal BMI score?',
        answer: 'A BMI between 18.5 and 24.9 is considered normal and associated with the lowest statistical risk of cardiovascular and metabolic conditions.'
      },
      {
        question: 'Does age affect BMI interpretation?',
        answer: 'For adults over 20, BMI categories are standard regardless of age. For children and teens (2-19), BMI percentiles adjusted for age and gender are used instead.'
      }
    ],
    relatedIds: ['bmr-calculator', 'daily-calorie-calculator', 'water-intake-calculator', 'ideal-weight-calculator'],
    disclaimerType: 'health',
    customDisclaimer: 'This calculator provides an informational estimate and is not a medical diagnosis or substitute for professional medical advice. Consult a certified physician or healthcare provider for clinical assessments.'
  },

  // 2. BMR & DAILY CALORIE CALCULATOR
  {
    id: 'bmr-calculator',
    slug: 'bmr-calculator',
    name: 'BMR & Basal Metabolic Rate Calculator',
    shortName: 'BMR Calculator',
    category: 'health',
    description: 'Calculate your Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor equation to understand resting calorie burn.',
    iconName: 'Flame',
    popular: true,
    keywords: ['bmr', 'basal metabolic rate', 'calories', 'metabolism', 'mifflin st jeor', 'resting calories', 'tdee'],
    inputs: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      {
        id: 'age',
        label: 'Age (Years)',
        type: 'slider',
        defaultValue: 28,
        min: 15,
        max: 90,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'weightKg',
        label: 'Weight (kg)',
        type: 'slider',
        defaultValue: 72,
        min: 35,
        max: 180,
        step: 0.5,
        suffix: ' kg'
      },
      {
        id: 'heightCm',
        label: 'Height (cm)',
        type: 'slider',
        defaultValue: 175,
        min: 120,
        max: 220,
        step: 1,
        suffix: ' cm'
      }
    ],
    calculate: (inputs) => {
      const gender = inputs.gender || 'male';
      const age = Number(inputs.age) || 28;
      const w = Number(inputs.weightKg) || 72;
      const h = Number(inputs.heightCm) || 175;

      // Mifflin-St Jeor Equation:
      // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
      // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
      let bmr = (10 * w) + (6.25 * h) - (5 * age);
      if (gender === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      // Activity levels
      const sedentary = bmr * 1.2;
      const light = bmr * 1.375;
      const moderate = bmr * 1.55;
      const active = bmr * 1.725;

      return {
        primaryMetric: {
          label: 'Basal Metabolic Rate (BMR)',
          value: Math.round(bmr),
          formattedValue: `${Math.round(bmr).toLocaleString()} kcal / day`,
          subtext: `Calories burned at complete rest just staying alive`,
          type: 'highlight',
          badge: 'Mifflin-St Jeor Standard'
        },
        secondaryMetrics: [
          {
            label: 'Sedentary Maintenance (Desk job)',
            value: Math.round(sedentary),
            formattedValue: `${Math.round(sedentary).toLocaleString()} kcal/day`,
            type: 'neutral'
          },
          {
            label: 'Moderate Exercise (3-5 days/wk)',
            value: Math.round(moderate),
            formattedValue: `${Math.round(moderate).toLocaleString()} kcal/day`,
            type: 'success'
          },
          {
            label: 'Very Active (Heavy training)',
            value: Math.round(active),
            formattedValue: `${Math.round(active).toLocaleString()} kcal/day`,
            type: 'neutral'
          }
        ],
        table: {
          title: 'Daily Energy Expenditure by Activity Level',
          columns: [
            { key: 'activity', label: 'Activity Level' },
            { key: 'calories', label: 'Daily Caloric Need' }
          ],
          data: [
            { activity: 'Basal Metabolic Rate (BMR)', calories: `${Math.round(bmr)} kcal` },
            { activity: 'Sedentary (Little or no exercise)', calories: `${Math.round(sedentary)} kcal` },
            { activity: 'Light Activity (Exercise 1-3 times/week)', calories: `${Math.round(light)} kcal` },
            { activity: 'Moderate Activity (Exercise 3-5 times/week)', calories: `${Math.round(moderate)} kcal` },
            { activity: 'Very Active (Intense daily exercise / physical job)', calories: `${Math.round(active)} kcal` }
          ]
        }
      };
    },
    formula: {
      expression: 'BMR (Men) = 10W + 6.25H - 5A + 5   |   BMR (Women) = 10W + 6.25H - 5A - 161',
      explanation: 'Where W is weight in kg, H is height in cm, and A is age in years.',
      variables: [
        { symbol: 'BMR', name: 'Basal Metabolic Rate', description: 'Minimum energy needed to sustain vital organ functions.' }
      ]
    },
    explanationSections: [
      {
        title: 'What is BMR?',
        content: 'Your BMR represents the number of calories your body burns performing essential life-sustaining functions such as breathing, circulation, cellular repair, and brain activity while lying in bed.'
      }
    ],
    faqs: [
      {
        question: 'Can you eat below your BMR to lose weight faster?',
        answer: 'Consistently eating significantly below your BMR can trigger metabolic slowdown, nutrient deficiencies, and lean muscle loss. Healthy deficits are applied relative to total TDEE rather than BMR.'
      }
    ],
    relatedIds: ['daily-calorie-calculator', 'bmi-calculator', 'ideal-weight-calculator'],
    disclaimerType: 'health'
  },

  // 3. DAILY CALORIE / TDEE CALCULATOR
  {
    id: 'daily-calorie-calculator',
    slug: 'daily-calorie-calculator',
    name: 'TDEE & Daily Calorie Needs Calculator',
    shortName: 'Daily Calorie Estimate',
    category: 'health',
    description: 'Estimate your Total Daily Energy Expenditure (TDEE) and caloric targets for weight loss, maintenance, or muscle gain.',
    iconName: 'Activity',
    popular: true,
    keywords: ['tdee', 'daily calories', 'calorie deficit', 'weight loss calories', 'macro targets', 'muscle gain calories', 'fitness'],
    inputs: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'female',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' }
        ]
      },
      {
        id: 'age',
        label: 'Age',
        type: 'slider',
        defaultValue: 26,
        min: 15,
        max: 85,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'weightKg',
        label: 'Weight (kg)',
        type: 'slider',
        defaultValue: 62,
        min: 35,
        max: 180,
        step: 0.5,
        suffix: ' kg'
      },
      {
        id: 'heightCm',
        label: 'Height (cm)',
        type: 'slider',
        defaultValue: 165,
        min: 120,
        max: 220,
        step: 1,
        suffix: ' cm'
      },
      {
        id: 'activityLevel',
        label: 'Physical Activity Level',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { label: 'Sedentary (Office job, minimal exercise)', value: 'sedentary' },
          { label: 'Lightly Active (1-3 workouts / week)', value: 'light' },
          { label: 'Moderately Active (3-5 workouts / week)', value: 'moderate' },
          { label: 'Very Active (6-7 intense workouts / week)', value: 'active' }
        ]
      }
    ],
    calculate: (inputs) => {
      const gender = inputs.gender || 'female';
      const age = Number(inputs.age) || 26;
      const w = Number(inputs.weightKg) || 62;
      const h = Number(inputs.heightCm) || 165;
      const act = inputs.activityLevel || 'moderate';

      let bmr = (10 * w) + (6.25 * h) - (5 * age);
      bmr += (gender === 'male' ? 5 : -161);

      const actMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
      };

      const tdee = bmr * (actMultipliers[act] || 1.55);
      const mildDeficit = tdee - 300;
      const weightLoss = tdee - 500;
      const muscleGain = tdee + 300;

      return {
        primaryMetric: {
          label: 'Maintenance Calories (TDEE)',
          value: Math.round(tdee),
          formattedValue: `${Math.round(tdee).toLocaleString()} kcal / day`,
          subtext: `Daily energy needed to maintain your current weight`,
          type: 'highlight',
          badge: `${act.toUpperCase()} Lifestyle`
        },
        secondaryMetrics: [
          {
            label: 'Weight Loss Target (-0.5 kg/wk)',
            value: Math.round(weightLoss),
            formattedValue: `${Math.round(weightLoss).toLocaleString()} kcal/day`,
            type: 'success',
            subtext: 'Safe 500 kcal deficit'
          },
          {
            label: 'Lean Muscle Gain Target',
            value: Math.round(muscleGain),
            formattedValue: `${Math.round(muscleGain).toLocaleString()} kcal/day`,
            type: 'neutral',
            subtext: '+300 kcal surplus'
          },
          {
            label: 'Basal Metabolic Rate (BMR)',
            value: Math.round(bmr),
            formattedValue: `${Math.round(bmr).toLocaleString()} kcal`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'TDEE = BMR × Activity Multiplier',
      explanation: 'Calculates Total Daily Energy Expenditure combining BMR, Non-Exercise Activity Thermogenesis (NEAT), and exercise.',
      variables: [
        { symbol: 'TDEE', name: 'Total Daily Energy Expenditure', description: 'Total calories burned in a 24-hour window.' }
      ]
    },
    explanationSections: [
      {
        title: 'How to Lose Weight Safely',
        content: 'A standard deficit of 500 kcal per day translates mathematically to approximately 3,500 kcal per week, resulting in a sustainable fat loss rate of about 0.5 kg (1 lb) per week without excessive hunger.'
      }
    ],
    faqs: [
      {
        question: 'Should I adjust my calorie targets as I lose weight?',
        answer: 'Yes. As your body weight decreases, your BMR and TDEE reduce slightly. Re-calculating every 4-5 kg ensures continuous progress.'
      }
    ],
    relatedIds: ['bmr-calculator', 'bmi-calculator', 'water-intake-calculator'],
    disclaimerType: 'health'
  },

  // 4. DAILY WATER INTAKE CALCULATOR
  {
    id: 'water-intake-calculator',
    slug: 'water-intake-calculator',
    name: 'Daily Water Intake & Hydration Calculator',
    shortName: 'Water Intake Estimate',
    category: 'health',
    description: 'Estimate your recommended daily water hydration volume in liters, fluid ounces, and standard 250ml glasses.',
    iconName: 'Droplets',
    popular: true,
    keywords: ['water intake', 'hydration', 'glasses of water', 'daily water', 'how much water should i drink', 'fluid intake'],
    inputs: [
      {
        id: 'weightKg',
        label: 'Body Weight (kg)',
        type: 'slider',
        defaultValue: 68,
        min: 30,
        max: 160,
        step: 1,
        suffix: ' kg'
      },
      {
        id: 'exerciseMinutes',
        label: 'Daily Exercise / Workout Duration',
        type: 'slider',
        defaultValue: 45,
        min: 0,
        max: 180,
        step: 15,
        suffix: ' Min'
      },
      {
        id: 'climate',
        label: 'Climate / Environment',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { label: 'Moderate / Air Conditioned', value: 'moderate' },
          { label: 'Hot / Humid / Tropical', value: 'hot' },
          { label: 'Cold / Winter', value: 'cold' }
        ]
      }
    ],
    calculate: (inputs) => {
      const w = Number(inputs.weightKg) || 68;
      const ex = Number(inputs.exerciseMinutes) || 45;
      const climate = inputs.climate || 'moderate';

      // Base hydration: ~35 ml per kg of body weight
      let waterMl = w * 35;

      // Add ~350ml for every 30 minutes of sweat-inducing exercise
      waterMl += (ex / 30) * 350;

      // Climate adjustment
      if (climate === 'hot') waterMl += 500;

      const waterLiters = waterMl / 1000;
      const glasses250ml = Math.round(waterMl / 250);
      const fluidOz = waterMl * 0.033814;

      return {
        primaryMetric: {
          label: 'Recommended Daily Water Intake',
          value: Number(waterLiters.toFixed(2)),
          formattedValue: `${waterLiters.toFixed(2)} Liters / day`,
          subtext: `Approximately ${glasses250ml} standard glasses (250ml each)`,
          type: 'highlight',
          badge: `${glasses250ml} Glasses / Day`
        },
        secondaryMetrics: [
          {
            label: 'Total Milliliters',
            value: Math.round(waterMl),
            formattedValue: `${Math.round(waterMl).toLocaleString()} mL`,
            type: 'neutral'
          },
          {
            label: 'Volume in Fluid Ounces',
            value: Math.round(fluidOz),
            formattedValue: `${Math.round(fluidOz)} fl oz`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Water (mL) = [Weight (kg) × 35] + [(Exercise Min / 30) × 350] + Climate Bonus',
      explanation: 'Scientifically calibrated hydration baseline accounting for metabolic body mass and perspiration losses.',
      variables: [
        { symbol: 'mL', name: 'Milliliters', description: 'Recommended liquid water intake.' }
      ]
    },
    explanationSections: [
      {
        title: 'The Importance of Proper Hydration',
        content: 'Adequate hydration supports physical endurance, mental concentration, kidney function, and healthy digestion throughout the day.'
      }
    ],
    faqs: [
      {
        question: 'Do tea and coffee count towards water intake?',
        answer: 'Yes, moderate consumption of coffee and herbal teas contributes to overall hydration, though pure water remains the ideal primary source.'
      }
    ],
    relatedIds: ['bmi-calculator', 'daily-calorie-calculator'],
    disclaimerType: 'health'
  },

  // 5. IDEAL BODY WEIGHT RANGE CALCULATOR
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight-calculator',
    name: 'Ideal Body Weight & Healthy Range Calculator',
    shortName: 'Healthy Weight Range',
    category: 'health',
    description: 'Calculate your ideal body weight based on scientific formulas (Devine, Robinson, Miller, and Hamwi equations) and BMI ranges.',
    iconName: 'Scale',
    popular: true,
    keywords: ['ideal weight', 'healthy weight range', 'devine formula', 'target weight', 'ideal body weight', 'ibw'],
    inputs: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      {
        id: 'heightCm',
        label: 'Height (cm)',
        type: 'slider',
        defaultValue: 178,
        min: 130,
        max: 220,
        step: 1,
        suffix: ' cm'
      }
    ],
    calculate: (inputs) => {
      const gender = inputs.gender || 'male';
      const hCm = Number(inputs.heightCm) || 178;

      const totalInches = hCm / 2.54;
      const inchesOver5Ft = Math.max(0, totalInches - 60);

      // Devine Formula:
      // Men: 50.0 kg + 2.3 kg per inch over 5 feet
      // Women: 45.5 kg + 2.3 kg per inch over 5 feet
      const devine = gender === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;

      // Robinson Formula:
      // Men: 52 kg + 1.9 kg per inch over 5 feet
      // Women: 49 kg + 1.7 kg per inch over 5 feet
      const robinson = gender === 'male' ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;

      // Miller Formula:
      // Men: 56.2 kg + 1.41 kg per inch over 5 feet
      // Women: 53.1 kg + 1.36 kg per inch over 5 feet
      const miller = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;

      // WHO Healthy BMI 18.5 - 24.9 window
      const hM = hCm / 100;
      const minBmiKg = 18.5 * (hM * hM);
      const maxBmiKg = 24.9 * (hM * hM);

      const avgIbw = (devine + robinson + miller) / 3;

      return {
        primaryMetric: {
          label: 'Ideal Body Weight (IBW Average)',
          value: Number(avgIbw.toFixed(1)),
          formattedValue: `${avgIbw.toFixed(1)} kg`,
          subtext: `Scientific range: ${minBmiKg.toFixed(1)} kg - ${maxBmiKg.toFixed(1)} kg`,
          type: 'highlight',
          badge: `Height: ${hCm} cm`
        },
        secondaryMetrics: [
          {
            label: 'Devine Formula (Clinical Standard)',
            value: Number(devine.toFixed(1)),
            formattedValue: `${devine.toFixed(1)} kg`,
            type: 'neutral'
          },
          {
            label: 'Robinson Formula',
            value: Number(robinson.toFixed(1)),
            formattedValue: `${robinson.toFixed(1)} kg`,
            type: 'neutral'
          },
          {
            label: 'Miller Formula',
            value: Number(miller.toFixed(1)),
            formattedValue: `${miller.toFixed(1)} kg`,
            type: 'neutral'
          }
        ],
        table: {
          title: 'Comparison of Clinical Ideal Weight Formulas',
          columns: [
            { key: 'formula', label: 'Equation Standard' },
            { key: 'weight', label: 'Estimated Ideal Weight' }
          ],
          data: [
            { formula: 'Devine Equation (1974 - Pharmacology Standard)', weight: `${devine.toFixed(1)} kg (${(devine * 2.20462).toFixed(1)} lbs)` },
            { formula: 'Robinson Equation (1983)', weight: `${robinson.toFixed(1)} kg (${(robinson * 2.20462).toFixed(1)} lbs)` },
            { formula: 'Miller Equation (1983)', weight: `${miller.toFixed(1)} kg (${(miller * 2.20462).toFixed(1)} lbs)` },
            { formula: 'WHO Healthy BMI Range (18.5 - 24.9)', weight: `${minBmiKg.toFixed(1)} - ${maxBmiKg.toFixed(1)} kg` }
          ]
        }
      };
    },
    formula: {
      expression: 'IBW (Devine Men) = 50 kg + 2.3 kg × (Height in inches - 60)',
      explanation: 'Clinical baseline standard used in medical pharmacology and nutritional medicine.',
      variables: [
        { symbol: 'IBW', name: 'Ideal Body Weight', description: 'Baseline weight for height.' }
      ]
    },
    explanationSections: [
      {
        title: 'Understanding Ideal Weight Formulas',
        content: 'These classical formulas were developed by physicians to determine appropriate clinical medication dosing and nutritional guidance.'
      }
    ],
    faqs: [
      {
        question: 'Why do formulas give slightly different results?',
        answer: 'Each formula was derived from distinct epidemiological sample studies with slightly varied baseline population weight assumptions.'
      }
    ],
    relatedIds: ['bmi-calculator', 'bmr-calculator', 'daily-calorie-calculator'],
    disclaimerType: 'health'
  }
];
