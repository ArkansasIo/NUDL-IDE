import React from 'react';
import {
  Menu,
  Plus,
  Save,
  Play,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { TargetLanguage } from '../nudl/types';

interface ToolstripProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeFileName: string;
  mode: 'text' | 'blueprint';
  onModeChange: (m: 'text' | 'blueprint') => void;
  target: TargetLanguage;
  status: 'Ready' | 'Running' | 'Success' | 'Error';
  diagnosticCount: { errors: number; warnings: number };
  onNewFile: () => void;
  onSave: () => void;
  onRun: () => void;
  onCompile: () => void;
  onFormat: () => void;
  onOpenDocs: () => void;
}

export const Toolstrip: React.FC<ToolstripProps> = ({
  sidebarOpen,
  onToggleSidebar,
  activeFileName,
  mode,
  onModeChange,
  target,
  status,
  diagnosticCount,
  onNewFile,
  onSave,
  onRun,
  onCompile,
  onFormat,
  onOpenDocs,
}) => {
  return (
    <div className="h-9 border-b border-[#20334a] bg-[#0b1827] flex items-center px-2 gap-1.5 text-xs select-none">
      <button
        onClick={onToggleSidebar}
        className={`p-1.5 rounded hover:bg-[#16334b] transition-colors ${
          sidebarOpen ? 'text-[#6ee7ff]' : 'text-[#8298ae]'
        }`}
        title="Toggle Solution Explorer Sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      <button
        onClick={onNewFile}
        className="p-1.5 rounded text-[#8298ae] hover:text-white hover:bg-[#16334b] transition-colors"
        title="New File"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={onSave}
        className="p-1.5 rounded text-[#8298ae] hover:text-white hover:bg-[#16334b] transition-colors"
        title="Save File (Ctrl+S)"
      >
        <Save className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-[#20334a] mx-1" />

      <button
        onClick={onRun}
        className="p-1.5 rounded text-[#259b79] hover:text-[#38e4b3] hover:bg-[#16334b] transition-colors"
        title="Run in Live Interpreter"
      >
        <Play className="w-4 h-4 fill-current" />
      </button>

      <button
        onClick={onCompile}
        className="p-1.5 rounded text-[#6ee7ff] hover:text-white hover:bg-[#16334b] transition-colors"
        title={`Compile to ${target}`}
      >
        <Zap className="w-4 h-4" />
      </button>

      {mode === 'text' && (
        <button
          onClick={onFormat}
          className="p-1.5 rounded text-[#8298ae] hover:text-white hover:bg-[#16334b] transition-colors"
          title="Format Source Code"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      )}

      <div className="w-px h-4 bg-[#20334a] mx-1" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-[11px] font-mono text-[#7891aa]">
        <span>Noodle</span>
        <span>/</span>
        <span>Workspace</span>
        <span>/</span>
        <span className="text-[#dce8f5] font-medium">{activeFileName}</span>
      </div>

      {/* Mode Badge */}
      <button
        onClick={() => onModeChange(mode === 'text' ? 'blueprint' : 'text')}
        className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border transition-colors ${
          mode === 'blueprint'
            ? 'border-purple-500/50 bg-purple-900/30 text-purple-300'
            : 'border-[#31536c] bg-[#102238] text-[#7bc9df]'
        }`}
        title="Click to toggle editor mode"
      >
        {mode}
      </button>

      <div className="flex-1" />

      {/* Diagnostics Quick Pill */}
      {diagnosticCount.errors > 0 ? (
        <div className="flex items-center gap-1 text-[11px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
          <XCircle className="w-3.5 h-3.5" />
          <span>{diagnosticCount.errors} error{diagnosticCount.errors > 1 ? 's' : ''}</span>
        </div>
      ) : diagnosticCount.warnings > 0 ? (
        <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{diagnosticCount.warnings} warning{diagnosticCount.warnings > 1 ? 's' : ''}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[11px] text-emerald-400/80">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>0 issues</span>
        </div>
      )}

      <div className="w-px h-4 bg-[#20334a] mx-1" />

      {/* Build / Execution State */}
      <div className="flex items-center gap-1.5 text-[11px]">
        {status === 'Running' ? (
          <span className="text-amber-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Executing...
          </span>
        ) : status === 'Success' ? (
          <span className="text-[#6ee7ff]">Build Succeeded ({target})</span>
        ) : status === 'Error' ? (
          <span className="text-red-400">Build Stopped</span>
        ) : (
          <span className="text-[#76b7c8]">Ready</span>
        )}
      </div>

      <button
        onClick={onOpenDocs}
        className="p-1 rounded text-[#8298ae] hover:text-[#6ee7ff] hover:bg-[#16334b] transition-colors ml-1"
        title="Open NUDL 0.3 Specification & Grammar Documentation"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
