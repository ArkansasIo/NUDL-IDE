#include "nudl/diagnostics.hpp"
namespace nudl { void Diagnostics::error(const Token& t,std::string m){errors_.push_back({t.line,t.column,std::move(m)});} }