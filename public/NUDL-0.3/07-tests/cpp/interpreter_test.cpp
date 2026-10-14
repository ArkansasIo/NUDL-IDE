#include "nudl/interpreter.hpp"
#include "nudl/lexer.hpp"
#include "nudl/parser.hpp"
#include <cassert>
int main(){const char* source="fn add(a: i64, b: i64) -> i64 { return a + b; } let answer = add(2, 3);";auto tokens=nudl::lex(source);nudl::Diagnostics d;nudl::Parser p(std::move(tokens),d);auto program=p.parse();assert(d.ok());nudl::Interpreter vm(*program);assert(nudl::runtime_value_to_string(vm.run())=="null");return 0;}