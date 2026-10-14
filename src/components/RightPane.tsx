import React, { useState } from 'react';
import { Program, Diagnostic, TargetLanguage } from '../nudl/types';
import { AlertCircle, CheckCircle2, Cpu, FileText, ListTree, Sliders } from 'lucide-react';

interface RightPaneProps {
  fileName: string;
  codeLength: number;
  lineCount: number;
  program: Program;
  diagnostics: Diagnostic[];
  target: TargetLanguage;
  compilerStatus: string;
  onJumpToLine?: (line: number) => void;
}

export const RightPane: React.FC<RightPaneProps> = ({
  fileName,
  codeLength,
  lineCount,
  program,
  diagnostics,
  target,
  compilerStatus,
  onJumpToLine,
}) => {
  const [activeTab, setActiveTab] = useState<'solution' | 'outline' | 'properties'>('solution');

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;

  return (
    <aside className="w-72 flex-shrink-0 border-l border-[#20334a] bg-[#091624] flex flex-col h-full select-none text-xs">
      {/* Dock Tabs */}
      <div className="flex border-b border-[#20334a] bg-[#0b1827]">
        <button
          onClick={() => setActiveTab('solution')}
          className={`flex-1 py-2 px-3 text-center text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'solution'
              ? 'border-[#6ee7ff] text-[#dce8f5] bg-[#0d1b2a]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          Solution
        </button>
        <button
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-2 px-3 text-center text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'outline'
              ? 'border-[#6ee7ff] text-[#dce8f5] bg-[#0d1b2a]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          Outline
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-2 px-3 text-center text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-[#6ee7ff] text-[#dce8f5] bg-[#0d1b2a]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          Properties
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'solution' && (
          <>
            {/* Diagnostics Panel */}
            <div className="p-2.5 rounded bg-[#0d1b2a] border border-[#20334a] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#7189a2]">
                <span>DIAGNOSTICS</span>
                {errorCount > 0 ? (
                  <span className="text-red-400 font-bold">{errorCount} error(s)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ Clean</span>
                )}
              </div>

              {diagnostics.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400/90 py-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No structural diagnostics.</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
                  {diagnostics.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => onJumpToLine?.(d.line)}
                      className={`p-1.5 rounded cursor-pointer transition-colors ${
                        d.severity === 'error'
                          ? 'bg-red-950/40 text-red-300 hover:bg-red-950/70'
                          : 'bg-amber-950/40 text-amber-300 hover:bg-amber-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{d.code}</span>
                        <span className="text-[10px] opacity-75">Ln {d.line}, Col {d.col}</span>
                      </div>
                      <p className="text-[10px] opacity-90 leading-tight mt-0.5">{d.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Compiler Target Status */}
            <div className="p-2.5 rounded bg-[#0d1b2a] border border-[#20334a] space-y-2">
              <div className="text-[10px] font-semibold tracking-wider text-[#7189a2]">
                COMPILER PIPELINE
              </div>
              <div className="font-mono text-[11px] text-[#b9cde0] space-y-1 bg-[#07111f] p-2 rounded border border-[#1b2b3d]">
                <div>Target: <strong className="text-[#6ee7ff]">{target}</strong></div>
                <div>Backend: <span className="text-emerald-300">Browser Analyzer / Codegen</span></div>
                <div>Status: <span className="text-white">{compilerStatus}</span></div>
                <div>Grammar: <span className="text-[#a9c5dc]">NUDL-0.3 EBNF</span></div>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="p-2.5 rounded bg-[#0d1b2a] border border-[#20334a] space-y-2 text-[11px]">
              <div className="text-[10px] font-semibold tracking-wider text-[#7189a2]">
                KEYBOARD SHORTCUTS
              </div>
              <div className="space-y-1.5 text-[#a9c5dc]">
                <div className="flex justify-between items-center">
                  <span>Run Program</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#102238] border border-[#28425d] text-[10px] font-mono text-white">Ctrl+Enter</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Save File</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#102238] border border-[#28425d] text-[10px] font-mono text-white">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Indent Tab</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#102238] border border-[#28425d] text-[10px] font-mono text-white">Tab (4 sp)</kbd>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'outline' && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-wider text-[#7189a2]">
              AST OUTLINE
            </div>

            {/* Functions */}
            <div>
              <div className="text-[10px] uppercase text-[#60778e] font-bold mb-1">Functions ({program.functions.length})</div>
              {program.functions.length === 0 ? (
                <div className="text-[#71869b] text-[11px] italic">No functions defined</div>
              ) : (
                <div className="space-y-1">
                  {program.functions.map((fn, i) => (
                    <div
                      key={i}
                      onClick={() => fn.line && onJumpToLine?.(fn.line)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d1b2a] text-[#6ee7ff] hover:bg-[#16334b] cursor-pointer font-mono text-[11px]"
                    >
                      <span className="font-serif">ƒ</span>
                      <span className="truncate">{fn.name}({fn.params.map((p) => p.name).join(', ')}) : {fn.returnType}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Structs */}
            <div>
              <div className="text-[10px] uppercase text-[#60778e] font-bold mb-1">Structs ({program.structs.length})</div>
              {program.structs.length === 0 ? (
                <div className="text-[#71869b] text-[11px] italic">No structs defined</div>
              ) : (
                <div className="space-y-1">
                  {program.structs.map((st, i) => (
                    <div
                      key={i}
                      onClick={() => st.line && onJumpToLine?.(st.line)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d1b2a] text-purple-300 hover:bg-[#16334b] cursor-pointer font-mono text-[11px]"
                    >
                      <span className="font-bold">struct</span>
                      <span className="truncate">{st.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schemas */}
            <div>
              <div className="text-[10px] uppercase text-[#60778e] font-bold mb-1">Schemas ({program.schemas.length})</div>
              {program.schemas.length === 0 ? (
                <div className="text-[#71869b] text-[11px] italic">No schemas defined</div>
              ) : (
                <div className="space-y-1">
                  {program.schemas.map((sc, i) => (
                    <div
                      key={i}
                      onClick={() => sc.line && onJumpToLine?.(sc.line)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d1b2a] text-emerald-300 hover:bg-[#16334b] cursor-pointer font-mono text-[11px]"
                    >
                      <span className="font-bold">schema</span>
                      <span className="truncate">{sc.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-3 font-mono text-[11px]">
            <div className="text-[10px] font-semibold tracking-wider text-[#7189a2] font-sans">
              FILE PROPERTIES
            </div>
            <div className="bg-[#0d1b2a] p-3 rounded border border-[#20334a] space-y-2 text-[#a9c5dc]">
              <div className="flex justify-between">
                <span>File Name:</span>
                <span className="text-white">{fileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Lines:</span>
                <span className="text-white">{lineCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="text-white">{codeLength}</span>
              </div>
              <div className="flex justify-between">
                <span>Functions:</span>
                <span className="text-white">{program.functions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Statements:</span>
                <span className="text-white">{program.statements.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
