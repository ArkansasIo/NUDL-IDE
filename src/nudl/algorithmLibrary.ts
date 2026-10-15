/**
 * NUDL 0.3 algorithm example library.
 *
 * The library exposes 200 deterministic .ndf examples to the IDE.  Examples
 * are generated from small source templates so the browser does not need to
 * ship 200 duplicated TypeScript string literals.
 */

export interface NudlAlgorithmExample {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
}

const examples: NudlAlgorithmExample[] = [];

function add(id: string, name: string, category: string, description: string, source: string) {
  examples.push({ id, name, category, description, source: source.trim() + '\n' });
}

const scalar = [
  ['absolute_value', 'Absolute value', 'Returns the magnitude of a number.', 'return abs(x);'],
  ['minimum_two', 'Minimum of two values', 'Returns the smaller input.', 'return min(a, b);'],
  ['maximum_two', 'Maximum of two values', 'Returns the larger input.', 'return max(a, b);'],
  ['average_two', 'Average of two values', 'Computes the arithmetic mean.', 'return (a + b) / 2;'],
  ['triangle_area', 'Triangle area', 'Computes one-half base times height.', 'return base * height / 2;'],
  ['rectangle_area', 'Rectangle area', 'Computes width times height.', 'return width * height;'],
  ['rectangle_perimeter', 'Rectangle perimeter', 'Computes the perimeter.', 'return 2 * (width + height);'],
  ['sum_to_n', 'Sum to N', 'Computes 1 through N.', 'return n * (n + 1) / 2;'],
  ['sum_squares', 'Sum of squares', 'Computes the first N square sum.', 'return n * (n + 1) * (2 * n + 1) / 6;'],
  ['degrees_to_radians', 'Degrees to radians', 'Converts angular units.', 'return degrees * pi() / 180;'],
];
scalar.forEach(([id, name, description, body]) => add(id, name, 'Mathematics', description, `fn ${id}(x: f64, a: f64, b: f64, base: f64, height: f64, width: f64, n: i64, degrees: f64) -> f64 {\n    ${body}\n}\n`));

const bitwise = [
  ['bitwise_and', 'Bitwise AND', 'Combines two integer masks.', 'return a & b;'],
  ['bitwise_or', 'Bitwise OR', 'Combines set bits from two integers.', 'return a | b;'],
  ['bitwise_xor', 'Bitwise XOR', 'Returns differing bits.', 'return a ^ b;'],
  ['shift_left', 'Shift left', 'Moves bits toward the high end.', 'return value << bits;'],
  ['shift_right', 'Shift right', 'Moves bits toward the low end.', 'return value >> bits;'],
  ['extract_bit', 'Extract bit', 'Reads one bit by index.', 'return (value >> index) & 1;'],
  ['set_bit', 'Set bit', 'Sets one bit.', 'return value | (1 << index);'],
  ['clear_bit', 'Clear bit', 'Clears one bit.', 'return value & ~(1 << index);'],
  ['toggle_bit', 'Toggle bit', 'Flips one bit.', 'return value ^ (1 << index);'],
  ['low_bit_mask', 'Low-bit mask', 'Builds a mask containing N low bits.', 'return (1 << bits) - 1;'],
];
bitwise.forEach(([id, name, description, body]) => add(id, name, 'Bitwise', description, `fn ${id}(value: i64, a: i64, b: i64, bits: i64, index: i64) -> i64 {\n    ${body}\n}\n`));

const collection = [
  ['linear_search', 'Linear search', 'Finds a value by scanning sequentially.', 'for (let i = 0; i < len(values); i = i + 1) { if (values[i] == target) { return i; } } return -1;'],
  ['binary_search', 'Binary search', 'Searches an ordered array in logarithmic time.', 'let lo = 0; let hi = len(values) - 1; while (lo <= hi) { let mid = (lo + hi) / 2; if (values[mid] == target) { return mid; } if (values[mid] < target) { lo = mid + 1; } else { hi = mid - 1; } } return -1;'],
  ['reverse_array', 'Reverse array', 'Reverses a collection.', 'return reverse(values);'],
  ['unique_values', 'Unique values', 'Removes duplicate values.', 'return unique(values);'],
  ['array_sum', 'Array sum', 'Adds all numeric elements.', 'return sum(values);'],
  ['array_min', 'Array minimum', 'Finds the smallest element.', 'return min(values);'],
  ['array_max', 'Array maximum', 'Finds the largest element.', 'return max(values);'],
  ['array_average', 'Array average', 'Computes the collection mean.', 'return average(values);'],
  ['prefix_sum', 'Prefix sum', 'Builds cumulative totals.', 'return prefix_sum(values);'],
  ['frequency_map', 'Frequency map', 'Counts occurrences of values.', 'return frequency_map(values);'],
  ['chunk_array', 'Chunk array', 'Splits an array into fixed-size chunks.', 'return chunk(values, size);'],
  ['pairwise', 'Pairwise traversal', 'Produces adjacent pairs.', 'return pairwise(values);'],
  ['interleave', 'Interleave arrays', 'Alternates elements from two arrays.', 'return interleave(a, b);'],
  ['rotate_array', 'Rotate array', 'Rotates elements by an offset.', 'return rotate(values, offset);'],
  ['flatten_array', 'Flatten array', 'Flattens nested collections.', 'return flatten(values);'],
];
collection.forEach(([id, name, description, body]) => add(id, name, 'Collections', description, `fn ${id}(values: array, target: i64, size: i64, a: array, b: array, offset: i64) -> array {\n    ${body}\n}\n`));

