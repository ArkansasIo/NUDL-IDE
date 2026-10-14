#include "nudl/codegen.hpp"
#include "nudl/lexer.hpp"
#include "nudl/parser.hpp"
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
using namespace nudl;
static TargetLanguage target(const std::string& s){if(s=="cpp"||s=="c++")return TargetLanguage::Cpp;if(s=="c")return TargetLanguage::C;if(s=="rust")return TargetLanguage::Rust;if(s=="python")return TargetLanguage::Python;if(s=="js"||s=="javascript")return TargetLanguage::JavaScript;if(s=="ts"||s=="typescript")return TargetLanguage::TypeScript;if(s=="csharp"||s=="cs")return TargetLanguage::CSharp;if(s=="java")return TargetLanguage::Java;if(s=="swift")return TargetLanguage::Swift;throw std::runtime_error("unknown target: "+s);}
int main(int argc,char**argv){
 if(argc<2){std::cerr<<"usage: nudlc <file.nudl> [--target cpp] [--emit output]\n";return 2;}
 std::string file=argv[1], target_name_arg="cpp", output;
 for(int i=2;i<argc;i++){std::string a=argv[i];if(a=="--target"&&i+1<argc)target_name_arg=argv[++i];else if(a=="--emit"&&i+1<argc)output=argv[++i];else {std::cerr<<"nudlc: unknown option "<<a<<"\n";return 2;}}
 std::ifstream f(file);if(!f){std::cerr<<"nudlc: cannot open "<<file<<"\n";return 2;}
 std::stringstream ss;ss<<f.rdbuf();auto tokens=lex(ss.str());Diagnostics d;Parser p(std::move(tokens),d);auto program=p.parse();
 if(!d.ok()){for(auto&e:d.errors())std::cerr<<file<<":"<<e.line<<":"<<e.column<<": error: "<<e.message<<"\n";return 1;}
 try {auto generated=generate_source(*program,{target(target_name_arg)});if(output.empty())std::cout<<generated;else {std::ofstream out(output);if(!out){std::cerr<<"nudlc: cannot write "<<output<<"\n";return 2;}out<<generated;}}
 catch(const std::exception& e){std::cerr<<"nudlc: code generation error: "<<e.what()<<"\n";return 1;}
 return 0;
}
