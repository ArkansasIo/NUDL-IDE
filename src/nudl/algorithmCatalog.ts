export interface NudlAlgorithmExample {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
}

const groups: Array<[string,string[]]> = [
  ['Mathematics',['absolute_value','minimum_two','maximum_two','average_two','triangle_area','rectangle_area','rectangle_perimeter','sum_to_n','sum_squares','degrees_to_radians']],
  ['Bitwise',['bitwise_and','bitwise_or','bitwise_xor','shift_left','shift_right','extract_bit','set_bit','clear_bit','toggle_bit','low_bit_mask']],
  ['Collections',['linear_search','binary_search','reverse_array','unique_values','array_sum','array_min','array_max','array_average','prefix_sum','frequency_map','chunk_array','pairwise','interleave','rotate_array','flatten_array']],
  ['Strings',['reverse_string','palindrome','isogram','pangram','count_substring','kmp_search','levenshtein','normalize_spaces','rot13','ascii_sum']],
  ['Graphs',['bfs','dfs','shortest_path','topological_sort','cycle_detection','connected_components','degree_sequence','reverse_graph','transpose_matrix','dijkstra','bellman_ford','floyd_warshall','prim_mst','kruskal_mst','bipartite_check']],
  ['Dynamic Programming',['fibonacci_dp','knapsack_01','coin_change','lcs','lis','edit_distance','matrix_chain','rod_cutting','partition_number','catalan']],
  ['Number Theory',['gcd','lcm','extended_gcd','is_prime','sieve','modular_power','modular_inverse','factorial','binomial','fibonacci_fast']],
  ['Sorting',['bubble_sort','selection_sort','insertion_sort','merge_sort','quick_sort','heap_sort','counting_sort','radix_sort','bucket_sort','stable_sort']],
  ['Searching & Selection',['arg_min','arg_max','two_sum','three_sum','majority_element','top_k_frequent','kth_smallest','median','mode','closest_pair']],
  ['Statistics',['mean','variance','standard_deviation','covariance','correlation','percentile','z_score','moving_average','weighted_average','normalize_minmax']],
  ['Utilities',['crc32','fnv1a','base64_roundtrip','json_roundtrip','paginate','group_by','index_by','partition','clamp','lerp']],
  ['Geometry',['distance_2d','distance_3d','circle_area','circle_circumference','sphere_volume','sphere_surface','triangle_perimeter','heron_area','dot_product','cross_product']],
  ['Optimization',['gradient_step','golden_section','binary_minimize','hill_climb','simulated_annealing_step','greedy_choice','local_search','beam_select','pareto_filter','dominance_test']],
  ['Cryptography',['xor_cipher','sha256_digest','hmac_digest','random_nonce','hex_encode','hex_decode','constant_time_equal','password_digest','merkle_parent','merkle_root']],
  ['Data Structures',['stack_push','stack_pop','queue_push','queue_pop','deque_push','deque_pop','heap_push','heap_pop','union_find','trie_lookup']],
  ['Scheduling',['interval_overlap','interval_union','earliest_finish','latest_start','round_robin','priority_schedule','deadline_order','weighted_interval','calendar_slot','makespan']],
  ['Machine Learning',['sigmoid','relu','softmax','mean_squared_error','cross_entropy','accuracy','precision','recall','f1_score','confusion_matrix']],
  ['Parsing',['token_count','balanced_delimiters','split_lines','csv_field_count','json_key_count','parse_integer','parse_float','quote_string','escape_string','unescape_string']],
  ['Simulation',['random_walk','monte_carlo_pi','queue_simulation','birth_death_step','cellular_step','boids_step','particle_step','decay_step','compound_growth','logistic_growth']],
  ['Testing',['assert_equal','assert_true','assert_false','benchmark_wrapper','random_test_data','property_sorted','property_unique','property_round_trip','property_idempotent','property_bounds']],
];

export const NUDL_ALGORITHM_CATALOG: NudlAlgorithmExample[] = groups.flatMap(([category, ids]) => ids.map(id => ({
  id,
  name: id.replaceAll('_',' ').replace(/\b\w/g, c => c.toUpperCase()),
  category,
  description: `Reference NUDL algorithm example for ${id.replaceAll('_',' ')}.`,
  source: `// ${id}\nfn ${id}(input: any) -> any {\n    return algorithm.${id}(input);\n}`,
})));

if (NUDL_ALGORITHM_CATALOG.length !== 200) {
  throw new Error(`NUDL algorithm catalog must contain exactly 200 examples; found ${NUDL_ALGORITHM_CATALOG.length}`);
}

export const NUDL_ALGORITHM_FILES = NUDL_ALGORITHM_CATALOG.map(example => ({
  name: `algorithms/${example.category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}/${example.id}.ndf`,
  content: `// ${example.name}\n// ${example.description}\n${example.source}\n`,
}));
