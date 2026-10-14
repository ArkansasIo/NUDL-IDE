#pragma once
#include "nudl/token.hpp"
#include <string_view>
#include <vector>
namespace nudl { std::vector<Token> lex(std::string_view source); }