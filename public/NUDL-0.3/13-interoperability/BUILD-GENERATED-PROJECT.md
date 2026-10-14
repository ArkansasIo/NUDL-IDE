# Generated C++ Project Contract

When the Noodle C++ backend is selected, the compiler should be able to emit:

    generated/
      CMakeLists.txt
      src/
        main.cpp
      include/
      noodle-build.json

The generated build manifest records source hash, Noodle version, backend version, target, compiler, flags, and dependencies.

The generated C++ project is ordinary C++ and can be opened in Visual Studio, CLion, Qt Creator, VS Code, Xcode, or another C++ IDE and compiled by the selected C++ toolchain.

Current milestone: direct C++ source generation is implemented for the compiler AST subset. Full project emission and additional target backends remain staged work.
