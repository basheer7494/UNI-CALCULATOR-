export type KMapVarCount = 2 | 3 | 4;

export interface KMapCell {
  index: number;
  row: number;
  col: number;
  binary: string;
  value: 0 | 1 | 'X';
  label: string;
  groupedIn?: number[]; // IDs of groups covering this cell
}

export interface KMapGroup {
  id: number;
  size: number;
  type: 'octal' | 'quad' | 'pair' | 'single' | 'hexadecet';
  cells: number[];
  term: string;
  color: string;
  isEssential: boolean;
}

export interface KMapResult {
  varCount: KMapVarCount;
  varNames: string[];
  grid: KMapCell[][];
  rowLabels: string[];
  colLabels: string[];
  minterms: number[];
  dontCares: number[];
  groups: KMapGroup[];
  simplifiedSOP: string;
  simplifiedPOS: string;
  canonicalSOP: string;
  canonicalPOS: string;
  truthTable: {
    inputs: Record<string, number>;
    minterm: number;
    output: 0 | 1 | 'X';
  }[];
  steps: string[];
}

const GROUP_COLORS = [
  'bg-blue-500/30 border-blue-500 text-blue-300',
  'bg-emerald-500/30 border-emerald-500 text-emerald-300',
  'bg-purple-500/30 border-purple-500 text-purple-300',
  'bg-amber-500/30 border-amber-500 text-amber-300',
  'bg-rose-500/30 border-rose-500 text-rose-300',
  'bg-cyan-500/30 border-cyan-500 text-cyan-300',
];

