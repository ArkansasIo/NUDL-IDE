#pragma once
#include <cstddef>
#include <string>
namespace nudl {
enum class TokenKind { Identifier, Number, String, Keyword, LParen,RParen,LBrace,RBrace,LBracket,RBracket,Comma,Colon,Semicolon,Arrow,Plus,Minus,Star,Slash,Percent,Equal,EqualEqual,BangEqual,Less,LessEqual,Greater,GreaterEqual,Bang,End,Unknown };
struct Token { TokenKind kind; std::string text; std::size_t line=1,column=1; };
const char* token_kind_name(TokenKind kind);
}