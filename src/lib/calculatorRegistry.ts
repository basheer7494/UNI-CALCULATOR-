import { CalculatorDefinition, CalculatorCategory } from '../types/calculator';
import { financeCalculators } from './calculators/finance';
import { educationCalculators } from './calculators/education';
import { engineeringCalculators } from './calculators/engineering';
import { businessCalculators } from './calculators/business';
import { everydayCalculators } from './calculators/everyday';
import { healthCalculators } from './calculators/health';

export const allCalculators: CalculatorDefinition[] = [
  ...financeCalculators,
  ...educationCalculators,
  ...engineeringCalculators,
  ...businessCalculators,
  ...everydayCalculators,
  ...healthCalculators
];

export interface CategoryInfo {
  id: CalculatorCategory;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  gradient: string;
  accentColor: string;
  borderColor: string;
  bgLight: string;
  count: number;
}

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  {
    id: 'finance',
    name: 'Finance & Investment Calculators',
    shortName: 'Finance',
    description: 'Smart wealth planning, SIP returns, EMI schedules, compound interest, FD, PPF & retirement projections.',
    iconName: 'Coins',
    gradient: 'from-emerald-500 to-teal-700',
    accentColor: 'emerald',
    borderColor: 'border-emerald-200 dark:border-emerald-900/50',
    bgLight: 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    count: financeCalculators.length
  },
  {
    id: 'education',
    name: 'Education & Academic Calculators',
    shortName: 'Education',
    description: 'Precision CGPA to percentage conversions, SGPA planners, minimum attendance required, and target exam calculators.',
    iconName: 'GraduationCap',
    gradient: 'from-indigo-500 to-blue-700',
    accentColor: 'indigo',
    borderColor: 'border-indigo-200 dark:border-indigo-900/50',
    bgLight: 'bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
    count: educationCalculators.length
  },
  {
    id: 'business',
    name: 'Business & Commercial Calculators',
    shortName: 'Business',
    description: 'Profit margins, GST / VAT breakdowns, break-even unit volumes, markups, and discount stacks.',
    iconName: 'Briefcase',
    gradient: 'from-blue-500 to-cyan-700',
    accentColor: 'blue',
    borderColor: 'border-blue-200 dark:border-blue-900/50',
    bgLight: 'bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
    count: businessCalculators.length
  },
  {
    id: 'engineering',
    name: 'Engineering & Scientific Calculators',
    shortName: 'Engineering',
    categoryName: 'engineering',
    description: "Ohm's law, 4/5-band resistor color codes, RC time constants, frequencies, and binary hex conversions.",
    iconName: 'Cpu',
    gradient: 'from-amber-500 to-orange-700',
    accentColor: 'amber',
    borderColor: 'border-amber-200 dark:border-amber-900/50',
    bgLight: 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    count: engineeringCalculators.length
  } as CategoryInfo,
  {
    id: 'everyday',
    name: 'Everyday Life & Utility Calculators',
    shortName: 'Everyday',
    description: 'Exact age milestones, working days duration, dining tip splits, temperature gauge, and universal unit conversions.',
    iconName: 'Sparkles',
    gradient: 'from-purple-500 to-violet-700',
    accentColor: 'purple',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
    bgLight: 'bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
    count: everydayCalculators.length
  },
  {
    id: 'health',
    name: 'Health & Wellness Calculators',
    shortName: 'Health',
    description: 'WHO BMI index categories, Mifflin-St Jeor BMR, TDEE daily calorie burn, water hydration & ideal weight estimates.',
    iconName: 'HeartPulse',
    gradient: 'from-rose-500 to-pink-700',
    accentColor: 'rose',
    borderColor: 'border-rose-200 dark:border-rose-900/50',
    bgLight: 'bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
    count: healthCalculators.length
  }
];

export function getAllCalculators(): CalculatorDefinition[] {
  return allCalculators;
}

export function getCalculatorById(idOrSlug: string): CalculatorDefinition | undefined {
  return allCalculators.find(c => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorDefinition[] {
  return allCalculators.filter(c => c.category === category);
}

export function getPopularCalculators(): CalculatorDefinition[] {
  return allCalculators.filter(c => c.popular);
}

export function getFeaturedCalculators(): CalculatorDefinition[] {
  return allCalculators.filter(c => c.featured);
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return [];

  return allCalculators.filter(calc => {
    const matchName = calc.name.toLowerCase().includes(clean);
    const matchShort = calc.shortName.toLowerCase().includes(clean);
    const matchDesc = calc.description.toLowerCase().includes(clean);
    const matchKeywords = calc.keywords?.some(k => k.toLowerCase().includes(clean));
    const matchCategory = calc.category.toLowerCase().includes(clean);

    return matchName || matchShort || matchDesc || matchKeywords || matchCategory;
  });
}