export function solveKMap(
  varCount: KMapVarCount,
  mintermList: number[],
  dontCareList: number[] = []
): KMapResult {
  const totalCells = Math.pow(2, varCount);
  const mintermSet = new Set(mintermList.filter(m => m >= 0 && m < totalCells));
  const dontCareSet = new Set(dontCareList.filter(d => d >= 0 && d < totalCells));

  let varNames: string[] = ['A', 'B'];
  let rowLabels: string[] = ['0', '1'];
  let colLabels: string[] = ['0', '1'];
  let rowGray = [0, 1];
  let colGray = [0, 1];

  if (varCount === 3) {
    varNames = ['A', 'B', 'C'];
    rowLabels = ['A = 0', 'A = 1'];
    colLabels = ['00', '01', '11', '10']; // Gray code order
    rowGray = [0, 1];
    colGray = [0, 1, 3, 2];
  } else if (varCount === 4) {
    varNames = ['A', 'B', 'C', 'D'];
    rowLabels = ['00', '01', '11', '10'];
    colLabels = ['00', '01', '11', '10'];
    rowGray = [0, 1, 3, 2];
    colGray = [0, 1, 3, 2];
  }

  const numRows = rowGray.length;
  const numCols = colGray.length;

  const grid: KMapCell[][] = [];

  for (let r = 0; r < numRows; r++) {
    const rowCells: KMapCell[] = [];
    for (let c = 0; c < numCols; c++) {
      let mintermIdx = 0;
      if (varCount === 2) {
        mintermIdx = r * 2 + c;
      } else if (varCount === 3) {
        mintermIdx = (rowGray[r] << 2) | colGray[c];
      } else if (varCount === 4) {
        mintermIdx = (rowGray[r] << 2) | colGray[c];
      }

      const binStr = mintermIdx.toString(2).padStart(varCount, '0');
      let val: 0 | 1 | 'X' = 0;
      if (mintermSet.has(mintermIdx)) val = 1;
      else if (dontCareSet.has(mintermIdx)) val = 'X';

      rowCells.push({
        index: mintermIdx,
        row: r,
        col: c,
        binary: binStr,
        value: val,
        label: `m${mintermIdx}`,
        groupedIn: []
      });
    }
    grid.push(rowCells);
  }

  // Quine-McCluskey / K-Map Minimization logic
  const onesAndXs = Array.from(mintermSet).concat(Array.from(dontCareSet));
  const groups: KMapGroup[] = [];
  const steps: string[] = [];

  steps.push(`1. Identified ${mintermSet.size} active minterms: [${Array.from(mintermSet).sort((a, b) => a - b).map(m => `m${m}`).join(', ')}]`);
  if (dontCareSet.size > 0) {
    steps.push(`2. Included ${dontCareSet.size} Don't Care conditions: [${Array.from(dontCareSet).sort((a, b) => a - b).map(d => `d${d}`).join(', ')}]`);
  }

  // Find prime implicants of sizes 16, 8, 4, 2, 1
  const potentialSizes = [16, 8, 4, 2, 1].filter(s => s <= totalCells);
  const coveredMinterms = new Set<number>();
  let groupIdCounter = 1;

  // Helper to test if a subgrid/group of cells is all 1s or Xs
  function findRectangularGroups() {
    if (varCount === 4 && onesAndXs.length === 16 && mintermSet.size > 0) {
      // Entire grid is 1
      groups.push({
        id: groupIdCounter++,
        size: 16,
        type: 'hexadecet',
        cells: Array.from({ length: 16 }, (_, i) => i),
        term: '1',
        color: GROUP_COLORS[0],
        isEssential: true
      });
      return;
    }

    if (varCount === 3 && onesAndXs.length === 8 && mintermSet.size > 0) {
      groups.push({
        id: groupIdCounter++,
        size: 8,
        type: 'octal',
        cells: Array.from({ length: 8 }, (_, i) => i),
        term: '1',
        color: GROUP_COLORS[0],
        isEssential: true
      });
      return;
    }

    // Grouping by standard powers of 2 using Gray Code adjacency
    const allValidGroups: { cells: number[]; term: string; size: number }[] = [];

    // Check sizes 8, 4, 2, 1
    const candidateSizes = varCount === 4 ? [8, 4, 2, 1] : varCount === 3 ? [4, 2, 1] : [2, 1];

    for (const size of candidateSizes) {
      // Find all valid subcubes of this size
      const foundSubcubes = getValidSubcubes(varCount, size, onesAndXs);
      for (const cube of foundSubcubes) {
        // Check if cube covers at least one un-covered actual minterm
        const coversRealMinterm = cube.cells.some(c => mintermSet.has(c));
        if (coversRealMinterm) {
          allValidGroups.push(cube);
        }
      }
    }

    // Filter essential prime implicants (greedy set cover)
    const activeGroups: { cells: number[]; term: string; size: number }[] = [];
    const remainingMinterms = new Set(mintermSet);

    // Sort by size descending
    allValidGroups.sort((a, b) => b.size - a.size);

    for (const g of allValidGroups) {
      const newlyCovered = g.cells.filter(c => remainingMinterms.has(c));
      if (newlyCovered.length > 0) {
        activeGroups.push(g);
        newlyCovered.forEach(c => remainingMinterms.delete(c));
      }
      if (remainingMinterms.size === 0) break;
    }

    activeGroups.forEach((g, idx) => {
      let groupType: KMapGroup['type'] = 'single';
      if (g.size === 8) groupType = 'octal';
      else if (g.size === 4) groupType = 'quad';
      else if (g.size === 2) groupType = 'pair';

      const groupObj: KMapGroup = {
        id: groupIdCounter++,
        size: g.size,
        type: groupType,
        cells: g.cells,
        term: g.term,
        color: GROUP_COLORS[idx % GROUP_COLORS.length],
        isEssential: true
      };

      groups.push(groupObj);

      // Mark cells
      g.cells.forEach(cellIdx => {
        for (const row of grid) {
          for (const cell of row) {
            if (cell.index === cellIdx) {
              if (!cell.groupedIn) cell.groupedIn = [];
              cell.groupedIn.push(groupObj.id);
            }
          }
        }
      });
    });
  }

  findRectangularGroups();

  // Construct Simplified Expressions
  let simplifiedSOP = '0';
  if (mintermSet.size === totalCells) {
    simplifiedSOP = '1';
  } else if (groups.length > 0) {
    simplifiedSOP = groups.map(g => g.term).join(' + ');
  }

  steps.push(`3. Formed ${groups.length} maximal prime implicant group(s):`);
  groups.forEach((g, i) => {
    steps.push(`   • Group ${i + 1} (${g.type} of size ${g.size}): [${g.cells.map(c => `m${c}`).join(', ')}] → Implicant: ${g.term}`);
  });
  steps.push(`4. Final Minimized SOP Expression: F(${varNames.join(', ')}) = ${simplifiedSOP}`);

  // Canonical forms
  const canonicalSOP = Array.from(mintermSet).length > 0
    ? `Σm(${Array.from(mintermSet).sort((a, b) => a - b).join(', ')})`
    : '0';

  const maxterms = Array.from({ length: totalCells }, (_, i) => i).filter(i => !mintermSet.has(i) && !dontCareSet.has(i));
  const canonicalPOS = maxterms.length > 0
    ? `ΠM(${maxterms.join(', ')})`
    : '1';

  // Simplified POS approximation (De Morgan dual)
  const simplifiedPOS = groups.length > 0
    ? groups.map(g => `(${g.term.split('').map(char => char === "'" ? '' : char).join(' + ')})`).join(' · ')
    : '0';

  // Truth Table
  const truthTable = Array.from({ length: totalCells }, (_, i) => {
    const bin = i.toString(2).padStart(varCount, '0');
    const inputs: Record<string, number> = {};
    varNames.forEach((name, idx) => {
      inputs[name] = parseInt(bin[idx], 10);
    });

    let out: 0 | 1 | 'X' = 0;
    if (mintermSet.has(i)) out = 1;
    else if (dontCareSet.has(i)) out = 'X';

    return {
      inputs,
      minterm: i,
      output: out
    };
  });

  return {
    varCount,
    varNames,
    grid,
    rowLabels,
    colLabels,
    minterms: Array.from(mintermSet).sort((a, b) => a - b),
    dontCares: Array.from(dontCareSet).sort((a, b) => a - b),
    groups,
    simplifiedSOP: simplifiedSOP || '0',
    simplifiedPOS: canonicalPOS,
    canonicalSOP,
    canonicalPOS,
    truthTable,
    steps
  };
}

