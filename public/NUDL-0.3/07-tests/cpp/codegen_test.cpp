#include "nudl/codegen.hpp"
#include "nudl/lexer.hpp"
#include "nudl/parser.hpp"
#include <cassert>
#include <string>
int main(){
 const std::string src=R"(fn main() -> i64 {
    print("Hello, world!");
    return 0;
})";
 nudl::Diagnostics d; nudl::Parser p(nudl::lex(src),d); auto program=p.parse(); assert(d.ok());
 auto out=nudl::generate_source(*program,{nudl::TargetLanguage::Cpp});
 assert(out.find("#include <iostream>")!=std::string::npos);
 assert(out.find("Hello, world!")!=std::string::npos);
 assert(out.find("int main()")!=std::string::npos);
 return 0;
}
