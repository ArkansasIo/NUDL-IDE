#pragma once
#include "nudl/token.hpp"
#include <string>
#include <vector>
namespace nudl {
struct Diagnostic { std::size_t line=1,column=1; std::string message; };
class Diagnostics { public: void error(const Token&, std::string); bool ok() const { return errors_.empty(); } const std::vector<Diagnostic>& errors() const { return errors_; } private: std::vector<Diagnostic> errors_; };
}