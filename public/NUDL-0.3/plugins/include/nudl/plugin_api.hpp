#pragma once
#include <cstdint>
#include <string_view>
namespace nudl::plugin {
inline constexpr std::uint32_t API_MAJOR=0;
inline constexpr std::uint32_t API_MINOR=1;
struct Host {
  std::uint32_t api_major;
  std::uint32_t api_minor;
  void (*log)(std::string_view);
};
struct Plugin {
  const char* id;
  const char* version;
  bool (*initialize)(Host*);
  void (*shutdown)();
};
using GetPlugin=Plugin* (*)();
}