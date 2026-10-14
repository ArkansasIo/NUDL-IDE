import React, { useState } from 'react';
import {
  Play,
  Zap,
  Code2,
  FolderGit2,
  FileCode,
  Sparkles,
  Download,
  RotateCcw,
  BookOpen,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { TargetLanguage } from '../nudl/types';

interface TopbarProps {
  activeFileName: string;
  target: TargetLanguage;
  onTargetChange: (t: TargetLanguage) => void;
  onRun: () => void;
  onCompile: () => void;
  onFormat: () => void;
  onClear: () => void;
  onSave: () => void;
  onDownloadNudl: () => void;
  onExportTarget: () => void;
  onOpenDocs: () => void;
  onNewFile: () => void;
  onResetWorkspace: () => void;
  mode: 'text' | 'blueprint';
  onModeChange: (m: 'text' | 'blueprint') => void;
  onSelectTab: (tab: 'terminal' | 'output' | 'problems' | 'console' | 'target' | 'ast' | 'tokens') => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeFileName,
  target,
  onTargetChange,
  onRun,
  onCompile,
  onFormat,
  onClear,
  onSave,
  onDownloadNudl,
  onExportTarget,
  onOpenDocs,
  onNewFile,
  onResetWorkspace,
  mode,
  onModeChange,
  onSelectTab,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const closeMenu = () => setOpenMenu(null);

  return (
    <header className="h-14 border-b border-[#18283a] bg-[#0b1522] flex items-center px-3 gap-4 text-xs select-none relative z-40">
      {/* Brand */}
      <div className="flex items-center gap-2.5 min-w-[210px]">
        <div className="w-7 h-7 rounded border border-[#3d647a] bg-[#102238] grid place-items-center text-[#6ee7ff] font-bold text-sm shadow-[0_0_12px_rgba(110,231,255,0.2)]">
          N
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-semibold text-white tracking-wide">
            <span>Noodle IDE</span>
            <span className="px-1.5 py-0.2 bg-[#17344d] text-[#6ee7ff] rounded text-[10px] font-mono">0.3</span>
          </div>
          <small className="text-[10px] text-[#71869b] truncate max-w-[150px]">{activeFileName}</small>
        </div>
      </div>

      {/* Menubar */}
      <nav className="flex items-center gap-0.5">
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('file')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'file' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            File ▾
          </button>
          {openMenu === 'file' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onNewFile();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#6ee7ff]" /> New File...
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onSave();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center justify-between"
                >
                  <span>Save</span>
                  <span className="text-[10px] text-[#71869b] font-mono">Ctrl+S</span>
                </button>
                <div className="my-1 border-t border-[#20334a]" />
                <button
                  onClick={() => {
                    closeMenu();
                    onDownloadNudl();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#a9c5dc]" /> Download .nudl
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onExportTarget();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#6ee7ff]" /> Export {target} Source
                </button>
                <div className="my-1 border-t border-[#20334a]" />
                <button
                  onClick={() => {
                    closeMenu();
                    onResetWorkspace();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-red-400 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Workspace
                </button>
              </div>
            </>
          )}
        </div>

        {/* EDIT MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('edit')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'edit' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            Edit ▾
          </button>
          {openMenu === 'edit' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-44 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onFormat();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#6ee7ff]" /> Format Code
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onClear();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-amber-300"
                >
                  Clear Buffer
                </button>
              </div>
            </>
          )}
        </div>

        {/* BUILD MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('build')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'build' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            Build ▾
          </button>
          {openMenu === 'build' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onRun();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#6ee7ff] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 fill-current" /> Run in Interpreter
                  </span>
                  <span className="text-[10px] text-[#71869b] font-mono">Ctrl+Enter</span>
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onCompile();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Compile to {target}
                </button>
                <div className="my-1 border-t border-[#20334a]" />
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('problems');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  Diagnostics & Problems
                </button>
              </div>
            </>
          )}
        </div>

        {/* VIEW MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('view')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'view' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            View ▾
          </button>
          {openMenu === 'view' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onModeChange('text');
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#16334b] flex items-center gap-2 ${
                    mode === 'text' ? 'text-[#6ee7ff] font-semibold' : 'text-[#dce8f5]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> Text Editor
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onModeChange('blueprint');
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#16334b] flex items-center gap-2 ${
                    mode === 'blueprint' ? 'text-[#6ee7ff] font-semibold' : 'text-[#dce8f5]'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" /> Blueprint Graph Editor
                </button>
                <div className="my-1 border-t border-[#20334a]" />
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('terminal');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  Show Terminal
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('target');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  Show Target Output
                </button>
              </div>
            </>
          )}
        </div>

        {/* TOOLS MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('tools')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'tools' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            Tools ▾
          </button>
          {openMenu === 'tools' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-44 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('tokens');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  Token Inspector
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('ast');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  AST Inspector
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    onSelectTab('terminal');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5]"
                >
                  CLI Terminal
                </button>
              </div>
            </>
          )}
        </div>

        {/* HELP MENU */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('help')}
            className={`px-2.5 py-1.5 rounded text-[#d1dce8] hover:bg-[#1a2a3c] transition-colors ${
              openMenu === 'help' ? 'bg-[#1a2a3c] text-white' : ''
            }`}
          >
            Help ▾
          </button>
          {openMenu === 'help' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} />
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#0d1b2a] border border-[#28425d] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    closeMenu();
                    onOpenDocs();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#6ee7ff] flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Specification & Docs
                </button>
                <a
                  href="https://github.com/ArkansasIo/NUDL-0.3"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#16334b] text-[#dce8f5] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 className="w-3.5 h-3.5" /> GitHub Repository
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#71869b]" />
                </a>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mode toggle */}
      <div className="flex items-center border border-[#28425d] rounded bg-[#091624] p-0.5 ml-2">
        <button
          onClick={() => onModeChange('text')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            mode === 'text' ? 'bg-[#134b61] text-[#6ee7ff] font-medium' : 'text-[#89a2ba] hover:text-[#dce8f5]'
          }`}
          title="Switch to Text Source Code Editor"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
        <button
          onClick={() => onModeChange('blueprint')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            mode === 'blueprint' ? 'bg-[#134b61] text-[#6ee7ff] font-medium' : 'text-[#89a2ba] hover:text-[#dce8f5]'
          }`}
          title="Switch to Visual Blueprint Node Editor"
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Blueprint</span>
        </button>
      </div>

      {/* Target Selector & Run/Build Actions */}
      <div className="ml-auto flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-[#091624] px-2 py-1 rounded border border-[#28425d]">
          <span className="text-[11px] text-[#91a4ba]">Target:</span>
          <select
            value={target}
            onChange={(e) => onTargetChange(e.target.value as TargetLanguage)}
            className="bg-[#102238] text-[#dce8f5] text-xs px-2 py-0.5 rounded border border-[#31536c] outline-none focus:border-[#6ee7ff]"
          >
            <option value="Interpreter">Interpreter (Live)</option>
            <option value="C++">C++ (C++23 Ref)</option>
            <option value="C">C (C99)</option>
            <option value="Rust">Rust</option>
            <option value="Python">Python 3</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="C#">C# (.NET)</option>
            <option value="Java">Java</option>
            <option value="Swift">Swift</option>
            <option value="WASM">WebAssembly</option>
          </select>
        </div>

        <button
          onClick={onRun}
          className="flex items-center gap-1.5 bg-[#17624d] hover:bg-[#1e7e63] text-white px-3 py-1.5 rounded font-medium shadow-md transition-colors border border-[#259b79]"
          title="Execute in browser interpreter (Ctrl+Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run</span>
        </button>

        <button
          onClick={onCompile}
          className="flex items-center gap-1.5 bg-[#134b61] hover:bg-[#1a5e78] text-[#6ee7ff] px-3 py-1.5 rounded font-medium shadow-md transition-colors border border-[#4f9bb5]"
          title="Compile to target language"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Build</span>
        </button>
      </div>
    </header>
  );
};
