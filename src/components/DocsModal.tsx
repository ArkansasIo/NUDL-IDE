import React, { useState } from 'react';
import { X, BookOpen, Code2, Milestone, Cpu, ExternalLink } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'spec' | 'grammar' | 'roadmap' | 'architecture'>('spec');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-4xl h-[85vh] bg-[#0d1b2a] border border-[#28425d] rounded-lg shadow-2xl overflow-hidden text-[#dce8f5]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#20334a] bg-[#0b1522]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#102238] border border-[#3d647a] grid place-items-center text-[#6ee7ff] font-bold">
              N
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">NUDL 0.3 Documentation & Specification</h2>
              <p className="text-xs text-[#71869b]">ArkansasIo/NUDL-0.3 • Official Language Documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#91a4ba] hover:text-white hover:bg-[#16334b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-4 border-b border-[#20334a] bg-[#091624]">
          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'spec'
                ? 'border-[#6ee7ff] text-white bg-[#0d1b2a]'
                : 'border-transparent text-[#91a4ba] hover:text-[#dce8f5]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            SPEC-0.3.md
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'grammar'
                ? 'border-[#6ee7ff] text-white bg-[#0d1b2a]'
                : 'border-transparent text-[#91a4ba] hover:text-[#dce8f5]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            NUDL-0.3.ebnf
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-[#6ee7ff] text-white bg-[#0d1b2a]'
                : 'border-transparent text-[#91a4ba] hover:text-[#dce8f5]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Architecture & Targets
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'roadmap'
                ? 'border-[#6ee7ff] text-white bg-[#0d1b2a]'
                : 'border-transparent text-[#91a4ba] hover:text-[#dce8f5]'
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            ROADMAP.md
          </button>

          <a
            href="https://github.com/ArkansasIo/NUDL-0.3"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-[#6ee7ff] hover:underline"
          >
            GitHub Repository <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed font-sans bg-[#07111f]">
          {activeTab === 'spec' && (
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-xl font-bold text-[#6ee7ff]">NUDL 0.3 Proposed Specification</h1>
              <p className="text-[#a9c5dc]">
                NUDL (Noodle Unified Data Language) is a proposed programming and data language. JSON, CSV, SQL,
                spreadsheets, CSS, and existing programming languages are design influences only; they are not embedded
                syntaxes.
              </p>

              <div className="border border-[#20334a] rounded-lg p-4 bg-[#0d1b2a] space-y-3">
                <h2 className="text-base font-semibold text-white">1. Value Families</h2>
                <p className="text-xs text-[#a9c5dc]">
                  Initial value families: <code className="text-[#6ee7ff]">null</code>,{' '}
                  <code className="text-[#6ee7ff]">bool</code>, signed/unsigned integers (
                  <code className="text-[#6ee7ff]">i64</code>, <code className="text-[#6ee7ff]">u64</code>), floating
                  point (<code className="text-[#6ee7ff]">f64</code>), <code className="text-[#6ee7ff]">text / string</code>
                  , <code className="text-[#6ee7ff]">bytes</code>, arrays (<code className="text-[#6ee7ff]">T[]</code>),
                  records, and named schema values.
                </p>

                <h2 className="text-base font-semibold text-white">2. Declarations</h2>
                <p className="text-xs text-[#a9c5dc]">
                  Declarations include <code className="text-[#6ee7ff]">schema</code>,{' '}
                  <code className="text-[#6ee7ff]">data</code>, <code className="text-[#6ee7ff]">const</code>,{' '}
                  <code className="text-[#6ee7ff]">let</code>, and <code className="text-[#6ee7ff]">fn</code>.
                </p>

                <h2 className="text-base font-semibold text-white">3. Records & Structs</h2>
                <p className="text-xs text-[#a9c5dc]">
                  Records use named fields and braces. Field order is significant for serialization only when explicitly
                  defined by a schema.
                </p>

                <h2 className="text-base font-semibold text-white">4. Validation</h2>
                <p className="text-xs text-[#a9c5dc]">
                  Schemas may mark fields <code className="text-[#6ee7ff]">required</code>, provide defaults, and attach
                  constraints. Validation reports structured diagnostics instead of silently coercing invalid data.
                </p>

                <h2 className="text-base font-semibold text-white">5. Execution Model</h2>
                <p className="text-xs text-[#a9c5dc]">
                  The reference implementation parses source into an AST, validates declarations, then executes or
                  compiles a deterministic intermediate representation.
                </p>

                <h2 className="text-base font-semibold text-white">6. Compatibility</h2>
                <p className="text-xs text-[#a9c5dc]">
                  JSON, CSV, SQL, and XLSX are interoperability targets, not native NUDL syntax. Import and export must
                  be explicit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-xl font-bold text-[#6ee7ff]">NUDL 0.3 EBNF Grammar</h1>
              <p className="text-xs text-[#a9c5dc]">
                Official draft grammar from <code className="text-[#6ee7ff]">grammar/NUDL-0.3.ebnf</code>:
              </p>
              <pre className="p-4 rounded bg-[#0d1b2a] border border-[#20334a] text-xs font-mono text-[#a9c5dc] overflow-x-auto leading-relaxed">
{`program     = { declaration } ;
declaration = schema | data | function | binding ;
schema      = "schema" , identifier , "{" , { field } , "}" ;
field       = identifier , ":" , type , [ "required" ] , [ "=" , expression ] ;
data        = "data" , identifier , ":" , identifier , "{" , { record } , "}" ;
function    = "fn" , identifier , "(" , [ parameters ] , ")" , "->" , type , block ;
binding     = ( "let" | "const" ) , identifier , [ ":" , type ] , "=" , expression ;
record      = "{" , [ fields ] , "}" ;
fields      = field-value , { "," , field-value } ;
field-value = identifier , ":" , expression ;
parameters  = parameter , { "," , parameter } ;
parameter   = identifier , ":" , type ;
type        = identifier , [ "[ ]" ] ;
block       = "{" , { statement } , "}" ;
statement   = binding | "return" , expression | if_stmt | while_stmt ;
expression  = literal | identifier | call | binary | array ;
call        = identifier , "(" , [ expression , { "," , expression } ] , ")" ;
binary      = expression , operator , expression ;
operator    = "==" | "!=" | "<" | "<=" | ">" | ">=" | "+" | "-" | "*" | "/" | "%" ;
literal     = string | number | "true" | "false" | "null" ;
identifier  = letter , { letter | digit | "_" } ;`}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-xl font-bold text-[#6ee7ff]">Compiler Architecture & Target Matrix</h1>
              <p className="text-xs text-[#a9c5dc]">
                The Noodle compiler front-end pipeline consists of Lexing, Parsing, Diagnostics, AST Lowering, and Code
                Generation:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0d1b2a] border border-[#20334a] rounded">
                  <h3 className="font-semibold text-sm text-[#6ee7ff] mb-2">Front-End Pipeline</h3>
                  <ul className="text-xs text-[#a9c5dc] space-y-1.5 list-disc list-inside">
                    <li><strong className="text-white">Lexer</strong>: Tokenizes keywords, symbols, literals</li>
                    <li><strong className="text-white">Parser</strong>: Recursive descent AST construction</li>
                    <li><strong className="text-white">Analyzer</strong>: Diagnostics & schema type checking</li>
                    <li><strong className="text-white">Interpreter</strong>: In-memory live evaluator</li>
                    <li><strong className="text-white">Blueprint Engine</strong>: Visual graph to Noodle compiler</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#0d1b2a] border border-[#20334a] rounded">
                  <h3 className="font-semibold text-sm text-[#6ee7ff] mb-2">Supported Target Languages</h3>
                  <div className="text-xs text-[#a9c5dc] space-y-1">
                    <div>• <strong>C++23</strong>: Official reference implementation</div>
                    <div>• <strong>C (C99)</strong>: Native portable C compilation</div>
                    <div>• <strong>Rust</strong>: Memory-safe idiomatic output</div>
                    <div>• <strong>Python 3</strong>: Scripting & data science pipeline</div>
                    <div>• <strong>JavaScript / TypeScript</strong>: Modern Web runtime</div>
                    <div>• <strong>C# (.NET) / Java / Swift</strong>: Enterprise & Mobile</div>
                    <div>• <strong>WebAssembly (WAT)</strong>: High performance stack machine</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-xl font-bold text-[#6ee7ff]">NUDL 0.3 Roadmap & Milestones</h1>
              <div className="space-y-3">
                <div className="p-3 border border-[#28425d] bg-[#0d1b2a] rounded">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#134b61] text-[#6ee7ff] font-mono mr-2">Phase 1</span>
                  <strong className="text-sm text-white">Syntax & Lexical Specification</strong>
                  <p className="text-xs text-[#a9c5dc] mt-1">EBNF grammar, token definitions, value types, and reference tests.</p>
                </div>
                <div className="p-3 border border-[#28425d] bg-[#0d1b2a] rounded">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#134b61] text-[#6ee7ff] font-mono mr-2">Phase 2</span>
                  <strong className="text-sm text-white">Front-End Compiler & Diagnostics</strong>
                  <p className="text-xs text-[#a9c5dc] mt-1">AST nodes, semantic analysis, error reporting, and browser IDE integration.</p>
                </div>
                <div className="p-3 border border-[#28425d] bg-[#0d1b2a] rounded">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#134b61] text-[#6ee7ff] font-mono mr-2">Phase 3</span>
                  <strong className="text-sm text-white">Multi-Target Code Generation & Interop</strong>
                  <p className="text-xs text-[#a9c5dc] mt-1">C++, Rust, Python, JavaScript backends, ABI/FFI bindings, and package registry.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#20334a] bg-[#0b1522] text-xs text-[#71869b]">
          <span>Noodle Unified Data Language (NUDL) 0.3</span>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-[#102238] hover:bg-[#16334b] text-[#dce8f5] border border-[#28425d]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
