export interface SortingAlgorithmInfo {
  id: string;
  name: string;
  category: 'Comparison' | 'Non-Comparison';
  bestTime: string;
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  auxiliarySpace: string;
  stability: 'Stable' | 'Unstable';
  inPlace: 'Yes' | 'No';
  method: string;
  description: string;
  pros: string[];
  cons: string[];
  codeCpp: string;
}

export const SORTING_ALGORITHMS: SortingAlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Comparison',
    bestTime: 'O(n)',
    averageTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    auxiliarySpace: 'O(1)',
    stability: 'Stable',
    inPlace: 'Yes',
    method: 'Exchanging',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    pros: ['Very easy to understand and implement', 'Detects sorted array in O(n) with early exit flag', 'O(1) memory'],
    cons: ['Severely inefficient on large datasets O(n²)', 'Performs excessive swap writes'],
    codeCpp: `void bubbleSort(int arr[], int n) {
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimized early exit
    }
}`
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Comparison',
    bestTime: 'O(n²)',
    averageTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    auxiliarySpace: 'O(1)',
    stability: 'Unstable',
    inPlace: 'Yes',
    method: 'Selection',
    description: 'Divides input into sorted and unsorted regions; continuously selects the minimum element from the unsorted sublist.',
    pros: ['Minimizes total memory write operations (at most n swaps)', 'Simple in-place implementation'],
    cons: ['Always takes quadratic O(n²) time regardless of initial order', 'Unstable by default'],
    codeCpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[minIdx], arr[i]);
    }
}`
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Comparison',
    bestTime: 'O(n)',
    averageTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    auxiliarySpace: 'O(1)',
    stability: 'Stable',
    inPlace: 'Yes',
    method: 'Insertion',
    description: 'Builds the final sorted array one item at a time by repeatedly inserting elements into their correct position.',
    pros: ['Extremely efficient for small arrays (n ≤ 20) and nearly sorted data', 'Online algorithm (can sort stream on arrival)', 'Stable'],
    cons: ['O(n²) average and worst case'],
    codeCpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Comparison',
    bestTime: 'O(n log n)',
    averageTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(n)',
    auxiliarySpace: 'O(n)',
    stability: 'Stable',
    inPlace: 'No',
    method: 'Merging / Divide & Conquer',
    description: 'Divides array into two halves, recursively sorts them, and merges the two sorted halves in linear time.',
    pros: ['Guaranteed O(n log n) worst-case performance', 'Stable sorting', 'Ideal for linked lists and external disk storage'],
    cons: ['Requires O(n) extra auxiliary buffer memory', 'Slower on small arrays than quicksort'],
    codeCpp: `void merge(int arr[], int l, int m, int r);

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort (Hoare / Lomuto)',
    category: 'Comparison',
    bestTime: 'O(n log n)',
    averageTime: 'O(n log n)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(log n)',
    auxiliarySpace: 'O(log n) stack',
    stability: 'Unstable',
    inPlace: 'Yes',
    method: 'Partitioning',
    description: 'Picks a pivot element and partitions the array around the pivot so smaller elements go left and greater elements go right.',
    pros: ['Fastest general-purpose sorting algorithm in practice (cache friendly)', 'In-place with O(log n) stack space'],
    cons: ['Worst-case O(n²) if pivot selection is unbalanced (e.g. already sorted array with naive pivot)', 'Unstable'],
    codeCpp: `int partition(int arr[], int low, int high);

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Comparison',
    bestTime: 'O(n log n)',
    averageTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(1)',
    auxiliarySpace: 'O(1)',
    stability: 'Unstable',
    inPlace: 'Yes',
    method: 'Selection via Binary Heap',
    description: 'Builds a max-heap from input data, then repeatedly swaps root element with last element and heapifies.',
    pros: ['Guaranteed O(n log n) with O(1) auxiliary memory', 'In-place'],
    cons: ['Poor cache locality due to jumpy array indexing', 'Unstable'],
    codeCpp: `void heapify(int arr[], int n, int i);

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'Non-Comparison',
    bestTime: 'O(n + k)',
    averageTime: 'O(n + k)',
    worstTime: 'O(n + k)',
    spaceComplexity: 'O(k)',
    auxiliarySpace: 'O(n + k)',
    stability: 'Stable',
    inPlace: 'No',
    method: 'Distribution / Bucket Indexing',
    description: 'Counts occurrences of each unique element within range k and computes their final array positions using prefix sums.',
    pros: ['Breaks the comparison sort O(n log n) lower bound', 'Linear time O(n) when range k is O(n)', 'Stable'],
    cons: ['Only works for non-negative integers', 'High memory overhead if k >> n'],
    codeCpp: `void countingSort(int arr[], int n, int k) {
    vector<int> count(k + 1, 0), output(n);
    for (int i = 0; i < n; i++) count[arr[i]]++;
    for (int i = 1; i <= k; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}`
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort (LSD)',
    category: 'Non-Comparison',
    bestTime: 'O(d × (n + b))',
    averageTime: 'O(d × (n + b))',
    worstTime: 'O(d × (n + b))',
    spaceComplexity: 'O(n + b)',
    auxiliarySpace: 'O(n + b)',
    stability: 'Stable',
    inPlace: 'No',
    method: 'Digit-by-Digit Positional Sorting',
    description: 'Sorts numbers digit by digit from least significant to most significant digit using a stable counting sort subroutine.',
    pros: ['Linear time for fixed-length keys', 'Stable'],
    cons: ['Constrained to fixed-width keys (integers, strings)', 'Higher constant factor than Quicksort'],
    codeCpp: `void countSortForRadix(int arr[], int n, int exp);

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10) {
        countSortForRadix(arr, n, exp);
    }
}`
  }
];

