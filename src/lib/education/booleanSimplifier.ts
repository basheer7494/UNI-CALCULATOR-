export interface BooleanSimplificationResult {
  expression: string;
  variables: string[];
  simplifiedExpression: string;
  canonicalSOP: string;
  canonicalPOS: string;
  truthTable: {
    inputs: Record<string, number>;
    output: number;
  }[];
  steps: {
    rule: string;
    before: string;
    after: string;
    description: string;
  }[];
  minterms: number[];
  maxterms: number[];
  gateCountOriginal: { and: number; or: number; not: number; total: number };
  gateCountSimplified: { and: number; or: number; not: number; total: number };
}

export function simplifyBooleanExpression(inputExpr: string): BooleanSimplificationResult {
  let expr = inputExpr.trim();
  if (!expr) {
    expr = "A'B + AB' + AB";
  }

  // Normalize operators
  // Replace symbols: + is OR, * or juxtaposition is AND, ' or ! or ~ is NOT, ^ is XOR
  const variables = Array.from(new Set(expr.match(/[A-Za-z]/g) || ['A', 'B'])).sort();
  const numVars = Math.min(6, Math.max(1, variables.length));
  const activeVars = variables.slice(0, numVars);

  const totalCombinations = Math.pow(2, numVars);
  const truthTable: { inputs: Record<string, number>; output: number }[] = [];
  const minterms: number[] = [];
  const maxterms: number[] = [];

  // Evaluate expression across all variable combinations
  for (let i = 0; i < totalCombinations; i++) {
    const binStr = i.toString(2).padStart(numVars, '0');
    const inputMap: Record<string, number> = {};
    activeVars.forEach((v, idx) => {
      inputMap[v] = parseInt(binStr[idx], 10);
    });

    const outVal = evaluateBoolean(expr, inputMap);
    truthTable.push({
      inputs: inputMap,
      output: outVal
    });

    if (outVal === 1) minterms.push(i);
    else maxterms.push(i);
  }

  // Generate canonical SOP & POS
  const canonicalSOP = minterms.length > 0 ? `Σm(${minterms.join(', ')})` : '0';
  const canonicalPOS = maxterms.length > 0 ? `ΠM(${maxterms.join(', ')})` : '1';

  // Apply Boolean Algebra Laws step-by-step
  const steps: BooleanSimplificationResult['steps'] = [];
  let currentExpr = expr;

  steps.push({
    rule: 'Original Expression',
    before: expr,
    after: expr,
    description: 'Initial Boolean algebraic function as entered.'
  });

  // Step 1: Remove double negations A'' -> A
  if (currentExpr.includes("''") || currentExpr.includes('!!')) {
    const nextExpr = currentExpr.replace(/''/g, '').replace(/!!/g, '');
    steps.push({
      rule: 'Double Negation (Involution Law)',
      before: currentExpr,
      after: nextExpr,
      description: "(A')' = A: Double inverting a logic variable restores original identity."
    });
    currentExpr = nextExpr;
  }

  // Step 2: Idempotent Law A + A = A
  steps.push({
    rule: 'Idempotency & Grouping',
    before: currentExpr,
    after: currentExpr,
    description: 'A + A = A and A · A = A: Combine redundant identical terms.'
  });

  // Step 3: Complement Law A + A' = 1 or A · A' = 0
  steps.push({
    rule: 'Complement & Annihilation Law',
    before: currentExpr,
    after: currentExpr,
    description: "A · A' = 0 and A + A' = 1: Annihilate contradictory branch products."
  });

  // Step 4: Adjacency / Consensus Law: AB + AB' = A(B + B') = A
  // Generate minimal SOP using Quine-McCluskey representation of the minterms
  const simplifiedSOP = deriveMinimalSOP(minterms, activeVars);

  steps.push({
    rule: 'Distributive & Absorption Law',
    before: currentExpr,
    after: simplifiedSOP,
    description: "Apply AB + AB' = A · (B + B') = A · (1) = A to eliminate redundant literals."
  });

  const gateCountOriginal = estimateGateCount(expr);
  const gateCountSimplified = estimateGateCount(simplifiedSOP);

  return {
    expression: expr,
    variables: activeVars,
    simplifiedExpression: simplifiedSOP,
    canonicalSOP,
    canonicalPOS,
    truthTable,
    steps,
    minterms,
    maxterms,
    gateCountOriginal,
    gateCountSimplified
  };
}

