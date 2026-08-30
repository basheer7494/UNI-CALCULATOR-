# 🧮 Universal Calculator Hub

A modern, high-precision collection of **40+ interactive calculators** designed for Finance, Education, Engineering & Construction, Business & Commerce, Everyday Life, and Health & Fitness.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Recharts**, and **Motion**.

---

## ✨ Features

- **⚡ 40+ Specialized Calculators**: Comprehensive math engines covering loans, investments, taxes, physics, construction, academic GPAs, health metrics, and business forecasting.
- **📊 Real-Time Interactive Visualizations**: Dynamic area charts, bar charts, and radial breakdown rings powered by Recharts.
- **🔄 Dual Synchronized Inputs**: Seamlessly tweak values using precision sliders or numeric inputs with instant recalculation.
- **🌍 Multi-Currency & Indian Numbering System**: Native support for Lakhs/Crores (`₹1,00,000`) and Millions/Billions (`$1,000,000`) across INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), CAD, AUD, and AED.
- **📖 Educational Formula Breakdowns**: Every calculator includes mathematical formulas, step-by-step variable definitions, and contextual FAQ guides.
- **📋 Export & Sharing**: 
  - One-click copy for clean text summaries.
  - Shareable URL state encoding (`?c=sip-calculator&inputs=...`).
  - Printable / PDF summary export.
- **🔍 Instant Command Palette**: Global search accessible with `Ctrl + K` / `Cmd + K` or by category filter.
- **🌓 Dark & Light Mode**: Accessible contrast ratios and refined typographic hierarchy.

---

## 📂 Calculator Catalog

| Category | Available Calculators |
| :--- | :--- |
| **💰 Finance & Investment** | SIP Calculator, Step-up SIP, EMI Calculator, Home Loan Comparison, Loan Prepayment, FD Calculator, RD Calculator, Compound Interest, Simple Interest, CAGR, SWP, PPF, Retirement Planner, Inflation, Mutual Fund Returns |
| **🎓 Education & Academic** | CGPA Calculator, SGPA Calculator, Percentage to CGPA, Attendance Shortage, Exam Marks Target, Scientific Calculator |
| **⚙️ Engineering & Construction** | Ohm's Law (V=IR), Concrete Slab Volume, Brick & Mortar Estimator, Tile Flooring Estimator, Paint Coverage, Unit Converter (Length, Mass, Volume, Temp, Speed) |
| **💼 Business & Commerce** | GST Calculator (Inclusive/Exclusive), Profit & Loss, Margin & Markup, Break-Even Point, Discount & Sales Tax, ROAS (Ad Spend Return), Currency Converter |
| **🕒 Everyday Life** | Exact Age & Birthday Countdown, Date Difference & Workdays, Fuel Cost & Mileage, Tip & Split Bill, Cooking Unit Converter, Electricity Bill Estimator |
| **🏃 Health & Fitness** | BMI & Body Classification, BMR & Calorie Estimator (Mifflin-St Jeor), Daily Water Intake, Ideal Body Weight (Devine), Target Heart Rate Zones |

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Motion
- **Visualizations**: Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart, Cell)
- **Icons**: Lucide React
- **Build Tool**: Vite 6

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/universal-calculator-hub.git
   cd universal-calculator-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Run Type Checking & Linting:**
   ```bash
   npm run lint
   ```

---

## 📁 Project Architecture

```
├── index.html                   # HTML Entry point
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── src/
│   ├── main.tsx                 # Application mount
│   ├── App.tsx                  # Root layout & view controller
│   ├── index.css                # Global styles & Tailwind CSS
│   ├── types.ts                 # Type definitions for Calculators, Inputs & Metrics
│   ├── lib/
│   │   ├── utils.ts             # Currency, Lakhs/Crores & compact number formatters
│   │   ├── calculatorRegistry.ts# Master directory & categorization
│   │   └── calculators/         # Pure calculation domain engines
│   │       ├── finance.ts       # 15 Financial engines (SIP, EMI, PPF, etc.)
│   │       ├── academic.ts      # 6 Academic engines (CGPA, SGPA, etc.)
│   │       ├── engineering.ts   # 6 Engineering engines (Ohm's, Concrete, etc.)
│   │       ├── business.ts      # 7 Business engines (GST, Margin, ROAS, etc.)
│   │       ├── everyday.ts      # 6 Everyday engines (Age, Fuel, Tip, etc.)
│   │       └── health.ts        # 5 Health engines (BMI, BMR, Water, etc.)
│   └── components/
│       ├── Header.tsx           # Search bar, currency selector, theme toggle
│       ├── CategoryNav.tsx      # Horizontal category filter tabs
│       ├── CalculatorCard.tsx   # Calculator grid preview cards
│       ├── CalculatorView.tsx   # Interactive input panel, charts & results
│       ├── FormulaSection.tsx   # Mathematical formulas & variable explanations
│       ├── SearchModal.tsx      # Command palette modal (Ctrl+K)
│       └── PDFReportModal.tsx   # Printable PDF export generator
└── tests/
    ├── run-all-tests.ts         # High-precision calculation test runner
    └── fuzz1089.test.ts         # 1089-iteration boundary stress test suite
```

---

## 🧪 Testing & Precision Guarantee

Every calculation engine is validated against boundary edge cases:
- Safe handling of zero division, negative values, and non-finite inputs ($NaN$, $\pm\infty$).
- Currency formatting tested with Indian numbering format (Lakhs, Crores) and Western numbering format.
- Automated fuzz testing running 1,000+ permutations across all calculators.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
