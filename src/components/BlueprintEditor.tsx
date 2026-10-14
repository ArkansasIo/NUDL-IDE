import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  Trash2,
  Zap,
  Info,
} from 'lucide-react';
import {
  BlueprintGraph,
  BlueprintNode,
  BlueprintNodeType,
  BlueprintPin,
  BlueprintConnection,
} from '../nudl/types';
import {
  DEFAULT_BLUEPRINT_EXAMPLES,
  compileBlueprintToNoodle,
} from '../nudl/blueprintEngine';

interface BlueprintEditorProps {
  graph: BlueprintGraph;
  onChange: (updatedGraph: BlueprintGraph) => void;
  onCompileToNoodle: (generatedCode: string) => void;
}

export const BlueprintEditor: React.FC<BlueprintEditorProps> = ({
  graph,
  onChange,
  onCompileToNoodle,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingPin, setConnectingPin] = useState<{
    nodeId: string;
    pinId: string;
    direction: 'in' | 'out';
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate Noodle preview dynamically
  const generatedNoodle = compileBlueprintToNoodle(graph);

  // Handle Dragging
  const handleNodeMouseDown = (e: React.MouseEvent, node: BlueprintNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const currentX = e.clientX - canvasRect.left;
    const currentY = e.clientY - canvasRect.top;
    setMousePos({ x: currentX, y: currentY });

    if (draggingNodeId) {
      const updatedNodes = graph.nodes.map((n) => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            x: Math.max(10, e.clientX - dragOffset.x),
            y: Math.max(10, e.clientY - dragOffset.y),
          };
        }
        return n;
      });
      onChange({ ...graph, nodes: updatedNodes });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Pin connection handling
  const handlePinClick = (e: React.MouseEvent, nodeId: string, pin: BlueprintPin) => {
    e.stopPropagation();

    if (!connectingPin) {
      setConnectingPin({ nodeId, pinId: pin.id, direction: pin.direction });
    } else {
      // Complete connection
      if (connectingPin.nodeId !== nodeId && connectingPin.direction !== pin.direction) {
        const fromNode = connectingPin.direction === 'out' ? connectingPin.nodeId : nodeId;
        const fromPin = connectingPin.direction === 'out' ? connectingPin.pinId : pin.id;
        const toNode = connectingPin.direction === 'out' ? nodeId : connectingPin.nodeId;
        const toPin = connectingPin.direction === 'out' ? pin.id : connectingPin.pinId;

        // Check if connection already exists
        const exists = graph.connections.some(
          (c) => c.fromNodeId === fromNode && c.fromPinId === fromPin && c.toNodeId === toNode && c.toPinId === toPin
        );

        if (!exists) {
          const newConnections: BlueprintConnection[] = [
            ...graph.connections,
            { fromNodeId: fromNode, fromPinId: fromPin, toNodeId: toNode, toPinId: toPin },
          ];
          onChange({ ...graph, connections: newConnections });
        }
      }
      setConnectingPin(null);
    }
  };

  // Add new node from palette
  const addNode = (title: string, type: BlueprintNodeType, inputs: string[], outputs: string[]) => {
    const id = `node-${Date.now()}`;
    const newNode: BlueprintNode = {
      id,
      title,
      type,
      x: 150 + (graph.nodes.length % 5) * 40,
      y: 120 + (graph.nodes.length % 5) * 35,
      inputs: inputs.map((name, i) => ({
        id: `${id}-in-${i}`,
        name,
        type: name === 'exec' ? 'exec' : 'any',
        direction: 'in',
      })),
      outputs: outputs.map((name, i) => ({
        id: `${id}-out-${i}`,
        name,
        type: name === 'exec' ? 'exec' : 'any',
        direction: 'out',
      })),
    };

    onChange({
      ...graph,
      nodes: [...graph.nodes, newNode],
    });
    setSelectedNodeId(id);
  };

  // Delete node
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    const remainingNodes = graph.nodes.filter((n) => n.id !== selectedNodeId);
    const remainingConns = graph.connections.filter(
      (c) => c.fromNodeId !== selectedNodeId && c.toNodeId !== selectedNodeId
    );
    onChange({ nodes: remainingNodes, connections: remainingConns });
    setSelectedNodeId(null);
  };

  // Node header styles based on node type
  const getNodeHeaderClass = (type: BlueprintNodeType) => {
    switch (type) {
      case 'event':
        return 'bg-[#1b4332] border-[#2d6a4f] text-[#b7e4c7]';
      case 'math':
        return 'bg-[#43281c] border-[#7f4f24] text-[#ddb892]';
      case 'variable':
        return 'bg-[#3c096c] border-[#5a189a] text-[#e0aaff]';
      case 'flow':
        return 'bg-[#7c2d12] border-[#9a3412] text-[#fed7aa]';
      case 'logic':
        return 'bg-[#1e3a8a] border-[#2563eb] text-[#bfdbfe]';
      case 'function':
      default:
        return 'bg-[#17344d] border-[#31516d] text-[#6ee7ff]';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07111f] overflow-hidden select-none">
      {/* Blueprint Toolbar */}
      <div className="h-10 border-b border-[#20334a] bg-[#0b1827] flex items-center px-3 gap-2 text-xs">
        <strong className="text-white font-semibold">Visual Blueprint Graph</strong>
        <span className="text-[#465d75]">|</span>

        {/* Example Presets */}
        <span className="text-[11px] text-[#8298ae]">Presets:</span>
        <button
          onClick={() => onChange(DEFAULT_BLUEPRINT_EXAMPLES.begin)}
          className="px-2 py-0.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#dce8f5] border border-[#28425d] text-[11px]"
        >
          Begin Play
        </button>
        <button
          onClick={() => onChange(DEFAULT_BLUEPRINT_EXAMPLES.health)}
          className="px-2 py-0.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#dce8f5] border border-[#28425d] text-[11px]"
        >
          Damage & Health
        </button>
        <button
          onClick={() => onChange(DEFAULT_BLUEPRINT_EXAMPLES.loop)}
          className="px-2 py-0.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#dce8f5] border border-[#28425d] text-[11px]"
        >
          While Loop
        </button>

        <span className="text-[#465d75]">|</span>

        {selectedNodeId && (
          <button
            onClick={deleteSelectedNode}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-[11px]"
          >
            <Trash2 className="w-3 h-3" /> Delete Node
          </button>
        )}

        <div className="flex-1" />

        <span className="text-[11px] text-[#76b7c8]">
          {graph.nodes.length} nodes • {graph.connections.length} wires
        </span>

        <button
          onClick={() => onCompileToNoodle(generatedNoodle)}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#134b61] hover:bg-[#1a5e78] text-[#6ee7ff] font-medium border border-[#4f9bb5] shadow-sm transition-colors"
          title="Lower visual graph into idiomatic Noodle 0.3 code"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Compile to Noodle</span>
        </button>
      </div>

      {/* Blueprint Canvas + Side Palette */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas */}
        <div
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={() => {
            setSelectedNodeId(null);
            setConnectingPin(null);
          }}
          className="flex-1 relative overflow-auto bg-[#07111f] cursor-default"
          style={{
            backgroundImage: 'radial-gradient(#1c2d3e 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="relative w-[2800px] h-[1800px]">
            {/* SVG Connection Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {graph.connections.map((c, i) => {
                const fromNode = graph.nodes.find((n) => n.id === c.fromNodeId);
                const toNode = graph.nodes.find((n) => n.id === c.toNodeId);
                if (!fromNode || !toNode) return null;

                const startX = fromNode.x + 240;
                const startY = fromNode.y + 40;
                const endX = toNode.x;
                const endY = toNode.y + 40;

                const dx = Math.abs(endX - startX) * 0.5;
                const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                return (
                  <g key={i}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#1e3a5f"
                      strokeWidth="5"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#6ee7ff"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  </g>
                );
              })}

              {/* In-progress connecting wire */}
              {connectingPin && (
                (() => {
                  const node = graph.nodes.find((n) => n.id === connectingPin.nodeId);
                  if (!node) return null;
                  const startX = connectingPin.direction === 'out' ? node.x + 240 : node.x;
                  const startY = node.y + 40;
                  const dx = Math.abs(mousePos.x - startX) * 0.5;
                  const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${mousePos.x - dx} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`;
                  return (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffbe0b"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                  );
                })()
              )}
            </svg>

            {/* Nodes */}
            {graph.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  className={`absolute w-60 rounded-lg bg-[#102033] border shadow-2xl overflow-hidden z-20 transition-shadow ${
                    isSelected
                      ? 'border-[#6ee7ff] ring-2 ring-[#6ee7ff]/30 shadow-[0_0_20px_rgba(110,231,255,0.25)]'
                      : 'border-[#28425d] hover:border-[#3d647a]'
                  }`}
                >
                  {/* Node Header */}
                  <div
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                    className={`px-3 py-2 text-xs font-bold cursor-grab active:cursor-grabbing border-b flex items-center justify-between ${getNodeHeaderClass(
                      node.type
                    )}`}
                  >
                    <span>{node.title}</span>
                    <span className="text-[9px] uppercase font-mono opacity-70">{node.type}</span>
                  </div>

                  {/* Node Pins */}
                  <div className="p-2.5 flex justify-between gap-4 font-mono text-[10px]">
                    {/* Inputs */}
                    <div className="flex flex-col gap-1.5">
                      {node.inputs.map((pin) => (
                        <div
                          key={pin.id}
                          onClick={(e) => handlePinClick(e, node.id, pin)}
                          className="flex items-center gap-1.5 text-[#a9c5dc] hover:text-white cursor-pointer group"
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full border border-[#6ee7ff] bg-[#07111f] group-hover:bg-[#6ee7ff] transition-colors ${
                              pin.type === 'exec' ? 'rounded-none rotate-45' : ''
                            }`}
                          />
                          <span>{pin.name}</span>
                          {pin.value !== undefined && (
                            <span className="text-[9px] text-[#71869b] truncate max-w-[60px] font-sans">
                              ({pin.value})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Outputs */}
                    <div className="flex flex-col gap-1.5 items-end">
                      {node.outputs.map((pin) => (
                        <div
                          key={pin.id}
                          onClick={(e) => handlePinClick(e, node.id, pin)}
                          className="flex items-center gap-1.5 text-[#a9c5dc] hover:text-white cursor-pointer group"
                        >
                          <span>{pin.name}</span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full border border-[#6ee7ff] bg-[#07111f] group-hover:bg-[#6ee7ff] transition-colors ${
                              pin.type === 'exec' ? 'rounded-none rotate-45' : ''
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Palette */}
        <aside className="w-64 border-l border-[#20334a] bg-[#091624] p-3 flex flex-col gap-3 overflow-y-auto text-xs">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#7189a2] font-semibold mb-2">
              NODE PALETTE
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => addNode('Begin Play', 'event', [], ['exec'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#b7e4c7] border border-[#2d6a4f]/50 flex items-center justify-between"
              >
                <span>Begin Play</span>
                <span className="text-[9px] text-[#71869b]">Event</span>
              </button>

              <button
                onClick={() => addNode('Print String', 'function', ['exec', 'text'], ['exec'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#6ee7ff] border border-[#31516d]/50 flex items-center justify-between"
              >
                <span>Print String</span>
                <span className="text-[9px] text-[#71869b]">Fn</span>
              </button>

              <button
                onClick={() => addNode('Add (+)', 'math', ['A', 'B'], ['result'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#ddb892] border border-[#7f4f24]/50 flex items-center justify-between"
              >
                <span>Add (+)</span>
                <span className="text-[9px] text-[#71869b]">Math</span>
              </button>

              <button
                onClick={() => addNode('Subtract (-)', 'math', ['A', 'B'], ['result'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#ddb892] border border-[#7f4f24]/50 flex items-center justify-between"
              >
                <span>Subtract (-)</span>
                <span className="text-[9px] text-[#71869b]">Math</span>
              </button>

              <button
                onClick={() => addNode('Branch (If)', 'flow', ['exec', 'condition'], ['then', 'else'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#fed7aa] border border-[#9a3412]/50 flex items-center justify-between"
              >
                <span>Branch (If)</span>
                <span className="text-[9px] text-[#71869b]">Flow</span>
              </button>

              <button
                onClick={() => addNode('Variable (Number)', 'variable', [], ['value'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#e0aaff] border border-[#5a189a]/50 flex items-center justify-between"
              >
                <span>Variable</span>
                <span className="text-[9px] text-[#71869b]">Var</span>
              </button>

              <button
                onClick={() => addNode('Compare (==)', 'logic', ['A', 'B'], ['equal'])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#bfdbfe] border border-[#2563eb]/50 flex items-center justify-between"
              >
                <span>Compare (==)</span>
                <span className="text-[9px] text-[#71869b]">Logic</span>
              </button>

              <button
                onClick={() => addNode('Return', 'flow', ['exec', 'value'], [])}
                className="w-full text-left px-2.5 py-1.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#fed7aa] border border-[#9a3412]/50 flex items-center justify-between"
              >
                <span>Return</span>
                <span className="text-[9px] text-[#71869b]">Flow</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 pt-2 border-t border-[#1b2b3d]">
            <h3 className="text-[10px] uppercase tracking-wider text-[#7189a2] font-semibold mb-1">
              GENERATED NOODLE
            </h3>
            <textarea
              readOnly
              value={generatedNoodle}
              spellCheck={false}
              className="flex-1 w-full bg-[#07111f] p-2 text-[11px] font-mono text-[#a9c5dc] border border-[#20334a] rounded outline-none resize-none leading-relaxed"
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
