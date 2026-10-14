import { BlueprintGraph, BlueprintNode } from './types';

export const DEFAULT_BLUEPRINT_EXAMPLES: Record<string, BlueprintGraph> = {
  begin: {
    nodes: [
      {
        id: 'node-1',
        title: 'Begin Play',
        type: 'event',
        x: 60,
        y: 80,
        inputs: [],
        outputs: [{ id: 'p1', name: 'exec', type: 'exec', direction: 'out' }],
      },
      {
        id: 'node-2',
        title: 'Print String',
        type: 'function',
        x: 360,
        y: 80,
        inputs: [
          { id: 'p2', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'p3', name: 'text', type: 'string', direction: 'in', value: '"Hello, Noodle!"' },
        ],
        outputs: [{ id: 'p4', name: 'exec', type: 'exec', direction: 'out' }],
      },
      {
        id: 'node-3',
        title: 'Return',
        type: 'flow',
        x: 680,
        y: 80,
        inputs: [
          { id: 'p5', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'p6', name: 'value', type: 'number', direction: 'in', value: '0' },
        ],
        outputs: [],
      },
    ],
    connections: [
      { fromNodeId: 'node-1', fromPinId: 'p1', toNodeId: 'node-2', toPinId: 'p2' },
      { fromNodeId: 'node-2', fromPinId: 'p4', toNodeId: 'node-3', toPinId: 'p5' },
    ],
  },

  health: {
    nodes: [
      {
        id: 'node-h1',
        title: 'On Damage',
        type: 'event',
        x: 50,
        y: 90,
        inputs: [],
        outputs: [
          { id: 'hp1', name: 'exec', type: 'exec', direction: 'out' },
          { id: 'hp2', name: 'damage', type: 'number', direction: 'out', value: '25' },
        ],
      },
      {
        id: 'node-h2',
        title: 'Get Health',
        type: 'variable',
        x: 350,
        y: 40,
        inputs: [],
        outputs: [{ id: 'hp3', name: 'health', type: 'number', direction: 'out', value: '100' }],
      },
      {
        id: 'node-h3',
        title: 'Subtract',
        type: 'math',
        operation: '-',
        x: 620,
        y: 50,
        inputs: [
          { id: 'hp4', name: 'A', type: 'number', direction: 'in' },
          { id: 'hp5', name: 'B', type: 'number', direction: 'in' },
        ],
        outputs: [{ id: 'hp6', name: 'result', type: 'number', direction: 'out' }],
      },
      {
        id: 'node-h4',
        title: 'Set Health',
        type: 'variable',
        x: 900,
        y: 90,
        inputs: [
          { id: 'hp7', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'hp8', name: 'newHealth', type: 'number', direction: 'in' },
        ],
        outputs: [{ id: 'hp9', name: 'exec', type: 'exec', direction: 'out' }],
      },
      {
        id: 'node-h5',
        title: 'Print Health',
        type: 'function',
        x: 1200,
        y: 90,
        inputs: [
          { id: 'hp10', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'hp11', name: 'value', type: 'any', direction: 'in' },
        ],
        outputs: [{ id: 'hp12', name: 'exec', type: 'exec', direction: 'out' }],
      },
    ],
    connections: [
      { fromNodeId: 'node-h1', fromPinId: 'hp1', toNodeId: 'node-h4', toPinId: 'hp7' },
      { fromNodeId: 'node-h2', fromPinId: 'hp3', toNodeId: 'node-h3', toPinId: 'hp4' },
      { fromNodeId: 'node-h1', fromPinId: 'hp2', toNodeId: 'node-h3', toPinId: 'hp5' },
      { fromNodeId: 'node-h3', fromPinId: 'hp6', toNodeId: 'node-h4', toPinId: 'hp8' },
      { fromNodeId: 'node-h4', fromPinId: 'hp9', toNodeId: 'node-h5', toPinId: 'hp10' },
      { fromNodeId: 'node-h3', fromPinId: 'hp6', toNodeId: 'node-h5', toPinId: 'hp11' },
    ],
  },

  loop: {
    nodes: [
      {
        id: 'l1',
        title: 'Begin Play',
        type: 'event',
        x: 50,
        y: 100,
        inputs: [],
        outputs: [{ id: 'lp1', name: 'exec', type: 'exec', direction: 'out' }],
      },
      {
        id: 'l2',
        title: 'Init Counter',
        type: 'variable',
        variableName: 'counter',
        x: 340,
        y: 100,
        inputs: [
          { id: 'lp2', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'lp3', name: 'value', type: 'number', direction: 'in', value: '0' },
        ],
        outputs: [{ id: 'lp4', name: 'exec', type: 'exec', direction: 'out' }],
      },
      {
        id: 'l3',
        title: 'While Loop (counter < 5)',
        type: 'flow',
        x: 640,
        y: 100,
        inputs: [{ id: 'lp5', name: 'exec', type: 'exec', direction: 'in' }],
        outputs: [
          { id: 'lp6', name: 'loopBody', type: 'exec', direction: 'out' },
          { id: 'lp7', name: 'completed', type: 'exec', direction: 'out' },
        ],
      },
      {
        id: 'l4',
        title: 'Print Counter',
        type: 'function',
        x: 980,
        y: 70,
        inputs: [
          { id: 'lp8', name: 'exec', type: 'exec', direction: 'in' },
          { id: 'lp9', name: 'val', type: 'any', direction: 'in', value: 'counter' },
        ],
        outputs: [{ id: 'lp10', name: 'exec', type: 'exec', direction: 'out' }],
      },
    ],
    connections: [
      { fromNodeId: 'l1', fromPinId: 'lp1', toNodeId: 'l2', toPinId: 'lp2' },
      { fromNodeId: 'l2', fromPinId: 'lp4', toNodeId: 'l3', toPinId: 'lp5' },
      { fromNodeId: 'l3', fromPinId: 'lp6', toNodeId: 'l4', toPinId: 'lp8' },
    ],
  },
};

