import { CalculatorDefinition } from '../../../types/calculator';
import { formatNumber } from '../../utils';

export const programmingCalculators: CalculatorDefinition[] = [
  // 1. AI TIME COMPLEXITY ANALYZER (FLAGSHIP)
  {
    id: 'time-complexity-analyzer',
    slug: 'time-complexity-analyzer',
    name: 'Time Complexity Analyzer',
    shortName: 'Time Complexity',
    category: 'engineering',
    description: 'Analyze algorithms in Python, C++, Java, or JavaScript to derive Big-O Time Complexity, loop depths, recursion branching, and optimization tips.',
    iconName: 'Cpu',
    popular: true,
    featured: true,
    keywords: ['time complexity', 'space complexity', 'big o analyzer', 'big o calculator', 'algorithm complexity', 'code analysis', 'python time complexity', 'leetcode complexity', 'data structures', 'engineering'],
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
      },
      {
        id: 'simulatedN',
        label: 'Simulate Operations for Input Size (n)',
        type: 'slider',
        defaultValue: 100,
        min: 10,
        max: 10000,
        step: 10
      }
    ],
    calculate: (inputs) => {
      const code = String(inputs.codeSnippet || '');
      const n = Number(inputs.simulatedN) || 100;
      
      // Simple AST heuristic inspection
      const loopMatches = (code.match(/for\s+|while\s+/g) || []).length;
      const isNested = /for[\s\S]*for|while[\s\S]*while/i.test(code);
      const isRecursive = /def\s+(\w+)[\s\S]*\1\(|function\s+(\w+)[\s\S]*\2\(/i.test(code);
      const isDivideConquer = /n\s*\/\/\s*2|n\s*\/\s*2|mid\s*=|binary/i.test(code);

      let bigO = 'O(n)';
      let labelSubtext = 'Linear time proportional to input n';
      let ops = n;
      let badge = 'O(n)';

      if (isRecursive && isDivideConquer) {
        bigO = 'O(log n)';
        labelSubtext = 'Logarithmic scaling via divide-and-conquer';
        ops = Math.round(Math.log2(n));
        badge = 'O(log n)';
      } else if (isNested || loopMatches >= 2) {
        bigO = 'O(n²)';
        labelSubtext = 'Quadratic growth from nested loop iterations';
        ops = n * n;
        badge = 'O(n²)';
      } else if (loopMatches === 1) {
        bigO = 'O(n)';
        labelSubtext = 'Single linear iteration pass';
        ops = n;
        badge = 'O(n)';
      } else if (code.trim().length > 0 && loopMatches === 0 && !isRecursive) {
        bigO = 'O(1)';
        labelSubtext = 'Constant time operations with direct address access';
        ops = 1;
        badge = 'O(1)';
      }

      return {
        primaryMetric: {
          label: 'Estimated Time Complexity',
          value: bigO,
          formattedValue: bigO,
          subtext: `${labelSubtext} (~${formatNumber(ops)} ops at n=${n})`,
          type: 'highlight',
          badge
        },
        secondaryMetrics: [
          {
            label: `Theoretical Operations (n = ${n})`,
            value: ops,
            formattedValue: `${formatNumber(ops)} operations`,
            type: 'neutral'
          },
          {
            label: 'Detected Loop Statements',
            value: loopMatches,
            formattedValue: `${loopMatches} loop block(s)`,
            type: loopMatches > 1 ? 'warning' : 'success'
          }
        ],
        breakdown: [
          { label: 'O(1) Constant Baseline', value: 1, formattedValue: '1 op' },
          { label: 'O(log n) Binary Reduction', value: Math.round(Math.log2(n)), formattedValue: `${Math.round(Math.log2(n))} ops` },
          { label: 'O(n) Linear Scan', value: n, formattedValue: `${formatNumber(n)} ops` },
          { label: 'O(n log n) Comparison Sort', value: Math.round(n * Math.log2(n)), formattedValue: `${formatNumber(Math.round(n * Math.log2(n)))} ops` },
          { label: 'O(n²) Quadratic Nested', value: n * n, formattedValue: `${formatNumber(n * n)} ops` }
        ],
        summaryText: `Analyzed ${inputs.language || 'Python'} code pattern. Evaluated asymptotic growth ceiling against standard LeetCode and DSA algorithm archetypes.`
      };
    },
    formula: {
      expression: 'T(n) = c₁ · f(n) + c₀  ⇒  O(f(n))',
      explanation: 'Big-O notation isolates the asymptotically dominant term describing the execution upper bound as input size n tends toward infinity.',
      variables: [
        { symbol: 'T(n)', name: 'Execution Time Function', description: 'Total elementary CPU instructions executed.' },
        { symbol: 'n', name: 'Input Size', description: 'Cardinality of elements in the input dataset.' }
      ]
    },
    explanationSections: [
      {
        title: 'How Time Complexity is Calculated',
        content: 'Time complexity measures runtime growth independent of hardware speed. Single loops scale as O(n), nested loops multiply to O(n²), binary search splits in half yielding O(log n), and recursive branching without memoization grows exponentially as O(2ⁿ).'
      },
      {
        title: 'Best, Average, and Worst Case',
        content: 'Big-O (O) characterizes the worst-case asymptotic upper bound, Big-Omega (Ω) defines the lower bound best case, and Big-Theta (Θ) denotes an asymptotically tight bound.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Big-O and Big-Theta?',
        answer: 'Big-O describes an asymptotic ceiling (cannot exceed this rate), while Big-Theta describes tight bounds where worst and best cases scale at the same mathematical rate.'
      },
      {
        question: 'Does Big-O include constant factors?',
        answer: 'No. Asymptotic notation drops lower-order terms and constant coefficients (e.g. 5n² + 100n + 50 becomes O(n²)) because as n approaches infinity, the highest-order polynomial completely dominates.'
      }
    ],
    relatedIds: ['space-complexity-analyzer', 'big-o-complexity-calculator', 'big-o-comparison', 'sorting-complexity'],
    disclaimerType: 'standard'
  },

  // 2. SPACE COMPLEXITY ANALYZER
  {
    id: 'space-complexity-analyzer',
    slug: 'space-complexity-analyzer',
    name: 'Space Complexity Analyzer',
    shortName: 'Space Complexity',
    category: 'engineering',
    description: 'Calculate auxiliary memory, recursion call-stack frame depth, heap allocations, and total space complexity for algorithms with memory size estimation in KB and MB.',
    iconName: 'HardDrive',
    popular: true,
    keywords: ['space complexity', 'auxiliary memory', 'recursion stack space', 'heap allocation', 'memory complexity', 'big o space', 'call stack'],
    inputs: [
      {
        id: 'allocationPattern',
        label: 'Memory Allocation Archetype',
        type: 'select',
        defaultValue: 'auxiliary_array',
        options: [
          { label: 'In-Place Variables (Pointers, Counters) → O(1)', value: 'in_place' },
          { label: 'Auxiliary Array / Buffer of Size n → O(n)', value: 'auxiliary_array' },
          { label: '2D Matrix / DP Table (n × m) → O(n²)', value: 'matrix_dp' },
          { label: 'Balanced Recursion Call Stack → O(log n)', value: 'recursion_tree' },
          { label: 'Linear Recursion Call Stack → O(n)', value: 'recursion_linear' },
          { label: 'Hash Map / Frequency Counter → O(k) or O(n)', value: 'hash_map' }
        ]
      },
      {
        id: 'inputSizeN',
        label: 'Input Cardinality (n elements)',
        type: 'slider',
        defaultValue: 10000,
        min: 100,
        max: 1000000,
        step: 100
      },
      {
        id: 'elementBytes',
        label: 'Data Type Size per Element',
        type: 'select',
        defaultValue: 8,
        options: [
          { label: '1 Byte (bool, char, int8)', value: 1 },
          { label: '4 Bytes (int32, float, pointer in 32-bit)', value: 4 },
          { label: '8 Bytes (int64, double, pointer in 64-bit)', value: 8 },
          { label: '32 Bytes (Node / Object Reference Overhead)', value: 32 }
        ]
      }
    ],
    calculate: (inputs) => {
      const pattern = inputs.allocationPattern || 'auxiliary_array';
      const n = Number(inputs.inputSizeN) || 10000;
      const bytesPerEl = Number(inputs.elementBytes) || 8;

      let bigOSpace = 'O(n)';
      let stackSpaceBytes = 0;
      let heapSpaceBytes = 0;
      let explanation = '';

      if (pattern === 'in_place') {
        bigOSpace = 'O(1)';
        heapSpaceBytes = bytesPerEl * 5; // few scalar variables
        stackSpaceBytes = 64; // single frame
        explanation = 'Constant auxiliary space. Modifies data in-place without scaling storage.';
      } else if (pattern === 'auxiliary_array') {
        bigOSpace = 'O(n)';
        heapSpaceBytes = n * bytesPerEl;
        stackSpaceBytes = 128;
        explanation = `Allocates linear contiguous buffer of ${formatNumber(n)} elements.`;
      } else if (pattern === 'matrix_dp') {
        bigOSpace = 'O(n²)';
        heapSpaceBytes = Math.min(n * n, 50000000) * bytesPerEl;
        stackSpaceBytes = 128;
        explanation = '2D DP grid or adjacency matrix scaling quadratically with input size.';
      } else if (pattern === 'recursion_tree') {
        bigOSpace = 'O(log n)';
        const depth = Math.round(Math.log2(n));
        stackSpaceBytes = depth * 128; // ~128 bytes per stack frame
        heapSpaceBytes = 0;
        explanation = `Divide-and-conquer call stack depth of ~${depth} activation frames.`;
      } else if (pattern === 'recursion_linear') {
        bigOSpace = 'O(n)';
        stackSpaceBytes = n * 128;
        heapSpaceBytes = 0;
        explanation = `Deep linear recursive chain holding ${formatNumber(n)} call frames simultaneously.`;
      } else if (pattern === 'hash_map') {
        bigOSpace = 'O(n)';
        heapSpaceBytes = n * (bytesPerEl + 24); // hash node overhead
        stackSpaceBytes = 128;
        explanation = 'Hash table storage with buckets, key-value entries, and load factor overhead.';
      }

      const totalBytes = heapSpaceBytes + stackSpaceBytes;
      const totalKB = totalBytes / 1024;
      const totalMB = totalKB / 1024;

      const formattedMemory = totalMB >= 1 
        ? `${totalMB.toFixed(2)} MB` 
        : totalKB >= 1 
          ? `${totalKB.toFixed(2)} KB` 
          : `${totalBytes} Bytes`;

      return {
        primaryMetric: {
          label: 'Auxiliary Space Complexity',
          value: bigOSpace,
          formattedValue: bigOSpace,
          subtext: `Estimated Memory Footprint: ${formattedMemory}`,
          type: 'highlight',
          badge: bigOSpace === 'O(1)' ? 'In-Place (Optimal)' : bigOSpace
        },
        secondaryMetrics: [
          {
            label: 'Heap Allocated Memory',
            value: Number(heapSpaceBytes.toFixed(0)),
            formattedValue: heapSpaceBytes >= 1048576 
              ? `${(heapSpaceBytes / 1048576).toFixed(2)} MB` 
              : `${(heapSpaceBytes / 1024).toFixed(1)} KB`,
            type: 'neutral'
          },
          {
            label: 'Call Stack Memory',
            value: Number(stackSpaceBytes.toFixed(0)),
            formattedValue: stackSpaceBytes >= 1048576 
              ? `${(stackSpaceBytes / 1048576).toFixed(2)} MB` 
              : `${(stackSpaceBytes / 1024).toFixed(1)} KB`,
            type: stackSpaceBytes > 1048576 ? 'error' : 'neutral'
          }
        ],
        breakdown: [
          { label: 'Heap Memory', value: heapSpaceBytes, formattedValue: `${(heapSpaceBytes / 1024).toFixed(1)} KB` },
          { label: 'Stack Frames Memory', value: stackSpaceBytes, formattedValue: `${(stackSpaceBytes / 1024).toFixed(1)} KB` },
          { label: 'Total Allocated Memory', value: totalBytes, formattedValue: formattedMemory }
        ],
        summaryText: explanation
      };
    },
    formula: {
      expression: 'Total Space = Input Space (Fixed) + Auxiliary Space (Dynamic / Stack)',
      explanation: 'Auxiliary space refers strictly to temporary or extra working memory allocated by the algorithm outside the original input data.',
      variables: [
        { symbol: 'Auxiliary Space', name: 'Working Memory', description: 'Extra buffers, hash maps, recursion stack frames.' },
        { symbol: 'Call Stack Frame', name: 'Stack Memory', description: 'Activation records created for each recursive subroutine call.' }
      ]
    },
    explanationSections: [
      {
        title: 'Difference Between Space Complexity and Auxiliary Space',
        content: 'Space complexity encompasses total memory including input storage. Auxiliary space measures only the additional workspace memory required by the algorithm. In interview coding, "Space Complexity" almost always refers to auxiliary space.'
      },
      {
        title: 'Stack Overflow Risks in Deep Recursion',
        content: 'Every recursive function invocation pushes a new stack frame (return address, local variables, CPU registers). Without tail-call optimization, recursive depths exceeding 10,000–50,000 frames typically exhaust the default 1MB–8MB stack limit, triggering a StackOverflowError.'
      }
    ],
    faqs: [
      {
        question: 'Does Merge Sort run in-place?',
        answer: 'Standard array-based Merge Sort requires O(n) auxiliary space to merge halves into temporary buffers. In contrast, Quick Sort runs in-place with O(log n) auxiliary stack space.'
      },
      {
        question: 'How do pointers affect space complexity on 64-bit systems?',
        answer: 'On 64-bit architectures, every memory pointer consumes 8 bytes. A linked list with 1,000,000 nodes holding 4-byte integers consumes ~12–16 MB due to pointer references and memory alignment padding.'
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'big-o-complexity-calculator', 'data-structure-complexity'],
    disclaimerType: 'standard'
  },

  // 3. BIG-O COMPLEXITY CALCULATOR
  {
    id: 'big-o-complexity-calculator',
    slug: 'big-o-complexity-calculator',
    name: 'Big-O Complexity Calculator',
    shortName: 'Big-O Calculator',
    category: 'engineering',
    description: 'Calculate operations count, CPU execution time at 1GHz, dominant term extraction, and asymptotic classification for any custom mathematical formula.',
    iconName: 'Calculator',
    popular: true,
    keywords: ['big o calculator', 'asymptotic complexity', 'runtime calculator', 'dominant term', 'operations count', 'cpu cycles', 'complexity solver'],
    inputs: [
      {
        id: 'formulaType',
        label: 'Complexity Class Archetype',
        type: 'select',
        defaultValue: 'nlogn',
        options: [
          { label: 'O(1) - Constant (Hash lookup, array index)', value: 'c' },
          { label: 'O(log n) - Logarithmic (Binary Search)', value: 'logn' },
          { label: 'O(n) - Linear (Single loop pass)', value: 'n' },
          { label: 'O(n log n) - Linearithmic (Merge Sort, Heap Sort)', value: 'nlogn' },
          { label: 'O(n²) - Quadratic (Bubble Sort, Nested Loops)', value: 'n2' },
          { label: 'O(n³) - Cubic (Matrix multiplication, 3 loops)', value: 'n3' },
          { label: 'O(2ⁿ) - Exponential (Subset sum, Naive Fibonacci)', value: '2n' },
          { label: 'O(n!) - Factorial (Traveling Salesperson Permutations)', value: 'nfact' }
        ]
      },
      {
        id: 'inputSize',
        label: 'Input Size (n)',
        type: 'slider',
        defaultValue: 1000,
        min: 10,
        max: 100000,
        step: 10
      },
      {
        id: 'cpuSpeedGhz',
        label: 'Target CPU Clock Frequency (GHz)',
        type: 'slider',
        defaultValue: 3.0,
        min: 0.5,
        max: 5.0,
        step: 0.1,
        suffix: ' GHz'
      }
    ],
    calculate: (inputs) => {
      const type = inputs.formulaType || 'nlogn';
      const n = Number(inputs.inputSize) || 1000;
      const ghz = Number(inputs.cpuSpeedGhz) || 3.0;
      const cyclesPerSec = ghz * 1e9;

      let ops = 1;
      let complexityClass = 'O(n log n)';
      let label = 'Linearithmic';

      if (type === 'c') {
        ops = 1;
        complexityClass = 'O(1)';
        label = 'Constant Time';
      } else if (type === 'logn') {
        ops = Math.log2(n);
        complexityClass = 'O(log n)';
        label = 'Logarithmic';
      } else if (type === 'n') {
        ops = n;
        complexityClass = 'O(n)';
        label = 'Linear';
      } else if (type === 'nlogn') {
        ops = n * Math.log2(n);
        complexityClass = 'O(n log n)';
        label = 'Linearithmic';
      } else if (type === 'n2') {
        ops = n * n;
        complexityClass = 'O(n²)';
        label = 'Quadratic';
      } else if (type === 'n3') {
        ops = n * n * n;
        complexityClass = 'O(n³)';
        label = 'Cubic';
      } else if (type === '2n') {
        ops = Math.pow(2, Math.min(n, 40));
        complexityClass = 'O(2ⁿ)';
        label = 'Exponential';
      } else if (type === 'nfact') {
        let f = 1;
        for (let i = 1; i <= Math.min(n, 15); i++) f *= i;
        ops = f;
        complexityClass = 'O(n!)';
        label = 'Factorial';
      }

      const seconds = ops / cyclesPerSec;
      let timeFormatted = '';
      if (seconds < 1e-6) {
        timeFormatted = `${(seconds * 1e9).toFixed(2)} nanoseconds`;
      } else if (seconds < 1e-3) {
        timeFormatted = `${(seconds * 1e6).toFixed(2)} microseconds`;
      } else if (seconds < 1) {
        timeFormatted = `${(seconds * 1000).toFixed(2)} milliseconds`;
      } else if (seconds < 60) {
        timeFormatted = `${seconds.toFixed(3)} seconds`;
      } else if (seconds < 3600) {
        timeFormatted = `${(seconds / 60).toFixed(1)} minutes`;
      } else {
        timeFormatted = `${(seconds / 3600).toFixed(1)} hours`;
      }

      return {
        primaryMetric: {
          label: 'Total Operations at n = ' + formatNumber(n),
          value: Number(ops.toFixed(0)),
          formattedValue: `${formatNumber(Math.round(ops))} ops`,
          subtext: `Class: ${complexityClass} (${label})`,
          type: 'highlight',
          badge: complexityClass
        },
        secondaryMetrics: [
          {
            label: `Estimated Time at ${ghz} GHz`,
            value: timeFormatted,
            formattedValue: timeFormatted,
            type: seconds > 1 ? 'error' : 'success'
          },
          {
            label: 'Operations / Second Throughput',
            value: `${ghz * 1000} Million`,
            formattedValue: `${(ghz).toFixed(1)} × 10⁹ ops/s`,
            type: 'neutral'
          }
        ],
        breakdown: [
          { label: 'n = 10', value: 10, formattedValue: type === 'n2' ? '100 ops' : type === 'nlogn' ? '33 ops' : '10 ops' },
          { label: 'n = 100', value: 100, formattedValue: type === 'n2' ? '10,000 ops' : type === 'nlogn' ? '664 ops' : '100 ops' },
          { label: 'n = 1,000', value: 1000, formattedValue: type === 'n2' ? '1,000,000 ops' : type === 'nlogn' ? '9,965 ops' : '1,000 ops' },
          { label: 'n = 10,000', value: 10000, formattedValue: type === 'n2' ? '100,000,000 ops' : type === 'nlogn' ? '132,877 ops' : '10,000 ops' }
        ],
        summaryText: `At input size n = ${formatNumber(n)}, ${complexityClass} requires ${formatNumber(Math.round(ops))} operations, executing in ~${timeFormatted} on a modern ${ghz} GHz processor.`
      };
    },
    formula: {
      expression: 'Time (s) = Operations / (Clock Frequency in Hz)',
      explanation: 'Estimates real-world execution latency by mapping theoretical Big-O algorithmic operation counts to CPU instruction cycle frequencies.',
      variables: [
        { symbol: 'Operations', name: 'Big-O Ops', description: 'Elementary instructions determined by f(n).' },
        { symbol: 'GHz', name: 'Clock Speed', description: 'Billions of clock cycles processed per second.' }
      ]
    },
    explanationSections: [
      {
        title: 'Rule of Thumb for Competitive Programming',
        content: 'Modern CPUs execute approximately 10⁸ (100 million) operations per second in practice. An algorithm requiring 10⁸ operations runs in ~1.0 second. If n = 10⁵, an O(n²) algorithm executes 10¹⁰ operations and will take ~100 seconds (resulting in a Time Limit Exceeded error).'
      }
    ],
    faqs: [
      {
        question: 'Why does O(n log n) scale so well compared to O(n²)?',
        answer: 'For n = 1,000,000: O(n log n) is roughly 20,000,000 operations (~0.02 seconds), whereas O(n²) is 1,000,000,000,000 operations (~3 hours)!'
      }
    ],
    relatedIds: ['time-complexity-analyzer', 'big-o-comparison', 'sorting-complexity'],
    disclaimerType: 'standard'
  },

  // 4. BIG-O COMPARISON TOOL
  {
    id: 'big-o-comparison',
    slug: 'big-o-comparison',
    name: 'Big-O Comparison Tool',
    shortName: 'Big-O Comparison',
    category: 'engineering',
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
        ],
        breakdown: [
          { label: 'O(1) Constant', value: 1, formattedValue: '1 op' },
          { label: 'O(log n) Logarithmic', value: Math.round(logn), formattedValue: `${Math.round(logn)} ops` },
          { label: 'O(n) Linear', value: n, formattedValue: `${n} ops` },
          { label: 'O(n log n) Linearithmic', value: Math.round(nlogn), formattedValue: `${formatNumber(Math.round(nlogn))} ops` },
          { label: 'O(n²) Quadratic', value: n2, formattedValue: `${formatNumber(n2)} ops` }
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

  // 5. SORTING ALGORITHM COMPLEXITY CALCULATOR
  {
    id: 'sorting-complexity',
    slug: 'sorting-complexity',
    name: 'Sorting Algorithm Complexity Calculator',
    shortName: 'Sorting Complexity',
    category: 'engineering',
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

  // 6. DATA STRUCTURE COMPLEXITY CALCULATOR
  {
    id: 'data-structure-complexity',
    slug: 'data-structure-complexity',
    name: 'Data Structure Complexity Calculator',
    shortName: 'Data Structure Complexity',
    category: 'engineering',
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
          { label: 'Binary Min/Max Heap', value: 'heap' },
          { label: 'Trie (Prefix Tree)', value: 'trie' }
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

  // 7. RECURSION COMPLEXITY ANALYZER (MASTER THEOREM)
  {
    id: 'recursion-master-theorem',
    slug: 'recursion-master-theorem',
    name: 'Recursion Complexity Analyzer',
    shortName: 'Recursion Complexity',
    category: 'engineering',
    description: 'Solve recurrence relations of the form T(n) = aT(n/b) + f(n) with step-by-step case determinations for Merge Sort, Strassen Matrix, Karatsuba, and Binary Search.',
    iconName: 'GitBranch',
    popular: true,
    keywords: ['recursion complexity analyzer', 'master theorem', 'recurrence relation', 'divide and conquer', 't(n) = at(n/b) + f(n)', 'merge sort recurrence', 'algorithm analysis'],
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

  // 8. BINARY / DECIMAL / HEXADECIMAL CONVERTER
  {
    id: 'binary-converter',
    slug: 'binary-converter',
    name: 'Binary / Decimal / Hexadecimal Converter',
    shortName: 'Binary / Hex Converter',
    category: 'engineering',
    description: 'Convert numbers instantly between Binary (Base 2), Decimal (Base 10), Hexadecimal (Base 16), and Octal (Base 8).',
    iconName: 'Binary',
    popular: true,
    keywords: ['binary converter', 'hex converter', 'decimal to binary', 'hex to decimal', 'base 16', 'bitwise', 'computer science'],
    inputs: [
      {
        id: 'inputBase',
        label: 'Input Number Format',
        type: 'select',
        defaultValue: 'decimal',
        options: [
          { label: 'Decimal (Base 10)', value: 'decimal' },
          { label: 'Binary (Base 2)', value: 'binary' },
          { label: 'Hexadecimal (Base 16)', value: 'hex' },
          { label: 'Octal (Base 8)', value: 'octal' }
        ]
      },
      {
        id: 'inputValue',
        label: 'Enter Value',
        type: 'text',
        defaultValue: '255',
        placeholder: 'e.g. 255 or 11111111 or FF'
      }
    ],
    calculate: (inputs) => {
      const base = inputs.inputBase || 'decimal';
      const raw = String(inputs.inputValue || '255').trim();

      let decimal = 0;
      try {
        if (base === 'decimal') decimal = parseInt(raw, 10);
        else if (base === 'binary') decimal = parseInt(raw, 2);
        else if (base === 'hex') decimal = parseInt(raw, 16);
        else if (base === 'octal') decimal = parseInt(raw, 8);
      } catch (e) {
        decimal = 0;
      }

      if (isNaN(decimal)) decimal = 0;

      const bin = decimal.toString(2);
      const hex = decimal.toString(16).toUpperCase();
      const oct = decimal.toString(8);

      return {
        primaryMetric: {
          label: 'Binary (Base 2)',
          value: bin,
          formattedValue: `0b${bin.padStart(8, '0')}`,
          subtext: `Decimal: ${decimal} | Hex: 0x${hex}`,
          type: 'highlight',
          badge: `${bin.length} Bits`
        },
        secondaryMetrics: [
          {
            label: 'Decimal (Base 10)',
            value: decimal,
            formattedValue: decimal.toLocaleString(),
            type: 'neutral'
          },
          {
            label: 'Hexadecimal (Base 16)',
            value: hex,
            formattedValue: `0x${hex}`,
            type: 'success'
          },
          {
            label: 'Octal (Base 8)',
            value: oct,
            formattedValue: `0o${oct}`,
            type: 'neutral'
          }
        ]
      };
    },
    formula: {
      expression: 'Decimal = Σ (digit × Base^position)',
      explanation: 'Positional numeral system conversion mapping polynomial powers of 2, 8, 10, and 16.',
      variables: [
        { symbol: 'Base 2', name: 'Binary', description: 'Composed of 0 and 1.' },
        { symbol: 'Base 16', name: 'Hexadecimal', description: 'Digits 0-9 and letters A-F (representing 10-15).' }
      ]
    },
    explanationSections: [
      {
        title: 'Why Computers Use Binary and Hex',
        content: 'Transistors in computer silicon represent binary states (0 = off, 1 = on). Hexadecimal is used by programmers as a compact, human-readable shorthand where each hex digit represents exactly 4 binary bits (a nibble).'
      }
    ],
    faqs: [
      {
        question: 'What is 255 in hex and binary?',
        answer: 'Decimal 255 is 0xFF in hexadecimal and 11111111 in binary (1 full byte of all ones).'
      }
    ],
    relatedIds: ['number-system-converter', 'binary-arithmetic-calculator'],
    disclaimerType: 'standard'
  },

  // 9. NUMBER SYSTEM CONVERTER
  {
    id: 'number-system-converter',
    slug: 'number-system-converter',
    name: 'Number System Converter',
    shortName: 'Number System Converter',
    category: 'engineering',
    description: 'Convert between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16) with interactive byte nibbles and step-by-step division tables.',
    iconName: 'Binary',
    popular: true,
    keywords: ['number system converter', 'binary to hex', 'hex to decimal', 'decimal to binary', 'octal conversion', 'bitwise', 'two complement', 'radix converter'],
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
    relatedIds: ['binary-converter', 'binary-arithmetic-calculator'],
    disclaimerType: 'standard'
  },

  // 10. ALGORITHM COMPLEXITY CHEAT SHEET
  {
    id: 'algorithm-cheat-sheet',
    slug: 'algorithm-cheat-sheet',
    name: 'Algorithm Complexity Cheat Sheet',
    shortName: 'Algorithm Cheat Sheet',
    category: 'engineering',
    description: 'Quick reference cheat sheet for Sorting, Searching, Graph traversals (BFS, DFS, Dijkstra), Trees, and Dynamic Programming algorithms.',
    iconName: 'FileText',
    popular: true,
    keywords: ['algorithm complexity cheat sheet', 'dsa cheat sheet', 'big o cheat sheet', 'dijkstra complexity', 'bfs dfs complexity', 'dynamic programming', 'engineering cheat sheet'],
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
          { label: 'Searching Algorithms', value: 'Searching' }
        ]
      }
    ],
    calculate: (inputs) => {
      const cat = inputs.categoryFilter || 'All';
      return {
        primaryMetric: {
          label: 'Standard Optimal Sorting Bound',
          value: 'O(n log n)',
          formattedValue: 'O(n log n) Time',
          subtext: 'Comparison sorting lower bound proved by decision trees',
          type: 'highlight',
          badge: 'Optimal Bound'
        },
        secondaryMetrics: [
          { label: 'Binary Search Lookup', value: 'O(log n)', formattedValue: 'O(log n) Time', type: 'success' },
          { label: 'Dijkstra Shortest Path', value: 'O((V + E) log V)', formattedValue: 'O((V + E) log V)', type: 'neutral' }
        ],
        table: {
          title: `Common Algorithm Complexities (${cat})`,
          columns: [
            { key: 'algo', label: 'Algorithm' },
            { key: 'best', label: 'Best Time' },
            { key: 'avg', label: 'Average Time' },
            { key: 'worst', label: 'Worst Time' },
            { key: 'space', label: 'Worst Space' }
          ],
          data: [
            { algo: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
            { algo: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
            { algo: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
            { algo: 'Binary Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
            { algo: 'BFS / DFS Graph', best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
            { algo: 'Dijkstra (Min-Heap)', best: 'O((V+E)log V)', avg: 'O((V+E)log V)', worst: 'O((V+E)log V)', space: 'O(V)' }
          ]
        },
        summaryText: 'Quick reference reference table for standard Big-O time and space complexity classes across common algorithms.'
      };
    },
    formula: {
      expression: 'Asymptotic Hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
      explanation: 'Asymptotic reference chart for competitive programming and technical interviews.',
      variables: [
        { symbol: 'V', name: 'Vertices', description: 'Number of graph vertices.' },
        { symbol: 'E', name: 'Edges', description: 'Number of graph edges.' }
      ]
    },
    explanationSections: [
      {
        title: 'How to Choose the Right Algorithm',
        content: 'For large sorted datasets, Binary Search delivers answers in microsecond timescales O(log n). For sorting large arrays, Merge Sort guarantees stable O(n log n) performance while Quick Sort maximizes CPU cache throughput.'
      }
    ],
    faqs: [
      {
        question: 'What is the fastest sorting algorithm?',
        answer: 'For general comparison sorting, TimSort (used in Python and Java) and Introsort (used in C++ std::sort) run in O(n log n). For integers within small ranges, Counting Sort runs in linear O(n + k) time.'
      }
    ],
    relatedIds: ['sorting-complexity', 'time-complexity-analyzer', 'data-structure-complexity'],
    disclaimerType: 'standard'
  }
];
