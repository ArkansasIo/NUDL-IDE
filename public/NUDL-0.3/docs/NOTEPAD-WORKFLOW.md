# NUDL + Notepad workflow

NUDL source is ordinary UTF-8 plain text. Windows Notepad can create and edit .nudl files.

## Create the source

Open Notepad and save the file as:

hello.nudl

Choose Save as type: All files. Use UTF-8 encoding if offered. The filename must not become hello.nudl.txt.

Example:

schema Person {
  id: u64 required
  name: text required
}

data people: Person {
  { id: 1, name: "Alice" }
}

## Build the compiler

From a Visual Studio Developer PowerShell:

powershell -ExecutionPolicy Bypass -File tools\\build-windows.ps1

This builds:

build\\Release\\nudlc.exe

## Compile/check the Notepad file

tools\\compile-nudl.bat hello.nudl

A successful first-stage compiler check reports:

NUDL OK: hello.nudl

This initial compiler validates source structure. It does not yet generate native machine code or a standalone executable from every NUDL construct.

## Planned compiler stages

1. Complete lexer and token diagnostics.
2. Implement the NUDL 0.3 parser and AST.
3. Add semantic/type checking.
4. Implement data/runtime evaluation.
5. Add deterministic output generation.
6. Add import/export adapters.
7. Add native executable and/or WebAssembly backends.

Notepad is the editor; nudlc is the compiler.