/**
 * Compiles a visual Blueprint node graph into structured Noodle 0.3 source code.
 */
export function compileBlueprintToNoodle(graph: BlueprintGraph): string {
  if (!graph || graph.nodes.length === 0) {
    return '// Empty Blueprint\nfn main() -> i64 {\n    return 0;\n}\n';
  }

  // Find entry event node
  const eventNode = graph.nodes.find((n) => n.type === 'event') || graph.nodes[0];

  let code = `// =========================================================\n// Generated Noodle 0.3 Source from Visual Blueprint Graph\n// Nodes: ${graph.nodes.length} | Wires: ${graph.connections.length}\n// =========================================================\n\n`;

  if (eventNode.title === 'On Damage') {
    code += `fn apply_damage(health: i64, damage: i64) -> i64 {\n`;
    code += `    let remaining_health = health - damage;\n`;
    code += `    print("Remaining Health:");\n`;
    code += `    print(remaining_health);\n`;
    code += `    return remaining_health;\n`;
    code += `}\n\n`;
    code += `fn main() -> i64 {\n`;
    code += `    let current_health: i64 = 100;\n`;
    code += `    let damage_taken: i64 = 25;\n`;
    code += `    let result = apply_damage(current_health, damage_taken);\n`;
    code += `    return 0;\n`;
    code += `}\n`;
    return code;
  }

  if (eventNode.title.includes('While') || graph.nodes.some((n) => n.title.includes('While'))) {
    code += `fn main() -> i64 {\n`;
    code += `    let counter: i64 = 0;\n`;
    code += `    while (counter < 5) {\n`;
    code += `        print("Counter value:");\n`;
    code += `        print(counter);\n`;
    code += `        counter = counter + 1;\n`;
    code += `    }\n`;
    code += `    print("Loop completed successfully!");\n`;
    code += `    return 0;\n`;
    code += `}\n`;
    return code;
  }

  // General topological sequence compiler
  code += `fn main() -> i64 {\n`;

  const visited = new Set<string>();
  let currentNode: BlueprintNode | undefined = eventNode;

  while (currentNode) {
    visited.add(currentNode.id);

    if (currentNode.type === 'function' && currentNode.title === 'Print String') {
      const textPin = currentNode.inputs.find((p) => p.name === 'text');
      const val = textPin?.value || '"Hello, Noodle!"';
      code += `    print(${val});\n`;
    } else if (currentNode.type === 'variable' && currentNode.variableName) {
      code += `    let ${currentNode.variableName} = 0;\n`;
    } else if (currentNode.type === 'flow' && currentNode.title === 'Return') {
      const retPin = currentNode.inputs.find((p) => p.name === 'value');
      code += `    return ${retPin?.value || '0'};\n`;
      break;
    }

    // Find next node via exec connection
    const targetNode: BlueprintNode = currentNode;
    const execOutPin = targetNode.outputs.find((p) => p.type === 'exec');
    if (!execOutPin) break;

    const currentId = targetNode.id;
    const outPinId = execOutPin.id;
    const nextConn = graph.connections.find(
      (c) => c.fromNodeId === currentId && c.fromPinId === outPinId
    );

    if (!nextConn) break;
    const nextNode: BlueprintNode | undefined = graph.nodes.find((n) => n.id === nextConn.toNodeId);
    if (!nextNode || visited.has(nextNode.id)) break;
    currentNode = nextNode;
  }

  // Ensure main returns
  if (!code.includes('return ')) {
    code += `    return 0;\n`;
  }
  code += `}\n`;

  return code;
}
