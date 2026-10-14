import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { INITIAL_FILES } from './nudl/examples';
import {
  VirtualFile,
  TargetLanguage,
  Diagnostic,
  Program,
  Token,
  BlueprintGraph,
} from './nudl/types';
import { lex } from './nudl/lexer';
import { Parser } from './nudl/parser';
import { analyzeProgram } from './nudl/analyzer';
import { Interpreter, ExecutionResult } from './nudl/interpreter';
import { generateCode, CodegenResult } from './nudl/codegen';
import { Topbar } from './components/Topbar';
import { Toolstrip } from './components/Toolstrip';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { BlueprintEditor } from './components/BlueprintEditor';
import { RightPane } from './components/RightPane';
import { BottomDock, BottomTabType } from './components/BottomDock';
import { DocsModal } from './components/DocsModal';
import { DEFAULT_BLUEPRINT_EXAMPLES } from './nudl/blueprintEngine';

export default function App() {
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    const saved = localStorage.getItem('nudl_workspace_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FILES;
      }
    }
    return INITIAL_FILES;
  });

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [mode, setMode] = useState<'text' | 'blueprint'>('text');
  const [target, setTarget] = useState<TargetLanguage>('C++');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState<BottomTabType>('terminal');
  const [status, setStatus] = useState<'Ready' | 'Running' | 'Success' | 'Error'>('Ready');
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [outputLog, setOutputLog] = useState<string>(
    '$ nudlc --version\nNoodle Compiler 0.3 (Development Snapshot)\nTarget: C++23 Reference Backend\nType checking and diagnostics engine active.'
  );
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [codegenResult, setCodegenResult] = useState<CodegenResult | null>(null);

  // Active File
  const activeFile = files[activeFileIndex] || files[0];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nudl_workspace_files', JSON.stringify(files));
  }, [files]);

  // If selecting a blueprint file, automatically switch to blueprint mode
  useEffect(() => {
    if (activeFile.isBlueprint || activeFile.name.endsWith('.nblueprint')) {
      setMode('blueprint');
    }
  }, [activeFileIndex, activeFile]);

  // Live compilation analysis (Lexer -> Parser -> Semantic Analyzer)
  const { tokens, program, diagnostics } = useMemo(() => {
    const code = activeFile.content || '';
    const { tokens, diagnostics: lexDiags } = lex(code);
    const parser = new Parser(tokens);
    const { program, diagnostics: parseDiags } = parser.parse();
    const allDiagnostics = analyzeProgram(
      code,
      program,
      lexDiags.map((d) => ({ ...d, code: 'L100', severity: 'error' })),
      parseDiags
    );
    return { tokens, program, diagnostics: allDiagnostics };
  }, [activeFile.content]);

  const diagnosticCount = useMemo(() => {
    const errors = diagnostics.filter((d) => d.severity === 'error').length;
    const warnings = diagnostics.filter((d) => d.severity === 'warning').length;
    return { errors, warnings };
  }, [diagnostics]);

  // Update file content
  const handleContentChange = useCallback((newContent: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === activeFileIndex ? { ...f, content: newContent } : f))
    );
  }, [activeFileIndex]);

  // Update blueprint data
  const handleBlueprintChange = useCallback((updatedGraph: BlueprintGraph) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === activeFileIndex ? { ...f, blueprintData: updatedGraph } : f))
    );
  }, [activeFileIndex]);

  // Compile Blueprint graph to Noodle source code
  const handleCompileToNoodle = useCallback((generatedCode: string) => {
    let pairedNudlIndex = files.findIndex((f) => f.name === 'main.nudl');
    if (pairedNudlIndex === -1) pairedNudlIndex = 0;

    setFiles((prev) =>
      prev.map((f, i) => (i === pairedNudlIndex ? { ...f, content: generatedCode } : f))
    );

    setActiveFileIndex(pairedNudlIndex);
    setMode('text');
    setBottomTab('output');
    setOutputLog(
      `[Blueprint Compiler]\nGraph compiled to Noodle 0.3 source code.\nUpdated ${files[pairedNudlIndex]?.name || 'main.nudl'}.\n`
    );
    setStatus('Success');
  }, [files]);

  // Run interpreter
  const handleRun = useCallback(() => {
    setStatus('Running');
    setOutputLog(`$ run ${activeFile.name}\nParsing program...`);

    try {
      const interpreter = new Interpreter(program);
      const res = interpreter.run();
      setExecutionResult(res);

      if (res.error) {
        setStatus('Error');
        setOutputLog(
          `$ run ${activeFile.name}\n[error] ${res.error}\nExecution terminated after ${res.stepCount} steps.`
        );
      } else {
        setStatus('Ready');
        setOutputLog(
          `$ run ${activeFile.name}\nProcess exited with code ${res.returnValue ?? 0} in ${res.executionTimeMs} ms.\n` +
            (res.output.length > 0 ? `Output:\n${res.output.join('\n')}` : 'No output.')
        );
      }
      setBottomTab('console');
    } catch (err: any) {
      setStatus('Error');
      setOutputLog(`[Interpreter Failure] ${err?.message || 'Unknown runtime error'}`);
      setBottomTab('console');
    }
  }, [activeFile.name, program]);

  // Compile to target language
  const handleCompile = useCallback(() => {
    setStatus('Running');
    if (diagnosticCount.errors > 0) {
      setStatus('Error');
      setOutputLog(
        `$ nudlc ${activeFile.name} --target ${target.toLowerCase()}\n[parse] Failed with ${diagnosticCount.errors} error(s).\nFix diagnostics in the Problems tab before compilation.`
      );
      setBottomTab('problems');
      return;
    }

    try {
      const res = generateCode(program, target);
      setCodegenResult(res);
      setStatus('Success');
      setOutputLog(
        `$ nudlc ${activeFile.name} --target ${target.toLowerCase()}\n[parse] OK\n[ast] Functions: ${program.functions.length}, Structs: ${program.structs.length}, Statements: ${program.statements.length}\n[codegen] Lowered to ${target} target (${res.filename}).\nCompilation completed successfully.`
      );
      setBottomTab('target');
    } catch (err: any) {
      setStatus('Error');
      setOutputLog(`[Codegen Error] ${err?.message || 'Failed to lower target'}`);
      setBottomTab('output');
    }
  }, [activeFile.name, diagnosticCount.errors, program, target]);

  // Format code
  const handleFormat = useCallback(() => {
    const raw = activeFile.content || '';
    const formatted = raw
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
    handleContentChange(formatted);
    setOutputLog(`[Format] Code formatted successfully.`);
  }, [activeFile.content, handleContentChange]);

  // Clear current editor
  const handleClear = useCallback(() => {
    if (confirm('Clear the current file content?')) {
      handleContentChange('');
    }
  }, [handleContentChange]);

  // Save current file
  const handleSave = useCallback(() => {
    localStorage.setItem('nudl_workspace_files', JSON.stringify(files));
    setOutputLog(`[File] Saved "${activeFile.name}" to workspace.`);
    setStatus('Ready');
  }, [activeFile.name, files]);

  // Download .nudl
  const handleDownloadNudl = useCallback(() => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [activeFile]);

  // Export target code
  const handleExportTarget = useCallback(() => {
    const res = generateCode(program, target);
    const blob = new Blob([res.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [program, target]);

  // Export the entire workspace, including blueprint graph data, as a portable JSON project.
  const handleExportWorkspace = useCallback(() => {
    const project = {
      format: 'NUDL-IDE-workspace',
      version: 1,
      exportedAt: new Date().toISOString(),
      files,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nudl-workspace.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setOutputLog(`[Workspace] Exported ${files.length} file(s) to nudl-workspace.json.`);
    setStatus('Success');
  }, [files]);

  const workspaceInputRef = useRef<HTMLInputElement>(null);

  const handleImportWorkspaceClick = useCallback(() => {
    workspaceInputRef.current?.click();
  }, []);

  const handleWorkspaceFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';
    if (!selectedFile) return;

    try {
      const parsed: unknown = JSON.parse(await selectedFile.text());
      if (!parsed || typeof parsed !== 'object' || !('format' in parsed) ||
          parsed.format !== 'NUDL-IDE-workspace' || !('files' in parsed) ||
          !Array.isArray(parsed.files) || parsed.files.length === 0) {
        throw new Error('This is not a valid NUDL IDE workspace export.');
      }

      const importedFiles: VirtualFile[] = [];
      const names = new Set<string>();
      for (const entry of parsed.files) {
        if (!entry || typeof entry !== 'object' ||
            !('name' in entry) || typeof entry.name !== 'string' || !entry.name.trim() ||
            !('content' in entry) || typeof entry.content !== 'string') {
          throw new Error('A workspace file is missing a valid name or text content.');
        }
        const name = entry.name.trim().replace(/\\/g, '/');
        if (name.startsWith('/') || name.split('/').some((part: string) => !part || part === '.' || part === '..')) {
          throw new Error(`Invalid relative path in workspace: "${name}".`);
        }
        const normalizedName = name.toLowerCase();
        if (names.has(normalizedName)) {
          throw new Error(`Duplicate filename in imported workspace: "${name}".`);
        }
        names.add(normalizedName);
        importedFiles.push({
          name,
          content: entry.content,
          isBlueprint: 'isBlueprint' in entry && typeof entry.isBlueprint === 'boolean'
            ? entry.isBlueprint : name.endsWith('.nblueprint'),
          blueprintData: 'blueprintData' in entry ? entry.blueprintData as BlueprintGraph | undefined : undefined,
          readOnly: 'readOnly' in entry && typeof entry.readOnly === 'boolean' ? entry.readOnly : false,
        });
      }

      setFiles(importedFiles);
      setActiveFileIndex(0);
      setMode(importedFiles[0].isBlueprint || importedFiles[0].name.endsWith('.nblueprint') ? 'blueprint' : 'text');
      localStorage.setItem('nudl_workspace_files', JSON.stringify(importedFiles));
      setOutputLog(`[Workspace] Imported ${importedFiles.length} file(s) from "${selectedFile.name}".`);
      setStatus('Success');
      setBottomTab('output');
    } catch (error) {
      setOutputLog(`[Workspace Import Error] ${error instanceof Error ? error.message : 'Could not read workspace file.'}`);
      setStatus('Error');
      setBottomTab('problems');
    }
  }, []);

  // New file modal/prompt
  const handleNewFile = useCallback(() => {
    const name = prompt('Enter file path (e.g. src/calculator.nudl or Graph.nblueprint). Use / to create folders:');
    if (!name || !name.trim()) return;

    const trimmed = name.trim().replace(/\\/g, '/');
    if (trimmed.startsWith('/') || trimmed.split('/').some((part) => !part || part === '.' || part === '..')) {
      setOutputLog('[File Error] Use a relative file path without empty, . or .. path segments.');
      setStatus('Error');
      return;
    }
    if (files.some((file) => file.name.toLowerCase() === trimmed.toLowerCase())) {
      setOutputLog(`[File Error] "${trimmed}" already exists in this workspace.`);
      setStatus('Error');
      return;
    }

    const isBlueprint = trimmed.endsWith('.nblueprint');
    const newFile: VirtualFile = {
      name: trimmed,
      content: isBlueprint
        ? `// Visual Blueprint Graph: ${trimmed}`
        : `// ${trimmed}\nfn main() -> i64 {\n    print("Hello from ${trimmed}");\n    return 0;\n}`,
      isBlueprint,
      blueprintData: isBlueprint ? DEFAULT_BLUEPRINT_EXAMPLES.begin : undefined,
    };

    setFiles((prev) => {
      setActiveFileIndex(prev.length);
      return [...prev, newFile];
    });
    setMode(isBlueprint ? 'blueprint' : 'text');
    setOutputLog(`[File] Created "${trimmed}".`);
    setStatus('Ready');
  }, [files]);

  // Delete file and preserve the selected file when possible.
  const handleDeleteFile = useCallback((idx: number) => {
    setFiles((prev) => {
      if (prev.length <= 1 || idx < 0 || idx >= prev.length) return prev;
      const updated = prev.filter((_, i) => i !== idx);
      setActiveFileIndex((currentIndex) => {
        if (currentIndex > idx) return currentIndex - 1;
        if (currentIndex === idx) return Math.min(idx, updated.length - 1);
        return currentIndex;
      });
      return updated;
    });
    setOutputLog(`[File] Deleted workspace file at index ${idx}.`);
  }, []);

  // Reset workspace
  const handleResetWorkspace = useCallback(() => {
    if (confirm('Reset workspace to official NUDL 0.3 sample suite? All modifications will be replaced.')) {
      setFiles(INITIAL_FILES);
      setActiveFileIndex(0);
      setMode('text');
      localStorage.removeItem('nudl_workspace_files');
      setOutputLog('[Workspace] Reset to repository defaults.');
    }
  }, []);

  // CLI Terminal command runner
  const handleExecuteCommand = useCallback(
    (cmd: string): string => {
      const parts = cmd.trim().split(/\s+/);
      const action = parts[0]?.toLowerCase();
      const arg = parts[1];

      switch (action) {
        case 'help':
          return (
            'Available Noodle CLI commands:\n' +
            '  run [file]         - Execute current program in live interpreter\n' +
            '  compile [target]   - Compile to target (cpp, c, rust, python, js, ts, cs, java, swift, wasm)\n' +
            '  check              - Run syntactic and semantic diagnostics\n' +
            '  ast                - Show Abstract Syntax Tree summary\n' +
            '  tokens             - Show lexical token count and first tokens\n' +
            '  ls                 - List workspace files\n' +
            '  cat <file>         - Display file contents\n' +
            '  docs               - Open NUDL 0.3 specification & grammar\n' +
            '  clear              - Clear terminal buffer'
          );

        case 'run': {
          handleRun();
          return `Executing ${activeFile.name}... See DEBUG CONSOLE tab for real-time output.`;
        }

        case 'compile': {
          if (arg) {
            const mapped: Record<string, TargetLanguage> = {
              cpp: 'C++',
              'c++': 'C++',
              c: 'C',
              rust: 'Rust',
              rs: 'Rust',
              py: 'Python',
              python: 'Python',
              js: 'JavaScript',
              javascript: 'JavaScript',
              ts: 'TypeScript',
              typescript: 'TypeScript',
              cs: 'C#',
              csharp: 'C#',
              java: 'Java',
              swift: 'Swift',
              wasm: 'WASM',
            };
            if (mapped[arg.toLowerCase()]) {
              setTarget(mapped[arg.toLowerCase()]);
            }
          }
          handleCompile();
          return `Compiling ${activeFile.name} to target... See TARGET CODE tab.`;
        }

        case 'check': {
          const errors = diagnostics.filter((d) => d.severity === 'error');
          const warnings = diagnostics.filter((d) => d.severity === 'warning');
          return `Diagnostics for ${activeFile.name}:\n${errors.length} errors, ${warnings.length} warnings.`;
        }

        case 'ast': {
          return `AST for ${activeFile.name}:\nFunctions: ${program.functions.length}\nStructs: ${program.structs.length}\nSchemas: ${program.schemas.length}\nStatements: ${program.statements.length}`;
        }

        case 'tokens': {
          return `Lexer scanned ${tokens.length} tokens for ${activeFile.name}.`;
        }

        case 'ls': {
          return files.map((f) => (f.name === activeFile.name ? `* ${f.name}` : `  ${f.name}`)).join('\n');
        }

        case 'cat': {
          if (!arg) return 'Usage: cat <filename>';
          const targetFile = files.find((f) => f.name === arg);
          if (!targetFile) return `File '${arg}' not found in workspace.`;
          return targetFile.content;
        }

        case 'docs':
          setIsDocsOpen(true);
          return 'Opened NUDL 0.3 documentation viewer.';

        default:
          return `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
      }
    },
    [activeFile, diagnostics, files, handleCompile, handleRun, program, tokens.length]
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07111f] text-[#dce8f5] font-sans antialiased">
      {/* Topbar */}
      <Topbar
        activeFileName={activeFile.name}
        target={target}
        onTargetChange={setTarget}
        onRun={handleRun}
        onCompile={handleCompile}
        onFormat={handleFormat}
        onClear={handleClear}
        onSave={handleSave}
        onDownloadNudl={handleDownloadNudl}
        onImportWorkspace={handleImportWorkspaceClick}
        onExportWorkspace={handleExportWorkspace}
        onExportTarget={handleExportTarget}
        onOpenDocs={() => setIsDocsOpen(true)}
        onNewFile={handleNewFile}
        onResetWorkspace={handleResetWorkspace}
        mode={mode}
        onModeChange={setMode}
        onSelectTab={setBottomTab}
      />

      {/* Toolstrip */}
      <Toolstrip
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeFileName={activeFile.name}
        mode={mode}
        onModeChange={setMode}
        target={target}
        status={status}
        diagnosticCount={diagnosticCount}
        onNewFile={handleNewFile}
        onSave={handleSave}
        onRun={handleRun}
        onCompile={handleCompile}
        onFormat={handleFormat}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Middle Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            files={files}
            activeFileIndex={activeFileIndex}
            onSelectFile={setActiveFileIndex}
            onNewFile={handleNewFile}
            onDeleteFile={handleDeleteFile}
            mode={mode}
            onModeChange={setMode}
            onFormat={handleFormat}
            onSelectTab={setBottomTab}
          />
        )}

        {/* Center Editor (Code Editor vs Blueprint Editor) */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#07111f]">
          {mode === 'text' ? (
            <TextEditor
              fileName={activeFile.name}
              code={activeFile.content}
              onChange={handleContentChange}
              onSave={handleSave}
              onRun={handleRun}
              diagnostics={diagnostics}
            />
          ) : (
            <BlueprintEditor
              graph={activeFile.blueprintData || DEFAULT_BLUEPRINT_EXAMPLES.begin}
              onChange={handleBlueprintChange}
              onCompileToNoodle={handleCompileToNoodle}
            />
          )}
        </main>

        {/* Right Pane */}
        <RightPane
          fileName={activeFile.name}
          codeLength={activeFile.content.length}
          lineCount={activeFile.content.split('\n').length}
          program={program}
          diagnostics={diagnostics}
          target={target}
          compilerStatus={status}
        />
      </div>

      {/* Bottom Dock (Terminal, Build Output, Problems, Debug Console, Target Code, AST, Tokens) */}
      <BottomDock
        activeTab={bottomTab}
        onTabChange={setBottomTab}
        outputLog={outputLog}
        diagnostics={diagnostics}
        executionResult={executionResult}
        codegenResult={codegenResult}
        program={program}
        tokens={tokens}
        onExecuteCommand={handleExecuteCommand}
        onClearTerminal={() => setOutputLog('')}
      />

      {/* Footer Status Bar */}
      <footer className="h-6 border-t border-[#18283a] bg-[#0b1522] flex items-center px-3 gap-4 text-[10px] text-[#657e97] select-none">
        <span className="text-[#6ee7ff] font-medium">Noodle 0.3</span>
        <span>•</span>
        <span>Target: {target}</span>
        <span>•</span>
        <span>Mode: {mode.toUpperCase()}</span>
        <span>•</span>
        <span>UTF-8</span>
        <div className="ml-auto flex items-center gap-2 text-[#76b7c8]">
          <span>Noodle Language Service Ready</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </footer>

      <input
        ref={workspaceInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        aria-label="Import NUDL IDE workspace"
        onChange={handleWorkspaceFileChange}
      />

      {/* Documentation Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}
