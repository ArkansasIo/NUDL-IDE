#pragma once
#include <memory>
#include <string>
#include <variant>
#include <vector>
namespace nudl {
struct Expr; using ExprPtr=std::unique_ptr<Expr>;
struct Literal { std::string value; enum class Kind{Number,String,Boolean,Null} kind; };
struct Name { std::string value; };
struct Unary { std::string op; ExprPtr rhs; };
struct Binary { std::string op; ExprPtr lhs,rhs; };
struct Call { std::string callee; std::vector<ExprPtr> args; };
struct Array { std::vector<ExprPtr> elements; };
struct Expr { std::variant<Literal,Name,Unary,Binary,Call,Array> node; template<class T> Expr(T v):node(std::move(v)){} };
struct Stmt; using StmtPtr=std::unique_ptr<Stmt>;
struct Binding { bool constant=false; std::string name; std::string type; ExprPtr value; };
struct Return { ExprPtr value; };
struct ExprStmt { ExprPtr value; };
struct If { ExprPtr condition; std::vector<StmtPtr> then_branch,else_branch; };
struct While { ExprPtr condition; std::vector<StmtPtr> body; };
struct Stmt { std::variant<Binding,Return,ExprStmt,If,While> node; template<class T> Stmt(T v):node(std::move(v)){} };
struct Parameter { std::string name,type; };
struct Function { std::string name; std::vector<Parameter> params; std::string return_type; std::vector<StmtPtr> body; };
struct Program { std::vector<Function> functions; std::vector<StmtPtr> statements; };
}