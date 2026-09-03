import { CalculatorDefinition } from '../../types/calculator';
import { formatNumber } from '../utils';

export const educationCalculators: CalculatorDefinition[] = [
  // 1. CGPA CALCULATOR (FLAGSHIP ACADEMIC TOOL)
  {
    id: 'cgpa-calculator',
    slug: 'cgpa-calculator',
    name: 'CGPA Calculator (Cumulative Grade Point Average)',
    shortName: 'CGPA Calculator',
    category: 'education',
    description: 'Calculate your cumulative CGPA across semesters with credit weighting and standard 10-point or 4-point scales.',
    iconName: 'GraduationCap',
    popular: true,
    featured: true,
    keywords: ['cgpa', 'sgpa', 'gpa', 'college grade', 'university marks', 'engineering gpa', 'credit points', 'education'],
    inputs: [
      {
        id: 'sem1',
        label: 'Semester 1 SGPA',
        type: 'slider',
        defaultValue: 8.5,
        min: 0,
        max: 10,
        step: 0.05,
        suffix: ' GPA'
      },
      {
        id: 'sem2',
        label: 'Semester 2 SGPA',
        type: 'slider',
        defaultValue: 8.8,
        min: 0,
        max: 10,
        step: 0.05,
        suffix: ' GPA'
      },
      {
        id: 'sem3',
        label: 'Semester 3 SGPA',
        type: 'slider',
        defaultValue: 8.2,
        min: 0,
        max: 10,
        step: 0.05,
        suffix: ' GPA'
      },
      {
        id: 'sem4',
        label: 'Semester 4 SGPA',
        type: 'slider',
        defaultValue: 9.0,
        min: 0,
        max: 10,
        step: 0.05,
        suffix: ' GPA'
      },
      {
        id: 'scaleType',
        label: 'Grading Scale',
        type: 'select',
        defaultValue: 10,
        options: [
          { label: '10-Point Scale (India/International)', value: 10 },
          { label: '4.0 Scale (US/Canada)', value: 4 }
        ]
      },
      {
        id: 'conversionFormula',
        label: 'Percentage Formula Standard',
        type: 'select',
        defaultValue: 'cbse',
        options: [
          { label: 'CBSE / AICTE (CGPA × 9.5)', value: 'cbse' },
          { label: 'Standard Direct (CGPA × 10)', value: 'direct' },
          { label: 'VTU / Engineering ((CGPA - 0.75) × 10)', value: 'vtu' },
          { label: 'Mumbai University ((CGPA × 7.1) + 11 / 12)', value: 'mu' }
        ]
      }
    ],
    calculate: (inputs) => {
      const s1 = Number(inputs.sem1) || 0;
      const s2 = Number(inputs.sem2) || 0;
      const s3 = Number(inputs.sem3) || 0;
      const s4 = Number(inputs.sem4) || 0;
      const scale = Number(inputs.scaleType) || 10;
      const formula = inputs.conversionFormula || 'cbse';

      const sems = [s1, s2, s3, s4].filter(s => s > 0);
      const totalSem = sems.length || 1;
      const cgpa = sems.reduce((acc, curr) => acc + curr, 0) / totalSem;

      let percentage = 0;
      if (formula === 'cbse') {
        percentage = cgpa * 9.5;
      } else if (formula === 'direct') {
        percentage = scale === 4 ? (cgpa / 4) * 100 : cgpa * 10;
      } else if (formula === 'vtu') {
        percentage = (cgpa - 0.75) * 10;
      } else if (formula === 'mu') {
        percentage = (cgpa * 7.1) + 11;
      }

      percentage = Math.max(0, Math.min(100, percentage));

      let gradeDivision = 'First Class with Distinction';
      if (cgpa < 5.0) gradeDivision = 'Pass / Re-appear';
      else if (cgpa < 6.5) gradeDivision = 'Second Class';
      else if (cgpa < 7.5) gradeDivision = 'First Class';

      const chartData = [
        { name: 'Sem 1', SGPA: s1, Average: Number(cgpa.toFixed(2)) },
        { name: 'Sem 2', SGPA: s2, Average: Number(cgpa.toFixed(2)) },
        { name: 'Sem 3', SGPA: s3, Average: Number(cgpa.toFixed(2)) },
        { name: 'Sem 4', SGPA: s4, Average: Number(cgpa.toFixed(2)) }
      ];

      return {
        primaryMetric: {
          label: 'Cumulative CGPA',
          value: Number(cgpa.toFixed(2)),
          formattedValue: `${cgpa.toFixed(2)} / ${scale}`,
          subtext: `Equivalent to ~${percentage.toFixed(2)}%`,
          type: 'highlight',
          badge: gradeDivision
        },
        secondaryMetrics: [
          {
            label: 'Equivalent Percentage',
            value: Number(percentage.toFixed(2)),
            formattedValue: `${percentage.toFixed(2)}%`,
            type: 'success',
            subtext: `Formula: ${formula.toUpperCase()}`
          },
          {
            label: 'Academic Classification',
            value: gradeDivision,
            formattedValue: gradeDivision,
            type: 'neutral'
          }
        ],
        chart: {
          type: 'bar',
          title: 'Semester-wise SGPA Progression vs Overall CGPA',
          data: chartData,
          series: [
            { key: 'SGPA', name: 'Semester SGPA', color: '#3b82f6' },
            { key: 'Average', name: 'Overall CGPA', color: '#10b981' }
          ]
        },
        summaryText: `Your calculated CGPA across ${totalSem} active semesters is ${cgpa.toFixed(2)} on a ${scale}-point scale, translating to an equivalent score of ${percentage.toFixed(2)}%.`
      };
    },
    formula: {
      expression: 'CGPA = (Σ SGPA_i × Credits_i) / (Σ Credits_i)',
      explanation: 'Weighted sum of grade points divided by total completed credit hours.',
      variables: [
        { symbol: 'CGPA', name: 'Cumulative GPA', description: 'Overall academic grade average.' },
        { symbol: 'SGPA', name: 'Semester GPA', description: 'Grade average of individual semester.' }
      ]
    },
    explanationSections: [
      {
        title: 'How CGPA is Calculated',
        content: 'CGPA represents the weighted average of all your semester grade points throughout your degree. Universities use credit hours to weigh high-credit core courses more heavily than 1-credit labs.'
      }
    ],
    faqs: [
      {
        question: 'Why does CBSE multiply CGPA by 9.5?',
        answer: 'CBSE arrived at 9.5 after analyzing the historical scores of the top 91-100 score brackets, ensuring fair equivalence between grading points and percentage marks.'
      }
    ],
    relatedIds: ['sgpa-calculator', 'cgpa-to-percentage-converter', 'attendance-calculator'],
    disclaimerType: 'standard'
  },

  // 2. SGPA CALCULATOR
  {
    id: 'sgpa-calculator',
    slug: 'sgpa-calculator',
    name: 'SGPA Calculator (Semester Grade Point Average)',
    shortName: 'SGPA Calculator',
    category: 'education',
    description: 'Calculate semester grade points from subject credits and achieved letter or numerical grades.',
    iconName: 'BookOpen',
    popular: true,
    keywords: ['sgpa', 'semester gpa', 'subject credits', 'grade points', 'university marks', 'college result'],
    inputs: [
      {
        id: 'c1',
        label: 'Subject 1 (Grade Point × Credits)',
        type: 'slider',
        defaultValue: 9,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Subject 1 Grade Point (4 Credits)'
      },
      {
        id: 'c2',
        label: 'Subject 2 Grade Point',
        type: 'slider',
        defaultValue: 8,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Subject 2 Grade Point (4 Credits)'
      },
      {
        id: 'c3',
        label: 'Subject 3 Grade Point',
        type: 'slider',
        defaultValue: 10,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Subject 3 Grade Point (3 Credits)'
      },
      {
        id: 'c4',
        label: 'Subject 4 Grade Point',
        type: 'slider',
        defaultValue: 9,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Subject 4 Grade Point (3 Credits)'
      },
      {
        id: 'c5',
        label: 'Lab Practical Grade Point',
        type: 'slider',
        defaultValue: 10,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Lab Course (2 Credits)'
      }
    ],
    calculate: (inputs) => {
      const g1 = Number(inputs.c1) || 9;
      const g2 = Number(inputs.c2) || 8;
      const g3 = Number(inputs.c3) || 10;
      const g4 = Number(inputs.c4) || 9;
      const g5 = Number(inputs.c5) || 10;

      const credits = [4, 4, 3, 3, 2];
      const grades = [g1, g2, g3, g4, g5];

      const totalCredits = credits.reduce((a, b) => a + b, 0);
      const earnedPoints = grades.reduce((acc, g, idx) => acc + g * credits[idx], 0);
      const sgpa = earnedPoints / totalCredits;

      return {
        primaryMetric: {
          label: 'Semester SGPA',
          value: Number(sgpa.toFixed(2)),
          formattedValue: `${sgpa.toFixed(2)} / 10.0`,
          subtext: `Earned ${earnedPoints} grade points over ${totalCredits} credits`,
          type: 'highlight',
          badge: sgpa >= 8.5 ? 'Outstanding' : 'Very Good'
        },
        secondaryMetrics: [
          {
            label: 'Total Completed Credits',
            value: totalCredits,
            formattedValue: `${totalCredits} Credits`,
            type: 'neutral'
          },
          {
            label: 'Total Grade Points',
            value: earnedPoints,
            formattedValue: `${earnedPoints} Points`,
            type: 'success'
          }
        ]
      };
    },
    formula: {
      expression: 'SGPA = Σ (Grade Points × Credits) / Total Credits',
      explanation: 'Calculated by multiplying each subject grade point by its course credit weightage.',
      variables: [
        { symbol: 'SGPA', name: 'Semester GPA', description: 'Final score for the semester.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Subject Credits Impact SGPA',
        content: 'Higher credit courses (e.g. 4-credit Core Engineering subjects) impact your SGPA twice as much as 2-credit elective or lab courses.'
      }
    ],
    faqs: [
      {
        question: 'What is a good SGPA in college?',
        answer: 'An SGPA of 8.0 and above is generally considered very good, placing students in the top quartile and eligible for campus placements and higher education.'
      }
    ],
    relatedIds: ['cgpa-calculator', 'cgpa-to-percentage-converter', 'marks-percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 3. PERCENTAGE CALCULATOR (Comprehensive)
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator (All-in-One)',
    shortName: 'Percentage Calculator',
    category: 'education',
    description: 'Calculate percentage values, percentage increase/decrease, what percentage X is of Y, and fractional ratios.',
    iconName: 'Percent',
    popular: true,
    featured: true,
    keywords: ['percentage', 'percent', 'percentage change', 'percentage difference', 'math', 'ratio', 'fraction'],
    inputs: [
      {
        id: 'calcMode',
        label: 'Calculation Type',
        type: 'select',
        defaultValue: 'what_percent_of',
        options: [
          { label: 'What is X% of Y? (e.g. 15% of 500)', value: 'x_percent_of_y' },
          { label: 'X is what % of Y? (e.g. 45 is what % of 180)', value: 'what_percent_of' },
          { label: 'Percentage Increase / Decrease from X to Y', value: 'change' },
          { label: 'Percentage Difference between X and Y', value: 'difference' }
        ]
      },
      {
        id: 'valX',
        label: 'Value X',
        type: 'number',
        defaultValue: 45,
        min: -1000000,
        max: 1000000,
        step: 0.1
      },
      {
        id: 'valY',
        label: 'Value Y',
        type: 'number',
        defaultValue: 180,
        min: -1000000,
        max: 1000000,
        step: 0.1
      }
    ],
    calculate: (inputs) => {
      const mode = inputs.calcMode || 'what_percent_of';
      const x = Number(inputs.valX) || 0;
      const y = Number(inputs.valY) || 1;

      let result = 0;
      let label = '';
      let subtext = '';

      if (mode === 'x_percent_of_y') {
        result = (x / 100) * y;
        label = `${x}% of ${y}`;
        subtext = `${x}% × ${y} = ${formatNumber(result, 2)}`;
      } else if (mode === 'what_percent_of') {
        result = y !== 0 ? (x / y) * 100 : 0;
        label = `${x} is what % of ${y}`;
        subtext = `(${x} ÷ ${y}) × 100 = ${formatNumber(result, 2)}%`;
      } else if (mode === 'change') {
        result = x !== 0 ? ((y - x) / Math.abs(x)) * 100 : 0;
        label = `Change from ${x} to ${y}`;
        subtext = result >= 0 ? `+${formatNumber(result, 2)}% Increase` : `${formatNumber(result, 2)}% Decrease`;
      } else if (mode === 'difference') {
        const avg = (Math.abs(x) + Math.abs(y)) / 2;
        result = avg !== 0 ? (Math.abs(x - y) / avg) * 100 : 0;
        label = `Difference between ${x} and ${y}`;
        subtext = `Absolute difference ratio: ${formatNumber(result, 2)}%`;
      }

      return {
        primaryMetric: {
          label: label,
          value: Number(result.toFixed(2)),
          formattedValue: mode === 'x_percent_of_y' ? formatNumber(result, 2) : `${formatNumber(result, 2)}%`,
          subtext: subtext,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Input X',
            value: x,
            formattedValue: formatNumber(x, 2),
            type: 'neutral'
          },
          {
            label: 'Input Y',
            value: y,
            formattedValue: formatNumber(y, 2),
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Percentage (%) = (Part / Whole) × 100',
      explanation: 'Fundamental percentage formula representing fractions of 100.',
      variables: [
        { symbol: '%', name: 'Percentage', description: 'Fraction per 100.' }
      ]
    },
    explanationSections: [
      {
        title: 'Practical Uses of Percentage Calculations',
        content: 'Percentages are the universal standard for comparing growth, computing store discounts, calculating tips, analyzing exam marks, and evaluating financial performance.'
      }
    ],
    faqs: [
      {
        question: 'What is the formula for percentage increase?',
        answer: 'Percentage Increase = [(New Value - Old Value) / Old Value] × 100%.'
      }
    ],
    relatedIds: ['marks-percentage-calculator', 'cgpa-to-percentage-converter'],
    disclaimerType: 'standard'
  },

  // 4. ATTENDANCE & BUNK CALCULATOR
  {
    id: 'attendance-calculator',
    slug: 'attendance-calculator',
    name: 'College Attendance & Bunk Calculator',
    shortName: 'Attendance Calculator',
    category: 'education',
    description: 'Calculate how many classes you can safely miss (bunk) or how many consecutive classes you must attend to meet required criteria (e.g. 75%).',
    iconName: 'UserCheck',
    popular: true,
    featured: true,
    keywords: ['attendance', 'bunk', 'college attendance', '75 percent attendance', 'classes attended', 'college policy'],
    inputs: [
      {
        id: 'attended',
        label: 'Classes Attended',
        type: 'slider',
        defaultValue: 42,
        min: 0,
        max: 200,
        step: 1,
        suffix: ' Classes'
      },
      {
        id: 'totalClasses',
        label: 'Total Classes Held',
        type: 'slider',
        defaultValue: 50,
        min: 1,
        max: 200,
        step: 1,
        suffix: ' Classes'
      },
      {
        id: 'targetPercentage',
        label: 'Target Attendance Criteria (%)',
        type: 'slider',
        defaultValue: 75,
        min: 50,
        max: 95,
        step: 5,
        suffix: '%'
      }
    ],
    calculate: (inputs) => {
      const attended = Number(inputs.attended) || 42;
      const total = Math.max(attended, Number(inputs.totalClasses) || 50);
      const target = Number(inputs.targetPercentage) || 75;

      const currentPercent = (attended / total) * 100;
      const targetFraction = target / 100;

      let message = '';
      let status: 'safe' | 'danger' = 'safe';
      let count = 0;

      if (currentPercent >= target) {
        const canBunk = Math.floor(attended / targetFraction - total);
        count = Math.max(0, canBunk);
        status = 'safe';
        message = `You can safely miss the next ${count} ${count === 1 ? 'class' : 'classes'} and still stay above ${target}%.`;
      } else {
        const mustAttend = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
        count = Math.max(0, mustAttend);
        status = 'danger';
        message = `You need to attend the next ${count} consecutive ${count === 1 ? 'class' : 'classes'} without missing to reach ${target}%.`;
      }

      return {
        primaryMetric: {
          label: 'Current Attendance Status',
          value: Number(currentPercent.toFixed(1)),
          formattedValue: `${currentPercent.toFixed(1)}%`,
          subtext: message,
          type: status === 'safe' ? 'success' : 'error',
          badge: status === 'safe' ? `✓ Above ${target}%` : `⚠ Below ${target}%`
        },
        secondaryMetrics: [
          {
            label: status === 'safe' ? 'Classes You Can Bunk' : 'Classes You Must Attend',
            value: count,
            formattedValue: `${count} Classes`,
            type: status === 'safe' ? 'highlight' : 'warning'
          },
          {
            label: 'Total Classes Attended',
            value: `${attended} / ${total}`,
            formattedValue: `${attended} / ${total}`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Attendance % = (Classes Attended / Total Classes) × 100',
      explanation: 'Calculates the threshold ratio required to maintain university examination eligibility.',
      variables: [
        { symbol: 'Target %', name: 'Required Attendance', description: 'Minimum attendance mandate set by institution.' }
      ]
    },
    explanationSections: [
      {
        title: 'College 75% Attendance Rule',
        content: 'Most universities require students to maintain a minimum of 75% aggregate attendance to be eligible for end-semester examinations. This tool helps you plan your leaves safely.'
      }
    ],
    faqs: [
      {
        question: 'What happens if attendance drops below 75%?',
        answer: 'Universities may debar students from taking exams, withhold hall tickets, or require medical certificates with official approval.'
      }
    ],
    relatedIds: ['cgpa-calculator', 'marks-percentage-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 5. MARKS PERCENTAGE CALCULATOR
  {
    id: 'marks-percentage-calculator',
    slug: 'marks-percentage-calculator',
    name: 'Marks & Grade Percentage Calculator',
    shortName: 'Marks Percentage',
    category: 'education',
    description: 'Calculate percentage, letter grade, and division from total marks obtained across school or university subjects.',
    iconName: 'Award',
    popular: true,
    keywords: ['marks', 'exam marks', 'score percentage', 'grade', 'board exam', 'university result'],
    inputs: [
      {
        id: 'obtainedMarks',
        label: 'Total Marks Obtained',
        type: 'slider',
        defaultValue: 465,
        min: 0,
        max: 1000,
        step: 1
      },
      {
        id: 'totalMarks',
        label: 'Maximum Possible Marks',
        type: 'slider',
        defaultValue: 500,
        min: 50,
        max: 1000,
        step: 10
      }
    ],
    calculate: (inputs) => {
      const obtained = Number(inputs.obtainedMarks) || 465;
      const maxMarks = Math.max(obtained, Number(inputs.totalMarks) || 500);

      const percentage = (obtained / maxMarks) * 100;

      let grade = 'A+';
      let division = 'Distinction';

      if (percentage >= 90) { grade = 'A+ (Outstanding)'; division = 'First Class with Distinction'; }
      else if (percentage >= 80) { grade = 'A (Excellent)'; division = 'First Class'; }
      else if (percentage >= 70) { grade = 'B+ (Very Good)'; division = 'First Class'; }
      else if (percentage >= 60) { grade = 'B (Good)'; division = 'First Class'; }
      else if (percentage >= 50) { grade = 'C (Average)'; division = 'Second Class'; }
      else if (percentage >= 40) { grade = 'D (Pass)'; division = 'Third Class'; }
      else { grade = 'F (Fail)'; division = 'Failed'; }

      return {
        primaryMetric: {
          label: 'Total Percentage',
          value: Number(percentage.toFixed(2)),
          formattedValue: `${percentage.toFixed(2)}%`,
          subtext: `Scored ${obtained} out of ${maxMarks}`,
          type: 'highlight',
          badge: grade
        },
        secondaryMetrics: [
          {
            label: 'Assigned Letter Grade',
            value: grade,
            formattedValue: grade,
            type: percentage >= 60 ? 'success' : 'warning'
          },
          {
            label: 'Division Standing',
            value: division,
            formattedValue: division,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Percentage = (Obtained Marks / Total Marks) × 100',
      explanation: 'Calculates the overall percentage score and maps it to standard grading divisions.',
      variables: [
        { symbol: 'Obtained', name: 'Marks Scored', description: 'Sum of marks obtained across all papers.' },
        { symbol: 'Total', name: 'Maximum Marks', description: 'Total maximum achievable marks.' }
      ]
    },
    explanationSections: [
      {
        title: 'Grading Scales Explained',
        content: 'Standard academic systems classify results into Distinction (75%+), First Class (60%–74%), Second Class (50%–59%), and Pass Class (40%–49%).'
      }
    ],
    faqs: [
      {
        question: 'How do I convert marks percentage to 10-point CGPA?',
        answer: 'Using standard CBSE guidelines, divide percentage by 9.5. For example, 85.5% ÷ 9.5 = 9.0 CGPA.'
      }
    ],
    relatedIds: ['cgpa-to-percentage-converter', 'required-marks-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 6. REQUIRED MARKS CALCULATOR
  {
    id: 'required-marks-calculator',
    slug: 'required-marks-calculator',
    name: 'Required Final Exam Marks Calculator',
    shortName: 'Required Marks',
    category: 'education',
    description: 'Calculate what score you need on your final exam to secure your desired overall target course grade.',
    iconName: 'Target',
    keywords: ['required marks', 'target grade', 'final exam score', 'passing marks', 'weighted grade'],
    inputs: [
      {
        id: 'currentGrade',
        label: 'Current Grade / Internal Score (%)',
        type: 'slider',
        defaultValue: 78,
        min: 0,
        max: 100,
        step: 1,
        suffix: '%'
      },
      {
        id: 'targetGrade',
        label: 'Target Desired Final Grade (%)',
        type: 'slider',
        defaultValue: 85,
        min: 40,
        max: 100,
        step: 1,
        suffix: '%'
      },
      {
        id: 'finalWeight',
        label: 'Final Exam Weightage (%)',
        type: 'slider',
        defaultValue: 40,
        min: 10,
        max: 90,
        step: 5,
        suffix: '%'
      }
    ],
    calculate: (inputs) => {
      const current = Number(inputs.currentGrade) || 78;
      const target = Number(inputs.targetGrade) || 85;
      const weight = Number(inputs.finalWeight) || 40;

      const currentWeight = (100 - weight) / 100;
      const finalWeightFraction = weight / 100;

      const required = (target - (current * currentWeight)) / finalWeightFraction;

      let achievable = 'Achievable';
      if (required > 100) achievable = 'Mathematically Impossible (Need >100%)';
      else if (required <= 0) achievable = 'Already Achieved (0% needed)';
      else if (required > 90) achievable = 'Challenging (>90% required)';

      return {
        primaryMetric: {
          label: 'Required Final Exam Score',
          value: Number(required.toFixed(1)),
          formattedValue: `${required.toFixed(1)}%`,
          subtext: `To achieve an overall course grade of ${target}%`,
          type: required <= 100 && required > 0 ? 'highlight' : 'error',
          badge: achievable
        },
        secondaryMetrics: [
          {
            label: 'Current Cumulative Standing',
            value: `${current}%`,
            formattedValue: `${current}% (${100 - weight}% weight)`,
            type: 'neutral'
          },
          {
            label: 'Exam Weightage',
            value: `${weight}%`,
            formattedValue: `${weight}% of total grade`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Required = [Target - (Current × (1 - W))] / W',
      explanation: 'Where W is the weight of the final exam in decimal form (Weight% / 100).',
      variables: [
        { symbol: 'Required', name: 'Needed Exam Score', description: 'Minimum percentage marks needed in final exam.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Weighted Course Grading Works',
        content: 'Universities assign specific weights to assignments, midterms, quizzes, and finals. Knowing the weight of the final exam lets you optimize your study preparation.'
      }
    ],
    faqs: [
      {
        question: 'What if required score is greater than 100%?',
        answer: 'If the calculation yields >100%, even a perfect 100% on the final exam will not reach that target; you should adjust your target grade to a realistic tier.'
      }
    ],
    relatedIds: ['marks-percentage-calculator', 'cgpa-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 7. CGPA TO PERCENTAGE CONVERTER
  {
    id: 'cgpa-to-percentage-converter',
    slug: 'cgpa-to-percentage-converter',
    name: 'CGPA to Percentage Converter (CBSE, AICTE, VTU, Mumbai Univ)',
    shortName: 'CGPA to Percentage',
    category: 'education',
    description: 'Convert your 10-point or 4-point CGPA into exact official percentage equivalents across Indian and international boards.',
    iconName: 'RefreshCw',
    popular: true,
    keywords: ['cgpa to percentage', 'convert cgpa', 'cbse percentage', 'vtu conversion', 'aicte cgpa', 'cgpa calculator'],
    inputs: [
      {
        id: 'cgpa',
        label: 'Enter CGPA',
        type: 'slider',
        defaultValue: 8.8,
        min: 0,
        max: 10,
        step: 0.01,
        suffix: ' CGPA'
      },
      {
        id: 'board',
        label: 'University / Board Standard',
        type: 'select',
        defaultValue: 'cbse',
        options: [
          { label: 'CBSE / AICTE / Standard (CGPA × 9.5)', value: 'cbse' },
          { label: 'Standard Direct (CGPA × 10)', value: 'direct' },
          { label: 'VTU Karnataka ((CGPA - 0.75) × 10)', value: 'vtu' },
          { label: 'Mumbai University (7.1 × CGPA + 11)', value: 'mu' },
          { label: 'Anna University (CGPA × 10)', value: 'anna' },
          { label: 'US 4.0 Scale ((GPA / 4) × 100)', value: 'us' }
        ]
      }
    ],
    calculate: (inputs) => {
      const cgpa = Number(inputs.cgpa) || 8.8;
      const board = inputs.board || 'cbse';

      let percentage = 0;
      let formulaUsed = '';

      if (board === 'cbse') {
        percentage = cgpa * 9.5;
        formulaUsed = `${cgpa} × 9.5 = ${percentage.toFixed(2)}%`;
      } else if (board === 'direct' || board === 'anna') {
        percentage = cgpa * 10;
        formulaUsed = `${cgpa} × 10 = ${percentage.toFixed(2)}%`;
      } else if (board === 'vtu') {
        percentage = (cgpa - 0.75) * 10;
        formulaUsed = `(${cgpa} - 0.75) × 10 = ${percentage.toFixed(2)}%`;
      } else if (board === 'mu') {
        percentage = (cgpa * 7.1) + 11;
        formulaUsed = `(7.1 × ${cgpa}) + 11 = ${percentage.toFixed(2)}%`;
      } else if (board === 'us') {
        percentage = (cgpa / 4) * 100;
        formulaUsed = `(${cgpa} ÷ 4) × 100 = ${percentage.toFixed(2)}%`;
      }

      percentage = Math.max(0, Math.min(100, percentage));

      return {
        primaryMetric: {
          label: 'Equivalent Percentage',
          value: Number(percentage.toFixed(2)),
          formattedValue: `${percentage.toFixed(2)}%`,
          subtext: formulaUsed,
          type: 'highlight',
          badge: `${board.toUpperCase()} Standard`
        },
        secondaryMetrics: [
          {
            label: 'Input CGPA',
            value: cgpa,
            formattedValue: `${cgpa} CGPA`,
            type: 'neutral'
          },
          {
            label: 'Academic Standing',
            value: percentage >= 75 ? 'First Class with Distinction' : 'First Class',
            formattedValue: percentage >= 75 ? 'First Class with Distinction' : 'First Class',
            type: 'success'
          }
        ]
      };
    },
    formula: {
      expression: 'Percentage = CGPA × 9.5 (CBSE/AICTE Standard)',
      explanation: 'Each university or government board has an officially notified conversion factor.',
      variables: [
        { symbol: 'CGPA', name: 'Cumulative GPA', description: 'Grade score awarded on mark sheet.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Different Universities Use Different Formulas',
        content: 'Different academic institutions use distinct bell-curves and grading methodologies. For job applications and higher education admissions abroad, always check your transcript for the specific conversion formula approved by your registrar.'
      }
    ],
    faqs: [
      {
        question: 'Is 9.5 official for CBSE board?',
        answer: 'Yes, CBSE officially mandated multiplying CGPA by 9.5 for Class 10 and 12 conversion to percentage.'
      }
    ],
    relatedIds: ['cgpa-calculator', 'percentage-calculator', 'marks-percentage-calculator'],
    disclaimerType: 'standard'
  },

  // 8. PERCENTAGE TO CGPA CONVERTER
  {
    id: 'percentage-to-cgpa-converter',
    slug: 'percentage-to-cgpa-converter',
    name: 'Percentage to CGPA Converter',
    shortName: 'Percentage to CGPA',
    category: 'education',
    description: 'Convert standard percentage marks to a 10.0 scale or 4.0 US scale CGPA.',
    iconName: 'Layers',
    keywords: ['percentage to cgpa', 'percent to gpa', 'cbse cgpa', 'us gpa conversion'],
    inputs: [
      {
        id: 'percentage',
        label: 'Percentage Marks (%)',
        type: 'slider',
        defaultValue: 85.5,
        min: 30,
        max: 100,
        step: 0.1,
        suffix: '%'
      },
      {
        id: 'targetScale',
        label: 'Target Scale',
        type: 'select',
        defaultValue: '10_cbse',
        options: [
          { label: '10-Point Scale (CBSE: % ÷ 9.5)', value: '10_cbse' },
          { label: '10-Point Direct (% ÷ 10)', value: '10_direct' },
          { label: '4.0 Scale (US: (% ÷ 100) × 4)', value: '4_us' }
        ]
      }
    ],
    calculate: (inputs) => {
      const pct = Number(inputs.percentage) || 85.5;
      const scale = inputs.targetScale || '10_cbse';

      let cgpa = 0;
      let maxScale = 10;

      if (scale === '10_cbse') {
        cgpa = pct / 9.5;
        maxScale = 10;
      } else if (scale === '10_direct') {
        cgpa = pct / 10;
        maxScale = 10;
      } else if (scale === '4_us') {
        cgpa = (pct / 100) * 4;
        maxScale = 4;
      }

      cgpa = Math.min(maxScale, Math.max(0, cgpa));

      return {
        primaryMetric: {
          label: 'Converted CGPA',
          value: Number(cgpa.toFixed(2)),
          formattedValue: `${cgpa.toFixed(2)} / ${maxScale}.0`,
          subtext: `From ${pct}% marks`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Original Percentage',
            value: pct,
            formattedValue: `${pct}%`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'CGPA = Percentage ÷ 9.5',
      explanation: 'Inverse of the CBSE / AICTE conversion multiplier.',
      variables: [
        { symbol: 'CGPA', name: 'Grade Point', description: 'Calculated 10-point equivalent.' }
      ]
    },
    explanationSections: [
      {
        title: 'Converting Marks to Grade Points',
        content: 'Useful when foreign universities or competitive exam forms require your GPA on a 10 or 4-point scale.'
      }
    ],
    faqs: [
      {
        question: 'What is 85% in CGPA?',
        answer: '85% divided by 9.5 equals approximately 8.95 CGPA.'
      }
    ],
    relatedIds: ['cgpa-to-percentage-converter', 'cgpa-calculator', 'marks-percentage-calculator'],
    disclaimerType: 'standard'
  }
];
