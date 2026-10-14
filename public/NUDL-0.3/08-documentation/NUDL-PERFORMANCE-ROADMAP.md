# NUDL Performance and Hardware Acceleration Roadmap
**Document ID:** NUDL-PERF-001  
**Status:** Design proposal; performance is not yet benchmark-verified  
**Goal:** Make NUDL programs efficient on current CPUs, GPUs, and supported device classes without sacrificing portability or correctness.

## Core rule
Optimize from measurements, not assumptions. No performance claim is valid until a reproducible benchmark compares equivalent work, checks correctness, and reports hardware, compiler version, flags, warm-up, repetitions, and variance.

## Architecture
1. **Frontend:** lexer, parser, type checker, diagnostics.
2. **Typed intermediate representation (IR):** explicit types, control flow, memory effects, overflow behavior, and source locations.
3. **Optimizer pipeline:** constant folding, dead-code elimination, common-subexpression elimination, inlining where beneficial, loop simplification, escape analysis where supported, and profile-guided optimization as a later phase.
4. **CPU code generation:** initially a reliable interpreter or portable backend for bring-up; add LLVM or another mature code-generation backend after IR semantics stabilize. Native machine code must respect target ABI and CPU feature detection.
5. **SIMD/vector layer:** portable vector operations with runtime or compile-time dispatch for available instruction sets (for example, x86-64 AVX2/AVX-512 where supported, and ARM NEON/SVE where available). Always provide a scalar fallback.
6. **GPU compute layer:** explicit accelerator APIs and kernels. Candidate adapters include Vulkan compute, WebGPU, CUDA, and HIP where the user's platform and installed toolchain support them. Do not assume every backend exists on every OS/device.
7. **Runtime and standard library:** allocation-aware collections, predictable error handling, buffered I/O, concurrency primitives, and numeric operations with documented semantics.
8. **Platform capability layer:** detect CPU features, GPU adapter/capabilities, memory limits, OS APIs, and permissions. Keep feature detection separate from application logic.

## Performance priorities
- Avoid unnecessary allocations and copies.
- Use contiguous data layouts for numeric arrays and matrices.
- Offer slices/views and iterator fusion where semantics permit.
- Keep hot loops simple and visible to the optimizer.
- Provide generic code plus specialization for common numeric types.
- Use parallel execution only when work size and overhead justify it.
- Use GPU offload only when data-parallel workload and transfer costs make it worthwhile.
- Keep startup time, executable size, peak memory, energy use, and latency as first-class metrics on mobile.
- Do not enable unsafe optimizations that change integer overflow, floating-point, aliasing, or exception semantics without explicit language rules.

## CPU support strategy
- Establish a portable baseline target.
- Add optimized target profiles and runtime dispatch.
- Test on x86-64 and ARM64, including Apple Silicon and ARM mobile hardware when available.
- Benchmark scalar and vectorized paths separately.
- Use profile-guided optimization only with documented training workloads and reproducible build steps.

## GPU strategy
- Treat GPU compute as an optional capability, not a requirement to run NUDL.
- Define a stable NUDL accelerator API for buffers, kernels, dispatch sizes, synchronization, and error reporting.
- Provide CPU fallback for every standard operation that promises portability.
- Include transfer overhead in benchmarks.
- Avoid claiming CUDA support on platforms where CUDA is unavailable; expose backend capability checks and clear diagnostics.
- Keep graphics APIs separate from general-purpose compute APIs where their capabilities differ.

## Cross-platform delivery
| Platform | Baseline execution | Optional acceleration | Key constraints |
|---|---|---|---|
| Windows | portable runtime/native CPU backend | supported GPU adapters, CUDA/HIP where installed | ABI, drivers, code signing |
| Linux | portable runtime/native CPU backend | Vulkan, CUDA/HIP where installed | distributions, driver/runtime versions |
| macOS | portable runtime/native CPU backend | Metal-based adapter or supported portable backend | Apple Silicon/Intel differences, sandboxing |
| Android | mobile runtime and ARM64 CPU | Vulkan compute where supported | thermal throttling, battery, permissions |
| iOS | mobile runtime and ARM64 CPU | Metal-based adapter where supported | sandboxing, energy, app-store constraints |
| Web | WebAssembly runtime | WebGPU where available | browser support and memory limits |

This matrix is a design target, not a claim that these backends are implemented.

## Benchmark protocol
Every benchmark should:
- specify exact source input and expected result;
- run correctness checks before timing;
- include warm-up and multiple measured iterations;
- report median and spread, not only best time;
- separate compile time, startup time, and steady-state runtime;
- record CPU/GPU model, OS, memory, backend, compiler revision, and optimization flags;
- measure memory allocations and peak memory where practical;
- compare against a baseline doing equivalent work;
- avoid cross-machine speed claims from incomparable runs.

## Release gates
- No wrong answers under optimized builds.
- Sanitizer and fuzz tests for compiler front end and runtime where available.
- Deterministic behavior documented for integer and floating-point operations.
- Performance regression thresholds based on stable CI runners.
- Graceful fallback when an instruction set or GPU backend is missing.
- Security review of native code generation and foreign-function interfaces.

## Implementation milestones
**P0:** Define semantics, IR, correctness tests, and benchmark harness.  
**P1:** Optimize interpreter/portable runtime; reduce allocations and copies.  
**P2:** Add native CPU backend and scalar-vs-SIMD dispatch.  
**P3:** Add profiler output, flamegraph-friendly symbols, and optimization reports.  
**P4:** Prototype one GPU compute backend and compare end-to-end performance.  
**P5:** Add additional backends only when there are tests and maintainers for them.

## References
- LLVM project: https://llvm.org/
- Rust performance book: https://nnethercote.github.io/perf-book/
- WebAssembly: https://webassembly.org/
- WebGPU specification: https://www.w3.org/TR/webgpu/
- Vulkan specification: https://www.khronos.org/vulkan/
- Apple Metal: https://developer.apple.com/metal/
