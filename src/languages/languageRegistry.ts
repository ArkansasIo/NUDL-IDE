/** NUDL IDE language registry. Profiles describe editor/runtime support; compiler adapters are added independently. */
export type LanguageKind = 'native' | 'script' | 'managed' | 'web' | 'systems' | 'data' | 'shell' | 'bytecode';
export type RuntimeMode = 'nudl-codegen' | 'browser' | 'wasm' | 'external' | 'interpreter' | 'none';

export interface LanguageProfile {
  id: string;
  name: string;
  version: string;
  extension: string;
  syntax: string;
  kind: LanguageKind;
  runtime: RuntimeMode;
  compiler?: string;
  enabled: boolean;
  notes?: string;
}

export const LANGUAGE_PROFILES: LanguageProfile[] = [
  { id: 'nudl', name: 'NUDL', version: '0.3', extension: '.nudl', syntax: 'nudl', kind: 'systems', runtime: 'interpreter', enabled: true },
  { id: 'cpp', name: 'C++', version: 'C++23', extension: '.cpp', syntax: 'cpp', kind: 'systems', runtime: 'external', compiler: 'clang++/g++', enabled: true },
  { id: 'c', name: 'C', version: 'C17/C23', extension: '.c', syntax: 'c', kind: 'systems', runtime: 'external', compiler: 'clang/gcc', enabled: true },
  { id: 'rust', name: 'Rust', version: '2024', extension: '.rs', syntax: 'rust', kind: 'systems', runtime: 'external', compiler: 'rustc/cargo', enabled: true },
  { id: 'python', name: 'Python', version: '3.13+', extension: '.py', syntax: 'python', kind: 'script', runtime: 'external', compiler: 'python', enabled: true },
  { id: 'javascript', name: 'JavaScript', version: 'ES2025', extension: '.js', syntax: 'javascript', kind: 'web', runtime: 'browser', enabled: true },
  { id: 'typescript', name: 'TypeScript', version: '5.x', extension: '.ts', syntax: 'typescript', kind: 'web', runtime: 'external', compiler: 'tsc', enabled: true },
  { id: 'csharp', name: 'C#', version: '.NET 10', extension: '.cs', syntax: 'csharp', kind: 'managed', runtime: 'external', compiler: 'dotnet', enabled: true },
  { id: 'java', name: 'Java', version: 'Java 25', extension: '.java', syntax: 'java', kind: 'managed', runtime: 'external', compiler: 'javac/java', enabled: true },
  { id: 'swift', name: 'Swift', version: 'Swift 6', extension: '.swift', syntax: 'swift', kind: 'systems', runtime: 'external', compiler: 'swiftc', enabled: true },
  { id: 'kotlin', name: 'Kotlin', version: '2.x', extension: '.kt', syntax: 'kotlin', kind: 'managed', runtime: 'external', compiler: 'kotlinc', enabled: true },
  { id: 'go', name: 'Go', version: '1.25+', extension: '.go', syntax: 'go', kind: 'systems', runtime: 'external', compiler: 'go', enabled: true },
  { id: 'dart', name: 'Dart', version: '3.x', extension: '.dart', syntax: 'dart', kind: 'managed', runtime: 'external', compiler: 'dart/flutter', enabled: true },
  { id: 'ruby', name: 'Ruby', version: '3.x', extension: '.rb', syntax: 'ruby', kind: 'script', runtime: 'external', compiler: 'ruby', enabled: true },
  { id: 'php', name: 'PHP', version: '8.x', extension: '.php', syntax: 'php', kind: 'script', runtime: 'external', compiler: 'php', enabled: true },
  { id: 'lua', name: 'Lua', version: '5.4', extension: '.lua', syntax: 'lua', kind: 'script', runtime: 'external', compiler: 'lua', enabled: true },
  { id: 'perl', name: 'Perl', version: '5.40+', extension: '.pl', syntax: 'perl', kind: 'script', runtime: 'external', compiler: 'perl', enabled: true },
  { id: 'r', name: 'R', version: '4.x', extension: '.r', syntax: 'r', kind: 'data', runtime: 'external', compiler: 'Rscript', enabled: true },
  { id: 'fortran', name: 'Fortran', version: 'Fortran 2023', extension: '.f90', syntax: 'fortran', kind: 'systems', runtime: 'external', compiler: 'gfortran', enabled: true },
  { id: 'assembly', name: 'Assembly', version: 'x86-64/ARM64', extension: '.asm', syntax: 'asm', kind: 'systems', runtime: 'external', compiler: 'nasm/as/llvm-mc', enabled: true },
  { id: 'sql', name: 'SQL', version: 'SQL:2023', extension: '.sql', syntax: 'sql', kind: 'data', runtime: 'external', compiler: 'database-client', enabled: true },
  { id: 'bash', name: 'Bash', version: '5.x', extension: '.sh', syntax: 'shell', kind: 'shell', runtime: 'external', compiler: 'bash', enabled: true },
  { id: 'powershell', name: 'PowerShell', version: '7.x', extension: '.ps1', syntax: 'powershell', kind: 'shell', runtime: 'external', compiler: 'pwsh', enabled: true },
  { id: 'html', name: 'HTML', version: 'HTML Living Standard', extension: '.html', syntax: 'html', kind: 'web', runtime: 'browser', enabled: true },
  { id: 'css', name: 'CSS', version: 'CSS Living Standard', extension: '.css', syntax: 'css', kind: 'web', runtime: 'browser', enabled: true },
];

export const LANGUAGE_COUNT = LANGUAGE_PROFILES.length;
export const getLanguage = (id: string) => LANGUAGE_PROFILES.find((language) => language.id === id);
export const getLanguageByExtension = (extension: string) => LANGUAGE_PROFILES.find((language) => language.extension === extension.toLowerCase());
