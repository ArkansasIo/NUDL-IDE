import React, { useRef, useState, useEffect } from 'react';
import { Diagnostic } from '../nudl/types';

interface TextEditorProps {
  fileName: string;
  code: string;
  onChange: (newCode: string) => void;
  onSave: () => void;
  onRun: () => void;
  diagnostics: Diagnostic[];
}

export const TextEditor: React.FC<TextEditorProps> = ({
  fileName,
  code,
  onChange,
  onSave,
  onRun,
  diagnostics,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const lines = code.split('\n');

  // Map diagnostics by line for gutter markers
  const diagByLine = new Map<number, Diagnostic>();
  for (const d of diagnostics) {
    if (!diagByLine.has(d.line)) {
      diagByLine.set(d.line, d);
    }
  }

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const linesBefore = text.substring(0, selStart).split('\n');
    setCursorPos({
      line: linesBefore.length,
      col: (linesBefore[linesBefore.length - 1]?.length || 0) + 1,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSave();
      return;
    }

    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Tab key: indent 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
        updateCursorPosition();
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07111f] overflow-hidden select-text">
      {/* Editor Tab Bar */}
      <div className="h-8 border-b border-[#20334a] bg-[#091624] flex items-center justify-between px-3 text-xs text-[#89a2ba]">
        <div className="flex items-center">
          <div className="px-3 py-1.5 bg-[#0d1b2a] text-[#dce9f4] border-r border-[#20334a] font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6ee7ff]" />
            <span>{fileName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#71869b]">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span className="text-[#6ee7ff]">Noodle 0.3</span>
        </div>
      </div>

      {/* Editor Body with Gutter */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-[#081321] border-r border-[#1a2b3d] text-right pr-2 text-[#465d75] font-mono text-xs select-none flex-shrink-0 overflow-hidden">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const hasDiag = diagByLine.get(lineNum);
            const isCurrentLine = cursorPos.line === lineNum;

            return (
              <div
                key={i}
                className={`h-5 leading-5 flex items-center justify-end gap-1.5 ${
                  isCurrentLine ? 'text-[#6ee7ff] font-bold' : ''
                }`}
                title={hasDiag ? `${hasDiag.severity.toUpperCase()}: ${hasDiag.message}` : undefined}
              >
                {hasDiag && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasDiag.severity === 'error' ? 'bg-red-400' : 'bg-amber-400'
                    }`}
                  />
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            aria-label="Noodle source editor"
            className="w-full h-full min-h-[400px] p-3 bg-transparent text-[#dce8f5] font-mono text-[13px] leading-5 resize-none outline-none border-0 overflow-y-auto selection:bg-[#134b61] selection:text-white"
            placeholder="// Write Noodle 0.3 code here..."
          />
        </div>
      </div>
    </div>
  );
};