export interface DataStructureComplexity {
  name: string;
  category: 'Linear' | 'Tree' | 'Hash' | 'Graph';
  accessAvg: string;
  accessWorst: string;
  searchAvg: string;
  searchWorst: string;
  insertionAvg: string;
  insertionWorst: string;
  deletionAvg: string;
  deletionWorst: string;
  spaceWorst: string;
  description: string;
  memoryDiagram: string;
}

export const DATA_STRUCTURES: DataStructureComplexity[] = [
  {
    name: 'Array',
    category: 'Linear',
    accessAvg: 'O(1)',
    accessWorst: 'O(1)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(n)',
    insertionWorst: 'O(n)',
    deletionAvg: 'O(n)',
    deletionWorst: 'O(n)',
    spaceWorst: 'O(n)',
    description: 'Contiguous block of memory holding elements of identical type with instant indexed access.',
    memoryDiagram: '[ 0 | 1 | 2 | 3 | 4 ... ]'
  },
  {
    name: 'Dynamic Array (Vector / ArrayList)',
    category: 'Linear',
    accessAvg: 'O(1)',
    accessWorst: 'O(1)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1) amortized',
    insertionWorst: 'O(n)',
    deletionAvg: 'O(n)',
    deletionWorst: 'O(n)',
    spaceWorst: 'O(n)',
    description: 'Resizable array that doubles capacity when full; amortized O(1) push_back operations.',
    memoryDiagram: '[ Cap: 8 | Len: 5 | [0, 1, 2, 3, 4, _, _, _] ]'
  },
  {
    name: 'Singly Linked List',
    category: 'Linear',
    accessAvg: 'O(n)',
    accessWorst: 'O(n)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1)',
    insertionWorst: 'O(1)',
    deletionAvg: 'O(1)',
    deletionWorst: 'O(1)',
    spaceWorst: 'O(n)',
    description: 'Sequence of nodes where each node contains data and a forward pointer to the next node.',
    memoryDiagram: '[Head] -> [Val|*Next] -> [Val|*Next] -> [Null]'
  },
  {
    name: 'Doubly Linked List',
    category: 'Linear',
    accessAvg: 'O(n)',
    accessWorst: 'O(n)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1)',
    insertionWorst: 'O(1)',
    deletionAvg: 'O(1)',
    deletionWorst: 'O(1)',
    spaceWorst: 'O(n)',
    description: 'Nodes maintain both previous and next pointers, allowing bidirectional traversal.',
    memoryDiagram: '[Null] <- [*Prev|Val|*Next] <-> [*Prev|Val|*Next] -> [Null]'
  },
  {
    name: 'Stack (LIFO)',
    category: 'Linear',
    accessAvg: 'O(n)',
    accessWorst: 'O(n)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1)',
    insertionWorst: 'O(1)',
    deletionAvg: 'O(1)',
    deletionWorst: 'O(1)',
    spaceWorst: 'O(n)',
    description: 'Last-In First-Out container with instant push, pop, and top inspections.',
    memoryDiagram: '| Top: [ 3 ] |\n|      [ 2 ] |\n| Base:[ 1 ] |'
  },
  {
    name: 'Queue (FIFO)',
    category: 'Linear',
    accessAvg: 'O(n)',
    accessWorst: 'O(n)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1)',
    insertionWorst: 'O(1)',
    deletionAvg: 'O(1)',
    deletionWorst: 'O(1)',
    spaceWorst: 'O(n)',
    description: 'First-In First-Out buffer with enqueue at rear and dequeue from front.',
    memoryDiagram: '[Front: Out] <- [ 1 | 2 | 3 | 4 ] <- [Rear: In]'
  },
  {
    name: 'Hash Table / Hash Map',
    category: 'Hash',
    accessAvg: 'N/A',
    accessWorst: 'N/A',
    searchAvg: 'O(1)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(1)',
    insertionWorst: 'O(n)',
    deletionAvg: 'O(1)',
    deletionWorst: 'O(n)',
    spaceWorst: 'O(n)',
    description: 'Maps key hashes to bucket indices; constant-time operations when collision load factor is low.',
    memoryDiagram: 'Key -> Hash(k) -> Index [Bucket 0..M-1] -> Linked Node / Tree'
  },
  {
    name: 'Binary Search Tree (BST)',
    category: 'Tree',
    accessAvg: 'O(log n)',
    accessWorst: 'O(n)',
    searchAvg: 'O(log n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(log n)',
    insertionWorst: 'O(n)',
    deletionAvg: 'O(log n)',
    deletionWorst: 'O(n)',
    spaceWorst: 'O(n)',
    description: 'Ordered binary tree: left children < root < right children. Degenerates to linear chain if unbalance occurs.',
    memoryDiagram: '      [ 50 ]\n     /      \\\n  [ 30 ]  [ 70 ]'
  },
  {
    name: 'Self-Balancing BST (AVL / Red-Black Tree)',
    category: 'Tree',
    accessAvg: 'O(log n)',
    accessWorst: 'O(log n)',
    searchAvg: 'O(log n)',
    searchWorst: 'O(log n)',
    insertionAvg: 'O(log n)',
    insertionWorst: 'O(log n)',
    deletionAvg: 'O(log n)',
    deletionWorst: 'O(log n)',
    spaceWorst: 'O(n)',
    description: 'Maintains height balance via tree rotations, guaranteeing worst-case logarithmic performance.',
    memoryDiagram: 'AVL Balance Factor: {-1, 0, +1} | RB Black Height Balanced'
  },
  {
    name: 'Binary Heap (Min / Max Heap)',
    category: 'Tree',
    accessAvg: 'O(1) for peak',
    accessWorst: 'O(1)',
    searchAvg: 'O(n)',
    searchWorst: 'O(n)',
    insertionAvg: 'O(log n)',
    insertionWorst: 'O(log n)',
    deletionAvg: 'O(log n)',
    deletionWorst: 'O(log n)',
    spaceWorst: 'O(n)',
    description: 'Complete binary tree satisfying heap invariant; array packed without pointer overhead.',
    memoryDiagram: 'Array Mapping: Parent i -> Left(2i+1), Right(2i+2)'
  }
];
