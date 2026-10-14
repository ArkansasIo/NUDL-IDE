#pragma once
#include "nudl/ast.hpp"
#include "nudl/diagnostics.hpp"
#include <memory>
#include <vector>
namespace nudl {
class Parser {
 public: Parser(std::vector<Token> tokens, Diagnostics& diagnostics); std::unique_ptr<Program> parse();
 private:
 std::vector<Token> t_; std::size_t p_=0; Diagnostics& d_;
 const Token& peek() const; bool match(TokenKind); const Token& expect(TokenKind,const char*);
 std::string expect_identifier(const char*); std::string parse_type();
 std::unique_ptr<Function> function(); StmtPtr statement(); StmtPtr binding(); StmtPtr control();
 ExprPtr expression(int min_prec=0); ExprPtr unary(); ExprPtr primary(); int precedence(TokenKind) const;
 std::vector<StmtPtr> block();
};
}