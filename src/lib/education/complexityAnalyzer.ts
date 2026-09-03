export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript';

export interface CodeDiagnostic {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  line: number;
  message: string;
  rootCause: string;
  suggestedFix: string;
  autoFixAvailable?: boolean;
  fixedCode?: string;
}

export interface CodeComplexityResult {
  timeComplexity: string;
  timeComplexityNotation: {
    bigO: string;
    bigTheta: string;
    bigOmega: string;
  };
  spaceComplexity: string;
  auxiliarySpace: string;
  totalSpace: string;
  dominantTerm: string;
  explanationSteps: string[];
  lineAnnotations: {
    lineNumber: number;
    code: string;
    complexity: string;
    description: string;
  }[];
  chartData: {
    n: number;
    'O(1)': number;
    'O(log n)': number;
    'O(n)': number;
    'O(n log n)': number;
    'O(n^2)': number;
    'O(2^n)': number;
    'Your Algorithm': number;
  }[];
  summary: string;
  optimizationTips: string[];
  recursionDetected: boolean;
  recursionType?: string;
  loopDepth: number;
  confidence: 'high' | 'medium' | 'approximate';
  diagnostics: CodeDiagnostic[];
  operationsEstimateAt100: number;
  operationsEstimateAt1000: number;
  languageDetected: SupportedLanguage;
}

export const SAMPLE_PROGRAMS: {
  id: string;
  name: string;
  language: SupportedLanguage;
  category: string;
  expectedTime: string;
  code: string;
}[] = [
  // 1. PYTHON SAMPLES
  {
    id: 'py-linear-search',
    name: 'Python: Linear Search',
    language: 'python',
    category: 'Searching',
    expectedTime: 'O(n)',
    code: `# Python: Linear Search across a list
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
  },
  {
    id: 'py-binary-search',
    name: 'Python: Binary Search',
    language: 'python',
    category: 'Searching',
    expectedTime: 'O(log n)',
    code: `# Python: Binary Search with logarithmic pointer halving
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1`
  },
  {
    id: 'py-bubble-sort',
    name: 'Python: Bubble Sort',
    language: 'python',
    category: 'Sorting',
    expectedTime: 'O(n^2)',
    code: `# Python: Nested Quadratic Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
  },
  {
    id: 'py-merge-sort',
    name: 'Python: Merge Sort',
    language: 'python',
    category: 'Sorting',
    expectedTime: 'O(n log n)',
    code: `# Python: Merge Sort Divide & Conquer
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves in O(n)
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged`
  },
  {
    id: 'py-two-sum-hashmap',
    name: 'Python: Two Sum (Hash Map)',
    language: 'python',
    category: 'Hash Tables',
    expectedTime: 'O(n)',
    code: `# Python: Two Sum using Hash Table for O(n) time
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
  },
  {
    id: 'py-fib-recursive',
    name: 'Python: Naive Fibonacci',
    language: 'python',
    category: 'Recursion',
    expectedTime: 'O(2^n)',
    code: `# Python: Naive Exponential Fibonacci
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`
  },

  // 2. C++ SAMPLES
  {
    id: 'cpp-linear-search',
    name: 'C++: Linear Search',
    language: 'cpp',
    category: 'Searching',
    expectedTime: 'O(n)',
    code: `// C++: Linear Search
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`
  },
  {
    id: 'cpp-binary-search',
    name: 'C++: Binary Search',
    language: 'cpp',
    category: 'Searching',
    expectedTime: 'O(log n)',
    code: `// C++: Binary Search (Logarithmic)
int binarySearch(int arr[], int l, int r, int target) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) return m;
        if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  },
  {
    id: 'cpp-quick-sort',
    name: 'C++: Quick Sort (Partition)',
    language: 'cpp',
    category: 'Sorting',
    expectedTime: 'O(n log n)',
    code: `// C++: Quick Sort Divide & Conquer
int partition(int arr[], int low, int high);

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
  },
  {
    id: 'cpp-matrix-mult',
    name: 'C++: 3D Matrix Multiplication',
    language: 'cpp',
    category: 'Linear Algebra',
    expectedTime: 'O(n^3)',
    code: `// C++: Matrix Multiplication (n x n)
void multiply(int A[N][N], int B[N][N], int C[N][N], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}`
  },

  // 3. JAVA SAMPLES
  {
    id: 'java-bubble-sort',
    name: 'Java: Bubble Sort',
    language: 'java',
    category: 'Sorting',
    expectedTime: 'O(n^2)',
    code: `// Java: Bubble Sort
public static void bubbleSort(int[] arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
  },
  {
    id: 'java-binary-search',
    name: 'Java: Binary Search',
    language: 'java',
    category: 'Searching',
    expectedTime: 'O(log n)',
    code: `// Java: Binary Search
public static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
  },
  {
    id: 'java-merge-sort',
    name: 'Java: Merge Sort',
    language: 'java',
    category: 'Sorting',
    expectedTime: 'O(n log n)',
    code: `// Java: Merge Sort Recursion
public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
  },
  {
    id: 'java-fibonacci-dp',
    name: 'Java: Dynamic Programming',
    language: 'java',
    category: 'Dynamic Programming',
    expectedTime: 'O(n)',
    code: `// Java: Linear Dynamic Programming (Tabulation)
public static int fibonacci(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`
  },

  // 4. JAVASCRIPT SAMPLES
  {
    id: 'js-array-filter',
    name: 'JavaScript: Array Iteration',
    language: 'javascript',
    category: 'Collections',
    expectedTime: 'O(n)',
    code: `// JavaScript: Array Iteration & Mapping
function processData(items) {
    const active = items.filter(item => item.isActive);
    return active.map(item => item.value * 2);
}`
  },
  {
    id: 'js-binary-search',
    name: 'JavaScript: Binary Search',
    language: 'javascript',
    category: 'Searching',
    expectedTime: 'O(log n)',
    code: `// JavaScript: Binary Search
function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
  },
  {
    id: 'js-nested-pairs',
    name: 'JavaScript: Pair Combinations',
    language: 'javascript',
    category: 'Combinatorics',
    expectedTime: 'O(n^2)',
    code: `// JavaScript: Nested Pair Examination
function findPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            pairs.push([arr[i], arr[j]]);
        }
    }
    return pairs;
}`
  },

  // 5. C SAMPLES
  {
    id: 'c-matrix-mult',
    name: 'C: Matrix Multiplication',
    language: 'c',
    category: 'Linear Algebra',
    expectedTime: 'O(n^3)',
    code: `// C: Standard 3D Matrix Multiplication