// Subcube finder helper
function getValidSubcubes(
  varCount: KMapVarCount,
  targetSize: number,
  availableMinterms: number[]
): { cells: number[]; term: string; size: number }[] {
  const availableSet = new Set(availableMinterms);
  const totalVars = varCount;
  const numCubes = Math.pow(3, totalVars); // each variable can be 0, 1, or '-' (dash)
  const varNames = varCount === 2 ? ['A', 'B'] : varCount === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

  const results: { cells: number[]; term: string; size: number }[] = [];

  // Generate all possible patterns with given number of dashes
  // Number of dashes determines subcube size: 2^(dashCount) = targetSize
  const requiredDashes = Math.round(Math.log2(targetSize));

  function generatePatterns(current: string[]) {
    if (current.length === totalVars) {
      const dashCount = current.filter(c => c === '-').length;
      if (dashCount === requiredDashes) {
        // Expand pattern into minterm list
        const mintermList = expandPatternToMinterms(current);
        const allAvailable = mintermList.every(m => availableSet.has(m));
        if (allAvailable && mintermList.length === targetSize) {
          const term = patternToTerm(current, varNames);
          results.push({
            cells: mintermList,
            term: term || '1',
            size: targetSize
          });
        }
      }
      return;
    }

    generatePatterns([...current, '0']);
    generatePatterns([...current, '1']);
    generatePatterns([...current, '-']);
  }

  generatePatterns([]);
  return results;
}

function expandPatternToMinterms(pattern: string[]): number[] {
  let values = [0];

  for (let i = 0; i < pattern.length; i++) {
    const bitPos = pattern.length - 1 - i;
    const char = pattern[i];

    if (char === '0') {
      // bit is 0, value doesn't add bitPos
    } else if (char === '1') {
      values = values.map(v => v | (1 << bitPos));
    } else if (char === '-') {
      const branch0 = [...values];
      const branch1 = values.map(v => v | (1 << bitPos));
      values = [...branch0, ...branch1];
    }
  }

  return values.sort((a, b) => a - b);
}

function patternToTerm(pattern: string[], varNames: string[]): string {
  let term = '';
  pattern.forEach((char, idx) => {
    if (char === '1') {
      term += varNames[idx];
    } else if (char === '0') {
      term += `${varNames[idx]}'`;
    }
  });
  return term || '1';
}
