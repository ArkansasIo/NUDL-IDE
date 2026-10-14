#include "nudl/lexer.hpp"
#include "nudl/parser.hpp"
#include <cassert>
#include <iostream>
int main(){auto t=nudl::lex("fn add(a: i64, b: i64) -> i64 { return a + b; }");assert(!t.empty());nudl::Diagnostics d;nudl::Parser p(std::move(t),d);auto prog=p.parse();assert(d.ok());assert(prog->functions.size()==1);assert(prog->functions[0].name=="add");std::cout<<"smoke: PASS\n";}