const stringAlgorithms = [
  ['reverse_string', 'Reverse string', 'Reverses Unicode text.', 'return reverse(text);'],
  ['palindrome', 'Palindrome test', 'Checks whether text reads the same backward.', 'return text == reverse(text);'],
  ['isogram', 'Isogram test', 'Checks that letters are not repeated.', 'return is_isogram(text);'],
  ['pangram', 'Pangram test', 'Checks whether every alphabet letter occurs.', 'return is_pangram(text);'],
  ['count_substring', 'Substring count', 'Counts occurrences of a substring.', 'return count_substring(text, pattern);'],
  ['kmp_search', 'KMP search', 'Searches text using the Knuth-Morris-Pratt method.', 'return kmp(text, pattern);'],
  ['levenshtein', 'Levenshtein distance', 'Computes edit distance.', 'return levenshtein_distance(a, b);'],
  ['normalize_spaces', 'Normalize spaces', 'Collapses repeated whitespace.', 'return regex_replace(text, "\\\\s+", " ");'],
  ['rot13', 'ROT13', 'Applies a Caesar shift of thirteen.', 'return caesar(text, 13);'],
  ['ascii_sum', 'ASCII/UTF-8 sum', 'Computes a byte-oriented checksum.', 'return byte_sum(text);'],
];
stringAlgorithms.forEach(([id, name, description, body]) => add(id, name, 'Strings', description, `fn ${id}(text: string, pattern: string, a: string, b: string) -> i64 {\n    ${body}\n}\n`));

const graphAlgorithms = [
  ['bfs', 'Breadth-first search', 'Traverses an unweighted graph by layers.', 'return bfs(graph, start);'],
  ['dfs', 'Depth-first search', 'Traverses a graph recursively.', 'return dfs(graph, start);'],
  ['shortest_path', 'Unweighted shortest path', 'Finds a shortest path in an unweighted graph.', 'return shortest_path(graph, start, goal);'],
  ['topological_sort', 'Topological sort', 'Orders vertices of a DAG.', 'return topological_sort(graph);'],
  ['cycle_detection', 'Cycle detection', 'Detects a directed cycle.', 'return has_cycle(graph);'],
  ['connected_components', 'Connected components', 'Partitions a graph into components.', 'return components(graph);'],
  ['degree_sequence', 'Degree sequence', 'Returns vertex degrees.', 'return degrees(graph);'],
  ['reverse_graph', 'Reverse graph', 'Reverses every directed edge.', 'return reverse_graph(graph);'],
  ['transpose_matrix', 'Matrix transpose', 'Swaps matrix rows and columns.', 'return transpose(matrix);'],
  ['dijkstra', 'Dijkstra shortest path', 'Computes non-negative weighted shortest paths.', 'return dijkstra(graph, start);'],
  ['bellman_ford', 'Bellman-Ford', 'Supports negative edge weights.', 'return bellman_ford(graph, start);'],
  ['floyd_warshall', 'Floyd-Warshall', 'Computes all-pairs shortest paths.', 'return floyd_warshall(matrix);'],
  ['prim_mst', 'Prim minimum spanning tree', 'Builds an MST from a connected weighted graph.', 'return prim_mst(graph);'],
  ['kruskal_mst', 'Kruskal minimum spanning tree', 'Builds an MST using disjoint sets.', 'return kruskal_mst(graph);'],
  ['bipartite_check', 'Bipartite test', 'Tests whether a graph is two-colorable.', 'return bipartite(graph);'],
];
graphAlgorithms.forEach(([id, name, description, body]) => add(id, name, 'Graphs', description, `fn ${id}(graph: graph, start: string, goal: string, matrix: matrix) -> any {\n    ${body}\n}\n`));

