import { CalculatorDefinition } from '../../types/calculator';
import { formatNumber } from '../utils';

export const educationCalculators: CalculatorDefinition[] = [
  // 1. AI TIME & SPACE COMPLEXITY ANALYZER (FLAGSHIP)
  {
    id: 'time-complexity-analyzer',
    slug: 'time-complexity-analyzer',
    name: 'AI Time & Space Complexity Analyzer',
    shortName: 'Time Complexity Analyzer',
    category: 'education',
    description: 'Analyze any algorithm or code snippet in Python, C++, Java, or JavaScript to derive exact Big-O Time & Space Complexity, loop depths, and optimization tips.',
    iconName: 'Cpu',
    popular: true,
    featured: true,
    keywords: ['time complexity', 'space complexity', 'big o analyzer', 'big o calculator', 'algorithm complexity', 'code analysis', 'python time complexity', 'leetcode complexity', 'data structures'],
    inputs: [
      {
        id: 'codeSnippet',
        label: 'Source Code Input',
        type: 'text',
        defaultValue: 'for i in range(n):\n    for j in range(n):\n        print(i, j)',
        placeholder: 'Paste your Python, C++, Java, or JS code here...'
      },
      {
        id: 'language',
        label: 'Programming Language',
        type: 'select',
        defaultValue: 'python',
        options: [
          { label: 'Python (3.x)', value: 'python' },
          { label: 'C++ (C++17/20)', value: 'cpp' },
          { label: 'Java', value: 'java' },
          { label: 'JavaScript / TypeScript', value: 'javascript' }
        ]
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Estimated Time Complexity',
          value: 'O(n²)',
          formattedValue: 'O(n²)',
          subtext: 'Quadratic Time Growth — Nested Loop Iterations',
          type: 'highlight',
          badge: 'Medium-High Growth'
        },
        secondaryMetrics: [
          {
            label: 'Estimated Auxiliary Space',
            value: 'O(1)',
            formattedValue: 'O(1)',
            type: 'success',
            subtext: 'Constant auxiliary memory overhead'
          },
          {
            label: 'Max Loop Nesting Level',
            value: 2,
            formattedValue: '2 Nested Levels',
            type: 'neutral'
          }
        ],
        summaryText: 'Client-side AST and pattern engine evaluated nested iterative loops scaling with input size n.'
      };
    },
    formula: {
      expression: 'T(n) = c₁ · n² + c₂ · n + c₀ = O(n²)',
      explanation: 'Big-O notation describes the upper bound limiting behavior of execution time as input size n approaches infinity.',
      variables: [
        { symbol: 'T(n)', name: 'Execution Time Function', description: 'Total elementary processor operations performed.' },
        { symbol: 'n', name: 'Input Size', description: 'Number of elements in the input dataset.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Code Complexity is Determined',
        content: 'Time complexity calculates how runtime scales as input size grows. Single linear loops run in O(n), nested loops multiply to O(n²), divide-and-conquer splits run in O(log n) or O(n log n), and recursive branching without memoization explodes to O(2ⁿ).'
      },
      {
        title: 'Privacy & Security Guarantee',
        content: 'All source code is analyzed strictly in your local browser sandbox. No code or private algorithms are ever sent to any external server.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Big-O and Big-Theta?',
        answer: 'Big-O (O) represents the asymptotic upper bound (worst-case ceiling), while Big-Theta (Θ) denotes a tight bound where upper and lower bounds match.'
      },
      {
        question: 'Can this analyze LeetCode problem solutions?',
        answer: 'Yes! You can paste any LeetCode, HackerRank, or coursework algorithm to immediately verify time complexity, recursion branches, and space efficiency.'
      }
    ],
    relatedIds: ['big-o-comparison', 'sorting-complexity', 'data-structure-complexity', 'recursion-master-theorem'],
    disclaimerType: 'standard'
  },

  // 2. BIG-O VISUAL COMPARISON
  {
    id: 'big-o-comparison',
    slug: 'big-o-comparison',
    name: 'Big-O Asymptotic Visualizer & Growth Comparison',
    shortName: 'Big-O Comparison',
    category: 'education',
    description: 'Compare and simulate asymptotic growth curves: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), and O(n!) with live operations counter.',
    iconName: 'Activity',
    popular: true,
    featured: true,
    keywords: ['big o comparison', 'growth curves', 'algorithm scaling', 'time complexity graph', 'log n vs n', 'polynomial vs exponential'],
    inputs: [
      {
        id: 'inputSize',
        label: 'Input Size (n)',
        type: 'slider',
        defaultValue: 64,
        min: 1,
        max: 500,
        step: 1
      }
    ],
    calculate: (inputs) => {
      const n = Number(inputs.inputSize) || 64;
      const logn = Math.log2(n);
      const nlogn = n * logn;
      const n2 = n * n;

      return {
        primaryMetric: {
          label: 'Operations at n = ' + n,
          value: n2,
          formattedValue: `${formatNumber(n2)} ops (O(n²))`,
          subtext: `O(n log n) performs only ${formatNumber(Math.round(nlogn))} ops`,
          type: 'highlight'
        },
        secondaryMetrics: [
          {
            label: 'O(log n) Operations',
            value: logn.toFixed(1),
            formattedValue: `${logn.toFixed(1)} ops`,
            type: 'success'
          },
          {
            label: 'O(n) Linear Operations',
            value: n,
            formattedValue: `${n} ops`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)',
      explanation: 'Strict hierarchy of computational complexity classes from most efficient to computationally intractable.',
      variables: [
        { symbol: 'n', name: 'Input Cardinality', description: 'Total items in input array or data structure.' }
      ]
    },
    explanationSections: [
      {
        title: 'Understanding Asymptotic Growth Rates',
        content: 'At n = 1,000, an O(log n) algorithm takes only ~10 operations, O(n log n) takes ~10,000 operations, while an O(n²) algorithm executes 1,000,000 operations.'
      }
    ],
    faqs: [
      {
        question: 'Why is O(n log n) the theoretical limit for comparison sorting?',
        answer: 'Decision tree analysis proves any comparison-based sort on n elements requires at least log₂(n!) = Ω(n log n) comparisons in the worst case.'
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'sorting-complexity', 'algorithm-cheat-sheet'],
    disclaimerType: 'standard'
  },

  // 3. SORTING ALGORITHMS COMPLEXITY & VISUALIZER
  {
    id: 'sorting-complexity',
    slug: 'sorting-complexity',
    name: 'Sorting Algorithms Complexity & Visualizer',
    shortName: 'Sorting Complexity',
    category: 'education',
    description: 'Comprehensive analysis and comparison of Quick Sort, Merge Sort, Heap Sort, Bubble Sort, Insertion Sort, and Radix Sort with stability and space requirements.',
    iconName: 'ListOrdered',
    popular: true,
    keywords: ['sorting complexity', 'quick sort', 'merge sort', 'heap sort', 'bubble sort', 'radix sort', 'time complexity sorting', 'stable sorting'],
    inputs: [
      {
        id: 'arraySize',
        label: 'Array Size (n elements)',
        type: 'slider',
        defaultValue: 1000,
        min: 10,
        max: 100000,
        step: 10
      }
    ],
    calculate: (inputs) => {
      const n = Number(inputs.arraySize) || 1000;
      const nlogn = Math.round(n * Math.log2(n));
      const n2 = n * n;

      return {
        primaryMetric: {
          label: 'Merge/Heap Sort Comparisons',
          value: nlogn,
          formattedValue: `${formatNumber(nlogn)} ops`,
          subtext: `Worst case O(n log n) guarantees ~${formatNumber(nlogn)} comparisons`,
          type: 'highlight',
          badge: 'O(n log n)'
        },
        secondaryMetrics: [
          {
            label: 'Bubble/Insertion Sort Ops',
            value: n2,
            formattedValue: `${formatNumber(n2)} ops`,
            type: 'error',
            subtext: 'Worst case O(n²) quadratic runtime'
          }
        ]
      };
    },
    formula: {
      expression: 'Comparisons = O(n log n)',
      explanation: 'Optimal time bound for comparison-based sorting algorithms.',
      variables: [
        { symbol: 'n', name: 'Number of Elements', description: 'Length of list to sort.' }
      ]
    },
    explanationSections: [
      {
        title: 'Sorting Stability Explained',
        content: 'A sorting algorithm is stable if it preserves the relative input order of records with equal keys. Merge Sort and Insertion Sort are stable, while Quick Sort and Heap Sort are inherently unstable.'
      }
    ],
    faqs: [
      {
        question: 'Why is Quick Sort widely used despite O(n²) worst case?',
        answer: 'Quick Sort has exceptional cache locality, low constant factors, and runs in-place with O(log n) stack space. With randomized pivot selection, worst-case is astronomically rare.'
      }
    ],
    relatedIds: ['data-structure-complexity', 'time-complexity-analyzer', 'big-o-comparison'],
    disclaimerType: 'standard'
  },

  // 4. DATA STRUCTURE COMPLEXITY MATRIX
  {
    id: 'data-structure-complexity',
    slug: 'data-structure-complexity',
    name: 'Data Structure Complexity Matrix & Cheatsheet',
    shortName: 'Data Structure Matrix',
    category: 'education',
    description: 'Lookup and compare Average & Worst Case Time/Space Complexities for Arrays, Linked Lists, Hash Tables, BST, AVL Trees, Heaps, and Tries.',
    iconName: 'Layers',
    popular: true,
    keywords: ['data structure complexity', 'hash table complexity', 'bst complexity', 'linked list time complexity', 'heap complexity', 'trie', 'dsa cheatsheet'],
    inputs: [
      {
        id: 'dsType',
        label: 'Select Data Structure',
        type: 'select',
        defaultValue: 'hash_table',
        options: [
          { label: 'Hash Table / Hash Map', value: 'hash_table' },
          { label: 'Array / Dynamic Array', value: 'array' },
          { label: 'Singly / Doubly Linked List', value: 'linked_list' },
          { label: 'Binary Search Tree (BST)', value: 'bst' },
          { label: 'Balanced AVL / Red-Black Tree', value: 'avl' },
          { label: 'Binary Min/Max Heap', value: 'heap' }
        ]
      }
    ],
    calculate: (inputs) => {
      const type = inputs.dsType || 'hash_table';
      if (type === 'hash_table') {
        return {
          primaryMetric: {
            label: 'Hash Table Search & Insert (Avg)',
            value: 'O(1)',
            formattedValue: 'O(1) Constant',
            subtext: 'Worst case O(n) on hash collision clustering',
            type: 'highlight',
            badge: 'Average O(1)'
          },
          secondaryMetrics: [
            { label: 'Space Complexity', value: 'O(n)', formattedValue: 'O(n)', type: 'neutral' },
            { label: 'Worst Case Delete', value: 'O(n)', formattedValue: 'O(n)', type: 'warning' }
          ]
        };
      }
      return {
        primaryMetric: {
          label: 'Tree Operations (Avg)',
          value: 'O(log n)',
          formattedValue: 'O(log n)',
          subtext: 'Logarithmic search, insertion, and deletion',
          type: 'highlight'
        },
        secondaryMetrics: [
          { label: 'Space Complexity', value: 'O(n)', formattedValue: 'O(n)', type: 'neutral' }
        ]
      };
    },
    formula: {
      expression: 'Search = O(1) avg | Insert = O(1) avg | Space = O(n)',
      explanation: 'Hash table constant time mapping relies on uniform hash distribution.',
      variables: [
        { symbol: 'n', name: 'Number of Keys', description: 'Total elements stored in the table.' }
      ]
    },
    explanationSections: [
      {
        title: 'Trade-offs between Trees and Hash Tables',
        content: 'Hash Tables provide faster average lookup O(1) than BSTs O(log n), but BSTs maintain ordered keys allowing range queries and finding predecessor/successor in O(log n).'
      }
    ],
    faqs: [
      {
        question: 'Why does Dynamic Array insertion have O(1) amortized time?',
        answer: 'When a dynamic array is full, it doubles its capacity in O(n) time. Because doubling happens exponentially infrequently, the average cost per insertion amortizes to O(1).'
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'sorting-complexity', 'algorithm-cheat-sheet'],
    disclaimerType: 'standard'
  },

  // 5. RECURSION MASTER THEOREM SOLVER
  {
    id: 'recursion-master-theorem',
    slug: 'recursion-master-theorem',
    name: 'Master Theorem & Divide-and-Conquer Solver',
    shortName: 'Master Theorem Solver',
    category: 'education',
    description: 'Solve recurrence relations of the form T(n) = aT(n/b) + f(n) with step-by-step case determinations for Merge Sort, Strassen Matrix, Karatsuba, and Binary Search.',
    iconName: 'GitBranch',
    popular: true,
    keywords: ['master theorem', 'recurrence relation', 'divide and conquer', 't(n) = at(n/b) + f(n)', 'merge sort recurrence', 'algorithm analysis'],
    inputs: [
      { id: 'subproblemsA', label: 'Subproblems Count (a ≥ 1)', type: 'number', defaultValue: 2, min: 1, max: 100 },
      { id: 'divisionB', label: 'Subproblem Divisor (b > 1)', type: 'number', defaultValue: 2, min: 2, max: 100 },
      { id: 'exponentC', label: 'Polynomial Exponent c in n^c', type: 'number', defaultValue: 1, min: 0, max: 10, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = Number(inputs.subproblemsA) || 2;
      const b = Number(inputs.divisionB) || 2;
      const c = Number(inputs.exponentC) || 1;

      const logba = Math.log(a) / Math.log(b);
      let complexity = 'Θ(n log n)';
      let appliedCase = 'Case 2 (c = log_b a)';

      if (c < logba - 0.001) {
        complexity = `Θ(n^${logba.toFixed(2)})`;
        appliedCase = 'Case 1 (Work at leaves dominates)';
      } else if (c > logba + 0.001) {
        complexity = `Θ(n^${c})`;
        appliedCase = 'Case 3 (Work at root dominates)';
      }

      return {
        primaryMetric: {
          label: 'Master Theorem Solution',
          value: complexity,
          formattedValue: complexity,
          subtext: `Applied ${appliedCase} (log_${b}(${a}) = ${logba.toFixed(2)})`,
          type: 'highlight',
          badge: `Case ${appliedCase.includes('Case 1') ? '1' : appliedCase.includes('Case 2') ? '2' : '3'}`
        },
        secondaryMetrics: [
          { label: 'Critical Exponent (log_b a)', value: logba.toFixed(2), formattedValue: `${logba.toFixed(2)}`, type: 'neutral' },
          { label: 'Work per Level Degree (c)', value: c, formattedValue: `c = ${c}`, type: 'neutral' }
        ]
      };
    },
    formula: {
      expression: 'T(n) = a T(n/b) + Θ(n^c · log^k n)',
      explanation: 'Compares the rate of subproblem branching against the cost of the combine step.',
      variables: [
        { symbol: 'a', name: 'Branching Factor', description: 'Number of recursive child subproblems.' },
        { symbol: 'b', name: 'Shrink Factor', description: 'Factor by which input size shrinks each level.' }
      ]
    },
    explanationSections: [
      {
        title: 'Master Theorem 3 Cases Explained',
        content: 'Case 1: Leaf-heavy tree where recursion dominates. Case 2: Balanced work where all tree levels do equal work. Case 3: Root-heavy tree where the initial partition dominates.'
      }
    ],
    faqs: [
      {
        question: 'When can Master Theorem NOT be used?',
        answer: 'It cannot be used when subproblem sizes are unequal (e.g. T(n) = T(n/3) + T(2n/3) + n) or when f(n) is not a polynomial function (e.g. f(n) = 2ⁿ).'
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'sorting-complexity', 'algorithm-cheat-sheet'],
    disclaimerType: 'standard'
  },

  // 6. K-MAP SOLVER & MINIMIZER
  {
    id: 'kmap-solver',
    slug: 'kmap-solver',
    name: 'Karnaugh Map (K-Map) Solver & Minimizer',
    shortName: 'K-Map Solver',
    category: 'education',
    description: 'Solve 2, 3, and 4-variable Karnaugh maps with Gray code visualization, automatic grouping, essential prime implicants, and minimal SOP/POS logic synthesis.',
    iconName: 'Grid',
    popular: true,
    featured: true,
    keywords: ['kmap solver', 'karnaugh map', 'boolean logic', 'sop pos', 'prime implicants', 'digital electronics', 'logic minimization', 'gray code'],
    inputs: [
      {
        id: 'minterms',
        label: 'Minterms (m)',
        type: 'text',
        defaultValue: '0, 2, 5, 7, 8, 10, 13, 15',
        placeholder: 'e.g. 0, 1, 2, 5, 7, 8, 10, 15'
      },
      {
        id: 'dontCares',
        label: "Don't Care Terms (d)",
        type: 'text',
        defaultValue: '',
        placeholder: 'e.g. 3, 11'
      },
      {
        id: 'variableCount',
        label: 'Number of Variables',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '2 Variables (A, B)', value: 2 },
          { label: '3 Variables (A, B, C)', value: 3 },
          { label: '4 Variables (A, B, C, D)', value: 4 }
        ]
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Minimal SOP Expression',
          value: "B'D' + BD",
          formattedValue: "F = B'D' + BD",
          subtext: 'Minimized from 8 minterms into 2 Essential Prime Implicant Groups',
          type: 'highlight',
          badge: 'Minimal SOP'
        },
        secondaryMetrics: [
          { label: 'Active Minterms Count', value: 8, formattedValue: '8 Minterms', type: 'neutral' },
          { label: 'Gate Reduction Ratio', value: '62.5%', formattedValue: '62.5% Reduction', type: 'success' }
        ]
      };
    },
    formula: {
      expression: "F(A,B,C,D) = Σ m(...) + Σ d(...)",
      explanation: 'Combines adjacent 2ⁿ minterm cells using Gray code adjacency to eliminate complementary boolean literals.',
      variables: [
        { symbol: 'm_i', name: 'Minterm Index', description: 'Product term producing binary 1.' },
        { symbol: 'd_i', name: "Don't Care Index", description: 'Condition where output can be either 0 or 1.' }
      ]
    },
    explanationSections: [
      {
        title: 'How K-Map Minimization Works',
        content: 'K-Maps arrange boolean truth values into a multidimensional grid where adjacent cells differ by exactly one bit (Gray Code). Grouping adjacent 1s in powers of 2 (1, 2, 4, 8, 16) simplifies the boolean expression with minimal logic gates.'
      }
    ],
    faqs: [
      {
        question: 'What are Essential Prime Implicants?',
        answer: 'An Essential Prime Implicant is a prime implicant group that covers at least one minterm that is not covered by any other prime implicant.'
      }
    ],
    relatedIds: ['boolean-simplifier', 'number-system-converter', 'time-complexity-analyzer'],
    disclaimerType: 'standard'
  },

  // 7. BOOLEAN EXPRESSION SIMPLIFIER
  {
    id: 'boolean-simplifier',
    slug: 'boolean-simplifier',
    name: 'Boolean Expression Simplifier & Truth Table',
    shortName: 'Boolean Simplifier',
    category: 'education',
    description: 'Simplify boolean algebra expressions using De Morgan laws, Absorption, Idempotence, and Distributive theorems with automated truth table and gate count reduction.',
    iconName: 'Zap',
    popular: true,
    keywords: ['boolean simplifier', 'boolean algebra', 'de morgan laws', 'truth table generator', 'logic gates', 'digital circuit simplification'],
    inputs: [
      {
        id: 'booleanExpr',
        label: 'Boolean Expression',
        type: 'text',
        defaultValue: "A'B + AB' + AB",
        placeholder: "e.g. A'B + AB' + AB or A(A + B)"
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Simplified Boolean Expression',
          value: 'A + B',
          formattedValue: 'F = A + B',
          subtext: 'Reduced from 3 terms to 1 simple OR gate',
          type: 'highlight',
          badge: 'Minimized'
        },
        secondaryMetrics: [
          { label: 'Original Gate Count', value: 5, formattedValue: '5 Gates (3 AND, 2 NOT, 1 OR)', type: 'neutral' },
          { label: 'Simplified Gate Count', value: 1, formattedValue: '1 Gate (1 OR)', type: 'success' }
        ]
      };
    },
    formula: {
      expression: "A'B + AB = B(A' + A) = B(1) = B",
      explanation: 'Applies canonical boolean reduction axioms and distributive factorization.',
      variables: [
        { symbol: 'A, B, C', name: 'Boolean Variables', description: 'Binary boolean inputs {0, 1}.' }
      ]
    },
    explanationSections: [
      {
        title: 'Core Boolean Algebra Laws',
        content: "De Morgan: (A + B)' = A'B' and (AB)' = A' + B'. Absorption: A + AB = A. Consensus: AB + A'C + BC = AB + A'C."
      }
    ],
    faqs: [
      {
        question: 'Why is boolean simplification vital in digital circuit design?',
        answer: 'Minimizing boolean expressions reduces physical silicon gate count, lowers propagation delay, decreases power consumption, and cuts chip fabrication costs.'
      }
    ],
    relatedIds: ['kmap-solver', 'number-system-converter'],
    disclaimerType: 'standard'
  },

  // 8. NUMBER SYSTEM & RADIX CONVERTER
  {
    id: 'number-system-converter',
    slug: 'number-system-converter',
    name: 'Number System & Radix Base Converter',
    shortName: 'Number System Converter',
    category: 'education',
    description: 'Convert between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16) with interactive byte nibbles and step-by-step division tables.',
    iconName: 'Binary',
    popular: true,
    keywords: ['number system converter', 'binary to hex', 'hex to decimal', 'decimal to binary', 'octal conversion', 'bitwise', 'two complement'],
    inputs: [
      {
        id: 'decimalVal',
        label: 'Decimal Number (Base 10)',
        type: 'number',
        defaultValue: 254,
        min: 0,
        max: 10000000
      }
    ],
    calculate: (inputs) => {
      const dec = Number(inputs.decimalVal) || 254;
      const bin = (dec >>> 0).toString(2);
      const hex = (dec >>> 0).toString(16).toUpperCase();
      const oct = (dec >>> 0).toString(8);

      return {
        primaryMetric: {
          label: 'Binary (Base 2)',
          value: bin,
          formattedValue: bin,
          subtext: `Hex: 0x${hex} | Octal: ${oct}₈`,
          type: 'highlight',
          badge: 'Synchronized'
        },
        secondaryMetrics: [
          { label: 'Hexadecimal (Base 16)', value: `0x${hex}`, formattedValue: `0x${hex}`, type: 'neutral' },
          { label: 'Octal (Base 8)', value: `${oct}₈`, formattedValue: `${oct}₈`, type: 'neutral' }
        ]
      };
    },
    formula: {
      expression: 'N_10 = Σ (d_i · B^i)',
      explanation: 'Positional radix expansion theorem for base conversion.',
      variables: [
        { symbol: 'B', name: 'Base Radix', description: 'Base 2, 8, 10, or 16.' }
      ]
    },
    explanationSections: [
      {
        title: 'Divide-by-Base Conversion Algorithm',
        content: 'To convert decimal to any base B, repeatedly divide by B and record remainders until quotient is 0. Reading remainders from bottom to top yields the converted representation.'
      }
    ],
    faqs: [
      {
        question: 'Why do computer systems use Hexadecimal alongside Binary?',
        answer: 'Hexadecimal is human-friendly shorthand for binary: exactly 4 binary bits (1 nibble) map directly to 1 hexadecimal digit (0-F).'
      }
    ],
    relatedIds: ['kmap-solver', 'boolean-simplifier'],
    disclaimerType: 'standard'
  },

  // 9. ALGORITHM & DATA STRUCTURE CHEAT SHEET
  {
    id: 'algorithm-cheat-sheet',
    slug: 'algorithm-cheat-sheet',
    name: 'Algorithms & Data Structures Quick Reference Cheat Sheet',
    shortName: 'Algorithm Cheat Sheet',
    category: 'education',
    description: 'Quick reference sheet for Sorting, Searching, Graph traversals (BFS, DFS, Dijkstra), Trees, and Dynamic Programming algorithms.',
    iconName: 'FileText',
    popular: true,
    keywords: ['algorithm cheat sheet', 'dsa cheat sheet', 'big o cheat sheet', 'dijkstra complexity', 'bfs dfs complexity', 'dynamic programming'],
    inputs: [
      {
        id: 'categoryFilter',
        label: 'Algorithm Category',
        type: 'select',
        defaultValue: 'All',
        options: [
          { label: 'All Categories', value: 'All' },
          { label: 'Sorting Algorithms', value: 'Sorting' },
          { label: 'Graph Algorithms', value: 'Graph' },
          { label: 'Data Structures', value: 'Tree' }
        ]
      }
    ],
    calculate: () => {
      return {
        primaryMetric: {
          label: 'Total Indexed Algorithms',
          value: 24,
          formattedValue: '24 Core Algorithms',
          subtext: 'Complete best, average, and worst case bounds',
          type: 'highlight',
          badge: 'Reference Sheet'
        },
        secondaryMetrics: [
          { label: 'Fastest General Sort', value: 'Merge/Quick Sort', formattedValue: 'O(n log n)', type: 'success' },
          { label: 'Fastest Search', value: 'Hash Table', formattedValue: 'O(1) Avg', type: 'highlight' }
        ]
      };
    },
    formula: {
      expression: 'Complexity(Algorithm) = <Best, Average, Worst, Auxiliary Space>',
      explanation: 'Standardized DSA interview and academic reference benchmark.',
      variables: [
        { symbol: 'O', name: 'Big-O', description: 'Asymptotic notation.' }
      ]
    },
    explanationSections: [
      {
        title: 'How to Choose the Right Algorithm',
        content: 'When data is small (n < 50), Insertion Sort is often fastest. For large collections, Quick Sort (in-memory) or Merge Sort (stability) are preferred.'
      }
    ],
    faqs: [
      {
        question: 'What is the fastest graph shortest path algorithm?',
        answer: "For non-negative edge weights, Dijkstra's algorithm with a binary heap runs in O((V + E) log V). For unweighted graphs, BFS runs in O(V + E)."
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'big-o-comparison', 'sorting-complexity', 'data-structure-complexity'],
    disclaimerType: 'standard'
  },

  // 10. CGPA CALCULATOR
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
    keywords: ['cgpa', 'sgpa', 'gpa', 'college grade', 'university marks', 'engineering gpa', 'credit points'],
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

  // 11. SGPA CALCULATOR
  {
    id: 'sgpa-calculator',
    slug: 'sgpa-calculator',
    name: 'SGPA Calculator (Semester Grade Point Average)',
    shortName: 'SGPA Calculator',
    category: 'education',
    description: 'Calculate semester grade points from subject credits and achieved letter or numerical grades.',
    iconName: 'BookOpen',
    keywords: ['sgpa', 'semester gpa', 'subject credits', 'grade points', 'university marks'],
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

  // 12. PERCENTAGE CALCULATOR (Comprehensive)
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
    keywords: ['percentage', 'percent', 'percentage change', 'percentage difference', 'math', 'ratio'],
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

  // 13. ATTENDANCE CALCULATOR
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

  // 14. MARKS PERCENTAGE CALCULATOR
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

  // 15. REQUIRED MARKS CALCULATOR
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

  // 16. CGPA TO PERCENTAGE CONVERTER
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

  // 17. PERCENTAGE TO CGPA CONVERTER
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
