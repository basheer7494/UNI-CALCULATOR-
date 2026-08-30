export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript';

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
}

export const SAMPLE_PROGRAMS: {
  id: string;
  name: string;
  language: SupportedLanguage;
  category: string;
  expectedTime: string;
  code: string;
}[] = [
  {
    id: 'linear-search',
    name: 'Linear Search',
    language: 'cpp',
    category: 'Searching',
    expectedTime: 'O(n)',
    code: `// Linear Search Algorithm in C++
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Target element found
        }
    }
    return -1; // Target element not found
}`
  },
  {
    id: 'binary-search',
    name: 'Binary Search (Iterative)',
    language: 'python',
    category: 'Searching',
    expectedTime: 'O(log n)',
    code: `# Binary Search in Python
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
    id: 'bubble-sort',
    name: 'Bubble Sort',
    language: 'java',
    category: 'Sorting',
    expectedTime: 'O(n^2)',
    code: `// Bubble Sort in Java
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
    id: 'merge-sort',
    name: 'Merge Sort (Divide & Conquer)',
    language: 'cpp',
    category: 'Sorting',
    expectedTime: 'O(n log n)',
    code: `// Merge Sort Divide & Conquer in C++
void merge(int arr[], int l, int m, int r);

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        // Divide into two halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        // Conquer & merge sorted halves: O(n)
        merge(arr, l, m, r);
    }
}`
  },
  {
    id: 'matrix-multiplication',
    name: 'Matrix Multiplication (Standard 3D Nested)',
    language: 'c',
    category: 'Linear Algebra',
    expectedTime: 'O(n^3)',
    code: `// Standard n x n Matrix Multiplication in C
void multiplyMatrices(int A[N][N], int B[N][N], int C[N][N], int n) {
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
    id: 'fibonacci-recursive',
    name: 'Naive Recursive Fibonacci',
    language: 'javascript',
    category: 'Recursion',
    expectedTime: 'O(2^n)',
    code: `// Naive Exponential Fibonacci
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    // Two recursive subproblems per call level
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
  },
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci (Dynamic Programming / Memoized)',
    language: 'javascript',
    category: 'Dynamic Programming',
    expectedTime: 'O(n)',
    code: `// Dynamic Programming Linear Fibonacci
function fibonacciDP(n) {
    if (n <= 1) return n;
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`
  },
  {
    id: 'logarithmic-halving',
    name: 'Logarithmic Division Loop',
    language: 'cpp',
    category: 'Number Theory',
    expectedTime: 'O(log n)',
    code: `// Number of digits / Logarithmic reduction
int countHalvings(int n) {
    int count = 0;
    while (n > 1) {
        n = n / 2; // Halving step
        count++;
    }
    return count;
}`
  }
];

