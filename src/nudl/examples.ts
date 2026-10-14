import { VirtualFile } from './types';
import { DEFAULT_BLUEPRINT_EXAMPLES } from './blueprintEngine';

export const INITIAL_FILES: VirtualFile[] = [
  {
    name: 'main.nudl',
    content: `// NUDL 0.3 - Welcome to Noodle Language
fn main() -> i64 {
    print("Hello, Noodle 0.3!");
    print("Deterministic data & program logic in one coherent language.");
    return 0;
}`,
  },
  {
    name: 'math.nudl',
    content: `// Functions, Types, and Arithmetic Operations
fn add(a: i64, b: i64) -> i64 {
    return a + b;
}

fn multiply(a: i64, b: i64) -> i64 {
    return a * b;
}

fn calculate_hypotenuse_squared(a: i64, b: i64) -> i64 {
    let a_squared = multiply(a, a);
    let b_squared = multiply(b, b);
    return add(a_squared, b_squared);
}

fn main() -> i64 {
    let result = calculate_hypotenuse_squared(3, 4);
    print("Hypotenuse squared (3^2 + 4^2):");
    print(result);
    return 0;
}`,
  },
  {
    name: 'conditionals.nudl',
    content: `// Conditional Branching in Noodle
fn classify_number(val: i64) -> string {
    if (val > 0) {
        return "Positive";
    } else if (val < 0) {
        return "Negative";
    } else {
        return "Zero";
    }
}

fn main() -> i64 {
    let test_val: i64 = 42;
    let label = classify_number(test_val);
    print("Classification of test value:");
    print(label);

    let zero_label = classify_number(0);
    print("Classification of zero:");
    print(zero_label);
    return 0;
}`,
  },
  {
    name: 'loops.nudl',
    content: `// While Loops and Iterations in Noodle
fn sum_first_n(n: i64) -> i64 {
    let sum: i64 = 0;
    let i: i64 = 1;
    while (i <= n) {
        sum = sum + i;
        i = i + 1;
    }
    return sum;
}

fn main() -> i64 {
    let total = sum_first_n(10);
    print("Sum of numbers from 1 to 10:");
    print(total);
    return 0;
}`,
  },
  {
    name: 'arrays.nudl',
    content: `// Arrays and Indexing in Noodle
fn main() -> i64 {
    let numbers = [10, 20, 30, 40, 50];
    print("Array elements:");
    print(numbers);

    let first = numbers[0];
    let third = numbers[2];
    print("First item:");
    print(first);
    print("Third item:");
    print(third);

    let sum = first + third;
    print("Sum of first and third:");
    print(sum);
    return 0;
}`,
  },
  {
    name: 'structures.nudl',
    content: `// Struct Declarations & Instantiation
struct Point {
    x: f64;
    y: f64;
}

struct Rectangle {
    origin: Point;
    width: f64;
    height: f64;
}

fn main() -> i64 {
    let p = Point { x: 12.5, y: 24.0 };
    print("Point struct:");
    print(p);

    let r = Rectangle { origin: p, width: 100.0, height: 50.0 };
    print("Rectangle struct:");
    print(r);
    return 0;
}`,
  },
  {
    name: 'pipeline.nudl',
    content: `// Omni-inspired NUDL 0.3 Data Pipeline
schema SensorReading {
    id: u64 required;
    sensor: text required;
    value: f64 required;
    unit: text required;
    valid: bool = true;
}

data input_readings: SensorReading {
    { id: 1, sensor: "TEMP-A", value: 21.5, unit: "C", valid: true }
    { id: 2, sensor: "TEMP-A", value: 22.0, unit: "C", valid: true }
    { id: 3, sensor: "TEMP-B", value: -999.0, unit: "C", valid: false }
    { id: 4, sensor: "TEMP-B", value: 20.5, unit: "C", valid: true }
}

fn main() -> i64 {
    print("Loaded data records for SensorReading:");
    print(input_readings);
    print("Processing sensor pipeline complete.");
    return 0;
}`,
  },
  {
    name: 'regex.nudl',
    content: `// Noodle Regex Extension
fn main() -> i64 {
    let email_pattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$";
    let test_email = "research@example.org";
    let is_valid = regex.is_match(email_pattern, test_email);
    print("Is valid email address?");
    print(is_valid);

    let raw_text = "Noodle    Unified    Data    Language";
    let cleaned = regex.replace("[[:space:]]+", raw_text, " ");
    print("Cleaned text:");
    print(cleaned);
    return 0;
}`,
  },
  {
    name: 'logic_solver.nudl',
    content: `// Noodle Logic & Truth Evaluation
fn evaluate_implication(p: bool, q: bool) -> bool {
    // p -> q is equivalent to (!p || q)
    return !p || q;
}

fn main() -> i64 {
    let t = true;
    let f = false;

    print("True implies False (should be false):");
    print(evaluate_implication(t, f));

    print("False implies True (should be true):");
    print(evaluate_implication(f, t));

    print("True implies True (should be true):");
    print(evaluate_implication(t, t));
    return 0;
}`,
  },
  {
    name: 'Player.nblueprint',
    content: `// Visual Blueprint Graph: Player.nblueprint`,
    isBlueprint: true,
    blueprintData: DEFAULT_BLUEPRINT_EXAMPLES.begin,
  },
  {
    name: 'Combat.nblueprint',
    content: `// Visual Blueprint Graph: Combat.nblueprint`,
    isBlueprint: true,
    blueprintData: DEFAULT_BLUEPRINT_EXAMPLES.health,
  },
];