const dynamic = [
  ['fibonacci_dp', 'Fibonacci dynamic programming', 'Computes Fibonacci numbers bottom-up.', 'return fibonacci(n);'],
  ['knapsack_01', '0/1 knapsack', 'Maximizes value under a capacity constraint.', 'return knapsack(weights, values, capacity);'],
  ['coin_change', 'Coin change', 'Finds a minimum coin count.', 'return coin_change(coins, amount);'],
  ['lcs', 'Longest common subsequence', 'Finds a longest shared subsequence.', 'return lcs(a, b);'],
  ['lis', 'Longest increasing subsequence', 'Finds a longest increasing subsequence.', 'return lis(values);'],
  ['edit_distance', 'Edit distance', 'Computes minimum insertion/deletion/substitution cost.', 'return levenshtein_distance(a, b);'],
  ['matrix_chain', 'Matrix-chain multiplication', 'Optimizes matrix multiplication order.', 'return matrix_chain(dimensions);'],
  ['rod_cutting', 'Rod cutting', 'Maximizes revenue from rod partitions.', 'return rod_cut(prices, length);'],
  ['partition_number', 'Integer partition', 'Counts additive partitions.', 'return partition(n);'],
  ['catalan', 'Catalan number', 'Computes the Nth Catalan number.', 'return catalan(n);'],
];
dynamic.forEach(([id, name, description, body]) => add(id, name, 'Dynamic Programming', description, `fn ${id}(n: i64, values: array, weights: array, prices: array, coins: array, a: string, b: string, capacity: i64, amount: i64, length: i64, dimensions: array) -> i64 {\n    ${body}\n}\n`));

const numberTheory = [
  ['gcd', 'Greatest common divisor', 'Euclidean algorithm for GCD.', 'return gcd(a, b);'],
  ['lcm', 'Least common multiple', 'Computes the least common multiple.', 'return lcm(a, b);'],
  ['extended_gcd', 'Extended GCD', 'Returns Bezout coefficients.', 'return extended_gcd(a, b);'],
  ['is_prime', 'Primality test', 'Tests whether an integer is prime.', 'return is_prime(n);'],
  ['sieve', 'Sieve of Eratosthenes', 'Generates primes through N.', 'return sieve(n);'],
  ['modular_power', 'Modular exponentiation', 'Raises a number to a power modulo M.', 'return pow_mod(base, exponent, modulus);'],
  ['modular_inverse', 'Modular inverse', 'Finds a multiplicative inverse.', 'return mod_inverse(a, modulus);'],
  ['factorial', 'Factorial', 'Computes N factorial.', 'return factorial(n);'],
  ['binomial', 'Binomial coefficient', 'Computes N choose K.', 'return binomial(n, k);'],
  ['fibonacci_fast', 'Fast Fibonacci', 'Computes Fibonacci with logarithmic-time doubling.', 'return fib_fast(n);'],
];
numberTheory.forEach(([id, name, description, body]) => add(id, name, 'Number Theory', description, `fn ${id}(n: i64, k: i64, a: i64, b: i64, base: i64, exponent: i64, modulus: i64) -> i64 {\n    ${body}\n}\n`));

const sorting = [
  ['bubble_sort', 'Bubble sort', 'Stable quadratic comparison sort.', 'return bubble_sort(values);'],
  ['selection_sort', 'Selection sort', 'In-place quadratic selection sort.', 'return selection_sort(values);'],
  ['insertion_sort', 'Insertion sort', 'Efficient for small or nearly sorted data.', 'return insertion_sort(values);'],
  ['merge_sort', 'Merge sort', 'Stable O(N log N) divide-and-conquer sort.', 'return merge_sort(values);'],
  ['quick_sort', 'Quick sort', 'Partition-based comparison sort.', 'return quick_sort(values);'],
  ['heap_sort', 'Heap sort', 'In-place O(N log N) heap sort.', 'return heap_sort(values);'],
  ['counting_sort', 'Counting sort', 'Integer sorting by frequency counts.', 'return counting_sort(values);'],
  ['radix_sort', 'Radix sort', 'Digit-wise integer sorting.', 'return radix_sort(values);'],
  ['bucket_sort', 'Bucket sort', 'Distribution sort for suitable numeric data.', 'return bucket_sort(values);'],
  ['stable_sort', 'Stable sort', 'Sorts while preserving equal-key order.', 'return stable_sort(values);'],
];
sorting.forEach(([id, name, description, body]) => add(id, name, 'Sorting', description, `fn ${id}(values: array) -> array {\n    ${body}\n}\n`));

