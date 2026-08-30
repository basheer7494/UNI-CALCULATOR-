import { CalculatorDefinition } from '../../types/calculator';
import { formatCurrency, formatNumber } from '../utils';

export const businessCalculators: CalculatorDefinition[] = [
  // 1. PROFIT & LOSS CALCULATOR
  {
    id: 'profit-loss-calculator',
    slug: 'profit-loss-calculator',
    name: 'Profit & Loss (P&L) Calculator',
    shortName: 'Profit & Loss',
    category: 'business',
    description: 'Calculate net profit, loss, profit margin percentage, and markup percentage from Cost Price (CP) and Selling Price (SP).',
    iconName: 'TrendingUp',
    popular: true,
    featured: true,
    keywords: ['profit', 'loss', 'profit margin', 'cost price', 'selling price', 'markup', 'business math', 'gross profit'],
    inputs: [
      {
        id: 'costPrice',
        label: 'Cost Price (CP)',
        type: 'slider',
        defaultValue: 800,
        min: 1,
        max: 500000,
        step: 10,
        prefix: 'currency'
      },
      {
        id: 'sellingPrice',
        label: 'Selling Price (SP)',
        type: 'slider',
        defaultValue: 1200,
        min: 1,
        max: 500000,
        step: 10,
        prefix: 'currency'
      },
      {
        id: 'quantity',
        label: 'Units Sold (Quantity)',
        type: 'slider',
        defaultValue: 100,
        min: 1,
        max: 10000,
        step: 5
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const cp = Number(inputs.costPrice) || 800;
      const sp = Number(inputs.sellingPrice) || 1200;
      const qty = Number(inputs.quantity) || 100;

      const unitDiff = sp - cp;
      const isProfit = unitDiff >= 0;

      const totalRevenue = sp * qty;
      const totalCost = cp * qty;
      const totalDiff = Math.abs(unitDiff * qty);

      const marginPct = sp > 0 ? (unitDiff / sp) * 100 : 0;
      const markupPct = cp > 0 ? (unitDiff / cp) * 100 : 0;

      return {
        primaryMetric: {
          label: isProfit ? 'Total Net Profit' : 'Total Net Loss',
          value: totalDiff,
          formattedValue: formatCurrency(totalDiff, currency),
          subtext: `${Math.abs(marginPct).toFixed(2)}% Profit Margin | ${Math.abs(markupPct).toFixed(2)}% Markup`,
          type: isProfit ? 'highlight' : 'error',
          badge: isProfit ? `+${marginPct.toFixed(1)}% Margin` : `-${Math.abs(marginPct).toFixed(1)}% Loss`
        },
        secondaryMetrics: [
          {
            label: 'Total Revenue (Turnover)',
            value: totalRevenue,
            formattedValue: formatCurrency(totalRevenue, currency),
            type: 'neutral'
          },
          {
            label: 'Total Cost of Goods Sold',
            value: totalCost,
            formattedValue: formatCurrency(totalCost, currency),
            type: 'neutral'
          },
          {
            label: 'Profit per Unit',
            value: unitDiff,
            formattedValue: formatCurrency(unitDiff, currency),
            type: isProfit ? 'success' : 'error'
          }
        ],
        breakdown: [
          {
            label: 'Total Cost',
            value: totalCost,
            formattedValue: formatCurrency(totalCost, currency),
            percentage: Math.round((totalCost / totalRevenue) * 100),
            color: '#3b82f6'
          },
          {
            label: isProfit ? 'Net Profit' : 'Loss Gap',
            value: totalDiff,
            formattedValue: formatCurrency(totalDiff, currency),
            percentage: Math.round((totalDiff / totalRevenue) * 100),
            color: isProfit ? '#10b981' : '#ef4444'
          }
        ]
      };
    },
    formula: {
      expression: 'Profit Margin = [(SP - CP) / SP] × 100%   |   Markup = [(SP - CP) / CP] × 100%',
      explanation: 'Margin is profit divided by selling price (revenue). Markup is profit divided by cost price.',
      variables: [
        { symbol: 'SP', name: 'Selling Price', description: 'Price paid by the customer.' },
        { symbol: 'CP', name: 'Cost Price', description: 'Direct acquisition or production cost.' }
      ]
    },
    explanationSections: [
      {
        title: 'Difference Between Margin and Markup',
        content: 'Margin looks at profit relative to total revenue (topline). Markup looks at profit added on top of your direct cost. A 50% markup equals a 33.3% profit margin.'
      }
    ],
    faqs: [
      {
        question: 'How do I price products for a 40% margin?',
        answer: 'Selling Price = Cost Price ÷ (1 - 0.40) = Cost Price ÷ 0.60.'
      }
    ],
    relatedIds: ['profit-margin-calculator', 'markup-calculator', 'break-even-calculator', 'gst-calculator'],
    disclaimerType: 'standard'
  },

  // 2. PROFIT MARGIN CALCULATOR
  {
    id: 'profit-margin-calculator',
    slug: 'profit-margin-calculator',
    name: 'Gross & Net Profit Margin Calculator',
    shortName: 'Profit Margin',
    category: 'business',
    description: 'Calculate Gross Profit Margin, Operating Margin, and Net Profit Margin with overhead expenses and taxes.',
    iconName: 'BarChart3',
    popular: true,
    keywords: ['profit margin', 'gross margin', 'net margin', 'operating margin', 'business financials', 'ebitda'],
    inputs: [
      {
        id: 'revenue',
        label: 'Total Revenue / Sales',
        type: 'slider',
        defaultValue: 1000000,
        min: 10000,
        max: 50000000,
        step: 50000,
        prefix: 'currency'
      },
      {
        id: 'cogs',
        label: 'Cost of Goods Sold (COGS)',
        type: 'slider',
        defaultValue: 450000,
        min: 0,
        max: 50000000,
        step: 25000,
        prefix: 'currency'
      },
      {
        id: 'operatingExpenses',
        label: 'Operating & Marketing Expenses',
        type: 'slider',
        defaultValue: 250000,
        min: 0,
        max: 20000000,
        step: 10000,
        prefix: 'currency'
      },
      {
        id: 'taxRate',
        label: 'Corporate Tax Rate (%)',
        type: 'slider',
        defaultValue: 25,
        min: 0,
        max: 40,
        step: 1,
        suffix: '%'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const rev = Number(inputs.revenue) || 1000000;
      const cogs = Number(inputs.cogs) || 450000;
      const opex = Number(inputs.operatingExpenses) || 250000;
      const taxRate = Number(inputs.taxRate) || 25;

      const grossProfit = rev - cogs;
      const operatingProfit = grossProfit - opex;
      const taxes = operatingProfit > 0 ? (operatingProfit * taxRate) / 100 : 0;
      const netProfit = operatingProfit - taxes;

      const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
      const operatingMargin = rev > 0 ? (operatingProfit / rev) * 100 : 0;
      const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

      return {
        primaryMetric: {
          label: 'Net Profit Margin',
          value: Number(netMargin.toFixed(2)),
          formattedValue: `${netMargin.toFixed(2)}%`,
          subtext: `Net Profit: ${formatCurrency(Math.round(netProfit), currency)}`,
          type: netMargin >= 0 ? 'highlight' : 'error',
          badge: `Gross Margin: ${grossMargin.toFixed(1)}%`
        },
        secondaryMetrics: [
          {
            label: 'Gross Profit',
            value: grossProfit,
            formattedValue: formatCurrency(grossProfit, currency),
            subtext: `${grossMargin.toFixed(1)}% margin`,
            type: 'neutral'
          },
          {
            label: 'Operating Profit (EBIT)',
            value: operatingProfit,
            formattedValue: formatCurrency(operatingProfit, currency),
            subtext: `${operatingMargin.toFixed(1)}% margin`,
            type: 'neutral'
          },
          {
            label: 'Corporate Taxes Paid',
            value: Math.round(taxes),
            formattedValue: formatCurrency(Math.round(taxes), currency),
            type: 'neutral'
          }
        ],
        chart: {
          type: 'bar',
          title: 'Income Statement Flow (Waterfalls)',
          data: [
            { name: 'Revenue', Amount: rev },
            { name: 'COGS', Amount: cogs },
            { name: 'Gross Profit', Amount: grossProfit },
            { name: 'OpEx', Amount: opex },
            { name: 'Net Profit', Amount: Math.round(netProfit) }
          ],
          series: [
            { key: 'Amount', name: 'Financial Stream', color: '#3b82f6' }
          ]
        }
      };
    },
    formula: {
      expression: 'Net Margin = (Net Profit / Total Revenue) × 100%',
      explanation: 'Reflects the percentage of revenue remaining after all COGS, operating costs, interest, and taxes have been paid.',
      variables: [
        { symbol: 'Net Margin', name: 'Bottom Line Margin', description: 'True residual profitability percentage.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Net Margin is the Ultimate Metric',
        content: 'Gross margin only reflects product cost, whereas Net Margin proves whether your overhead, customer acquisition, and payroll costs are sustainable.'
      }
    ],
    faqs: [
      {
        question: 'What is a healthy net profit margin?',
        answer: 'Across general businesses, a 10% net profit margin is considered average, 20% is good, and 30%+ (common in software SaaS) is exceptional.'
      }
    ],
    relatedIds: ['profit-loss-calculator', 'break-even-calculator', 'gst-calculator'],
    disclaimerType: 'standard'
  },

  // 3. BREAK-EVEN CALCULATOR
  {
    id: 'break-even-calculator',
    slug: 'break-even-calculator',
    name: 'Break-Even Point (BEP) Calculator',
    shortName: 'Break-Even Calculator',
    category: 'business',
    description: 'Calculate the exact number of units and total sales revenue needed to cover fixed and variable business costs.',
    iconName: 'CheckCircle',
    popular: true,
    featured: true,
    keywords: ['break even', 'bep', 'fixed cost', 'variable cost', 'contribution margin', 'business launch', 'unit economics'],
    inputs: [
      {
        id: 'fixedCosts',
        label: 'Total Monthly Fixed Costs (Rent, Salaries, Software)',
        type: 'slider',
        defaultValue: 150000,
        min: 1000,
        max: 5000000,
        step: 5000,
        prefix: 'currency'
      },
      {
        id: 'pricePerUnit',
        label: 'Selling Price per Unit',
        type: 'slider',
        defaultValue: 500,
        min: 10,
        max: 50000,
        step: 10,
        prefix: 'currency'
      },
      {
        id: 'variableCostPerUnit',
        label: 'Variable Cost per Unit (COGS, Shipping, Packaging)',
        type: 'slider',
        defaultValue: 200,
        min: 1,
        max: 50000,
        step: 5,
        prefix: 'currency'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const fixed = Number(inputs.fixedCosts) || 150000;
      const price = Number(inputs.pricePerUnit) || 500;
      const variable = Number(inputs.variableCostPerUnit) || 200;

      const contributionMargin = price - variable;
      const marginRatio = price > 0 ? (contributionMargin / price) * 100 : 0;

      let breakEvenUnits = 0;
      let breakEvenRevenue = 0;

      if (contributionMargin > 0) {
        breakEvenUnits = Math.ceil(fixed / contributionMargin);
        breakEvenRevenue = breakEvenUnits * price;
      }

      const chartData = [];
      const stepUnits = Math.max(10, Math.round(breakEvenUnits / 4));
      for (let i = 0; i <= 6; i++) {
        const u = i * stepUnits;
        const rev = u * price;
        const totalCost = fixed + (u * variable);
        chartData.push({
          name: `${u} Units`,
          'Total Revenue': rev,
          'Total Costs': totalCost
        });
      }

      return {
        primaryMetric: {
          label: 'Break-Even Sales Required',
          value: breakEvenUnits,
          formattedValue: `${breakEvenUnits.toLocaleString()} Units`,
          subtext: `Total Revenue required: ${formatCurrency(breakEvenRevenue, currency)}`,
          type: 'highlight',
          badge: `${marginRatio.toFixed(1)}% Contribution Margin`
        },
        secondaryMetrics: [
          {
            label: 'Break-Even Revenue',
            value: breakEvenRevenue,
            formattedValue: formatCurrency(breakEvenRevenue, currency),
            type: 'neutral'
          },
          {
            label: 'Contribution Margin per Unit',
            value: contributionMargin,
            formattedValue: formatCurrency(contributionMargin, currency),
            type: contributionMargin > 0 ? 'success' : 'error'
          }
        ],
        chart: {
          type: 'line',
          title: 'Break-Even Revenue vs Total Cost Curve',
          data: chartData,
          series: [
            { key: 'Total Revenue', name: 'Revenue', color: '#10b981' },
            { key: 'Total Costs', name: 'Total Costs', color: '#ef4444' }
          ]
        }
      };
    },
    formula: {
      expression: 'BEP (Units) = Fixed Costs / (Price per Unit - Variable Cost per Unit)',
      explanation: 'Contribution margin (Price - Variable Cost) covers fixed overhead until profitability is reached.',
      variables: [
        { symbol: 'BEP', name: 'Break Even Point', description: 'Sales volume where total profit equals zero.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Break-Even Analysis is Crucial Before Launching',
        content: 'Knowing your break-even number tells you exactly how many sales your marketing and sales team must hit each month simply to keep the lights on.'
      }
    ],
    faqs: [
      {
        question: 'How do I lower my break-even point?',
        answer: 'You can lower your break-even point by increasing product price, reducing unit variable manufacturing costs, or trimming fixed recurring overhead.'
      }
    ],
    relatedIds: ['profit-loss-calculator', 'profit-margin-calculator', 'markup-calculator'],
    disclaimerType: 'standard'
  },

  // 4. GST / VAT CALCULATOR
  {
    id: 'gst-calculator',
    slug: 'gst-calculator',
    name: 'GST & VAT Calculator (Exclusive & Inclusive Tax)',
    shortName: 'GST / VAT Calculator',
    category: 'business',
    description: 'Calculate GST/VAT inclusive or exclusive amounts with 5%, 12%, 18%, 28% tax slabs and CGST + SGST split.',
    iconName: 'Receipt',
    popular: true,
    featured: true,
    keywords: ['gst', 'vat', 'sales tax', 'gst inclusive', 'gst exclusive', 'cgst', 'sgst', 'igst', 'invoice tax'],
    inputs: [
      {
        id: 'amount',
        label: 'Base or Invoice Amount',
        type: 'slider',
        defaultValue: 10000,
        min: 100,
        max: 1000000,
        step: 100,
        prefix: 'currency'
      },
      {
        id: 'taxRate',
        label: 'GST / Tax Slab (%)',
        type: 'select',
        defaultValue: 18,
        options: [
          { label: '5% (Essential Commodities)', value: 5 },
          { label: '12% (Standard Goods / Food)', value: 12 },
          { label: '18% (Services & Tech / Standard)', value: 18 },
          { label: '28% (Luxury Goods & Autos)', value: 28 },
          { label: 'Custom 0% - 40%', value: 'custom' }
        ]
      },
      {
        id: 'taxType',
        label: 'Calculation Type',
        type: 'select',
        defaultValue: 'exclusive',
        options: [
          { label: 'GST Exclusive (Add GST to amount)', value: 'exclusive' },
          { label: 'GST Inclusive (Extract GST from total)', value: 'inclusive' }
        ]
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const amount = Number(inputs.amount) || 10000;
      const rate = Number(inputs.taxRate) || 18;
      const type = inputs.taxType || 'exclusive';

      let basePrice = 0;
      let taxAmount = 0;
      let totalPrice = 0;

      if (type === 'exclusive') {
        basePrice = amount;
        taxAmount = (amount * rate) / 100;
        totalPrice = basePrice + taxAmount;
      } else {
        totalPrice = amount;
        basePrice = amount / (1 + rate / 100);
        taxAmount = totalPrice - basePrice;
      }

      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;

      return {
        primaryMetric: {
          label: type === 'exclusive' ? 'Total Bill (GST Inclusive)' : 'Net Base Price (Pre-Tax)',
          value: Math.round(type === 'exclusive' ? totalPrice : basePrice),
          formattedValue: formatCurrency(Math.round(type === 'exclusive' ? totalPrice : basePrice), currency),
          subtext: `Total GST (${rate}%): ${formatCurrency(Math.round(taxAmount), currency)}`,
          type: 'highlight',
          badge: `${rate}% GST Rate`
        },
        secondaryMetrics: [
          {
            label: 'CGST (Central GST)',
            value: Math.round(cgst),
            formattedValue: formatCurrency(Math.round(cgst), currency),
            subtext: `${(rate / 2).toFixed(1)}% rate`,
            type: 'neutral'
          },
          {
            label: 'SGST / UTGST (State GST)',
            value: Math.round(sgst),
            formattedValue: formatCurrency(Math.round(sgst), currency),
            subtext: `${(rate / 2).toFixed(1)}% rate`,
            type: 'neutral'
          },
          {
            label: 'Total Tax Amount',
            value: Math.round(taxAmount),
            formattedValue: formatCurrency(Math.round(taxAmount), currency),
            type: 'warning'
          }
        ],
        breakdown: [
          {
            label: 'Base Amount',
            value: Math.round(basePrice),
            formattedValue: formatCurrency(Math.round(basePrice), currency),
            percentage: Math.round((basePrice / totalPrice) * 100),
            color: '#3b82f6'
          },
          {
            label: 'GST Tax',
            value: Math.round(taxAmount),
            formattedValue: formatCurrency(Math.round(taxAmount), currency),
            percentage: Math.round((taxAmount / totalPrice) * 100),
            color: '#f59e0b'
          }
        ]
      };
    },
    formula: {
      expression: 'GST Exclusive = Cost + (Cost × Rate%)   |   GST Inclusive Base = Total / (1 + Rate%)',
      explanation: 'Applies standard value-added tax rules with split inter-state and intra-state taxation.',
      variables: [
        { symbol: 'CGST', name: 'Central GST', description: '50% of the applicable GST rate.' },
        { symbol: 'SGST', name: 'State GST', description: '50% of the applicable GST rate for intra-state supply.' }
      ]
    },
    explanationSections: [
      {
        title: 'Intra-State vs Inter-State GST',
        content: 'When selling within the same state, GST is split equally into CGST and SGST. When selling across state borders, the full rate applies as IGST (Integrated GST).'
      }
    ],
    faqs: [
      {
        question: 'How do I extract GST from an inclusive price?',
        answer: 'GST Amount = Total Inclusive Price - [Total Inclusive Price ÷ (1 + GST% ÷ 100)].'
      }
    ],
    relatedIds: ['discount-calculator', 'profit-margin-calculator', 'profit-loss-calculator'],
    disclaimerType: 'standard'
  },

  // 5. DISCOUNT & SAVINGS CALCULATOR
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount, Sale & Coupon Calculator',
    shortName: 'Discount Calculator',
    category: 'business',
    description: 'Calculate final discounted price, total money saved, stacked promo coupon codes, and sales tax.',
    iconName: 'Tag',
    popular: true,
    featured: true,
    keywords: ['discount', 'sale', 'coupon', 'promo code', 'shopping discount', 'black friday', 'savings'],
    inputs: [
      {
        id: 'originalPrice',
        label: 'Original Item Price',
        type: 'slider',
        defaultValue: 2500,
        min: 10,
        max: 100000,
        step: 50,
        prefix: 'currency'
      },
      {
        id: 'discountPercent',
        label: 'Store Discount (%)',
        type: 'slider',
        defaultValue: 30,
        min: 0,
        max: 95,
        step: 1,
        suffix: '%'
      },
      {
        id: 'additionalCoupon',
        label: 'Extra Coupon / Promo Code (%)',
        type: 'slider',
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 1,
        suffix: '%'
      },
      {
        id: 'salesTax',
        label: 'Sales Tax / GST (%)',
        type: 'slider',
        defaultValue: 5,
        min: 0,
        max: 30,
        step: 0.5,
        suffix: '%'
      }
    ],
    calculate: (inputs, currency = 'INR') => {
      const original = Number(inputs.originalPrice) || 2500;
      const d1 = Number(inputs.discountPercent) || 30;
      const d2 = Number(inputs.additionalCoupon) || 10;
      const tax = Number(inputs.salesTax) || 5;

      const priceAfterFirst = original * (1 - d1 / 100);
      const priceAfterSecond = priceAfterFirst * (1 - d2 / 100);
      const taxAmount = (priceAfterSecond * tax) / 100;
      const finalPrice = priceAfterSecond + taxAmount;
      const totalSavings = original - priceAfterSecond;

      const effectiveDiscount = ((original - priceAfterSecond) / original) * 100;

      return {
        primaryMetric: {
          label: 'Final You Pay (After Taxes)',
          value: Math.round(finalPrice),
          formattedValue: formatCurrency(Math.round(finalPrice), currency),
          subtext: `You save ${formatCurrency(Math.round(totalSavings), currency)} (${effectiveDiscount.toFixed(1)}% total off)`,
          type: 'highlight',
          badge: `${effectiveDiscount.toFixed(0)}% Off Total`
        },
        secondaryMetrics: [
          {
            label: 'Total Discount Saved',
            value: Math.round(totalSavings),
            formattedValue: formatCurrency(Math.round(totalSavings), currency),
            type: 'success'
          },
          {
            label: 'Sales Tax Added',
            value: Math.round(taxAmount),
            formattedValue: formatCurrency(Math.round(taxAmount), currency),
            type: 'neutral'
          },
          {
            label: 'Original Price',
            value: original,
            formattedValue: formatCurrency(original, currency),
            type: 'neutral'
          }
        ],
        breakdown: [
          {
            label: 'Final Price',
            value: Math.round(finalPrice),
            formattedValue: formatCurrency(Math.round(finalPrice), currency),
            percentage: Math.round((finalPrice / (original + taxAmount)) * 100),
            color: '#10b981'
          },
          {
            label: 'Total Savings',
            value: Math.round(totalSavings),
            formattedValue: formatCurrency(Math.round(totalSavings), currency),
            percentage: Math.round((totalSavings / (original + taxAmount)) * 100),
            color: '#3b82f6'
          }
        ]
      };
    },
    formula: {
      expression: 'Final Price = [Original × (1 - D1) × (1 - D2)] × (1 + Tax)',
      explanation: 'Stacked discounts are applied sequentially, rather than simply added together.',
      variables: [
        { symbol: 'D1', name: 'First Discount', description: 'Primary store markdown.' },
        { symbol: 'D2', name: 'Second Coupon', description: 'Additional checkout promo code.' }
      ]
    },
    explanationSections: [
      {
        title: 'Why 30% + 10% is NOT 40% Off',
        content: 'When retailers offer 30% off plus an extra 10% promo coupon, the 10% is deducted from the already-discounted price. The true effective discount is 37%, not 40%.'
      }
    ],
    faqs: [
      {
        question: 'Does sales tax apply before or after discount?',
        answer: 'In most jurisdictions, sales tax is calculated on the discounted final selling price, saving you tax money as well.'
      }
    ],
    relatedIds: ['gst-calculator', 'profit-loss-calculator', 'percentage-calculator'],
    disclaimerType: 'standard'
  }
];
