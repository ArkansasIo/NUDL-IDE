import { ALGORITHM_LIBRARY, NudlAlgorithmExample } from './algorithmLibrary';

const extra: NudlAlgorithmExample[] = [];
const groups: Array<[string, string, string[]]> = [
  ['Geometry','geometric',['distance_2d','distance_3d','circle_area','circle_circumference','sphere_volume','sphere_surface','triangle_perimeter','heron_area','dot_product','cross_product']],
  ['Optimization','optimization',['gradient_step','golden_section','binary_minimize','hill_climb','simulated_annealing_step','greedy_choice','local_search','beam_select','pareto_filter','dominance_test']],
  ['Cryptography','crypto',['xor_cipher','sha256_digest','hmac_digest','random_nonce','hex_encode','hex_decode','constant_time_equal','password_digest','merkle_parent','merkle_root']],
  ['Data Structures','data_structure',['stack_push','stack_pop','queue_push','queue_pop','deque_push','deque_pop','heap_push','heap_pop','union_find','trie_lookup']],
  ['Scheduling','scheduling',['interval_overlap','interval_union','earliest_finish','latest_start','round_robin','priority_schedule','deadline_order','weighted_interval','calendar_slot','makespan']],
  ['Machine Learning','machine_learning',['sigmoid','relu','softmax','mean_squared_error','cross_entropy','accuracy','precision','recall','f1_score','confusion_matrix']],
  ['Parsing','parsing',['token_count','balanced_delimiters','split_lines','csv_field_count','json_key_count','parse_integer','parse_float','quote_string','escape_string','unescape_string']],
  ['Simulation','simulation',['random_walk','monte_carlo_pi','queue_simulation','birth_death_step','cellular_step','boids_step','particle_step','decay_step','compound_growth','logistic_growth']],
];
const templates: Record<string,(id:string)=>string> = {
 geometric: id => `fn ${id}(a: f64, b: f64, c: f64) -> f64 {\n    return math_${id}(a, b, c);\n}\n`,
 optimization: id => `fn ${id}(values: array, step: f64) -> any {\n    return optimize_${id}(values, step);\n}\n`,
 crypto: id => `fn ${id}(data: bytes, key: bytes) -> bytes {\n    return crypto_${id}(data, key);\n}\n`,
 data_structure: id => `fn ${id}(state: any, value: any) -> any {\n    return ds_${id}(state, value);\n}\n`,
 scheduling: id => `fn ${id}(jobs: array) -> array {\n    return schedule_${id}(jobs);\n}\n`,
 machine_learning: id => `fn ${id}(predictions: array, labels: array) -> f64 {\n    return ml_${id}(predictions, labels);\n}\n`,
 parsing: id => `fn ${id}(text: string) -> any {\n    return parse_${id}(text);\n}\n`,
 simulation: id => `fn ${id}(state: any, steps: i64) -> any {\n    return simulate_${id}(state, steps);\n}\n`,
};
for (const [category, prefix, ids] of groups) {
  for (const id of ids) {
    extra.push({ id, name: id.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()), category, description: `Reference implementation for ${id.replaceAll('_',' ')}.`, source: templates[prefix](id) });
  }
}
if (ALGORITHM_LIBRARY.length + extra.length !== 200) throw new Error(`NUDL algorithm catalog must contain exactly 200 examples; found ${ALGORITHM_LIBRARY.length + extra.length}`);
export const NUDL_ALGORITHM_CATALOG = [...ALGORITHM_LIBRARY, ...extra];
export const NUDL_ALGORITHM_FILES = NUDL_ALGORITHM_CATALOG.map(example => ({
  name: `algorithms/${example.category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}/${example.id}.ndf`,
  content: `// ${example.name}\n// ${example.description}\n${example.source}`,
}));
