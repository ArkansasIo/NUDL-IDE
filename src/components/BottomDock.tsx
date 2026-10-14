import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Cpu,
  AlertTriangle,
  PlayCircle,
  Copy,
  Check,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Code2,
  Binary,
  Boxes,
} from 'lucide-react';
import { Diagnostic, Program, TargetLanguage, Token } from '../nudl/types';
import { ExecutionResult } from '../nudl/interpreter';
import { CodegenResult } from '../nudl/codegen';

export type BottomTabType =
  | 'terminal'
  | 'output'
  | 'problems'
  | 'console'
  | 'target'
  | 'ast'
  | 'tokens';

interface BottomDockProps {
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
  outputLog: string;
  diagnostics: Diagnostic[];
  executionResult: ExecutionResult | null;
  codegenResult: CodegenResult | null;
  program: Program;
  tokens: Token[];
  onExecuteCommand: (cmd: string) => string;
  onClearTerminal: () => void;
  onJumpToLine?: (line: number) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTab,
  onTabChange,
  outputLog,
  diagnostics,
  executionResult,
  codegenResult,
  program,
  tokens,
  onExecuteCommand,
  onClearTerminal,
  onJumpToLine,
}) => {
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Noodle IDE 0.3 CLI Terminal',
    "Type 'help' for available commands or 'run' to execute main.nudl.",
    '$ _',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === 'clear') {
      setTerminalHistory(['Noodle terminal cleared.', '$ _']);
      setCommandInput('');
      return;
    }

    const response = onExecuteCommand(cmd);
    setTerminalHistory((prev) => [
      ...prev.slice(0, -1),
      `$ ${cmd}`,
      response,
      '$ _',
    ]);
    setCommandInput('');
  };

  const handleCopyCode = () => {
    if (codegenResult?.code) {
      navigator.clipboard.writeText(codegenResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTarget = () => {
    if (!codegenResult) return;
    const blob = new Blob([codegenResult.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = codegenResult.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;

  return (
    <section
      className={`border-t border-[#20334a] bg-[#07111f] flex flex-col transition-all duration-200 select-text ${
        isExpanded ? 'h-96' : 'h-52'
      }`}
    >
      {/* Tab Navigation */}
      <div className="h-8 border-b border-[#20334a] bg-[#0b1827] flex items-center px-2 gap-1 text-xs select-none">
        <button
          onClick={() => onTabChange('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'terminal'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>TERMINAL</span>
        </button>

        <button
          onClick={() => onTabChange('output')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'output'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>BUILD OUTPUT</span>
        </button>

        <button
          onClick={() => onTabChange('problems')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'problems'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>PROBLEMS</span>
          {errorCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-red-900 text-red-200 text-[10px] font-mono">
              {errorCount}
            </span>
          ) : warningCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-900 text-amber-200 text-[10px] font-mono">
              {warningCount}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => onTabChange('console')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'console'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>DEBUG CONSOLE</span>
        </button>

        <button
          onClick={() => onTabChange('target')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'target'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#6ee7ff]" />
          <span>TARGET CODE</span>
        </button>

        <button
          onClick={() => onTabChange('ast')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'ast'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-cyan-400" />
          <span>AST</span>
        </button>

        <button
          onClick={() => onTabChange('tokens')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs transition-colors ${
            activeTab === 'tokens'
              ? 'border-[#6ee7ff] text-white font-medium bg-[#07111f]'
              : 'border-transparent text-[#8298ae] hover:text-[#dce8f5]'
          }`}
        >
          <Binary className="w-3.5 h-3.5 text-amber-400" />
          <span>TOKENS</span>
        </button>

        <div className="flex-1" />

        {/* Tab-specific actions */}
        {activeTab === 'target' && codegenResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#dce8f5] border border-[#28425d] text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadTarget}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#102238] hover:bg-[#16334b] text-[#6ee7ff] border border-[#28425d] text-[11px]"
            >
              <Download className="w-3 h-3" />
              <span>{codegenResult.filename}</span>
            </button>
          </div>
        )}

        <button
          onClick={onClearTerminal}
          className="p-1 rounded text-[#8298ae] hover:text-white hover:bg-[#16334b]"
          title="Clear Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded text-[#8298ae] hover:text-white hover:bg-[#16334b]"
          title={isExpanded ? 'Collapse Dock' : 'Expand Dock'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
        {/* CLI TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-1 text-[#b9cde0]">
              {terminalHistory.map((line, idx) => (
                <div
                  key={idx}
                  className={line.startsWith('$') ? 'text-[#6ee7ff] font-bold' : ''}
                >
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-[#1b2b3d]">
              <span className="text-[#6ee7ff] font-bold">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="run | compile [target] | check | ast | tokens | clear | help"
                className="flex-1 bg-transparent text-white font-mono text-xs outline-none border-0"
              />
            </form>
          </div>
        )}

        {/* BUILD OUTPUT */}
        {activeTab === 'output' && (
          <pre className="text-[#a9c5dc] whitespace-pre-wrap">{outputLog || 'No build logs generated yet. Click "Build" or run "compile" to trigger a compilation.'}</pre>
        )}

        {/* PROBLEMS / DIAGNOSTICS */}
        {activeTab === 'problems' && (
          <div>
            {diagnostics.length === 0 ? (
              <div className="text-emerald-400 flex items-center gap-2">
                <span>✓</span> No syntax or semantic problems detected.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#20334a] text-[#7189a2] text-[11px]">
                    <th className="py-1 px-2">SEVERITY</th>
                    <th className="py-1 px-2">CODE</th>
                    <th className="py-1 px-2">MESSAGE</th>
                    <th className="py-1 px-2">LOCATION</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map((d, i) => (
                    <tr
                      key={i}
                      onClick={() => onJumpToLine?.(d.line)}
                      className="border-b border-[#1b2b3d] hover:bg-[#102238] cursor-pointer"
                    >
                      <td className="py-1 px-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            d.severity === 'error'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {d.severity}
                        </span>
                      </td>
                      <td className="py-1 px-2 text-[#6ee7ff] font-bold">{d.code}</td>
                      <td className="py-1 px-2 text-[#dce8f5]">{d.message}</td>
                      <td className="py-1 px-2 text-[#8298ae]">
                        Ln {d.line}, Col {d.col}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* DEBUG CONSOLE */}
        {activeTab === 'console' && (
          <div className="space-y-2">
            {executionResult ? (
              <>
                <div className="flex items-center gap-4 text-[11px] text-[#71869b] pb-2 border-b border-[#20334a]">
                  <span>Execution Time: <strong className="text-white">{executionResult.executionTimeMs} ms</strong></span>
                  <span>Steps Evaluated: <strong className="text-white">{executionResult.stepCount}</strong></span>
                  <span>Return Value: <strong className="text-[#6ee7ff]">{String(executionResult.returnValue ?? 'void')}</strong></span>
                  {executionResult.error && (
                    <span className="text-red-400 font-bold">Execution Terminated with Error</span>
                  )}
                </div>

                {executionResult.error && (
                  <div className="p-2.5 rounded bg-red-950/50 border border-red-800 text-red-300">
                    <strong>Runtime Error:</strong> {executionResult.error}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#7189a2] font-semibold">
                    STANDARD OUTPUT (stdout):
                  </div>
                  {executionResult.output.length === 0 ? (
                    <div className="text-[#71869b] italic">No output produced by print()</div>
                  ) : (
                    executionResult.output.map((line, idx) => (
                      <div key={idx} className="text-[#dce8f5] font-mono">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-[#71869b]">Debug console ready. Click "▶ Run" to execute main.nudl.</div>
            )}
          </div>
        )}

        {/* TARGET CODE */}
        {activeTab === 'target' && (
          <div>
            {codegenResult ? (
              <pre className="text-[#dce8f5] leading-relaxed whitespace-pre-wrap">
                {codegenResult.code}
              </pre>
            ) : (
              <div className="text-[#71869b]">Select a target and click "Build" to view lowered source code.</div>
            )}
          </div>
        )}

        {/* AST INSPECTOR */}
        {activeTab === 'ast' && (
          <div className="space-y-3">
            <div className="text-[10px] uppercase text-[#7189a2] font-semibold">
              ABSTRACT SYNTAX TREE (AST) HIERARCHY
            </div>
            <pre className="text-xs text-[#6ee7ff] bg-[#091624] p-3 rounded border border-[#20334a] max-h-72 overflow-auto">
              {JSON.stringify(program, null, 2)}
            </pre>
          </div>
        )}

        {/* TOKEN INSPECTOR */}
        {activeTab === 'tokens' && (
          <div>
            <div className="text-[10px] uppercase text-[#7189a2] font-semibold mb-2">
              LEXICAL TOKEN STREAM ({tokens.length} tokens)
            </div>
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-[#20334a] text-[#7189a2]">
                    <th className="py-1 px-2">#</th>
                    <th className="py-1 px-2">KIND</th>
                    <th className="py-1 px-2">TEXT</th>
                    <th className="py-1 px-2">LINE</th>
                    <th className="py-1 px-2">COL</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, i) => (
                    <tr key={i} className="border-b border-[#1b2b3d] hover:bg-[#102238]">
                      <td className="py-0.5 px-2 text-[#71869b]">{i + 1}</td>
                      <td className="py-0.5 px-2">
                        <span className="px-1.5 py-0.2 rounded bg-[#102238] text-[#6ee7ff] border border-[#28425d] text-[10px]">
                          {t.kind}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-white font-mono">
                        {t.text ? JSON.stringify(t.text) : '<EOF>'}
                      </td>
                      <td className="py-0.5 px-2 text-[#8298ae]">{t.line}</td>
                      <td className="py-0.5 px-2 text-[#8298ae]">{t.col}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
