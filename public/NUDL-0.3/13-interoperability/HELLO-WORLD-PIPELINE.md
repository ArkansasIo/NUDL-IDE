# Noodle Hello World Cross-Compilation

Source:

    fn main() -> i32 {
        print("Hello, world!");
        return 0;
    }

Conceptual compilation:

    hello.nudl
      -> Noodle AST
      -> typed Noodle IR
      -> C++ backend
      -> hello.cpp
      -> C++ compiler/linker
      -> hello.exe / hello

For a C++ IDE, Noodle should export a complete C++ project containing source, headers, generated metadata, and a build configuration such as CMake.

The same semantic source can be lowered to C, Rust, Python, JavaScript/TypeScript, C#, Java, Swift, or WebAssembly when the selected backend supports the program's feature set.

The generated artifact should include a reproducibility manifest recording Noodle version, backend version, target, compiler, flags, source hash, and dependency versions.