export function analyzeCodeComplexity(code: string, language: SupportedLanguage): CodeComplexityResult {
  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');

  if (!cleanCode) {
    return createEmptyResult();
  }

  // Tracking metrics
  let maxLoopNesting = 0;
  let currentLoopNesting = 0;
  let hasLogarithmicLoop = false;
  let hasLinearLoop = false;
  let loopCount = 0;
  let recursiveCallCount = 0;
  let isDivideAndConquer = false;
  let isExponentialRecursion = false;
  let isLinearRecursion = false;
  let functionName = '';
  let allocatesArray = false;
  let allocates2DArray = false;

  const lineAnnotations: CodeComplexityResult['lineAnnotations'] = [];
  const explanationSteps: string[] = [];

  // Match function name
  const fnMatchCpp = cleanCode.match(/(?:void|int|double|bool|float|auto|def|function)\s+([a-zA-Z0-9_]+)\s*\(/);
  if (fnMatchCpp && fnMatchCpp[1]) {
    functionName = fnMatchCpp[1];
  }

  // Parse lines
  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }

    let lineComplexity = 'O(1)';
    let lineDescription = 'Constant time basic operation';

    // Check for array allocations (Space analysis)
    if (
      trimmed.match(/new\s+(?:int|double|float|long|char)\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/vector<[a-zA-Z0-9_]+>\s+[a-zA-Z0-9_]+\s*\([a-zA-Z0-9_]+\)/) ||
      trimmed.match(/new\s+Array\([a-zA-Z0-9_]+\)/) ||
      trimmed.match(/\[0\]\s*\*\s*[a-zA-Z0-9_]+/) ||
      trimmed.match(/int\s+[a-zA-Z0-9_]+\[[a-zA-Z0-9_]+\]/)
    ) {
      allocatesArray = true;
      lineComplexity = 'O(n) Space';
      lineDescription = 'Allocates linear array/buffer of size proportional to n';
    }

    if (
      trimmed.match(/\[[a-zA-Z0-9_]+\]\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/new\s+int\[[a-zA-Z0-9_]+\]\[[a-zA-Z0-9_]+\]/) ||
      trimmed.match(/vector<vector<.*>>/)
    ) {
      allocates2DArray = true;
      lineComplexity = 'O(n^2) Space';
      lineDescription = 'Allocates 2D matrix storage (n × n)';
    }

    // Check for loops
    const isForLoop = trimmed.startsWith('for ') || trimmed.startsWith('for(') || trimmed.match(/^for\s*\(.*\)/);
    const isWhileLoop = trimmed.startsWith('while ') || trimmed.startsWith('while(') || trimmed.match(/^while\s*\(.*\)/);

    if (isForLoop || isWhileLoop) {
      loopCount++;
      currentLoopNesting++;
      if (currentLoopNesting > maxLoopNesting) {
        maxLoopNesting = currentLoopNesting;
      }

      // Check loop increment/stepping pattern
      const isLogStep =
        trimmed.includes('*=') ||
        trimmed.includes('/=') ||
        trimmed.includes('* 2') ||
        trimmed.includes('/ 2') ||
        trimmed.includes('>>= 1') ||
        trimmed.includes('// 2') ||
        trimmed.includes('low = mid + 1') ||
        trimmed.includes('high = mid - 1');

      if (isLogStep) {
        hasLogarithmicLoop = true;
        lineComplexity = 'O(log n)';
        lineDescription = 'Logarithmic iteration (variable doubles or halves every iteration)';
      } else {
        hasLinearLoop = true;
        lineComplexity = `O(n)`;
        lineDescription = `Iterates linearly up to upper bound (nesting level ${currentLoopNesting})`;
      }
    }

    // Check loop closing braces / dedents
    if (trimmed.includes('}') || (language === 'python' && trimmed.startsWith('return'))) {
      if (currentLoopNesting > 0) {
        currentLoopNesting--;
      }
    }

    // Check recursive calls
    if (functionName && trimmed.includes(`${functionName}(`)) {
      // Exclude function definition itself
      const isDef = trimmed.startsWith('def ') || trimmed.startsWith('function ') || trimmed.match(/^[a-zA-Z0-9_<>]+\s+[a-zA-Z0-9_]+\s*\(/);
      if (!isDef) {
        recursiveCallCount++;

        // Count multiple calls on same line (e.g. fib(n-1) + fib(n-2) or mergeSort)
        const matches = (trimmed.match(new RegExp(`${functionName}\\s*\\(`, 'g')) || []).length;
        if (matches >= 2) {
          if (trimmed.includes('/ 2') || trimmed.includes('- l) / 2') || trimmed.includes('mid')) {
            isDivideAndConquer = true;
            lineComplexity = '2 × T(n/2)';
            lineDescription = 'Divides problem into 2 subproblems of size n/2 (Divide & Conquer)';
          } else {
            isExponentialRecursion = true;
            lineComplexity = '2 × T(n-1)';
            lineDescription = 'Branches into multiple recursive calls without memoization (Exponential)';
          }
        } else {
          if (trimmed.includes('/ 2') || trimmed.includes('mid')) {
            isDivideAndConquer = true;
            lineComplexity = 'T(n/2)';
            lineDescription = 'Reduces search space by half (Binary Search / Logarithmic recursion)';
          } else {
            isLinearRecursion = true;
            lineComplexity = 'T(n-1)';
            lineDescription = 'Single recursive subproblem of size n-1 (Linear recursion)';
          }
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

  // Derive asymptotic complexity
  let timeBigO = 'O(1)';
  let timeBigTheta = 'Θ(1)';
  let timeBigOmega = 'Ω(1)';
  let spaceBigO = 'O(1)';
  let auxiliarySpace = 'O(1)';
  let totalSpace = 'O(1)';
  let dominantTerm = 'Constant C';
  let summary = '';
  let confidence: 'high' | 'medium' | 'approximate' = 'high';
  const optimizationTips: string[] = [];

  // 1. Recursive scenarios
  if (recursiveCallCount > 0) {
    if (isExponentialRecursion) {
      timeBigO = 'O(2^n)';
      timeBigTheta = 'Θ(2^n)';
      timeBigOmega = 'Ω(2^n)';
      spaceBigO = 'O(n)';
      auxiliarySpace = 'O(n)';
      totalSpace = 'O(n)';
      dominantTerm = '2^n (Exponential)';
      explanationSteps.push(
        'Detected recursive branching: The function calls itself 2 or more times per level with step reduction (n-1).',
        'Recurrence Relation: T(n) = 2T(n-1) + O(1) = O(2^n).',
        'Recursion Tree: The depth is n, and the number of nodes at level k is 2^k, yielding total operations ~ 2^n.',
        'Space Complexity: O(n) auxiliary stack space corresponding to the maximum recursion call tree depth.'
      );
      summary = 'Exponential Time Complexity O(2^n). The number of operations doubles with each increase in input size.';
      optimizationTips.push(
        'Apply Dynamic Programming / Memoization to cache overlapping subproblems and reduce complexity from O(2^n) to O(n).',
        'Convert recursive state machine to an iterative bottom-up array/table loop.'
      );
    } else if (isDivideAndConquer) {
      if (cleanCode.includes('merge(') || cleanCode.includes('partition(') || loopCount > 0) {
        timeBigO = 'O(n log n)';
        timeBigTheta = 'Θ(n log n)';
        timeBigOmega = 'Ω(n log n)';
        spaceBigO = 'O(n)';
        auxiliarySpace = 'O(n)';
        totalSpace = 'O(n)';
        dominantTerm = 'n log n (Linearithmic)';
        explanationSteps.push(
          'Detected Divide and Conquer recursion with linear merge/partition step.',
          'Recurrence Relation: T(n) = 2T(n/2) + O(n).',
          'Applying Master Theorem: Case 2 where a = 2, b = 2, f(n) = O(n). Since log_b(a) = log_2(2) = 1, T(n) = Θ(n log n).',
          'Tree depth is log₂(n), and at each level total work is O(n), giving O(n log n).'
        );
        summary = 'Linearithmic Time Complexity O(n log n). Optimal performance for general comparison-based sorting.';
        optimizationTips.push(
          'For in-place partitioning (e.g. QuickSort), auxiliary space can be reduced to O(log n) stack space.'
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
          'Detected single-branch halving recursion (e.g., Binary Search).',
          'Recurrence: T(n) = T(n/2) + O(1).',
          'Master Theorem Case 2: a = 1, b = 2, f(n) = O(1). log_2(1) = 0, giving T(n) = Θ(log n).',
          'Call stack depth is log₂(n).'
        );
        summary = 'Logarithmic Time Complexity O(log n). Execution time grows very slowly as input size scales.';
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
        'Detected linear recursion with decrement n - 1.',
        'Recurrence: T(n) = T(n-1) + O(1) = O(n).',
        'Stack frames allocated: n sequential frames.'
      );
      summary = 'Linear Time Complexity O(n) with O(n) call-stack space.';
      optimizationTips.push('Enable tail-call optimization or rewrite using an iterative while/for loop to save O(n) stack memory.');
    }
  } else {
    // 2. Iterative loop scenarios
    if (maxLoopNesting >= 3) {
      timeBigO = 'O(n^3)';
      timeBigTheta = 'Θ(n^3)';
      timeBigOmega = 'Ω(n^3)';
      dominantTerm = 'n³ (Cubic)';
      explanationSteps.push(
        `Detected 3 levels of deeply nested loops: Outer loop O(n) × Middle loop O(n) × Inner loop O(n).`,
        `Total iterations = n × n × n = n³ operations.`,
        `Each inner iteration executes constant time O(1) operations.`
      );
      summary = 'Cubic Time Complexity O(n³). Performance degrades rapidly for large n (e.g. n=1,000 → 1 Billion ops).';
      optimizationTips.push(
        'Look for Strassen algorithm matrix optimizations or mathematical factorizations to reduce cubic loops to O(n^2.81) or O(n^2).'
      );
    } else if (maxLoopNesting === 2) {
      if (hasLogarithmicLoop) {
        timeBigO = 'O(n log n)';
        timeBigTheta = 'Θ(n log n)';
        timeBigOmega = 'Ω(n log n)';
        dominantTerm = 'n log n (Linearithmic)';
        explanationSteps.push(
          'Detected nested loops where one loop runs linearly O(n) and the inner loop steps logarithmically O(log n).',
          'Total iterations = n × log₂(n) = O(n log n).'
        );
        summary = 'Linearithmic Time Complexity O(n log n).';
      } else {
        timeBigO = 'O(n^2)';
        timeBigTheta = 'Θ(n^2)';
        timeBigOmega = 'Ω(n)';
        dominantTerm = 'n² (Quadratic)';
        explanationSteps.push(
          'Detected 2 levels of nested loops: Outer loop runs n times, inner loop runs up to n times.',
          'Arithmetic series summation: Σ i (from 1 to n) = n(n-1)/2 = 0.5n² - 0.5n = O(n²).',
          'Worst-case and average-case require quadratic operations.'
        );
        summary = 'Quadratic Time Complexity O(n²). Execution time quadruples when input size doubles.';
        optimizationTips.push(
          'Use hash maps, sets, two-pointer techniques, or sorting + binary search to bring quadratic O(n²) loops down to O(n log n) or O(n).'
        );
      }
    } else if (maxLoopNesting === 1) {
      if (hasLogarithmicLoop) {
        timeBigO = 'O(log n)';
        timeBigTheta = 'Θ(log n)';
        timeBigOmega = 'Ω(1)';
        dominantTerm = 'log n (Logarithmic)';
        explanationSteps.push(
          'Detected single loop with multiplicative/divisive stepping (e.g., i *= 2 or high/low binary bisection).',
          'The search space is divided by a constant factor every iteration.',
          'Total loop iterations = log_base(n) = O(log n).'
        );
        summary = 'Logarithmic Time Complexity O(log n). Extremely fast even for millions of elements.';
      } else {
        timeBigO = 'O(n)';
        timeBigTheta = 'Θ(n)';
        timeBigOmega = 'Ω(1)';
        dominantTerm = 'n (Linear)';
        explanationSteps.push(
          `Detected single linear loop iterating across elements from 0 to n.`,
          `Number of loop iterations is directly proportional to input size n: T(n) = c × n = O(n).`,
          `Best Case: Ω(1) if target is found immediately on first iteration; Worst Case: O(n) if full traversal required.`
        );
        summary = 'Linear Time Complexity O(n). Execution time scales linearly in direct proportion to input size.';
      }
    } else {
      timeBigO = 'O(1)';
      timeBigTheta = 'Θ(1)';
      timeBigOmega = 'Ω(1)';
      dominantTerm = '1 (Constant)';
      explanationSteps.push(
        'No loops or recursive calls detected in the core execution path.',
        'All statements consist of direct memory access, arithmetic calculations, or conditional branching.',
        'Execution completes in a fixed, constant number of CPU cycles independent of input size.'
      );
      summary = 'Constant Time Complexity O(1). Optimal instantaneous computation.';
    }

    // Space derivation for iterative code
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

  // Generate growth chart data
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
      'Algorithm is performing within expected asymptotic optimal bounds for this class of problem.',
      'Check for cache locality and contiguous memory access patterns for micro-optimizations.'
    ],
    recursionDetected: recursiveCallCount > 0,
    recursionType: isDivideAndConquer ? 'Divide & Conquer' : isExponentialRecursion ? 'Exponential Branching' : isLinearRecursion ? 'Linear' : undefined,
    loopDepth: maxLoopNesting,
    confidence: confidence
  };
}

function createEmptyResult(): CodeComplexityResult {
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
    explanationSteps: ['Enter code above to analyze its Big-O time and space complexity.'],
    lineAnnotations: [],
    chartData: [],
    summary: 'No code provided for static analysis.',
    optimizationTips: [],
    recursionDetected: false,
    loopDepth: 0,
    confidence: 'high'
  };
}