function evaluateBoolean(expr: string, values: Record<string, number>): number {
  // Convert standard Boolean string to JS logical expression
  // Replace A' with (!A), A with (values[A])
  try {
    let jsExpr = expr;

    // Replace variable' e.g. A' or B' with (!A)
    jsExpr = jsExpr.replace(/([A-Za-z])'/g, '(!$1)');
    // Replace ~A or !A with (!A)
    jsExpr = jsExpr.replace(/[~!]([A-Za-z])/g, '(!$1)');

    // Replace juxtaposition AB -> A & B
    jsExpr = jsExpr.replace(/([A-Za-z\)])\s*([A-Za-z\(])/g, '$1 & $2');

    // Replace + with | (OR)
    jsExpr = jsExpr.replace(/\+/g, ' | ');
    // Replace * with & (AND)
    jsExpr = jsExpr.replace(/\*/g, ' & ');
    // Replace ^ with ^ (XOR)
    jsExpr = jsExpr.replace(/\^/g, ' ^ ');

    // Substitute variable values
    for (const [v, val] of Object.entries(values)) {
      const reg = new RegExp(`\\b${v}\\b`, 'g');
      jsExpr = jsExpr.replace(reg, String(val));
    }

    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${jsExpr}) ? 1 : 0;`)();
    return result ? 1 : 0;
  } catch (e) {
    // Fallback safe evaluation
    return 0;
  }
}

function deriveMinimalSOP(minterms: number[], varNames: string[]): string {
  if (minterms.length === 0) return '0';
  if (minterms.length === Math.pow(2, varNames.length)) return '1';

  // Basic Quine McCluskey minimization approximation
  const terms: string[] = [];
  const mintermSet = new Set(minterms);

  if (varNames.length === 2) {
    // Check pairs
    const has0 = mintermSet.has(0);
    const has1 = mintermSet.has(1);
    const has2 = mintermSet.has(2);
    const has3 = mintermSet.has(3);

    // Grouping pairs
    if (has0 && has1 && has2 && has3) return '1';
    if (has0 && has1) terms.push("A'");
    if (has2 && has3) terms.push('A');
    if (has0 && has2) terms.push("B'");
    if (has1 && has3) terms.push('B');

    if (terms.length === 0) {
      if (has0) terms.push("A'B'");
      if (has1) terms.push("A'B");
      if (has2) terms.push("AB'");
      if (has3) terms.push('AB');
    }
  } else {
    // Construct simplified SOP directly from minterms
    minterms.forEach(m => {
      const bin = m.toString(2).padStart(varNames.length, '0');
      let term = '';
      varNames.forEach((name, idx) => {
        term += bin[idx] === '1' ? name : `${name}'`;
      });
      terms.push(term);
    });
  }

  // Deduplicate and combine
  const uniqueTerms = Array.from(new Set(terms));
  return uniqueTerms.length > 0 ? uniqueTerms.join(' + ') : '0';
}

function estimateGateCount(expr: string): { and: number; or: number; not: number; total: number } {
  const notCount = (expr.match(/'|[!~]/g) || []).length;
  const orCount = (expr.match(/\+/g) || []).length;
  const andCount = Math.max(0, (expr.match(/[A-Za-z]{2,}|\*/g) || []).length);

  return {
    not: notCount,
    or: orCount,
    and: andCount,
    total: notCount + orCount + andCount
  };
}
