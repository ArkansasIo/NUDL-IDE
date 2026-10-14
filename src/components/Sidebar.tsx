import React, { useState } from 'react';
import {
  FileCode,
  Layout,
  Plus,
  Trash2,
  Sparkles,
  Terminal,
  Binary,
  Code2,
  CheckCircle,
  FileText,
  Boxes,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { VirtualFile } from '../nudl/types';

interface SidebarProps {
  files: VirtualFile[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
  onNewFile: () => void;
  onDeleteFile: (index: number) => void;
  mode: 'text' | 'blueprint';
  onModeChange: (m: 'text' | 'blueprint') => void;
  onFormat: () => void;
  onSelectTab: (tab: 'terminal' | 'output' | 'problems' | 'console' | 'target' | 'ast' | 'tokens') => void;
}

interface FileTreeNode {
  name: string;
  path: string;
  children: Record<string, FileTreeNode>;
  fileIndex?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeFileIndex,
  onSelectFile,
  onNewFile,
  onDeleteFile,
  mode,
  onModeChange,
  onFormat,
  onSelectTab,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set());

  const tree: FileTreeNode[] = [];
  const nodeIndex = new Map<string, FileTreeNode>();
  files.forEach((file, fileIndex) => {
    const segments = file.name.replace(/\\/g, '/').split('/').filter(Boolean);
    let siblings = tree;
    let parentPath = '';
    segments.forEach((segment, segmentIndex) => {
      const path = parentPath ? `${parentPath}/${segment}` : segment;
      let node = nodeIndex.get(path);
      if (!node) {
        node = { name: segment, path, children: {} };
        nodeIndex.set(path, node);
        if (parentPath) {
          const parent = nodeIndex.get(parentPath);
          if (parent) parent.children[segment] = node;
        } else {
          siblings.push(node);
        }
      }
      if (segmentIndex === segments.length - 1) {
        node.fileIndex = fileIndex;
      }
      parentPath = path;
    });
  });

  const renderTree = (nodes: FileTreeNode[], depth = 0): React.ReactNode =>
    nodes.map((node) => {
      const isFolder = Object.keys(node.children).length > 0;
      const isCollapsed = collapsedFolders.has(node.path);
      if (isFolder) {
        return (
          <div key={node.path}>
            <button
              onClick={() => setCollapsedFolders((current) => {
                const next = new Set(current);
                if (next.has(node.path)) next.delete(node.path);
                else next.add(node.path);
                return next;
              })}
              className="w-full flex items-center gap-1.5 px-1.5 py-1.5 rounded text-left text-[#a9c5dc] hover:bg-[#102238]"
              style={{ paddingLeft: `${8 + depth * 12}px` }}
              aria-expanded={!isCollapsed}
              title={node.path}
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
              {isCollapsed ? <Folder className="w-3.5 h-3.5 shrink-0 text-amber-300" /> : <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-300" />}
              <span className="truncate">{node.name}</span>
            </button>
            {!isCollapsed && <div>{renderTree(Object.values(node.children), depth + 1)}</div>}
          </div>
        );
      }
      const idx = node.fileIndex;
      if (idx === undefined) return null;
      const file = files[idx];
      const isActive = idx === activeFileIndex;
      return (
        <div
          key={node.path}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onSelectFile(idx)}
          className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${isActive
            ? 'bg-[#123044] text-white border border-[#3f829b]/60'
            : 'text-[#c8d8e8] hover:bg-[#102238] border border-transparent'}`}
          style={{ paddingLeft: `${22 + depth * 12}px` }}
          title={file.name}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3.5 flex justify-center text-xs shrink-0">{getFileIcon(file)}</span>
            <span className="truncate text-xs font-mono">{node.name}</span>
          </div>
          {hoveredIndex === idx && files.length > 1 && !file.readOnly && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete file "${file.name}"?`)) onDeleteFile(idx);
              }}
              className="p-1 rounded text-[#8298ae] hover:text-red-400 hover:bg-[#16334b]"
              title={`Delete ${file.name}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    });


  const getFileIcon = (file: VirtualFile) => {
    if (file.isBlueprint || file.name.endsWith('.nblueprint')) {
      return <span className="text-purple-400 font-bold">◇</span>;
    }
    if (file.name.includes('math') || file.name.includes('function')) {
      return <span className="text-[#6ee7ff] font-serif">ƒ</span>;
    }
    if (file.name.includes('logic') || file.name.includes('solver')) {
      return <span className="text-amber-400 font-serif">λ</span>;
    }
    if (file.name.includes('pipeline') || file.name.includes('data')) {
      return <span className="text-emerald-400 font-mono">◈</span>;
    }
    return <span className="text-cyan-400">●</span>;
  };

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#20334a] bg-[#091624] flex flex-col h-full select-none text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1b2b3d] text-[10px] tracking-wider text-[#7189a2] font-semibold">
        <span>SOLUTION EXPLORER</span>
        <button
          onClick={onNewFile}
          className="p-1 rounded hover:bg-[#16334b] text-[#91a4ba] hover:text-[#6ee7ff] transition-colors"
          title="Create New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        <div className="text-[9px] uppercase tracking-wider text-[#60778e] px-2 py-1 font-semibold">
          Source & Blueprints
        </div>
        {renderTree(tree)}

        {/* Quick Views */}
        <div className="pt-3">
          <div className="text-[9px] uppercase tracking-wider text-[#60778e] px-2 py-1 font-semibold">
            WORKSPACE VIEWS
          </div>
          <button
            onClick={() => onModeChange('text')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              mode === 'text' ? 'text-[#6ee7ff] bg-[#102238]' : 'text-[#a9c5dc] hover:bg-[#102238]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#6ee7ff]" />
            <span>Text Code Editor</span>
          </button>
          <button
            onClick={() => onModeChange('blueprint')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              mode === 'blueprint' ? 'text-purple-300 bg-[#102238]' : 'text-[#a9c5dc] hover:bg-[#102238]'
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-purple-400" />
            <span>Visual Blueprint Graph</span>
          </button>
        </div>

        {/* Tools Section */}
        <div className="pt-3">
          <div className="text-[9px] uppercase tracking-wider text-[#60778e] px-2 py-1 font-semibold">
            LANGUAGE TOOLS
          </div>
          <button
            onClick={onFormat}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#a9c5dc] hover:bg-[#102238] hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6ee7ff]" />
            <span>Format Source</span>
          </button>
          <button
            onClick={() => onSelectTab('tokens')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#a9c5dc] hover:bg-[#102238] hover:text-white transition-colors"
          >
            <Binary className="w-3.5 h-3.5 text-amber-400" />
            <span>Token Inspector</span>
          </button>
          <button
            onClick={() => onSelectTab('ast')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#a9c5dc] hover:bg-[#102238] hover:text-white transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
            <span>AST Inspector</span>
          </button>
          <button
            onClick={() => onSelectTab('terminal')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#a9c5dc] hover:bg-[#102238] hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>CLI Terminal</span>
          </button>
        </div>
      </div>

      {/* Target Status Footer in Sidebar */}
      <div className="p-2 border-t border-[#1b2b3d] bg-[#07111f] text-[10px] text-[#71869b] space-y-1">
        <div className="flex items-center justify-between">
          <span>Grammar Conformance</span>
          <span className="text-[#6ee7ff] font-mono">NUDL 0.3</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Backend Target</span>
          <span className="text-white font-mono">Active</span>
        </div>
      </div>
    </aside>
  );
};
