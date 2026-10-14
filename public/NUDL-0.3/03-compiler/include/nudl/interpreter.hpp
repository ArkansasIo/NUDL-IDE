#pragma once
#include "nudl/ast.hpp"
#include <memory>
#include <string>
#include <unordered_map>
#include <variant>
#include <vector>
namespace nudl {
struct RuntimeValue;
using RuntimeArray=std::vector<RuntimeValue>;
struct RuntimeValue {
  using Data=std::variant<std::monostate,double,bool,std::string,std::shared_ptr<RuntimeArray>>;
  Data data;
};
class Interpreter {
 public:
  explicit Interpreter(const Program& program);
  RuntimeValue run();
 private:
  const Program& program_;
  std::unordered_map<std::string,RuntimeValue> globals_;
  RuntimeValue eval(const Expr&);
  RuntimeValue eval_call(const Call&);
  RuntimeValue eval_binary(const Binary&);
  bool truthy(const RuntimeValue&) const;
  static double number(const RuntimeValue&);
  void exec(const Stmt&,RuntimeValue&,bool&);
  const Function* find_function(const std::string&) const;
};
std::string runtime_value_to_string(const RuntimeValue&);
}