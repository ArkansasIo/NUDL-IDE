#include "nudl/codegen.hpp"
#include <sstream>
#include <stdexcept>
#include <type_traits>
namespace nudl {
namespace {
std::string type_cpp(const std::string& t){ if(t=="i64"||t=="int"||t=="integer") return "long long"; if(t=="f64"||t=="float"||t=="double") return "double"; if(t=="bool") return "bool"; if(t=="string") return "std::string"; if(t=="void") return "void"; return "auto"; }
std::string lit(const Literal& x){ if(x.kind==Literal::Kind::String) return """ + x.value + """; if(x.kind==Literal::Kind::Boolean) return x.value; if(x.kind==Literal::Kind::Null) return "nullptr"; return x.value; }
std::string expr(const Expr& e){
 return std::visit([](auto const& n)->std::string{
  using T=std::decay_t<decltype(n)>;
  if constexpr(std::is_same_v<T,Literal>) return lit(n);
  else if constexpr(std::is_same_v<T,Name>) return n.value;
  else if constexpr(std::is_same_v<T,Unary>) return "(" + n.op + expr(*n.rhs) + ")";
  else if constexpr(std::is_same_v<T,Binary>) return "(" + expr(*n.lhs) + " " + n.op + " " + expr(*n.rhs) + ")";
  else if constexpr(std::is_same_v<T,Call>){ std::string s=n.callee+"("; for(size_t i=0;i<n.args.size();++i){if(i)s+=", ";s+=expr(*n.args[i]);} return s+")"; }
  else throw std::runtime_error("C++ backend does not yet lower arrays");
 },e.node);
}
void emit_stmt(std::ostringstream& o,const Stmt& s,int ind){
 std::string pad(ind*4,' ');
 std::visit([&](auto const& n){
  using T=std::decay_t<decltype(n)>;
  if constexpr(std::is_same_v<T,Binding>) o<<pad<<(n.constant?"const ":"auto ")<<n.name<<" = "<<expr(*n.value)<<";\n";
  else if constexpr(std::is_same_v<T,Return>) o<<pad<<"return "<<expr(*n.value)<<";\n";
  else if constexpr(std::is_same_v<T,ExprStmt>) { if(auto* c=std::get_if<Call>(&n.value->node); c && c->callee=="print" && c->args.size()==1) o<<pad<<"std::cout << "<<expr(*c->args[0])<<" << std::endl;\n"; else o<<pad<<expr(*n.value)<<";\n"; }
  else if constexpr(std::is_same_v<T,If>) { o<<pad<<"if ("<<expr(*n.condition)<<") {\n"; for(auto const& x:n.then_branch) emit_stmt(o,*x,ind+1); o<<pad<<"}\n"; }
  else if constexpr(std::is_same_v<T,While>) { o<<pad<<"while ("<<expr(*n.condition)<<") {\n"; for(auto const& x:n.body) emit_stmt(o,*x,ind+1); o<<pad<<"}\n"; }
 },s.node);
}
void emit_function(std::ostringstream& o,const Function& f){
 bool main=f.name=="main"; o<<(main?"int ":"auto ")<<f.name<<"("; for(size_t i=0;i<f.params.size();++i){if(i)o<<", ";o<<type_cpp(f.params[i].type)<<" "<<f.params[i].name;} o<<") {\n"; for(auto const& s:f.body)emit_stmt(o,*s,1); if(main)o<<"    return 0;\n"; o<<"}\n\n";
}
}
std::string target_name(TargetLanguage t){switch(t){case TargetLanguage::Cpp:return "cpp";case TargetLanguage::C:return "c";case TargetLanguage::Rust:return "rust";case TargetLanguage::Python:return "python";case TargetLanguage::JavaScript:return "javascript";case TargetLanguage::TypeScript:return "typescript";case TargetLanguage::CSharp:return "csharp";case TargetLanguage::Java:return "java";case TargetLanguage::Swift:return "swift";}return "unknown";}
std::string generate_source(const Program& p,const CodegenOptions& o){ if(o.target!=TargetLanguage::Cpp) throw std::runtime_error("only the C++ backend is implemented; other targets are registered for staged implementation"); std::ostringstream out; out<<"#include <iostream>\n#include <string>\n\n"; for(auto const& f:p.functions)emit_function(out,*f); for(auto const& s:p.statements)emit_stmt(out,*s,0); return out.str(); }
}
