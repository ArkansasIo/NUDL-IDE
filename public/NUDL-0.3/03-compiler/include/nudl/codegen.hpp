#pragma once
#include "nudl/ast.hpp"
#include <string>
namespace nudl {
enum class TargetLanguage { Cpp, C, Rust, Python, JavaScript, TypeScript, CSharp, Java, Swift };
struct CodegenOptions { TargetLanguage target=TargetLanguage::Cpp; };
std::string target_name(TargetLanguage target);
std::string generate_source(const Program& program, const CodegenOptions& options);
}
