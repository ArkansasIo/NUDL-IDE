# Noodle Plugins

Plugins extend the compiler, runtime, standard library, backend, IDE, tools, data adapters, or FFI without silently changing Noodle semantics.

Every plugin declares an identifier, semantic version, plugin API version, compatible Noodle version, kind, entry point, platforms, capabilities, and dependencies.

Native plugins must use an explicit API boundary. File, network, process, device, GPU, and FFI access are capabilities and should be declared.

Lifecycle: discover -> validate -> resolve dependencies -> load -> register -> use -> unload.

The host must reject incompatible API major versions and must fail closed when required capabilities are unavailable.