void matmul(int A[N][N], int B[N][N], int C[N][N], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}`
  },
  {
    id: 'c-log-halving',
    name: 'C: Logarithmic Halving Loop',
    language: 'c',
    category: 'Number Theory',
    expectedTime: 'O(log n)',
    code: `// C: Logarithmic loop step
int countHalvings(int n) {
    int steps = 0;
    while (n > 1) {
        n = n / 2;
        steps++;
    }
    return steps;
}`
  }
];

/**
 * Remove multi-line and single-line comments cleanly
 */
function stripComments(code: string, language: SupportedLanguage): string[] {
  let cleaned = code;
  if (language === 'python') {
    // Multi-line docstrings: '''...''' or """..."""
    cleaned = cleaned.replace(/'''[\s\S]*?'''/g, '');
    cleaned = cleaned.replace(/"""[\s\S]*?"""/g, '');
  } else {
    // Multi-line /* ... */
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  const lines = cleaned.split('\n');
  return lines.map(line => {
    if (language === 'python') {
      const idx = line.indexOf('#');
      return idx >= 0 ? line.substring(0, idx) : line;
    } else {
      const idx = line.indexOf('//');
      return idx >= 0 ? line.substring(0, idx) : line;
    }
  });
}

/**
 * Static Diagnostics Engine: Detects root causes of code bugs & syntax errors
 */
export function runCodeDiagnostics(code: string, language: SupportedLanguage): CodeDiagnostic[] {
  const diagnostics: CodeDiagnostic[] = [];
  const rawLines = code.split('\n');
  const sanitizedLines = stripComments(code, language);

  // 1. Check bracket balance
  const braceStack: { char: string; line: number }[] = [];
  const parenStack: { char: string; line: number }[] = [];
  const bracketStack: { char: string; line: number }[] = [];

  for (let i = 0; i < sanitizedLines.length; i++) {
    const line = sanitizedLines[i];
    const lineNum = i + 1;

    for (const char of line) {
      if (char === '{') braceStack.push({ char, line: lineNum });
      else if (char === '}') {
        if (braceStack.length === 0) {
          diagnostics.push({
            id: `err-unmatched-brace-${lineNum}`,
            severity: 'error',
            title: 'Unmatched Closing Brace',
            line: lineNum,
            message: `Found extra closing brace '}' without a matching opening '{'.`,
            rootCause: `In ${language.toUpperCase()}, curly braces delimit scopes. An extra or unmatched closing brace causes syntax errors.`,
            suggestedFix: `Remove the stray '}' on line ${lineNum} or ensure the corresponding opening brace exists.`
          });
        } else {
          braceStack.pop();
        }
      } else if (char === '(') parenStack.push({ char, line: lineNum });
      else if (char === ')') {
        if (parenStack.length === 0) {
          diagnostics.push({
            id: `err-unmatched-paren-${lineNum}`,
            severity: 'error',
            title: 'Unmatched Closing Parenthesis',
            line: lineNum,
            message: `Found extra closing parenthesis ')' on line ${lineNum}.`,
            rootCause: `Mismatched parentheses break expression parsing.`,
            suggestedFix: `Check formula or loop condition on line ${lineNum} and remove or match the ')'.`
          });
        } else {
          parenStack.pop();
        }
      } else if (char === '[') bracketStack.push({ char, line: lineNum });
      else if (char === ']') {
        if (bracketStack.length === 0) {
          diagnostics.push({
            id: `err-unmatched-bracket-${lineNum}`,
            severity: 'error',
            title: 'Unmatched Square Bracket',
            line: lineNum,
            message: `Found unmatched ']' on line ${lineNum}.`,
            rootCause: `Array subscript or list indexing closing bracket has no opening counterpart.`,
            suggestedFix: `Ensure correct array indexing syntax.`
          });
        } else {
          bracketStack.pop();
        }
      }
    }
  }

  // Report unclosed openers
  if (braceStack.length > 0 && language !== 'python') {
    const unclosed = braceStack[braceStack.length - 1];
    diagnostics.push({
      id: `err-unclosed-brace-${unclosed.line}`,
      severity: 'error',
      title: 'Unclosed Block Scope',
      line: unclosed.line,
      message: `Opening brace '{' opened on line ${unclosed.line} was never closed.`,
      rootCause: `Functions and loops in ${language.toUpperCase()} require balanced closing braces '}'. Missing '}' prevents compilation.`,
      suggestedFix: `Add '}' at the end of the block or function.`
    });
  }

  if (parenStack.length > 0) {
    const unclosed = parenStack[parenStack.length - 1];
    diagnostics.push({
      id: `err-unclosed-paren-${unclosed.line}`,
      severity: 'error',
      title: 'Unclosed Parenthesis',
      line: unclosed.line,
      message: `Parenthesis '(' opened on line ${unclosed.line} was not closed.`,
      rootCause: `Function argument list or loop condition was left open.`,
      suggestedFix: `Close with ')' on or after line ${unclosed.line}.`
    });
  }

  // 2. Python specific diagnostics
  if (language === 'python') {
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check missing colon on control headers
      if (
        (trimmed.startsWith('def ') ||
         trimmed.startsWith('for ') ||
         trimmed.startsWith('while ') ||
         trimmed.startsWith('if ') ||
         trimmed.startsWith('elif ') ||
         trimmed === 'else' ||
         trimmed.startsWith('else ')) &&
        !trimmed.endsWith(':')
      ) {
        diagnostics.push({
          id: `err-py-colon-${lineNum}`,
          severity: 'error',
          title: 'Missing Colon (SyntaxError)',
          line: lineNum,
          message: `Python requires a colon ':' at the end of '${trimmed.split(' ')[0]}' statements.`,
          rootCause: `In Python syntax, block headers must terminate with ':' to introduce an indented suite.`,
          suggestedFix: `Append ':' to the end of line ${lineNum}: '${trimmed}:'`,
          autoFixAvailable: true
        });
      }

      // Check mixed tabs and spaces
      if (line.includes('\t') && line.includes('    ')) {
        diagnostics.push({
          id: `warn-py-tabspace-${lineNum}`,
          severity: 'warning',
          title: 'Mixed Tabs and Spaces',
          line: lineNum,
          message: `Line ${lineNum} mixes tabs and spaces for indentation.`,
          rootCause: `PEP 8 disallows mixing tabs and spaces; Python 3 raises TabError.`,
          suggestedFix: `Convert all tabs to 4 spaces consistently.`,
          autoFixAvailable: true
        });
      }
    }
  }

  // 3. Infinite loop risks
  for (let i = 0; i < sanitizedLines.length; i++) {
    const line = sanitizedLines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;

    // While (true) without break or return
    if (
      trimmed.match(/^while\s*\(?\s*(?:true|1)\s*\)?\s*:?/i) ||
      trimmed === 'while True:'
    ) {
      // Check next 20 lines for break or return
      const lookahead = sanitizedLines.slice(i, i + 25).join('\n');
      if (!lookahead.includes('break') && !lookahead.includes('return')) {
        diagnostics.push({
          id: `warn-inf-loop-${lineNum}`,
          severity: 'warning',
          title: 'Potential Infinite Loop Hazard',
          line: lineNum,
          message: `'while True' loop on line ${lineNum} does not contain an explicit 'break' or 'return' statement in its body.`,
          rootCause: `Loops with constant true conditions will execute indefinitely without a break or return statement, causing thread freeze.`,
          suggestedFix: `Ensure a termination condition with 'break' or 'return' is reached.`
        });
      }
    }

    // Check for loop index off-by-one: e.g. for (int i = 0; i <= n; i++) accessing arr[i]
    if (
      trimmed.match(/for\s*\(\s*int\s+([a-zA-Z0-9_]+)\s*=\s*0\s*;\s*\1\s*<=\s*([a-zA-Z0-9_]+)\s*;\s*\1\+\+\s*\)/)
    ) {
      diagnostics.push({
        id: `info-off-by-one-${lineNum}`,
        severity: 'info',
        title: 'Potential Off-By-One Array Bound (i <= n)',
        line: lineNum,
        message: `Loop condition uses '<=' with 0-indexed counter on line ${lineNum}.`,
        rootCause: `Standard 0-indexed arrays of size n have valid indices 0 to n-1. Iterating to '<= n' accesses index n (out of bounds).`,
        suggestedFix: `Change '<=' to '<' if iterating through an array of length n.`
      });
    }
  }

  return diagnostics;
}

/**
 * Main AST & Logic Pattern Analyzer
 */
export function analyzeCodeComplexity(code: string, language: SupportedLanguage): CodeComplexityResult {
  const cleanCode = code.trim();
  const rawLines = cleanCode.split('\n');

  if (!cleanCode) {
    return createEmptyResult(language);
  }

  const sanitizedLines = stripComments(cleanCode, language);
  const diagnostics = runCodeDiagnostics(code, language);

  // Extract defined function names (ignoring forward declarations ending in ;)
  const functionNames: string[] = [];
  const linesWithoutComments = sanitizedLines;

  for (const line of linesWithoutComments) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.endsWith(';')) continue; // skip forward declarations ending with ;

    const pyMatch = trimmed.match(/^def\s+([a-zA-Z0-9_]+)\s*\(/);
    const jsMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(|^(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>)/);
    const cLikeMatch = trimmed.match(/^(?:(?:public|private|protected|static|final|inline|virtual|synchronized)\s+)*[a-zA-Z0-9_<>[\]*&:]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{?/);

    if (pyMatch && pyMatch[1]) functionNames.push(pyMatch[1]);
    else if (jsMatch && (jsMatch[1] || jsMatch[2])) functionNames.push(jsMatch[1] || jsMatch[2]);
    else if (cLikeMatch && cLikeMatch[1] && !trimmed.startsWith('return ') && !trimmed.startsWith('if ') && !trimmed.startsWith('while ') && !trimmed.startsWith('for ')) {
      functionNames.push(cLikeMatch[1]);
    }
  }

  // Primary function name
  const functionName = functionNames[0] || '';

  // Tracking loop blocks and depths
  let maxLoopNesting = 0;
  let loopCount = 0;
  let hasLogarithmicLoop = false;
  let recursiveCallCount = 0;
  let isDivideAndConquer = false;
  let isExponentialRecursion = false;
  let isLinearRecursion = false;
  let allocatesArray = false;
  let allocates2DArray = false;

  const lineAnnotations: CodeComplexityResult['lineAnnotations'] = [];
  const explanationSteps: string[] = [];

  // Scoped loop tracking
  // In Python: track indent stack of active loops
  const pyLoopIndentStack: number[] = [];

  // In C-like: track braces stack
  interface BlockScope {
    isLoop: boolean;
    isLogarithmic?: boolean;
  }
  const cBlockStack: BlockScope[] = [];

  for (let idx = 0; idx < rawLines.length; idx++) {
    const rawLine = rawLines[idx];
    const sanitized = sanitizedLines[idx] || '';
    const lineNum = idx + 1;
    const trimmed = sanitized.trim();

    if (!trimmed) {
      continue;
    }

    let lineComplexity = 'O(1)';
    let lineDescription = 'Constant time basic operation';

    // Memory / Array Allocation Detection
    if (
      trimmed.match(/new\s+(?:int|double|float|long|char|String)\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/vector<[a-zA-Z0-9_]+>\s+[a-zA-Z0-9_]+\s*\([a-zA-Z0-9_]+\)/) ||
      trimmed.match(/new\s+Array\([a-zA-Z0-9_]+\)/) ||
      trimmed.match(/\[0\]\s*\*\s*[a-zA-Z0-9_]+/) ||
      trimmed.match(/int\s+[a-zA-Z0-9_]+\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/malloc\s*\(\s*(?:sizeof|\w+)/)
    ) {
      allocatesArray = true;
      lineComplexity = 'O(n) Space';
      lineDescription = 'Allocates linear auxiliary storage of size proportional to n';
    }

    if (
      trimmed.match(/\[[a-zA-Z0-9_]+\]\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/new\s+int\[[a-zA-Z0-9_]+\]\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/vector<vector<.*>>/) ||
      trimmed.match(/\[\[.*\]\s*for\s+.*in\s+range/)
    ) {
      allocates2DArray = true;
      lineComplexity = 'O(n^2) Space';
      lineDescription = 'Allocates 2D matrix storage (n × n quadratic auxiliary space)';
    }

    // Loop Header Identification
    const isForHeader =
      trimmed.startsWith('for ') ||
      trimmed.startsWith('for(') ||
      trimmed.match(/^for\s*\(.*\)/) ||
      (trimmed.includes('.forEach(') || trimmed.includes('.map(') || trimmed.includes('.filter('));

    const isWhileHeader =
      trimmed.startsWith('while ') ||
      trimmed.startsWith('while(') ||
      trimmed.match(/^while\s*\(.*\)/);

    // Stepping checks (in current line or surrounding body)
    const lineHasLogStep =
      /\b[a-zA-Z0-9_]+\s*\*=\s*2/.test(trimmed) ||
      /\b[a-zA-Z0-9_]+\s*\/=\s*2/.test(trimmed) ||
      /\b[a-zA-Z0-9_]+\s*>>=\s*1/.test(trimmed) ||
      /\b[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+\s*[*\/]\s*2/.test(trimmed) ||
      /\b[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+\s*\/\/\s*2/.test(trimmed) ||
      trimmed.includes('low = mid + 1') ||
      trimmed.includes('high = mid - 1') ||
      trimmed.includes('l = m + 1') ||
      trimmed.includes('r = m - 1') ||
      trimmed.includes('m = l + (r - l) / 2') ||
      trimmed.includes('(low + high) // 2') ||
      trimmed.includes('(low + high) / 2') ||
      trimmed.includes('mid = Math.floor') ||
      trimmed.includes('n >> 1');

    if (lineHasLogStep) {
      hasLogarithmicLoop = true;
    }

    // Python Indentation Scope Management
    if (language === 'python') {
      const leadingSpaces = rawLine.search(/\S/);

      // Pop finished loops whose indentation is >= current line's leading spaces
      while (
        pyLoopIndentStack.length > 0 &&
        leadingSpaces <= pyLoopIndentStack[pyLoopIndentStack.length - 1]
      ) {
        pyLoopIndentStack.pop();
      }

      if (isForHeader || isWhileHeader) {
        loopCount++;
        pyLoopIndentStack.push(leadingSpaces);
        const currentDepth = pyLoopIndentStack.length;
        if (currentDepth > maxLoopNesting) {
          maxLoopNesting = currentDepth;
        }

        // Check if loop body contains binary search / logarithmic step
        const nextFewLines = sanitizedLines.slice(idx, idx + 10).join('\n');
        const isLog =
          lineHasLogStep ||
          nextFewLines.includes('// 2') ||
          nextFewLines.includes('/ 2') ||
          nextFewLines.includes('mid =') ||
          nextFewLines.includes('low = mid') ||
          nextFewLines.includes('high = mid');

        if (isLog) {
          hasLogarithmicLoop = true;
          lineComplexity = 'O(log n)';
          lineDescription = `Logarithmic loop halving (nesting level ${currentDepth})`;
        } else {
          lineComplexity = `O(n)`;
          lineDescription = `Linear iteration (nesting level ${currentDepth})`;
        }
      }
    } else {
      // C / C++ / Java / JS Scope Management
      if (isForHeader || isWhileHeader) {
        loopCount++;
        // Check next few lines for log step
        const nextFewLines = sanitizedLines.slice(idx, idx + 10).join('\n');
        const isLog =
          lineHasLogStep ||
          nextFewLines.includes('/ 2') ||
          nextFewLines.includes('mid =') ||
          nextFewLines.includes('>>= 1') ||
          nextFewLines.includes('m = l + (r - l) / 2') ||
          nextFewLines.includes('low = mid') ||
          nextFewLines.includes('l = m + 1');

        if (isLog) {
          hasLogarithmicLoop = true;
          lineComplexity = 'O(log n)';
        } else {
          lineComplexity = 'O(n)';
        }

        // If line has '{', open loop block immediately
        const isSelfContainedCall = trimmed.includes('.forEach(') || trimmed.includes('.map(') || trimmed.includes('.filter(');
        let activeLoops = cBlockStack.filter(b => b.isLoop).length;

        if (trimmed.includes('{')) {
          cBlockStack.push({ isLoop: true, isLogarithmic: isLog });
          activeLoops = cBlockStack.filter(b => b.isLoop).length;
        } else if (isSelfContainedCall || trimmed.endsWith(';')) {
          // Self-contained loop statement that finishes on this line
          activeLoops += 1;
        } else {
          // Single-statement loop or opens block on next line
          cBlockStack.push({ isLoop: true, isLogarithmic: isLog });
          activeLoops = cBlockStack.filter(b => b.isLoop).length;
        }

        if (activeLoops > maxLoopNesting) {
          maxLoopNesting = activeLoops;
        }
        lineDescription = `${isLog ? 'Logarithmic' : 'Linear'} loop iteration (nesting level ${activeLoops})`;
      } else {
        // Track general braces
        const openBraces = (trimmed.match(/\{/g) || []).length;
        const closeBraces = (trimmed.match(/\}/g) || []).length;

        for (let b = 0; b < openBraces; b++) {
          cBlockStack.push({ isLoop: false });
        }
        for (let b = 0; b < closeBraces; b++) {
          if (cBlockStack.length > 0) {
            cBlockStack.pop();
          }
        }
      }
    }

    // Recursion Detection
    const matchingRecursiveFn = functionNames.find(fn => trimmed.includes(`${fn}(`));
    if (matchingRecursiveFn) {
      const isDefLine =
        trimmed.startsWith('def ') ||
        trimmed.startsWith('function ') ||
        trimmed.startsWith('export ') ||
        /^(?:(?:public|private|protected|static|final|inline|virtual|synchronized)\s+)*[a-zA-Z0-9_<>[\]*&:]+\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{?$/.test(trimmed);

      if (!isDefLine && !trimmed.startsWith('//') && !trimmed.startsWith('#')) {
        recursiveCallCount++;
        const matchesOnLine = (trimmed.match(new RegExp(`${matchingRecursiveFn}\\s*\\(`, 'g')) || []).length;

        const isHalvingArg =
          trimmed.includes('/ 2') ||
          trimmed.includes('// 2') ||
          trimmed.includes('- l) / 2') ||
          trimmed.includes('mid') ||
          trimmed.includes('pi') ||
          trimmed.includes('m + 1') ||
          trimmed.includes('m - 1');

        if (isHalvingArg) {
          isDivideAndConquer = true;
          lineComplexity = matchesOnLine >= 2 ? '2 × T(n/2)' : 'T(n/2)';
          lineDescription = matchesOnLine >= 2
            ? 'Divide & Conquer branching into 2 subproblems of size n/2'
            : 'Divide & Conquer single branch halving of size n/2';
        } else if (trimmed.includes('- 1') || trimmed.includes('- 2') || trimmed.includes('n -')) {
          if (matchesOnLine >= 2) {
            isExponentialRecursion = true;
            lineComplexity = '2 × T(n-1)';
            lineDescription = 'Unmemoized exponential recursive branching (e.g. Fibonacci)';
          } else {
            lineComplexity = 'T(n-1)';
            lineDescription = 'Single recursive subproblem of size n-1 (Linear recursion)';
          }
        } else {
          lineComplexity = 'T(n-1)';
          lineDescription = 'Recursive call step';
        }
      }
    }

    lineAnnotations.push({
      lineNumber: lineNum,
      code: rawLine,
      complexity: lineComplexity,
      description: lineDescription
    });
  }

  // Derive Asymptotic Complexity
  let timeBigO = 'O(1)';
  let timeBigTheta = 'Θ(1)';
  let timeBigOmega = 'Ω(1)';
  let spaceBigO = 'O(1)';
  let auxiliarySpace = 'O(1)';
  let totalSpace = 'O(1)';
  let dominantTerm = '1 (Constant)';
  let summary = '';
  let confidence: 'high' | 'medium' | 'approximate' = 'high';
  const optimizationTips: string[] = [];

  // Recursive scenarios
  if (recursiveCallCount > 0) {
    if (isExponentialRecursion) {
      timeBigO = 'O(2^n)';
      timeBigTheta = 'Θ(2^n)';
      timeBigOmega = 'Ω(2^n)';
      spaceBigO = 'O(n)';
      auxiliarySpace = 'O(n)';
      totalSpace = 'O(n)';
      dominantTerm = '2ⁿ (Exponential)';
      explanationSteps.push(
        'Detected recursive branching: Function calls itself 2 or more times per level with decrement (n-1).',
        'Recurrence Relation: T(n) = 2T(n-1) + O(1) = O(2ⁿ).',
        'Recursion Tree: Total nodes at depth k = 2ᵏ, leading to 2ⁿ total operations.',
        'Auxiliary Space: O(n) call-stack depth memory frames.'
      );
      summary = 'Exponential Time Complexity O(2ⁿ). Execution time doubles for every incremental increase in input size n.';
      optimizationTips.push(
        'Apply Dynamic Programming or Memoization to store solved subproblems and collapse complexity to O(n).',
        'Convert recursive state traversal into an iterative bottom-up array loop.'
      );
    } else if (isDivideAndConquer) {
      const hasLinearMerge =
        cleanCode.includes('merge(') ||
        cleanCode.includes('partition(') ||
        cleanCode.includes('merged =') ||
        loopCount > 0;

      if (hasLinearMerge) {
        timeBigO = 'O(n log n)';
        timeBigTheta = 'Θ(n log n)';
        timeBigOmega = 'Ω(n log n)';
        spaceBigO = 'O(n)';
        auxiliarySpace = cleanCode.includes('partition') ? 'O(log n)' : 'O(n)';
        totalSpace = 'O(n)';
        dominantTerm = 'n log n (Linearithmic)';
        explanationSteps.push(
          'Detected Divide and Conquer recursion with linear merge/partition pass (e.g. Merge Sort, Quick Sort).',
          'Recurrence Relation: T(n) = 2T(n/2) + O(n).',
          'Master Theorem: Case 2 where a = 2, b = 2, f(n) = O(n). Since log₂(2) = 1, T(n) = Θ(n log n).',
          'Tree depth is log₂(n), and total work across all nodes at each level is O(n).'
        );
        summary = 'Linearithmic Time Complexity O(n log n). The gold standard for comparison-based sorting.';
        optimizationTips.push(
          'Ensure randomized pivot selection (Quick Sort) to guarantee O(n log n) expected bounds and avoid worst-case O(n²).'
        );
      } else {
        timeBigO = 'O(log n)';
        timeBigTheta = 'Θ(log n)';
        timeBigOmega = 'Ω(1)';
        spaceBigO = 'O(log n)';
        auxiliarySpace = 'O(log n)';
        totalSpace = 'O(1)';
        dominantTerm = 'log n (Logarithmic)';
        explanationSteps.push(
          'Detected single-branch recursive halving (Recursive Binary Search).',
          'Recurrence Relation: T(n) = T(n/2) + O(1).',
          'Master Theorem: a = 1, b = 2, f(n) = O(1). T(n) = Θ(log n).',
          'Call stack memory depth = log₂(n) frames.'
        );
        summary = 'Logarithmic Time Complexity O(log n). The search space is halved at every recursion depth.';
      }
    } else if (isLinearRecursion) {
      timeBigO = 'O(n)';
      timeBigTheta = 'Θ(n)';
      timeBigOmega = 'Ω(1)';
      spaceBigO = 'O(n)';
      auxiliarySpace = 'O(n)';
      totalSpace = 'O(n)';
      dominantTerm = 'n (Linear)';
      explanationSteps.push(
        'Detected linear recursion with step reduction n - 1 (e.g. Factorial or linked list traversal).',
        'Recurrence Relation: T(n) = T(n-1) + O(1) = O(n).',
        'Allocates n sequential stack frames on the call stack.'
      );
      summary = 'Linear Time Complexity O(n) with O(n) call-stack memory depth.';
      optimizationTips.push(
        'Convert to an iterative loop to avoid stack overflow errors on large inputs (n > 10,000).'
      );
    }
  } else {
    // Iterative Loop Scenarios
    if (maxLoopNesting >= 3) {
      timeBigO = 'O(n^3)';
      timeBigTheta = 'Θ(n^3)';
      timeBigOmega = 'Ω(n^3)';
      dominantTerm = 'n³ (Cubic)';
      explanationSteps.push(
        `Detected 3 levels of nested loops: Outer O(n) × Middle O(n) × Inner O(n).`,
        `Total iterations = n × n × n = n³ operations.`,
        `Common in standard 3D Matrix Multiplication and 3-Sum brute-force algorithms.`
      );
      summary = 'Cubic Time Complexity O(n³). Operations grow exponentially as n³ (n=1,000 → 1,000,000,000 operations).';
      optimizationTips.push(
        'Investigate Strassen Matrix Multiplication algorithm to reduce complexity to O(n^2.81).'
      );
    } else if (maxLoopNesting === 2) {
      if (hasLogarithmicLoop) {
        timeBigO = 'O(n log n)';
        timeBigTheta = 'Θ(n log n)';
        timeBigOmega = 'Ω(n log n)';
        dominantTerm = 'n log n (Linearithmic)';
        explanationSteps.push(
          'Detected nested loops where an outer linear loop O(n) is paired with an inner logarithmic loop O(log n).',
          'Total iterations = n × log₂(n) = O(n log n).'
        );
        summary = 'Linearithmic Time Complexity O(n log n). Highly efficient sub-quadratic scaling.';
      } else {
        timeBigO = 'O(n^2)';
        timeBigTheta = 'Θ(n^2)';
        timeBigOmega = 'Ω(n)';
        dominantTerm = 'n² (Quadratic)';
        explanationSteps.push(
          'Detected 2 levels of nested loops (Outer loop runs n times, inner loop runs up to n times).',
          'Arithmetic series: Σ i (from 1 to n) = n(n-1)/2 = 0.5n² - 0.5n = O(n²).',
          'Found in Bubble Sort, Selection Sort, and quadratic pair comparisons.'
        );
        summary = 'Quadratic Time Complexity O(n²). Runtime quadruples every time input size n doubles.';
        optimizationTips.push(
          'Consider using a Hash Table (Set/Map) to replace the inner loop lookup, bringing time down from O(n²) to O(n).'
        );
      }
    } else if (maxLoopNesting === 1) {
      if (hasLogarithmicLoop) {
        timeBigO = 'O(log n)';
        timeBigTheta = 'Θ(log n)';
        timeBigOmega = 'Ω(1)';
        dominantTerm = 'log n (Logarithmic)';
        explanationSteps.push(
          'Detected single loop with multiplicative or binary dividing steps (e.g., low/high halving or i *= 2).',
          'The problem size is reduced by a factor of 2 on each iteration.',
          'Total loop iterations = log₂(n) = O(log n).'
        );
        summary = 'Logarithmic Time Complexity O(log n). Can search a billion elements in under 30 iterations!';
      } else {
        timeBigO = 'O(n)';
        timeBigTheta = 'Θ(n)';
        timeBigOmega = 'Ω(1)';
        dominantTerm = 'n (Linear)';
        explanationSteps.push(
          'Detected single linear loop iterating through input elements.',
          'Execution time is directly proportional to dataset size n: T(n) = c · n = O(n).',
          'Best Case: Ω(1) if target is found on the first element; Worst Case: O(n) for full array scan.'
        );
        summary = 'Linear Time Complexity O(n). Optimal for single-pass data processing and streaming.';
      }
    } else {
      timeBigO = 'O(1)';
      timeBigTheta = 'Θ(1)';
      timeBigOmega = 'Ω(1)';
      dominantTerm = '1 (Constant)';
      explanationSteps.push(
        'No loops or recursive calls detected in the execution flow.',
        'All operations consist of direct memory access, hash lookups, arithmetic, or fixed conditionals.',
        'Execution completes in a bounded, fixed number of CPU cycles independent of input size.'
      );
      summary = 'Constant Time Complexity O(1). Executes in deterministic nanoseconds.';
    }

    // Space Derivation
    if (allocates2DArray) {
      spaceBigO = 'O(n^2)';
      auxiliarySpace = 'O(n^2)';
      totalSpace = 'O(n^2)';
    } else if (allocatesArray) {
      spaceBigO = 'O(n)';
      auxiliarySpace = 'O(n)';
      totalSpace = 'O(n)';
    } else {
      spaceBigO = 'O(1)';
      auxiliarySpace = 'O(1)';
      totalSpace = 'O(1)';
    }
  }

  // Calculate Theoretical Operations at n=100 and n=1000
  let ops100 = 100;
  let ops1000 = 1000;
  if (timeBigO === 'O(1)') {
    ops100 = 1;
    ops1000 = 1;
  } else if (timeBigO === 'O(log n)') {
    ops100 = 7;
    ops1000 = 10;
  } else if (timeBigO === 'O(n)') {
    ops100 = 100;
    ops1000 = 1000;
  } else if (timeBigO === 'O(n log n)') {
    ops100 = Math.round(100 * Math.log2(100));
    ops1000 = Math.round(1000 * Math.log2(1000));
  } else if (timeBigO === 'O(n^2)') {
    ops100 = 10000;
    ops1000 = 1000000;
  } else if (timeBigO === 'O(n^3)') {
    ops100 = 1000000;
    ops1000 = 1000000000;
  } else if (timeBigO === 'O(2^n)') {
    ops100 = 1e30;
    ops1000 = 1e100;
  }

  // Growth Chart Data
  const nValues = [1, 2, 4, 8, 16, 32, 64, 128];
  const chartData = nValues.map(n => {
    const logN = Number(Math.log2(n).toFixed(2));
    const nLogN = Number((n * Math.log2(n)).toFixed(2));
    const n2 = n * n;
    const expN = n <= 16 ? Math.pow(2, n) : 65536;

    let yourAlgoVal = n;
    if (timeBigO === 'O(1)') yourAlgoVal = 1;
    else if (timeBigO === 'O(log n)') yourAlgoVal = logN;
    else if (timeBigO === 'O(n)') yourAlgoVal = n;
    else if (timeBigO === 'O(n log n)') yourAlgoVal = nLogN;
    else if (timeBigO === 'O(n^2)') yourAlgoVal = n2;
    else if (timeBigO === 'O(n^3)') yourAlgoVal = Math.min(100000, n * n * n);
    else if (timeBigO === 'O(2^n)') yourAlgoVal = expN;

    return {
      n,
      'O(1)': 1,
      'O(log n)': logN,
      'O(n)': n,
      'O(n log n)': nLogN,
      'O(n^2)': n2 > 10000 ? 10000 : n2,
      'O(2^n)': expN > 10000 ? 10000 : expN,
      'Your Algorithm': yourAlgoVal > 10000 ? 10000 : yourAlgoVal
    };
  });

  return {
    timeComplexity: timeBigO,
    timeComplexityNotation: {
      bigO: timeBigO,
      bigTheta: timeBigTheta,
      bigOmega: timeBigOmega
    },
    spaceComplexity: spaceBigO,
    auxiliarySpace: auxiliarySpace,
    totalSpace: totalSpace,
    dominantTerm: dominantTerm,
    explanationSteps: explanationSteps,
    lineAnnotations: lineAnnotations,
    chartData: chartData,
    summary: summary,
    optimizationTips: optimizationTips.length > 0 ? optimizationTips : [
      'Algorithm is performing within expected asymptotic optimal bounds for this category.',
      'Check for cache line friendliness and contiguous memory layout for low-level CPU acceleration.'
    ],
    recursionDetected: recursiveCallCount > 0,
    recursionType: isDivideAndConquer ? 'Divide & Conquer' : isExponentialRecursion ? 'Exponential Branching' : isLinearRecursion ? 'Linear' : undefined,
    loopDepth: maxLoopNesting,
    confidence: confidence,
    diagnostics: diagnostics,
    operationsEstimateAt100: ops100,
    operationsEstimateAt1000: ops1000,
    languageDetected: language
  };
}

function createEmptyResult(language: SupportedLanguage = 'python'): CodeComplexityResult {
  return {
    timeComplexity: 'O(1)',
    timeComplexityNotation: {
      bigO: 'O(1)',
      bigTheta: 'Θ(1)',
      bigOmega: 'Ω(1)'
    },
    spaceComplexity: 'O(1)',
    auxiliarySpace: 'O(1)',
    totalSpace: 'O(1)',
    dominantTerm: '1',
    explanationSteps: ['Enter code above and click "Proceed to Analyze" to derive Big-O time and space complexity.'],
    lineAnnotations: [],
    chartData: [],
    summary: 'Paste or type your algorithm above and click "Proceed to Analyze" to inspect complexity.',
    optimizationTips: [],
    recursionDetected: false,
    loopDepth: 0,
    confidence: 'high',
    diagnostics: [],
    operationsEstimateAt100: 1,
    operationsEstimateAt1000: 1,
    languageDetected: language
  };
}

/**
 * Automated Root Cause Code Repair
 */
export function autoFixCode(code: string, _language: SupportedLanguage, diagnosticId: string): string {
  const lines = code.split('\n');

  if (diagnosticId.startsWith('err-py-colon-')) {
    const lineNum = parseInt(diagnosticId.replace('err-py-colon-', ''), 10);
    if (lineNum > 0 && lineNum <= lines.length) {
      lines[lineNum - 1] = lines[lineNum - 1].trimEnd() + ':';
      return lines.join('\n');
    }
  }

  if (diagnosticId.startsWith('err-unclosed-brace-')) {
    return code.trimEnd() + '\n}\n';
  }

  if (diagnosticId.startsWith('warn-py-tabspace-')) {
    return lines.map(l => l.replace(/\t/g, '    ')).join('\n');
  }

  if (diagnosticId.startsWith('info-off-by-one-')) {
    const lineNum = parseInt(diagnosticId.replace('info-off-by-one-', ''), 10);
    if (lineNum > 0 && lineNum <= lines.length) {
      lines[lineNum - 1] = lines[lineNum - 1].replace(/<=\s*([a-zA-Z0-9_]+)/, '< $1');
      return lines.join('\n');
    }
  }

  return code;
}