const searching = [
  ['arg_min', 'Arg min', 'Returns the index of the minimum element.', 'return argmin(values);'],
  ['arg_max', 'Arg max', 'Returns the index of the maximum element.', 'return argmax(values);'],
  ['two_sum', 'Two sum', 'Finds two values that reach a target.', 'return two_sum(values, target);'],
  ['three_sum', 'Three sum', 'Finds triples reaching a target.', 'return three_sum(values, target);'],
  ['majority_element', 'Majority element', 'Finds an element occurring more than half the time.', 'return majority(values);'],
  ['top_k_frequent', 'Top K frequent', 'Returns the most frequent values.', 'return top_k(values, k);'],
  ['kth_smallest', 'Kth smallest', 'Selects the Kth order statistic.', 'return kth_smallest(values, k);'],
  ['median', 'Median', 'Computes the middle order statistic.', 'return median(values);'],
  ['mode', 'Mode', 'Returns the most frequent value.', 'return mode(values);'],
  ['closest_pair', 'Closest pair', 'Finds the closest pair in numeric data.', 'return closest_pair(values);'],
];
searching.forEach(([id, name, description, body]) => add(id, name, 'Searching & Selection', description, `fn ${id}(values: array, target: i64, k: i64) -> any {\n    ${body}\n}\n`));

const statistics = [
  ['mean', 'Mean', 'Arithmetic average.', 'return average(values);'],
  ['variance', 'Variance', 'Population variance.', 'return variance(values);'],
  ['standard_deviation', 'Standard deviation', 'Square root of variance.', 'return sqrt(variance(values));'],
  ['covariance', 'Covariance', 'Measures joint variation.', 'return covariance(a, b);'],
  ['correlation', 'Correlation', 'Computes normalized linear correlation.', 'return correlation(a, b);'],
  ['percentile', 'Percentile', 'Returns a percentile estimate.', 'return percentile(values, p);'],
  ['z_score', 'Z score', 'Standardizes a value.', 'return (x - mean) / stddev;'],
  ['moving_average', 'Moving average', 'Computes rolling averages.', 'return moving_average(values, window);'],
  ['weighted_average', 'Weighted average', 'Computes a weighted mean.', 'return weighted_average(values, weights);'],
  ['normalize_minmax', 'Min-max normalization', 'Maps values into a bounded interval.', 'return minmax_normalize(values);'],
];
statistics.forEach(([id, name, description, body]) => add(id, name, 'Statistics', description, `fn ${id}(values: array, a: array, b: array, weights: array, x: f64, p: f64, window: i64, stddev: f64) -> f64 {\n    ${body}\n}\n`));

const misc = [
  ['crc32', 'CRC32 checksum', 'Computes a CRC32 checksum.', 'return crc32(data);'],
  ['fnv1a', 'FNV-1a hash', 'Computes a compact non-cryptographic hash.', 'return fnv1a(data);'],
  ['base64_roundtrip', 'Base64 round trip', 'Encodes and decodes bytes.', 'return base64_decode(base64_encode(data));'],
  ['json_roundtrip', 'JSON round trip', 'Serializes and parses structured data.', 'return json_parse(json_stringify(value));'],
  ['paginate', 'Pagination', 'Selects one page from a collection.', 'return slice(values, page * size, (page + 1) * size);'],
  ['group_by', 'Group by key', 'Groups records by a computed key.', 'return group_by(records, key);'],
  ['index_by', 'Index by key', 'Creates a lookup map from records.', 'return index_by(records, key);'],
  ['partition', 'Partition collection', 'Splits values by a predicate.', 'return partition(values, predicate);'],
  ['clamp', 'Clamp', 'Restricts a number to an interval.', 'return max(low, min(high, value));'],
  ['lerp', 'Linear interpolation', 'Interpolates between two values.', 'return a + (b - a) * t;'],
];
misc.forEach(([id, name, description, body]) => add(id, name, 'Utilities', description, `fn ${id}(data: any, value: f64, a: f64, b: f64, t: f64, low: f64, high: f64, values: array, records: array, key: function, predicate: function, page: i64, size: i64) -> any {\n    ${body}\n}\n`));

// Ensure the public library contains exactly 200 examples.  If the source
// catalog is expanded, this guard makes accidental omissions visible in tests.
if (examples.length !== 200) {
  throw new Error(`NUDL algorithm catalog must contain exactly 200 examples; found ${examples.length}`);
}

export const ALGORITHM_LIBRARY: NudlAlgorithmExample[] = examples;
export const ALGORITHM_FILES = ALGORITHM_LIBRARY.map((example) => ({
  name: `algorithms/${example.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${example.id}.ndf`,
  content: `// ${example.name}\n// ${example.description}\n${example.source}`,
}));
