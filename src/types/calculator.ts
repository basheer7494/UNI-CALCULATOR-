export type CategoryId = 
  | 'finance'
  | 'education'
  | 'engineering'
  | 'business'
  | 'everyday'
  | 'health'
  | 'converters';

export type CalculatorCategory = CategoryId;

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  shortDescription: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export type InputFieldType = 
  | 'number'
  | 'slider'
  | 'select'
  | 'toggle'
  | 'segmented'
  | 'date'
  | 'text'
  | 'custom';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface CalculatorInputField {
  id: string;
  label: string;
  type: InputFieldType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  options?: SelectOption[];
  tooltip?: string;
  helpText?: string;
  placeholder?: string;
  condition?: (values: Record<string, any>) => boolean;
}

export type CalculatorInput = CalculatorInputField;

export interface MetricCard {
  label: string;
  value: string | number;
  formattedValue?: string;
  subtext?: string;
  type?: 'primary' | 'secondary' | 'highlight' | 'neutral' | 'success' | 'warning' | 'error';
  badge?: string;
}

export interface BreakdownItem {
  label: string;
  value: string | number;
  formattedValue?: string;
  color?: string;
  percentage?: number;
  note?: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface TableRow {
  [key: string]: string | number | boolean;
}

export interface TableConfig {
  title: string;
  columns: { key: string; label: string; format?: 'currency' | 'number' | 'percent' | 'text' }[];
  data: TableRow[];
}

export interface CalculatorOutput {
  primaryMetric: MetricCard;
  secondaryMetrics?: MetricCard[];
  breakdown?: BreakdownItem[];
  chart?: {
    type: 'pie' | 'donut' | 'bar' | 'line' | 'area';
    title?: string;
    data: ChartDataPoint[];
    series?: { key: string; name: string; color: string }[];
  };
  table?: TableConfig;
  customVisual?: string; // e.g. 'resistor-preview', 'bmi-scale', 'attendance-status'
  customData?: Record<string, any>;
  summaryText?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorFormula {
  expression: string;
  explanation: string;
  variables: { symbol: string; name: string; description: string }[];
}

export interface CalculatorExample {
  title: string;
  scenario: string;
  steps: { step: string; calculation: string; result: string }[];
  conclusion: string;
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  category: CategoryId;
  description: string;
  iconName: string;
  popular?: boolean;
  featured?: boolean;
  keywords: string[];
  inputs: CalculatorInputField[];
  calculate: (inputs: Record<string, any>, currency?: string) => CalculatorOutput;
  formula?: CalculatorFormula;
  explanationSections: {
    title: string;
    content: string;
  }[];
  example?: CalculatorExample;
  faqs: FAQItem[];
  relatedIds: string[];
  disclaimerType?: 'financial' | 'health' | 'standard';
  customDisclaimer?: string;
  customComponent?: string;
}
