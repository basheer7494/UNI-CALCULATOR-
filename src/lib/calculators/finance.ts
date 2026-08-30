import { CalculatorDefinition } from '../../types/calculator';
import { formatCurrency, formatNumber } from '../utils';

export const financeCalculators: CalculatorDefinition[] = [
  // 1. SIP CALCULATOR
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    name: 'SIP Calculator (Systematic Investment Plan)',
    shortName: 'SIP Calculator',
    category: 'finance',
    description: 'Calculate future wealth and expected returns on your monthly mutual fund SIP investments.',
    iconName: 'TrendingUp',
    popular: true,
    featured: true,
    keywords: ['sip', 'mutual fund', 'systematic investment', 'wealth', 'investment', 'compound growth', 'monthly savings'],
    inputs: [
      {
        id: 'monthlyInvestment',
        label: 'Monthly Investment',
        type: 'slider',
        defaultValue: 10000,
        min: 500,
        max: 500000,
        step: 500,
        prefix: 'currency',
        helpText: 'Amount you plan to invest every month'
      },
      {
        id: 'expectedReturnRate',
        label: 'Expected Return Rate (p.a.)',
        type: 'slider',
        defaultValue: 12,
        min: 1,
        max: 30,
        step: 0.5,
        suffix: '%',
        helpText: 'Historical equity mutual fund return benchmark is 12-15%'
      },
      {
        id: 'timePeriod',
        label: 'Investment Period',
        type: 'slider',
        defaultValue: 10,
        min: 1,
        max: 40,
        step: 1,
        suffix: ' Years',
        helpText: 'Number of years you plan to stay invested'
      },
      {
        id: 'stepUpRate',
        label: 'Annual Step-Up (Optional)',
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 25,
        step: 1,
        suffix: '%',
        helpText: 'Increase your monthly SIP each year as your income grows'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P0 = inputs.monthlyInvestment !== undefined && !isNaN(Number(inputs.monthlyInvestment)) ? Math.max(0, Number(inputs.monthlyInvestment)) : 10000;
      const annualRate = inputs.expectedReturnRate !== undefined && !isNaN(Number(inputs.expectedReturnRate)) ? Math.max(0, Math.min(100, Number(inputs.expectedReturnRate))) : 12;
      const years = Math.min(50, Math.max(1, Math.round(Number(inputs.timePeriod) || 10)));
      const stepUp = Math.min(100, Math.max(0, Number(inputs.stepUpRate) || 0));
      
      const r = annualRate / 100 / 12; // monthly rate
      const totalMonths = years * 12;

      let totalInvested = 0;
      let futureValue = 0;
      const chartData = [];
      const tableData = [];

      let currentMonthly = P0;

      for (let y = 1; y <= years; y++) {
        let yearlyInvestment = 0;
        for (let m = 1; m <= 12; m++) {
          totalInvested += currentMonthly;
          yearlyInvestment += currentMonthly;
          futureValue = (futureValue + currentMonthly) * (1 + r);
        }

        const estGain = Math.max(0, futureValue - totalInvested);

        chartData.push({
          name: `Yr ${y}`,
          'Total Invested': Math.round(totalInvested),
          'Future Value': Math.round(futureValue),
          'Wealth Gain': Math.round(estGain)
        });

        tableData.push({
          year: `Year ${y}`,
          monthlyAmount: formatCurrency(currentMonthly, currency),
          yearlyInvested: formatCurrency(yearlyInvestment, currency),
          totalInvested: formatCurrency(totalInvested, currency),
          totalValue: formatCurrency(Math.round(futureValue), currency),
          returns: formatCurrency(Math.round(estGain), currency)
        });

        if (stepUp > 0) {
          currentMonthly = Math.round(currentMonthly * (1 + stepUp / 100));
        }
      }

      const totalReturns = Math.max(0, futureValue - totalInvested);
      const returnRatio = totalInvested > 0 ? (futureValue / totalInvested).toFixed(2) : '1.00';
      const investedPct = futureValue > 0 ? Math.round((totalInvested / futureValue) * 100) : 50;
      const returnsPct = futureValue > 0 ? Math.round((totalReturns / futureValue) * 100) : 50;

      return {
        primaryMetric: {
          label: 'Total Expected Value',
          value: Math.round(futureValue),
          formattedValue: formatCurrency(Math.round(futureValue), currency),
          subtext: `Earned ${returnRatio}x on your total principal`,
          type: 'highlight',
          badge: `${years} Years @ ${annualRate}%`
        },
        secondaryMetrics: [
          {
            label: 'Total Amount Invested',
            value: Math.round(totalInvested),
            formattedValue: formatCurrency(Math.round(totalInvested), currency),
            type: 'neutral'
          },
          {
            label: 'Estimated Wealth Gain',
            value: Math.round(totalReturns),
            formattedValue: formatCurrency(Math.round(totalReturns), currency),
            type: 'success',
            subtext: `${((totalReturns / (futureValue || 1)) * 100).toFixed(1)}% of total corpus`
          }
        ],
        breakdown: [
          {
            label: 'Invested Amount',
            value: Math.round(totalInvested),
            formattedValue: formatCurrency(Math.round(totalInvested), currency),
            percentage: investedPct,
            color: '#3b82f6'
          },
          {
            label: 'Estimated Returns',
            value: Math.round(totalReturns),
            formattedValue: formatCurrency(Math.round(totalReturns), currency),
            percentage: returnsPct,
            color: '#10b981'
          }
        ],
        chart: {
          type: 'area',
          title: 'SIP Growth Over Time',
          data: chartData,
          series: [
            { key: 'Total Invested', name: 'Total Invested', color: '#3b82f6' },
            { key: 'Future Value', name: 'Future Value', color: '#10b981' }
          ]
        },
        table: {
          title: 'Year-by-Year Wealth Progression',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'totalInvested', label: 'Total Invested' },
            { key: 'returns', label: 'Est. Gain' },
            { key: 'totalValue', label: 'Total Value' }
          ],
          data: tableData
        },
        summaryText: `Investing ${formatCurrency(P0, currency)}/month for ${years} years at an expected ${annualRate}% return could yield an estimated future value of ${formatCurrency(Math.round(futureValue), currency)}.`
      };
    },
    formula: {
      expression: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
      explanation: 'Where M is the future maturity amount, P is monthly investment, i is periodic monthly rate (Annual Rate / 12 / 100), and n is the total number of months.',
      variables: [
        { symbol: 'M', name: 'Maturity Amount', description: 'Total corpus accumulated at the end of the tenure.' },
        { symbol: 'P', name: 'Monthly Investment', description: 'Periodic deposit made at the start of each month.' },
        { symbol: 'i', name: 'Monthly Interest Rate', description: 'Annual expected return divided by 1200.' },
        { symbol: 'n', name: 'Number of Months', description: 'Total number of monthly contributions (Years × 12).' }
      ]
    },
    explanationSections: [
      {
        title: 'What is a Systematic Investment Plan (SIP)?',
        content: 'A Systematic Investment Plan (SIP) allows investors to invest a fixed amount regularly into mutual funds or asset portfolios. Instead of timing the volatile markets with a lump-sum amount, SIP leverages Rupee/Dollar Cost Averaging and the power of compound interest.'
      },
      {
        title: 'How Compounding Supercharges SIPs',
        content: 'In the early years of a SIP, capital contributions form the majority of your portfolio. Over 10-20 years, the exponential power of compounding kicks in—your accumulated gains generate their own returns, multiplying your wealth without requiring proportional extra work.'
      },
      {
        title: 'Why Step-Up SIPs are Game-Changers',
        content: 'A Step-Up SIP increases your monthly contribution annually (typically 5%–10% to match salary hikes). Even a modest 10% annual step-up can double your final retirement corpus compared to a static SIP over 15+ years.'
      }
    ],
    example: {
      title: 'Real-World Example: 15-Year Growth',
      scenario: 'Suppose you invest ₹10,000 per month in an equity index fund providing a 12% annualized return for 15 years.',
      steps: [
        { step: '1. Total Principal Invested', calculation: '₹10,000 × 180 months', result: '₹18,00,000' },
        { step: '2. Monthly Rate & Compounding', calculation: 'i = 12 / 1200 = 0.01, n = 180', result: '(1.01)^180 ≈ 5.9958' },
        { step: '3. Final Accumulated Wealth', calculation: '10,000 × [(5.9958 - 1) / 0.01] × 1.01', result: '₹50,45,760' }
      ],
      conclusion: 'Your ₹18,00,000 principal creates a total corpus of ~₹50.45 Lakhs, generating over ₹32.45 Lakhs in pure compound returns.'
    },
    faqs: [
      {
        question: 'Are returns from SIP guaranteed?',
        answer: 'No. Mutual fund SIP returns depend on market movements and asset allocation. Historical long-term equity returns typically range between 12% and 15% p.a., but actual future returns may vary.'
      },
      {
        question: 'Can I change my monthly SIP amount or stop anytime?',
        answer: 'Yes! Open-ended mutual fund SIPs offer full flexibility. You can pause, modify, or redeem your holdings at any point without strict lock-in periods (except for tax-saving ELSS funds which have a 3-year lock-in).'
      },
      {
        question: 'What is the best date of the month to invest in SIP?',
        answer: 'Over a multi-year horizon (5+ years), historical data proves that the specific date of the month has a negligible impact on overall portfolio returns due to rupee-cost averaging.'
      }
    ],
    relatedIds: ['swp-calculator', 'lump-sum-calculator', 'compound-interest-calculator', 'emi-calculator', 'cagr-calculator'],
    disclaimerType: 'financial'
  },

  // 2. EMI CALCULATOR
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    name: 'EMI Calculator (Home, Car & Personal Loan)',
    shortName: 'EMI Calculator',
    category: 'finance',
    description: 'Calculate Equated Monthly Installment (EMI), total interest payable, and full amortization schedule for any loan.',
    iconName: 'CreditCard',
    popular: true,
    featured: true,
    keywords: ['emi', 'loan', 'home loan', 'car loan', 'personal loan', 'interest', 'amortization', 'mortgage'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount',
        type: 'slider',
        defaultValue: 2500000,
        min: 10000,
        max: 20000000,
        step: 50000,
        prefix: 'currency',
        helpText: 'Principal loan amount borrowed'
      },
      {
        id: 'interestRate',
        label: 'Interest Rate (p.a.)',
        type: 'slider',
        defaultValue: 8.5,
        min: 4,
        max: 24,
        step: 0.1,
        suffix: '%',
        helpText: 'Annual reducing interest rate'
      },
      {
        id: 'tenureYears',
        label: 'Loan Tenure',
        type: 'slider',
        defaultValue: 20,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' Years',
        helpText: 'Duration of loan in years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = inputs.loanAmount !== undefined && !isNaN(Number(inputs.loanAmount)) ? Math.max(0, Number(inputs.loanAmount)) : 2500000;
      const annualRate = inputs.interestRate !== undefined && !isNaN(Number(inputs.interestRate)) ? Math.max(0, Math.min(100, Number(inputs.interestRate))) : 8.5;
      const years = Math.min(50, Math.max(1, Math.round(Number(inputs.tenureYears) || 20)));

      const r = annualRate / 12 / 100;
      const n = years * 12;

      let emi = 0;
      if (P === 0) {
        emi = 0;
      } else if (r > 0) {
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        emi = P / n;
      }

      const totalPayment = emi * n;
      const totalInterest = Math.max(0, totalPayment - P);
      const principalPct = totalPayment > 0 ? Math.round((P / totalPayment) * 100) : 100;
      const interestPct = totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;

      // Amortization schedule (yearly summary)
      let balance = P;
      const chartData = [];
      const tableData = [];

      for (let y = 1; y <= years; y++) {
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;

        for (let m = 1; m <= 12; m++) {
          const interestMonth = balance * r;
          const principalMonth = emi - interestMonth;
          yearlyInterest += interestMonth;
          yearlyPrincipal += principalMonth;
          balance = Math.max(0, balance - principalMonth);
        }

        chartData.push({
          name: `Yr ${y}`,
          'Remaining Balance': Math.round(balance),
          'Principal Paid': Math.round(P - balance),
          'Interest Paid': Math.round(yearlyInterest * y)
        });

        tableData.push({
          year: `Year ${y}`,
          emi: formatCurrency(Math.round(emi * 12), currency),
          principal: formatCurrency(Math.round(yearlyPrincipal), currency),
          interest: formatCurrency(Math.round(yearlyInterest), currency),
          balance: formatCurrency(Math.round(balance), currency)
        });
      }

      return {
        primaryMetric: {
          label: 'Monthly Loan EMI',
          value: Math.round(emi),
          formattedValue: formatCurrency(Math.round(emi), currency),
          subtext: `Total payment: ${formatCurrency(Math.round(totalPayment), currency)}`,
          type: 'highlight',
          badge: `${years} Years @ ${annualRate}%`
        },
        secondaryMetrics: [
          {
            label: 'Principal Loan Amount',
            value: Math.round(P),
            formattedValue: formatCurrency(Math.round(P), currency),
            type: 'neutral'
          },
          {
            label: 'Total Interest Payable',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            type: 'warning',
            subtext: `${P > 0 ? ((totalInterest / P) * 100).toFixed(1) : '0'}% of principal`
          }
        ],
        breakdown: [
          {
            label: 'Principal Amount',
            value: Math.round(P),
            formattedValue: formatCurrency(Math.round(P), currency),
            percentage: principalPct,
            color: '#3b82f6'
          },
          {
            label: 'Total Interest',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            percentage: interestPct,
            color: '#f59e0b'
          }
        ],
        chart: {
          type: 'area',
          title: 'Loan Balance Amortization Over Time',
          data: chartData,
          series: [
            { key: 'Remaining Balance', name: 'Remaining Balance', color: '#ef4444' },
            { key: 'Principal Paid', name: 'Principal Repaid', color: '#10b981' }
          ]
        },
        table: {
          title: 'Yearly Loan Amortization Schedule',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'principal', label: 'Principal Paid' },
            { key: 'interest', label: 'Interest Paid' },
            { key: 'balance', label: 'Remaining Balance' }
          ],
          data: tableData
        },
        summaryText: `For a ${formatCurrency(P, currency)} loan at ${annualRate}% interest for ${years} years, your monthly EMI is ${formatCurrency(Math.round(emi), currency)}. Total interest paid will be ${formatCurrency(Math.round(totalInterest), currency)}.`
      };
    },
    formula: {
      expression: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
      explanation: 'Where P is loan principal, r is monthly reducing interest rate (annual % / 1200), and n is loan duration in months.',
      variables: [
        { symbol: 'EMI', name: 'Equated Monthly Installment', description: 'Fixed monthly repayment amount throughout loan term.' },
        { symbol: 'P', name: 'Loan Principal', description: 'Total initial amount borrowed from the bank.' },
        { symbol: 'r', name: 'Monthly Interest Rate', description: 'Annual interest rate divided by 1200.' },
        { symbol: 'n', name: 'Tenure in Months', description: 'Total number of monthly installments.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Loan Amortization Works',
        content: 'In the initial months of your loan tenure, a significant portion of your monthly EMI goes towards paying interest charges. As the principal balance reduces over time, a progressively higher percentage of each EMI goes towards reducing the actual principal loan amount.'
      },
      {
        title: 'How to Reduce Your Total Loan Interest',
        content: 'Making occasional principal prepayments (even 1 extra EMI per year) or opting for a shorter tenure can dramatically slash total interest burden and reduce loan duration by multiple years.'
      }
    ],
    example: {
      title: 'Example: ₹30,00,000 Home Loan',
      scenario: 'Loan of ₹30,00,000 at 8.5% p.a. for a 20-year term (240 months).',
      steps: [
        { step: '1. Monthly rate (r)', calculation: '8.5 / 1200', result: '0.007083' },
        { step: '2. Compound multiplier (1+r)^n', calculation: '(1 + 0.007083)^240', result: '5.4042' },
        { step: '3. Calculate Monthly EMI', calculation: '[30,00,000 × 0.007083 × 5.4042] / (5.4042 - 1)', result: '₹26,035/mo' }
      ],
      conclusion: 'Total amount paid across 20 years is ₹62,48,335, of which ₹32,48,335 is interest.'
    },
    faqs: [
      {
        question: 'What is the difference between fixed and floating rate loans?',
        answer: 'A fixed-rate loan maintains the exact same interest rate and EMI throughout the tenure. Floating-rate loans fluctuate with benchmark repo rates (RBI or Central Bank policies), affecting your tenure or EMI.'
      },
      {
        question: 'Does increasing loan tenure decrease my total cost?',
        answer: 'No. While a longer tenure reduces your monthly EMI, it substantially increases the total cumulative interest paid to the lender.'
      }
    ],
    relatedIds: ['sip-calculator', 'loan-comparison-calculator', 'compound-interest-calculator', 'fd-calculator'],
    disclaimerType: 'financial'
  },

  // 3. SWP CALCULATOR
  {
    id: 'swp-calculator',
    slug: 'swp-calculator',
    name: 'SWP Calculator (Systematic Withdrawal Plan)',
    shortName: 'SWP Calculator',
    category: 'finance',
    description: 'Calculate monthly retirement cashflows, remaining mutual fund balance, and portfolio sustainability.',
    iconName: 'ArrowDownCircle',
    keywords: ['swp', 'systematic withdrawal', 'retirement income', 'pension', 'monthly cashflow', 'mutual fund withdrawal'],
    inputs: [
      {
        id: 'totalInvestment',
        label: 'Total Initial Corpus',
        type: 'slider',
        defaultValue: 5000000,
        min: 100000,
        max: 50000000,
        step: 100000,
        prefix: 'currency',
        helpText: 'Initial corpus invested in mutual funds'
      },
      {
        id: 'monthlyWithdrawal',
        label: 'Monthly Withdrawal',
        type: 'slider',
        defaultValue: 35000,
        min: 1000,
        max: 300000,
        step: 1000,
        prefix: 'currency',
        helpText: 'Fixed amount you withdraw each month'
      },
      {
        id: 'expectedReturnRate',
        label: 'Expected Return Rate (p.a.)',
        type: 'slider',
        defaultValue: 9,
        min: 1,
        max: 20,
        step: 0.5,
        suffix: '%',
        helpText: 'Conservative balanced/hybrid fund returns'
      },
      {
        id: 'tenureYears',
        label: 'Withdrawal Period',
        type: 'slider',
        defaultValue: 15,
        min: 1,
        max: 40,
        step: 1,
        suffix: ' Years',
        helpText: 'How many years you wish to draw monthly funds'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      let balance = Number(inputs.totalInvestment) || 5000000;
      const initialCorpus = balance;
      const monthlyW = Number(inputs.monthlyWithdrawal) || 35000;
      const annualRate = Number(inputs.expectedReturnRate) || 9;
      const years = Number(inputs.tenureYears) || 15;

      const monthlyRate = annualRate / 12 / 100;
      let totalWithdrawn = 0;
      const chartData = [];
      const tableData = [];
      let depletedYear: number | null = null;

      for (let y = 1; y <= years; y++) {
        let yearWithdrawn = 0;
        for (let m = 1; m <= 12; m++) {
          if (balance > 0) {
            const interest = balance * monthlyRate;
            balance += interest;
            const actualW = Math.min(balance, monthlyW);
            balance -= actualW;
            totalWithdrawn += actualW;
            yearWithdrawn += actualW;

            if (balance <= 0 && depletedYear === null) {
              depletedYear = y;
            }
          }
        }

        chartData.push({
          name: `Yr ${y}`,
          'Remaining Balance': Math.round(Math.max(0, balance)),
          'Cumulative Withdrawn': Math.round(totalWithdrawn)
        });

        tableData.push({
          year: `Year ${y}`,
          withdrawn: formatCurrency(Math.round(yearWithdrawn), currency),
          totalWithdrawn: formatCurrency(Math.round(totalWithdrawn), currency),
          balance: formatCurrency(Math.round(Math.max(0, balance)), currency)
        });
      }

      const finalValue = Math.max(0, balance);
      const totalCreated = totalWithdrawn + finalValue;

      return {
        primaryMetric: {
          label: 'Total Withdrawn Cashflow',
          value: Math.round(totalWithdrawn),
          formattedValue: formatCurrency(Math.round(totalWithdrawn), currency),
          subtext: `From initial ${formatCurrency(initialCorpus, currency)} corpus`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Final Remaining Balance',
            value: Math.round(finalValue),
            formattedValue: formatCurrency(Math.round(finalValue), currency),
            type: finalValue > 0 ? 'success' : 'error',
            subtext: finalValue > 0 ? 'Corpus sustained!' : `Depleted in year ${depletedYear}`
          },
          {
            label: 'Total Value Generated',
            value: Math.round(totalCreated),
            formattedValue: formatCurrency(Math.round(totalCreated), currency),
            type: 'neutral'
          }
        ],
        breakdown: [
          {
            label: 'Total Withdrawn',
            value: Math.round(totalWithdrawn),
            formattedValue: formatCurrency(Math.round(totalWithdrawn), currency),
            percentage: Math.round((totalWithdrawn / (totalCreated || 1)) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Remaining Balance',
            value: Math.round(finalValue),
            formattedValue: formatCurrency(Math.round(finalValue), currency),
            percentage: Math.round((finalValue / (totalCreated || 1)) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'area',
          title: 'SWP Balance vs Total Withdrawals',
          data: chartData,
          series: [
            { key: 'Remaining Balance', name: 'Remaining Portfolio Balance', color: '#10b981' },
            { key: 'Cumulative Withdrawn', name: 'Total Withdrawn So Far', color: '#3b82f6' }
          ]
        },
        table: {
          title: 'Yearly SWP Breakdown',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'withdrawn', label: 'Withdrawn this Year' },
            { key: 'totalWithdrawn', label: 'Total Withdrawn' },
            { key: 'balance', label: 'Ending Balance' }
          ],
          data: tableData
        }
      };
    },
    formula: {
      expression: 'Balance(n) = Balance(n-1) × (1 + r) - Withdrawal',
      explanation: 'Calculated iteratively for every month with monthly interest addition and cash withdrawal.',
      variables: [
        { symbol: 'Balance(n)', name: 'Current Month Balance', description: 'Remaining balance after adding interest and subtracting withdrawal.' },
        { symbol: 'r', name: 'Monthly Return Rate', description: 'Annual portfolio expected return / 1200.' }
      ]
    },
    explanationSections: [
      {
        title: 'What is a Systematic Withdrawal Plan (SWP)?',
        content: 'An SWP lets you redeem a predetermined sum from your mutual fund investments on a monthly or quarterly basis. It is widely used by retirees for tax-efficient monthly pensions.'
      }
    ],
    faqs: [
      {
        question: 'Is SWP better than Fixed Deposit monthly interest?',
        answer: 'SWP offers significant tax efficiency because only the capital gain proportion in each redemption is taxed, rather than the entire interest payout in FDs.'
      }
    ],
    relatedIds: ['sip-calculator', 'retirement-calculator', 'lump-sum-calculator'],
    disclaimerType: 'financial'
  },

  // 4. COMPOUND INTEREST CALCULATOR
  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortName: 'Compound Interest',
    category: 'finance',
    description: 'Calculate compound interest with flexible compounding frequency (daily, monthly, quarterly, annually) and regular deposits.',
    iconName: 'Percent',
    popular: true,
    keywords: ['compound interest', 'compounding', 'interest rate', 'savings', 'future value', 'investing'],
    inputs: [
      {
        id: 'principal',
        label: 'Initial Principal',
        type: 'slider',
        defaultValue: 100000,
        min: 1000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'slider',
        defaultValue: 10,
        min: 1,
        max: 30,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'years',
        label: 'Time Period (Years)',
        type: 'slider',
        defaultValue: 10,
        min: 1,
        max: 40,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'compoundFrequency',
        label: 'Compounding Frequency',
        type: 'select',
        defaultValue: 12,
        options: [
          { label: 'Annually (1x/yr)', value: 1 },
          { label: 'Semi-Annually (2x/yr)', value: 2 },
          { label: 'Quarterly (4x/yr)', value: 4 },
          { label: 'Monthly (12x/yr)', value: 12 },
          { label: 'Daily (365x/yr)', value: 365 }
        ]
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.principal) || 100000;
      const r = (Number(inputs.annualRate) || 10) / 100;
      const t = Number(inputs.years) || 10;
      const n = Number(inputs.compoundFrequency) || 12;

      const A = P * Math.pow(1 + r / n, n * t);
      const totalInterest = A - P;

      const chartData = [];
      const tableData = [];

      for (let y = 1; y <= t; y++) {
        const val = P * Math.pow(1 + r / n, n * y);
        const interest = val - P;
        chartData.push({
          name: `Yr ${y}`,
          'Principal': P,
          'Total Balance': Math.round(val),
          'Compound Interest': Math.round(interest)
        });
        tableData.push({
          year: `Year ${y}`,
          principal: formatCurrency(P, currency),
          interest: formatCurrency(Math.round(interest), currency),
          balance: formatCurrency(Math.round(val), currency)
        });
      }

      return {
        primaryMetric: {
          label: 'Total Future Value (A)',
          value: Math.round(A),
          formattedValue: formatCurrency(Math.round(A), currency),
          subtext: `Earned ${formatCurrency(Math.round(totalInterest), currency)} in pure interest`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Initial Principal (P)',
            value: P,
            formattedValue: formatCurrency(P, currency),
            type: 'neutral'
          },
          {
            label: 'Total Compound Interest',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            type: 'success',
            subtext: `${((totalInterest / P) * 100).toFixed(1)}% total gain`
          }
        ],
        breakdown: [
          {
            label: 'Principal',
            value: P,
            formattedValue: formatCurrency(P, currency),
            percentage: Math.round((P / A) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Interest',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            percentage: Math.round((totalInterest / A) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'area',
          title: 'Compound Growth Over Time',
          data: chartData,
          series: [
            { key: 'Principal', name: 'Principal Amount', color: '#3b82f6' },
            { key: 'Total Balance', name: 'Total Balance', color: '#10b981' }
          ]
        },
        table: {
          title: 'Yearly Compound Interest Table',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'principal', label: 'Principal' },
            { key: 'interest', label: 'Accrued Interest' },
            { key: 'balance', label: 'End Balance' }
          ],
          data: tableData
        }
      };
    },
    formula: {
      expression: 'A = P × (1 + r/n)^(n × t)',
      explanation: 'Where A is future amount, P is principal, r is annual rate in decimal, n is compounding frequency per year, and t is time in years.',
      variables: [
        { symbol: 'A', name: 'Final Amount', description: 'Total accumulated balance.' },
        { symbol: 'P', name: 'Principal Amount', description: 'Starting balance.' },
        { symbol: 'r', name: 'Annual Rate', description: 'Interest rate as a decimal (e.g. 0.10 for 10%).' },
        { symbol: 'n', name: 'Compounding Frequency', description: 'Times interest compounds per year.' },
        { symbol: 't', name: 'Time in Years', description: 'Number of years invested.' }
      ]
    },
    explanationSections: [
      {
        title: 'The Magic of Compound Interest',
        content: 'Albert Einstein famously called compound interest the eighth wonder of the world. By reinvesting earned interest rather than withdrawing it, your money works around the clock to create wealth exponentially.'
      }
    ],
    faqs: [
      {
        question: 'How does compounding frequency affect returns?',
        answer: 'The more frequently interest is compounded (e.g. daily vs annually), the higher the effective annual yield (APY).'
      }
    ],
    relatedIds: ['simple-interest-calculator', 'sip-calculator', 'lump-sum-calculator', 'cagr-calculator'],
    disclaimerType: 'financial'
  },

  // 5. SIMPLE INTEREST CALCULATOR
  {
    id: 'simple-interest-calculator',
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    shortName: 'Simple Interest',
    category: 'finance',
    description: 'Calculate simple interest, total repayment, and annual interest breakdowns without compounding.',
    iconName: 'Calculator',
    keywords: ['simple interest', 'interest', 'flat interest', 'loan', 'pnr', 'principal rate time'],
    inputs: [
      {
        id: 'principal',
        label: 'Principal Amount',
        type: 'slider',
        defaultValue: 50000,
        min: 1000,
        max: 2000000,
        step: 1000,
        prefix: 'currency'
      },
      {
        id: 'rate',
        label: 'Annual Interest Rate (%)',
        type: 'slider',
        defaultValue: 7,
        min: 0.5,
        max: 30,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'time',
        label: 'Time Period (Years)',
        type: 'slider',
        defaultValue: 5,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.principal) || 50000;
      const R = Number(inputs.rate) || 7;
      const T = Number(inputs.time) || 5;

      const SI = (P * R * T) / 100;
      const totalAmount = P + SI;

      const chartData = [];
      const tableData = [];

      for (let y = 1; y <= T; y++) {
        const currentInterest = (P * R * y) / 100;
        chartData.push({
          name: `Yr ${y}`,
          'Principal': P,
          'Total Amount': P + currentInterest,
          'Interest Accrued': currentInterest
        });

        tableData.push({
          year: `Year ${y}`,
          yearlyInterest: formatCurrency((P * R) / 100, currency),
          cumulativeInterest: formatCurrency(currentInterest, currency),
          totalAmount: formatCurrency(P + currentInterest, currency)
        });
      }

      return {
        primaryMetric: {
          label: 'Total Simple Interest (SI)',
          value: Math.round(SI),
          formattedValue: formatCurrency(Math.round(SI), currency),
          subtext: `Total repayment: ${formatCurrency(Math.round(totalAmount), currency)}`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Principal Amount',
            value: P,
            formattedValue: formatCurrency(P, currency),
            type: 'neutral'
          },
          {
            label: 'Total Payable Amount',
            value: Math.round(totalAmount),
            formattedValue: formatCurrency(Math.round(totalAmount), currency),
            type: 'success'
          }
        ],
        breakdown: [
          {
            label: 'Principal',
            value: P,
            formattedValue: formatCurrency(P, currency),
            percentage: Math.round((P / totalAmount) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Interest',
            value: Math.round(SI),
            formattedValue: formatCurrency(Math.round(SI), currency),
            percentage: Math.round((SI / totalAmount) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'bar',
          title: 'Simple Interest Accumulation',
          data: chartData,
          series: [
            { key: 'Principal', name: 'Principal', color: '#3b82f6' },
            { key: 'Interest Accrued', name: 'Interest Accrued', color: '#10b981' }
          ]
        },
        table: {
          title: 'Annual Simple Interest Progression',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'yearlyInterest', label: 'Annual Interest' },
            { key: 'cumulativeInterest', label: 'Total Interest' },
            { key: 'totalAmount', label: 'Total Value' }
          ],
          data: tableData
        }
      };
    },
    formula: {
      expression: 'SI = (P × R × T) / 100',
      explanation: 'Simple interest is calculated solely on the original principal amount without interest reinvestment.',
      variables: [
        { symbol: 'SI', name: 'Simple Interest', description: 'Interest amount earned or owed.' },
        { symbol: 'P', name: 'Principal', description: 'Initial sum of money.' },
        { symbol: 'R', name: 'Rate of Interest', description: 'Annual interest percentage.' },
        { symbol: 'T', name: 'Time', description: 'Duration in years.' }
      ]
    },
    explanationSections: [
      {
        title: 'When is Simple Interest Used?',
        content: 'Simple interest is commonly used in short-term personal loans, car loans with flat interest terms, retail credit agreements, and basic promissory notes.'
      }
    ],
    faqs: [
      {
        question: 'What is the main difference between Simple and Compound Interest?',
        answer: 'Simple interest earns a fixed fee calculated purely on the starting principal. Compound interest earns interest on both the principal and previously earned interest.'
      }
    ],
    relatedIds: ['compound-interest-calculator', 'emi-calculator', 'cagr-calculator'],
    disclaimerType: 'financial'
  },

  // 6. LUMP SUM CALCULATOR
  {
    id: 'lump-sum-calculator',
    slug: 'lump-sum-calculator',
    name: 'Lump Sum Investment Calculator',
    shortName: 'Lump Sum Calculator',
    category: 'finance',
    description: 'Calculate the maturity value and growth of a one-time lump-sum mutual fund or equity investment.',
    iconName: 'Coins',
    popular: true,
    keywords: ['lump sum', 'one time investment', 'mutual fund', 'future value', 'cagr', 'wealth'],
    inputs: [
      {
        id: 'investment',
        label: 'Total Investment',
        type: 'slider',
        defaultValue: 100000,
        min: 5000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'returnRate',
        label: 'Expected Return Rate (p.a.)',
        type: 'slider',
        defaultValue: 12,
        min: 1,
        max: 30,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'tenure',
        label: 'Investment Period',
        type: 'slider',
        defaultValue: 10,
        min: 1,
        max: 35,
        step: 1,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.investment) || 100000;
      const rate = Number(inputs.returnRate) || 12;
      const years = Number(inputs.tenure) || 10;

      const r = rate / 100;
      const finalValue = P * Math.pow(1 + r, years);
      const returns = finalValue - P;

      const chartData = [];
      for (let y = 1; y <= years; y++) {
        const val = P * Math.pow(1 + r, y);
        chartData.push({
          name: `Yr ${y}`,
          'Principal': P,
          'Future Value': Math.round(val),
          'Gain': Math.round(val - P)
        });
      }

      return {
        primaryMetric: {
          label: 'Total Expected Value',
          value: Math.round(finalValue),
          formattedValue: formatCurrency(Math.round(finalValue), currency),
          subtext: `Earned ${(finalValue / P).toFixed(2)}x of original principal`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Invested Amount',
            value: P,
            formattedValue: formatCurrency(P, currency),
            type: 'neutral'
          },
          {
            label: 'Est. Capital Gains',
            value: Math.round(returns),
            formattedValue: formatCurrency(Math.round(returns), currency),
            type: 'success'
          }
        ],
        breakdown: [
          {
            label: 'Initial Investment',
            value: P,
            formattedValue: formatCurrency(P, currency),
            percentage: Math.round((P / finalValue) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Estimated Returns',
            value: Math.round(returns),
            formattedValue: formatCurrency(Math.round(returns), currency),
            percentage: Math.round((returns / finalValue) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'area',
          title: 'Lump Sum Wealth Expansion',
          data: chartData,
          series: [
            { key: 'Principal', name: 'Initial Principal', color: '#3b82f6' },
            { key: 'Future Value', name: 'Future Value', color: '#10b981' }
          ]
        }
      };
    },
    formula: {
      expression: 'A = P × (1 + r)^t',
      explanation: 'One-time compounding growth formula over time period t.',
      variables: [
        { symbol: 'A', name: 'Future Value', description: 'Expected portfolio value at maturity.' },
        { symbol: 'P', name: 'Lump Sum Investment', description: 'Starting capital.' },
        { symbol: 'r', name: 'Annual Growth Rate', description: 'Expected rate of return.' },
        { symbol: 't', name: 'Time in Years', description: 'Holding period.' }
      ]
    },
    explanationSections: [
      {
        title: 'SIP vs Lump Sum: Which is Better?',
        content: 'Lump sum investments mathematically outperform SIP in secular bull markets because 100% of your capital is invested on day one. However, SIPs reduce behavioral risk and volatility when market valuations are high.'
      }
    ],
    faqs: [
      {
        question: 'When should I choose Lump Sum over SIP?',
        answer: 'Lump sum is suitable when you have a surplus windfall (bonus, property sale, inheritance) and a long investment horizon (7+ years).'
      }
    ],
    relatedIds: ['sip-calculator', 'cagr-calculator', 'compound-interest-calculator'],
    disclaimerType: 'financial'
  },

  // 7. FD CALCULATOR (Fixed Deposit)
  {
    id: 'fd-calculator',
    slug: 'fd-calculator',
    name: 'FD Calculator (Fixed Deposit)',
    shortName: 'FD Calculator',
    category: 'finance',
    description: 'Calculate Fixed Deposit maturity amount, interest earned with quarterly compounding, and TDS deduction estimates.',
    iconName: 'Landmark',
    popular: true,
    keywords: ['fd', 'fixed deposit', 'bank fd', 'maturity value', 'term deposit', 'interest payout'],
    inputs: [
      {
        id: 'depositAmount',
        label: 'Total Deposit Amount',
        type: 'slider',
        defaultValue: 200000,
        min: 5000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'interestRate',
        label: 'Interest Rate (p.a.)',
        type: 'slider',
        defaultValue: 7.25,
        min: 3,
        max: 12,
        step: 0.05,
        suffix: '%'
      },
      {
        id: 'tenureYears',
        label: 'Tenure (Years)',
        type: 'slider',
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 1,
        suffix: ' Years'
      },
      {
        id: 'compoundingFrequency',
        label: 'Compounding Method',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: 'Quarterly (Standard Bank FD)', value: 4 },
          { label: 'Monthly', value: 12 },
          { label: 'Half-Yearly', value: 2 },
          { label: 'Annually (Simple)', value: 1 }
        ]
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.depositAmount) || 200000;
      const rate = Number(inputs.interestRate) || 7.25;
      const years = Number(inputs.tenureYears) || 5;
      const n = Number(inputs.compoundingFrequency) || 4;

      const r = rate / 100;
      const maturity = P * Math.pow(1 + r / n, n * years);
      const interest = maturity - P;

      const chartData = [];
      for (let y = 1; y <= years; y++) {
        const currentMaturity = P * Math.pow(1 + r / n, n * y);
        chartData.push({
          name: `Yr ${y}`,
          'Principal': P,
          'Total Maturity': Math.round(currentMaturity),
          'Interest': Math.round(currentMaturity - P)
        });
      }

      return {
        primaryMetric: {
          label: 'Total Maturity Value',
          value: Math.round(maturity),
          formattedValue: formatCurrency(Math.round(maturity), currency),
          subtext: `Total interest earned: ${formatCurrency(Math.round(interest), currency)}`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Principal Invested',
            value: P,
            formattedValue: formatCurrency(P, currency),
            type: 'neutral'
          },
          {
            label: 'Total Interest Earned',
            value: Math.round(interest),
            formattedValue: formatCurrency(Math.round(interest), currency),
            type: 'success'
          }
        ],
        breakdown: [
          {
            label: 'Principal Deposit',
            value: P,
            formattedValue: formatCurrency(P, currency),
            percentage: Math.round((P / maturity) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Interest Earned',
            value: Math.round(interest),
            formattedValue: formatCurrency(Math.round(interest), currency),
            percentage: Math.round((interest / maturity) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'bar',
          title: 'Fixed Deposit Growth (Quarterly Compounding)',
          data: chartData,
          series: [
            { key: 'Principal', name: 'Principal', color: '#3b82f6' },
            { key: 'Interest', name: 'Cumulative Interest', color: '#10b981' }
          ]
        }
      };
    },
    formula: {
      expression: 'A = P × (1 + r/4)^(4 × t)',
      explanation: 'Most commercial banks compound FD interest on a quarterly basis (4 times a year).',
      variables: [
        { symbol: 'A', name: 'Maturity Amount', description: 'Final payout received upon maturity.' },
        { symbol: 'P', name: 'Deposit Principal', description: 'Original deposit amount.' },
        { symbol: 'r', name: 'Annual Rate', description: 'Annual percentage interest rate.' },
        { symbol: 't', name: 'Tenure in Years', description: 'Length of fixed deposit term.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Bank Fixed Deposits Work',
        content: 'Fixed Deposits are guaranteed-return investments insured by government central bodies (e.g. DICGC in India up to ₹5 Lakhs per bank). Interest is compounded quarterly and paid either at maturity (cumulative) or periodically.'
      }
    ],
    faqs: [
      {
        question: 'Is FD interest taxable?',
        answer: 'Yes. Interest earned on Fixed Deposits is fully taxable according to your income tax slab. Banks deduct TDS if annual interest exceeds statutory thresholds.'
      }
    ],
    relatedIds: ['rd-calculator', 'ppf-calculator', 'compound-interest-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  },

  // 8. RD CALCULATOR (Recurring Deposit)
  {
    id: 'rd-calculator',
    slug: 'rd-calculator',
    name: 'RD Calculator (Recurring Deposit)',
    shortName: 'RD Calculator',
    category: 'finance',
    description: 'Calculate maturity value of monthly recurring bank deposits with quarterly compounding interest.',
    iconName: 'Clock',
    keywords: ['rd', 'recurring deposit', 'monthly deposit', 'bank savings', 'post office rd'],
    inputs: [
      {
        id: 'monthlyDeposit',
        label: 'Monthly Deposit',
        type: 'slider',
        defaultValue: 5000,
        min: 500,
        max: 100000,
        step: 500,
        prefix: 'currency'
      },
      {
        id: 'interestRate',
        label: 'Interest Rate (p.a.)',
        type: 'slider',
        defaultValue: 7.0,
        min: 3,
        max: 12,
        step: 0.1,
        suffix: '%'
      },
      {
        id: 'tenureYears',
        label: 'Tenure (Years)',
        type: 'slider',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.monthlyDeposit) || 5000;
      const rate = Number(inputs.interestRate) || 7.0;
      const years = Number(inputs.tenureYears) || 3;
      const months = years * 12;

      // Quarterly compounding for each installment
      // Each monthly deposit m (from 1 to months) earns interest for (months - m + 1) months
      const r = rate / 100;
      let totalMaturity = 0;
      for (let m = 1; m <= months; m++) {
        const remainingMonths = months - m + 1;
        const maturityOfInstallment = P * Math.pow(1 + r / 4, (remainingMonths / 3));
        totalMaturity += maturityOfInstallment;
      }

      const totalInvested = P * months;
      const interestEarned = totalMaturity - totalInvested;

      return {
        primaryMetric: {
          label: 'Total Maturity Value',
          value: Math.round(totalMaturity),
          formattedValue: formatCurrency(Math.round(totalMaturity), currency),
          subtext: `Interest earned: ${formatCurrency(Math.round(interestEarned), currency)}`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Total Amount Invested',
            value: totalInvested,
            formattedValue: formatCurrency(totalInvested, currency),
            type: 'neutral'
          },
          {
            label: 'Total Interest Earned',
            value: Math.round(interestEarned),
            formattedValue: formatCurrency(Math.round(interestEarned), currency),
            type: 'success'
          }
        ],
        breakdown: [
          {
            label: 'Total Invested',
            value: totalInvested,
            formattedValue: formatCurrency(totalInvested, currency),
            percentage: Math.round((totalInvested / totalMaturity) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Interest Accrued',
            value: Math.round(interestEarned),
            formattedValue: formatCurrency(Math.round(interestEarned), currency),
            percentage: Math.round((interestEarned / totalMaturity) * 100),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'M = Σ [P × (1 + r/4)^(quarters_left)]',
      explanation: 'Quarterly compounding calculated for each monthly installment.',
      variables: [
        { symbol: 'M', name: 'Maturity Amount', description: 'Total value received at the end of tenure.' },
        { symbol: 'P', name: 'Monthly Installment', description: 'Fixed amount deposited each month.' }
      ]
    },
    explanationSections: [
      {
        title: 'What is a Recurring Deposit (RD)?',
        content: 'An RD allows people to invest a fixed monthly amount over a predetermined period while earning guaranteed interest rates similar to Fixed Deposits.'
      }
    ],
    faqs: [
      {
        question: 'Can I withdraw RD before maturity?',
        answer: 'Premature withdrawals are permitted by most banks, though a small penalty (e.g. 0.5%–1% interest reduction) may apply.'
      }
    ],
    relatedIds: ['fd-calculator', 'sip-calculator', 'ppf-calculator'],
    disclaimerType: 'financial'
  },

  // 9. PPF CALCULATOR (Public Provident Fund)
  {
    id: 'ppf-calculator',
    slug: 'ppf-calculator',
    name: 'PPF Calculator (Public Provident Fund)',
    shortName: 'PPF Calculator',
    category: 'finance',
    description: 'Calculate 15-year Public Provident Fund maturity with EEE tax benefits and compounding interest.',
    iconName: 'ShieldCheck',
    popular: true,
    keywords: ['ppf', 'provident fund', 'tax saving', '80c', 'eee', 'government bond', 'safe investment'],
    inputs: [
      {
        id: 'yearlyDeposit',
        label: 'Yearly Investment (Max ₹1.5 Lakhs)',
        type: 'slider',
        defaultValue: 150000,
        min: 500,
        max: 150000,
        step: 500,
        prefix: 'currency',
        helpText: 'Annual contribution (Max ₹1,50,000 for tax exemption under 80C)'
      },
      {
        id: 'interestRate',
        label: 'Current PPF Interest Rate (p.a.)',
        type: 'slider',
        defaultValue: 7.1,
        min: 6,
        max: 9,
        step: 0.1,
        suffix: '%',
        helpText: 'Government regulated rate (currently 7.1%)'
      },
      {
        id: 'tenureYears',
        label: 'Investment Duration (Years)',
        type: 'slider',
        defaultValue: 15,
        min: 15,
        max: 30,
        step: 5,
        suffix: ' Years',
        helpText: 'Initial 15 years, extendable in 5-year blocks'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const yearly = Number(inputs.yearlyDeposit) || 150000;
      const rate = Number(inputs.interestRate) || 7.1;
      const years = Number(inputs.tenureYears) || 15;

      const r = rate / 100;
      let balance = 0;
      let totalInvested = 0;
      const chartData = [];
      const tableData = [];

      for (let y = 1; y <= years; y++) {
        totalInvested += yearly;
        const interest = (balance + yearly) * r;
        balance = balance + yearly + interest;

        chartData.push({
          name: `Yr ${y}`,
          'Total Invested': totalInvested,
          'Corpus Value': Math.round(balance),
          'Interest': Math.round(balance - totalInvested)
        });

        tableData.push({
          year: `Year ${y}`,
          deposit: formatCurrency(yearly, currency),
          interest: formatCurrency(Math.round(interest), currency),
          totalInvested: formatCurrency(totalInvested, currency),
          balance: formatCurrency(Math.round(balance), currency)
        });
      }

      const totalInterest = balance - totalInvested;

      return {
        primaryMetric: {
          label: 'Total PPF Maturity Amount',
          value: Math.round(balance),
          formattedValue: formatCurrency(Math.round(balance), currency),
          subtext: `100% Tax-Free under EEE category`,
          type: 'highlight',
          badge: '100% Sovereign Guarantee'
        },
        secondaryMetrics: [
          {
            label: 'Total Amount Deposited',
            value: totalInvested,
            formattedValue: formatCurrency(totalInvested, currency),
            type: 'neutral'
          },
          {
            label: 'Total Tax-Free Interest',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            type: 'success'
          }
        ],
        breakdown: [
          {
            label: 'Total Principal',
            value: totalInvested,
            formattedValue: formatCurrency(totalInvested, currency),
            percentage: Math.round((totalInvested / balance) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Tax-Free Interest',
            value: Math.round(totalInterest),
            formattedValue: formatCurrency(Math.round(totalInterest), currency),
            percentage: Math.round((totalInterest / balance) * 100),
            color: '#10b981'
          }
        ],
        chart: {
          type: 'area',
          title: 'PPF 15-Year Tax-Free Wealth Accumulation',
          data: chartData,
          series: [
            { key: 'Total Invested', name: 'Total Deposited', color: '#3b82f6' },
            { key: 'Corpus Value', name: 'Total PPF Corpus', color: '#10b981' }
          ]
        },
        table: {
          title: 'Year-by-Year PPF Schedule',
          columns: [
            { key: 'year', label: 'Year' },
            { key: 'totalInvested', label: 'Total Invested' },
            { key: 'interest', label: 'Interest Accrued' },
            { key: 'balance', label: 'Closing Balance' }
          ],
          data: tableData
        }
      };
    },
    formula: {
      expression: 'F = P × [((1 + i)^n - 1) / i] × (1 + i)',
      explanation: 'Compounded annually, calculated on the lowest balance between the 5th and last day of each month.',
      variables: [
        { symbol: 'F', name: 'Maturity Corpus', description: 'Total accumulated tax-free sum.' },
        { symbol: 'P', name: 'Annual Deposit', description: 'Contribution made per year.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why PPF is considered the Gold Standard for Safe Savings',
        content: 'PPF falls under the Exempt-Exempt-Exempt (EEE) tax status in India. Deposits are tax-exempt under Section 80C, interest earned is completely tax-free, and final maturity withdrawals are also 100% tax-free.'
      }
    ],
    faqs: [
      {
        question: 'What is the best date to deposit in PPF?',
        answer: 'Deposit on or before the 5th of each month (or in April for annual lumpsum) to maximize interest, as interest is calculated on the minimum balance between the 5th and end of the month.'
      }
    ],
    relatedIds: ['nps-calculator', 'sip-calculator', 'fd-calculator', 'retirement-calculator'],
    disclaimerType: 'financial'
  },

  // 10. NPS CALCULATOR (National Pension System)
  {
    id: 'nps-calculator',
    slug: 'nps-calculator',
    name: 'NPS Calculator (National Pension System)',
    shortName: 'NPS Calculator',
    category: 'finance',
    description: 'Calculate retirement pension, lump-sum payout, and monthly annuity under the National Pension Scheme.',
    iconName: 'Award',
    keywords: ['nps', 'pension', 'national pension scheme', 'annuity', 'retirement corpus', 'tax deduction 80ccd'],
    inputs: [
      {
        id: 'monthlyContribution',
        label: 'Monthly Investment',
        type: 'slider',
        defaultValue: 5000,
        min: 500,
        max: 100000,
        step: 500,
        prefix: 'currency'
      },
      {
        id: 'currentAge',
        label: 'Current Age',
        type: 'slider',
        defaultValue: 28,
        min: 18,
        max: 60,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'retirementAge',
        label: 'Retirement Age',
        type: 'slider',
        defaultValue: 60,
        min: 50,
        max: 75,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'expectedReturn',
        label: 'Expected ROI (p.a.)',
        type: 'slider',
        defaultValue: 10,
        min: 5,
        max: 15,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'annuityPercent',
        label: 'Annuity Reinvestment (%)',
        type: 'slider',
        defaultValue: 40,
        min: 40,
        max: 100,
        step: 5,
        suffix: '%',
        helpText: 'Min 40% mandatory annuity purchase at age 60'
      },
      {
        id: 'annuityRate',
        label: 'Expected Annuity Rate (%)',
        type: 'slider',
        defaultValue: 6,
        min: 4,
        max: 10,
        step: 0.5,
        suffix: '%'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const monthly = Number(inputs.monthlyContribution) || 5000;
      const currentAge = Number(inputs.currentAge) || 28;
      const retAge = Number(inputs.retirementAge) || 60;
      const years = Math.max(1, retAge - currentAge);
      const returnRate = Number(inputs.expectedReturn) || 10;
      const annuityPercent = Number(inputs.annuityPercent) || 40;
      const annuityRate = Number(inputs.annuityRate) || 6;

      const r = returnRate / 100 / 12;
      const totalMonths = years * 12;
      const totalInvested = monthly * totalMonths;

      // Future value of SIP
      const totalCorpus = monthly * (((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r));
      const totalGains = totalCorpus - totalInvested;

      const annuityAmount = totalCorpus * (annuityPercent / 100);
      const lumpSumAmount = totalCorpus - annuityAmount;
      const monthlyPension = (annuityAmount * (annuityRate / 100)) / 12;

      return {
        primaryMetric: {
          label: 'Total Retirement Corpus',
          value: Math.round(totalCorpus),
          formattedValue: formatCurrency(Math.round(totalCorpus), currency),
          subtext: `At retirement age ${retAge} (${years} years compounding)`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Monthly Pension Expected',
            value: Math.round(monthlyPension),
            formattedValue: formatCurrency(Math.round(monthlyPension), currency) + ' / mo',
            type: 'success',
            subtext: `From ${formatCurrency(Math.round(annuityAmount), currency)} annuity`
          },
          {
            label: 'Tax-Free Lump Sum Payout',
            value: Math.round(lumpSumAmount),
            formattedValue: formatCurrency(Math.round(lumpSumAmount), currency),
            type: 'neutral',
            subtext: `${100 - annuityPercent}% withdrawn lump sum`
          }
        ],
        breakdown: [
          {
            label: 'Total Principal Invested',
            value: totalInvested,
            formattedValue: formatCurrency(totalInvested, currency),
            percentage: Math.round((totalInvested / totalCorpus) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Growth / Returns',
            value: Math.round(totalGains),
            formattedValue: formatCurrency(Math.round(totalGains), currency),
            percentage: Math.round((totalGains / totalCorpus) * 100),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'Corpus = P × [((1 + r)^n - 1) / r] × (1 + r)',
      explanation: 'Monthly compounding over the working horizon, split into lump-sum cashout and monthly annuity.',
      variables: [
        { symbol: 'Corpus', name: 'Total NPS Corpus', description: 'Accumulated portfolio at age 60.' }
      ]
    },
    explanationSections: [
      {
        title: 'How NPS Retirement Works',
        content: 'NPS is a voluntary defined contribution retirement system regulated by PFRDA. It offers dedicated tax deductions under Section 80CCD(1B) up to ₹50,000 above the regular 80C limit.'
      }
    ],
    faqs: [
      {
        question: 'Is the lump sum withdrawal taxable upon retirement?',
        answer: 'Under current rules, the 60% lump-sum withdrawal at age 60 is 100% tax-free. The remaining 40% annuity generates monthly pension which is taxable as income.'
      }
    ],
    relatedIds: ['retirement-calculator', 'ppf-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  },

  // 11. CAGR CALCULATOR (Compound Annual Growth Rate)
  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    name: 'CAGR Calculator (Compound Annual Growth Rate)',
    shortName: 'CAGR Calculator',
    category: 'finance',
    description: 'Calculate the accurate annualized compound growth rate of any investment portfolio or business asset.',
    iconName: 'LineChart',
    popular: true,
    keywords: ['cagr', 'compound annual growth rate', 'annualized return', 'portfolio performance', 'irr', 'stocks'],
    inputs: [
      {
        id: 'initialValue',
        label: 'Initial Investment Value',
        type: 'slider',
        defaultValue: 50000,
        min: 1000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'finalValue',
        label: 'Final / Current Value',
        type: 'slider',
        defaultValue: 160000,
        min: 1000,
        max: 20000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'years',
        label: 'Time Period (Years)',
        type: 'slider',
        defaultValue: 5,
        min: 0.5,
        max: 30,
        step: 0.5,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const start = Number(inputs.initialValue) || 50000;
      const end = Number(inputs.finalValue) || 160000;
      const years = Number(inputs.years) || 5;

      const cagr = start > 0 && years > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0;
      const absoluteReturn = start > 0 ? ((end - start) / start) * 100 : 0;
      const totalGain = end - start;

      const chartData = [];
      const rateDecimal = cagr / 100;
      for (let y = 0; y <= Math.ceil(years); y++) {
        const val = start * Math.pow(1 + rateDecimal, y);
        chartData.push({
          name: `Yr ${y}`,
          'Growth Trajectory': Math.round(val)
        });
      }

      return {
        primaryMetric: {
          label: 'Compound Annual Growth Rate (CAGR)',
          value: Number(cagr.toFixed(2)),
          formattedValue: `${cagr.toFixed(2)}% p.a.`,
          subtext: `Smoothed annual growth over ${years} years`,
          type: 'highlight',
          badge: cagr >= 12 ? 'High Performer' : 'Stable Growth'
        },
        secondaryMetrics: [
          {
            label: 'Total Absolute Return',
            value: Number(absoluteReturn.toFixed(2)),
            formattedValue: `${absoluteReturn.toFixed(2)}%`,
            type: absoluteReturn >= 0 ? 'success' : 'error'
          },
          {
            label: 'Total Wealth Generated',
            value: Math.round(totalGain),
            formattedValue: formatCurrency(Math.round(totalGain), currency),
            type: 'neutral'
          }
        ],
        chart: {
          type: 'line',
          title: 'Constant Compounding Trajectory',
          data: chartData,
          series: [
            { key: 'Growth Trajectory', name: 'Value', color: '#10b981' }
          ]
        }
      };
    },
    formula: {
      expression: 'CAGR = [(Final Value / Initial Value)^(1 / n)] - 1',
      explanation: 'CAGR measures the mean annual growth rate of an investment over a specified period of time longer than one year.',
      variables: [
        { symbol: 'CAGR', name: 'Compound Annual Growth Rate', description: 'Annualized rate of return in percentage.' },
        { symbol: 'n', name: 'Number of Years', description: 'Holding period in years.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why CAGR is Better than Simple Average Return',
        content: 'Simple average returns distort reality when investment returns fluctuate wildly between years. CAGR provides the single constant rate at which an investment would have grown if it grew at a steady rate every year.'
      }
    ],
    faqs: [
      {
        question: 'Can CAGR be negative?',
        answer: 'Yes, if the final value is less than the initial investment, CAGR will be negative, representing an annualized loss.'
      }
    ],
    relatedIds: ['roi-calculator', 'lump-sum-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  },

  // 12. ROI CALCULATOR (Return on Investment)
  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    name: 'ROI Calculator (Return on Investment)',
    shortName: 'ROI Calculator',
    category: 'finance',
    description: 'Calculate net profit, percentage ROI, and annualized return on any financial or business investment.',
    iconName: 'PieChart',
    popular: true,
    keywords: ['roi', 'return on investment', 'profit', 'yield', 'capital gain', 'business return'],
    inputs: [
      {
        id: 'investedAmount',
        label: 'Amount Invested',
        type: 'slider',
        defaultValue: 100000,
        min: 1000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'returnedAmount',
        label: 'Amount Returned / Final Value',
        type: 'slider',
        defaultValue: 145000,
        min: 1000,
        max: 10000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'holdingYears',
        label: 'Investment Duration (Years)',
        type: 'slider',
        defaultValue: 3,
        min: 0.25,
        max: 25,
        step: 0.25,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const invested = Number(inputs.investedAmount) || 100000;
      const returned = Number(inputs.returnedAmount) || 145000;
      const years = Number(inputs.holdingYears) || 3;

      const netProfit = returned - invested;
      const roi = invested > 0 ? (netProfit / invested) * 100 : 0;
      const annualizedRoi = years > 0 && invested > 0 ? (Math.pow(returned / invested, 1 / years) - 1) * 100 : 0;

      return {
        primaryMetric: {
          label: 'Total Return on Investment (ROI)',
          value: Number(roi.toFixed(2)),
          formattedValue: `${roi.toFixed(2)}%`,
          subtext: `Net gain: ${formatCurrency(netProfit, currency)}`,
          type: roi >= 0 ? 'highlight' : 'error'
        },
        secondaryMetrics: [
          {
            label: 'Annualized ROI (CAGR)',
            value: Number(annualizedRoi.toFixed(2)),
            formattedValue: `${annualizedRoi.toFixed(2)}% / yr`,
            type: annualizedRoi >= 0 ? 'success' : 'error'
          },
          {
            label: 'Net Profit / Loss',
            value: netProfit,
            formattedValue: formatCurrency(netProfit, currency),
            type: netProfit >= 0 ? 'success' : 'error'
          }
        ],
        breakdown: [
          {
            label: 'Initial Capital',
            value: invested,
            formattedValue: formatCurrency(invested, currency),
            percentage: Math.round((invested / returned) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Net Profit',
            value: Math.max(0, netProfit),
            formattedValue: formatCurrency(Math.max(0, netProfit), currency),
            percentage: Math.round((Math.max(0, netProfit) / returned) * 100),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'ROI = [(Net Profit) / (Cost of Investment)] × 100%',
      explanation: 'Measures the efficiency and profitability of an investment.',
      variables: [
        { symbol: 'ROI', name: 'Return on Investment', description: 'Expressed as a percentage ratio.' },
        { symbol: 'Net Profit', name: 'Gain from Investment', description: 'Final Value - Initial Investment Cost.' }
      ]
    },
    explanationSections: [
      {
        title: 'Understanding ROI',
        content: 'ROI is the most popular metric used to evaluate the financial consequence of an investment decision across real estate, stock portfolios, and corporate marketing initiatives.'
      }
    ],
    faqs: [
      {
        question: 'What is a good ROI?',
        answer: 'A good ROI depends on risk: 10-15% annually is considered strong for stock markets, while higher-risk venture investments seek 25%+.'
      }
    ],
    relatedIds: ['cagr-calculator', 'lump-sum-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  },

  // 13. INFLATION CALCULATOR
  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    name: 'Inflation Calculator & Purchasing Power',
    shortName: 'Inflation Calculator',
    category: 'finance',
    description: 'Calculate future cost of living, purchasing power decay, and required savings to outpace inflation.',
    iconName: 'Flame',
    keywords: ['inflation', 'purchasing power', 'future cost', 'cpi', 'cost of living', 'money value'],
    inputs: [
      {
        id: 'currentAmount',
        label: 'Current Amount / Monthly Expense',
        type: 'slider',
        defaultValue: 50000,
        min: 1000,
        max: 1000000,
        step: 1000,
        prefix: 'currency'
      },
      {
        id: 'inflationRate',
        label: 'Annual Inflation Rate (%)',
        type: 'slider',
        defaultValue: 6.0,
        min: 1,
        max: 15,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'years',
        label: 'Time Horizon (Years)',
        type: 'slider',
        defaultValue: 15,
        min: 1,
        max: 40,
        step: 1,
        suffix: ' Years'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const amount = Number(inputs.currentAmount) || 50000;
      const rate = Number(inputs.inflationRate) || 6.0;
      const years = Number(inputs.years) || 15;

      const r = rate / 100;
      const futureCost = amount * Math.pow(1 + r, years);
      const purchasingPowerToday = amount / Math.pow(1 + r, years);

      const chartData = [];
      for (let y = 1; y <= years; y++) {
        chartData.push({
          name: `Yr ${y}`,
          'Future Required Cost': Math.round(amount * Math.pow(1 + r, y)),
          'Value of Money': Math.round(amount / Math.pow(1 + r, y))
        });
      }

      return {
        primaryMetric: {
          label: `Cost in ${years} Years`,
          value: Math.round(futureCost),
          formattedValue: formatCurrency(Math.round(futureCost), currency),
          subtext: `Will cost ${(futureCost / amount).toFixed(2)}x more due to ${rate}% inflation`,
          type: 'warning'
        },
        secondaryMetrics: [
          {
            label: 'Purchasing Power of Same Sum',
            value: Math.round(purchasingPowerToday),
            formattedValue: formatCurrency(Math.round(purchasingPowerToday), currency),
            type: 'error',
            subtext: `What ${formatCurrency(amount, currency)} will feel like in ${years} yrs`
          },
          {
            label: 'Increase in Expenses',
            value: Math.round(futureCost - amount),
            formattedValue: formatCurrency(Math.round(futureCost - amount), currency),
            type: 'neutral'
          }
        ],
        chart: {
          type: 'area',
          title: 'Future Expense Inflation Trajectory',
          data: chartData,
          series: [
            { key: 'Future Required Cost', name: 'Future Price of Goods', color: '#ef4444' }
          ]
        }
      };
    },
    formula: {
      expression: 'Future Cost = Current Cost × (1 + i)^n',
      explanation: 'Calculates the compounding increase in price levels over time due to inflation.',
      variables: [
        { symbol: 'Future Cost', name: 'Expected Cost', description: 'Price required in future years for the same lifestyle.' }
      ]
    },
    explanationSections: [
      {
        title: 'The Silent Wealth Destroyer',
        content: 'Inflation reduces the purchasing power of idle cash. Money parked in a 3% savings account when inflation is 6% actually loses 3% of its real purchasing power every single year.'
      }
    ],
    faqs: [
      {
        question: 'How can I beat inflation?',
        answer: 'Investing in growth assets such as diversified equity mutual funds, index funds, and real estate historically delivers returns well above consumer inflation.'
      }
    ],
    relatedIds: ['retirement-calculator', 'sip-calculator', 'cagr-calculator'],
    disclaimerType: 'financial'
  },

  // 14. RETIREMENT CALCULATOR
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    name: 'Retirement Corpus & Freedom Calculator',
    shortName: 'Retirement Calculator',
    category: 'finance',
    description: 'Calculate target retirement corpus, monthly savings required, and portfolio longevity after retirement.',
    iconName: 'Sun',
    popular: true,
    featured: true,
    keywords: ['retirement', 'fire', 'financial freedom', 'pension', 'corpus', 'post retirement expenses', 'savings'],
    inputs: [
      {
        id: 'currentAge',
        label: 'Current Age',
        type: 'slider',
        defaultValue: 30,
        min: 18,
        max: 55,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'retirementAge',
        label: 'Desired Retirement Age',
        type: 'slider',
        defaultValue: 60,
        min: 40,
        max: 70,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'monthlyExpenses',
        label: 'Current Monthly Expenses',
        type: 'slider',
        defaultValue: 45000,
        min: 10000,
        max: 500000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'inflationRate',
        label: 'Inflation Rate (p.a.)',
        type: 'slider',
        defaultValue: 6,
        min: 3,
        max: 10,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'preRetReturn',
        label: 'Pre-Retirement Return (p.a.)',
        type: 'slider',
        defaultValue: 12,
        min: 6,
        max: 18,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'postRetReturn',
        label: 'Post-Retirement Return (p.a.)',
        type: 'slider',
        defaultValue: 8,
        min: 4,
        max: 12,
        step: 0.5,
        suffix: '%'
      },
      {
        id: 'lifeExpectancy',
        label: 'Life Expectancy (Years)',
        type: 'slider',
        defaultValue: 85,
        min: 70,
        max: 100,
        step: 1,
        suffix: ' Yrs'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const currentAge = Number(inputs.currentAge) || 30;
      const retAge = Number(inputs.retirementAge) || 60;
      const currentExpenses = Number(inputs.monthlyExpenses) || 45000;
      const inflation = Number(inputs.inflationRate) || 6;
      const preReturn = Number(inputs.preRetReturn) || 12;
      const postReturn = Number(inputs.postRetReturn) || 8;
      const lifeExp = Number(inputs.lifeExpectancy) || 85;

      const yearsToRetire = Math.max(1, retAge - currentAge);
      const yearsInRetirement = Math.max(1, lifeExp - retAge);

      // Inflated monthly expense at retirement
      const inflatedMonthlyExpense = currentExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
      const inflatedAnnualExpense = inflatedMonthlyExpense * 12;

      // Real rate of return post retirement
      const realRate = ((1 + postReturn / 100) / (1 + inflation / 100) - 1);
      
      // Target corpus calculation (Present value of growing annuity)
      let targetCorpus = 0;
      if (Math.abs(realRate) > 0.0001) {
        targetCorpus = inflatedAnnualExpense * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
      } else {
        targetCorpus = inflatedAnnualExpense * yearsInRetirement;
      }

      // Required monthly SIP to reach target corpus
      const monthlyPreRate = preReturn / 100 / 12;
      const totalMonths = yearsToRetire * 12;
      const requiredMonthlySIP = (targetCorpus * monthlyPreRate) / (Math.pow(1 + monthlyPreRate, totalMonths) - 1);

      return {
        primaryMetric: {
          label: 'Required Retirement Corpus',
          value: Math.round(targetCorpus),
          formattedValue: formatCurrency(Math.round(targetCorpus), currency),
          subtext: `To fund ${yearsInRetirement} years of comfortable retirement`,
          type: 'highlight',
          badge: `Target Age: ${retAge}`
        },
        secondaryMetrics: [
          {
            label: 'Monthly SIP Required Today',
            value: Math.round(requiredMonthlySIP),
            formattedValue: formatCurrency(Math.round(requiredMonthlySIP), currency) + ' / mo',
            type: 'success',
            subtext: `At ${preReturn}% expected investment growth`
          },
          {
            label: 'Inflated Monthly Expense at Age ' + retAge,
            value: Math.round(inflatedMonthlyExpense),
            formattedValue: formatCurrency(Math.round(inflatedMonthlyExpense), currency) + ' / mo',
            type: 'warning'
          }
        ],
        breakdown: [
          {
            label: 'Monthly Savings Needed',
            value: Math.round(requiredMonthlySIP * 12),
            formattedValue: formatCurrency(Math.round(requiredMonthlySIP * 12), currency) + '/yr',
            color: '#3b82f6'
          },
          {
            label: 'Total Target Corpus',
            value: Math.round(targetCorpus),
            formattedValue: formatCurrency(Math.round(targetCorpus), currency),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'Corpus = Annual_Expense_At_Retirement × [(1 - (1+r_real)^-N) / r_real]',
      explanation: 'Where r_real is the inflation-adjusted post-retirement return rate and N is years spent in retirement.',
      variables: [
        { symbol: 'Corpus', name: 'Target Nest Egg', description: 'Capital required on day one of retirement.' }
      ]
    },
    explanationSections: [
      {
        title: 'The 4% Rule and FIRE Movement',
        content: 'Financial Independence, Retire Early (FIRE) advocates having 25x to 33x your annual post-retirement expenses invested in a resilient asset allocation to achieve lifelong financial freedom.'
      }
    ],
    faqs: [
      {
        question: 'What if I start investing 5 years later?',
        answer: 'Delaying by just 5 years can increase your required monthly SIP by 50%–70% because you lose the most powerful compounding years at the end of the curve.'
      }
    ],
    relatedIds: ['sip-calculator', 'nps-calculator', 'inflation-calculator', 'swp-calculator'],
    disclaimerType: 'financial'
  },

  // 15. LOAN COMPARISON CALCULATOR
  {
    id: 'loan-comparison-calculator',
    slug: 'loan-comparison-calculator',
    name: 'Loan Comparison Calculator',
    shortName: 'Loan Comparison',
    category: 'finance',
    description: 'Compare two loan options side-by-side to discover total interest savings and optimal tenure.',
    iconName: 'Scale',
    keywords: ['loan compare', 'compare loans', 'interest comparison', 'bank comparison', 'emi comparison'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount',
        type: 'slider',
        defaultValue: 3000000,
        min: 100000,
        max: 10000000,
        step: 50000,
        prefix: 'currency'
      },
      {
        id: 'rate1',
        label: 'Loan 1: Interest Rate (%)',
        type: 'slider',
        defaultValue: 8.5,
        min: 5,
        max: 20,
        step: 0.1,
        suffix: '%'
      },
      {
        id: 'tenure1',
        label: 'Loan 1: Tenure (Years)',
        type: 'slider',
        defaultValue: 20,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' Yrs'
      },
      {
        id: 'rate2',
        label: 'Loan 2: Interest Rate (%)',
        type: 'slider',
        defaultValue: 8.0,
        min: 5,
        max: 20,
        step: 0.1,
        suffix: '%'
      },
      {
        id: 'tenure2',
        label: 'Loan 2: Tenure (Years)',
        type: 'slider',
        defaultValue: 15,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' Yrs'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const P = Number(inputs.loanAmount) || 3000000;
      const r1 = (Number(inputs.rate1) || 8.5) / 1200;
      const n1 = (Number(inputs.tenure1) || 20) * 12;
      const r2 = (Number(inputs.rate2) || 8.0) / 1200;
      const n2 = (Number(inputs.tenure2) || 15) * 12;

      const emi1 = (P * r1 * Math.pow(1 + r1, n1)) / (Math.pow(1 + r1, n1) - 1);
      const totalPay1 = emi1 * n1;
      const interest1 = totalPay1 - P;

      const emi2 = (P * r2 * Math.pow(1 + r2, n2)) / (Math.pow(1 + r2, n2) - 1);
      const totalPay2 = emi2 * n2;
      const interest2 = totalPay2 - P;

      const interestDiff = Math.abs(interest1 - interest2);
      const cheaperOption = interest1 < interest2 ? 'Loan 1' : 'Loan 2';

      return {
        primaryMetric: {
          label: `Interest Savings with ${cheaperOption}`,
          value: Math.round(interestDiff),
          formattedValue: formatCurrency(Math.round(interestDiff), currency),
          subtext: `${cheaperOption} saves ${formatCurrency(Math.round(interestDiff), currency)} in total interest`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'Loan 1: Monthly EMI',
            value: Math.round(emi1),
            formattedValue: formatCurrency(Math.round(emi1), currency),
            subtext: `Interest: ${formatCurrency(Math.round(interest1), currency)}`,
            type: 'neutral'
          },
          {
            label: 'Loan 2: Monthly EMI',
            value: Math.round(emi2),
            formattedValue: formatCurrency(Math.round(emi2), currency),
            subtext: `Interest: ${formatCurrency(Math.round(interest2), currency)}`,
            type: 'neutral'
          }
        ],
        chart: {
          type: 'bar',
          title: 'Total Cost Comparison: Loan 1 vs Loan 2',
          data: [
            { name: 'Loan 1', Principal: P, Interest: Math.round(interest1) },
            { name: 'Loan 2', Principal: P, Interest: Math.round(interest2) }
          ],
          series: [
            { key: 'Principal', name: 'Principal', color: '#3b82f6' },
            { key: 'Interest', name: 'Total Interest', color: '#ef4444' }
          ]
        }
      };
    },
    explanationSections: [
      {
        title: 'How Small Rate Reductions Yield Massive Savings',
        content: 'Even a 0.5% reduction in your home loan interest rate can save several lakhs of rupees over a 15-20 year tenure.'
      }
    ],
    faqs: [
      {
        question: 'Should I choose lower EMI or lower total interest?',
        answer: 'If your cashflow permits, choosing a shorter tenure with slightly higher EMI saves enormous sums in cumulative interest.'
      }
    ],
    relatedIds: ['emi-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  },

  // 16. SALARY HIKE / INCREMENT CALCULATOR
  {
    id: 'salary-hike-calculator',
    slug: 'salary-hike-calculator',
    name: 'Salary Hike & Increment Calculator',
    shortName: 'Salary Hike',
    category: 'finance',
    description: 'Calculate salary increment percentage, new annual CTC, and estimated new monthly take-home salary.',
    iconName: 'Briefcase',
    popular: true,
    keywords: ['salary hike', 'increment', 'ctc', 'take home', 'appraisal', 'pay rise', 'raise'],
    inputs: [
      {
        id: 'currentCtc',
        label: 'Current Annual CTC',
        type: 'slider',
        defaultValue: 1200000,
        min: 100000,
        max: 10000000,
        step: 25000,
        prefix: 'currency'
      },
      {
        id: 'hikePercent',
        label: 'Hike Percentage (%)',
        type: 'slider',
        defaultValue: 20,
        min: 1,
        max: 150,
        step: 1,
        suffix: '%'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const ctc = Number(inputs.currentCtc) || 1200000;
      const hike = Number(inputs.hikePercent) || 20;

      const incrementAmount = (ctc * hike) / 100;
      const newCtc = ctc + incrementAmount;

      const currentMonthly = ctc / 12;
      const newMonthly = newCtc / 12;
      const monthlyHike = newMonthly - currentMonthly;

      return {
        primaryMetric: {
          label: 'New Annual CTC',
          value: Math.round(newCtc),
          formattedValue: formatCurrency(Math.round(newCtc), currency),
          subtext: `+${formatCurrency(Math.round(incrementAmount), currency)} annual increase (${hike}%)`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'New Monthly Gross Salary',
            value: Math.round(newMonthly),
            formattedValue: formatCurrency(Math.round(newMonthly), currency) + ' / mo',
            type: 'success',
            subtext: `+${formatCurrency(Math.round(monthlyHike), currency)} monthly bump`
          },
          {
            label: 'Previous Monthly Salary',
            value: Math.round(currentMonthly),
            formattedValue: formatCurrency(Math.round(currentMonthly), currency) + ' / mo',
            type: 'neutral'
          }
        ],
        breakdown: [
          {
            label: 'Base CTC',
            value: ctc,
            formattedValue: formatCurrency(ctc, currency),
            percentage: Math.round((ctc / newCtc) * 100),
            color: '#3b82f6'
          },
          {
            label: 'Salary Hike',
            value: Math.round(incrementAmount),
            formattedValue: formatCurrency(Math.round(incrementAmount), currency),
            percentage: Math.round((incrementAmount / newCtc) * 100),
            color: '#10b981'
          }
        ]
      };
    },
    formula: {
      expression: 'New CTC = Current CTC × (1 + Hike% / 100)',
      explanation: 'Calculates the updated annual compensation and monthly gross split.',
      variables: [
        { symbol: 'New CTC', name: 'Updated Package', description: 'Total annual cost to company after appraisal.' }
      ]
    },
    explanationSections: [
      {
        title: 'Gross CTC vs In-Hand Salary',
        content: 'Remember that annual CTC includes employer PF, gratuity, performance bonuses, and taxes. Actual monthly in-hand net credit is typically 70%–85% of gross CTC.'
      }
    ],
    faqs: [
      {
        question: 'How do I negotiate a higher percentage hike?',
        answer: 'Quantify your measurable impact, cite industry benchmark compensation reports, and highlight certifications or special leadership responsibilities.'
      }
    ],
    relatedIds: ['cagr-calculator', 'roi-calculator', 'sip-calculator'],
    disclaimerType: 'financial'
  }
];
