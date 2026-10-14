# NUDL Performance Test Plan
**Document ID:** NUDL-PERF-TEST-001

## Acceptance areas
- **Correctness:** optimized and baseline outputs agree within explicitly defined numeric semantics.
- **CPU portability:** scalar fallback works on every supported CPU architecture.
- **SIMD safety:** dispatch never executes unsupported instructions.
- **GPU fallback:** missing drivers/adapters produce a clear diagnostic and use a supported fallback when possible.
- **Transfer costs:** accelerator measurements include and separately report data transfer and synchronization.
- **Resource limits:** large allocations fail predictably; mobile tests track peak memory and thermal behavior.
- **Reproducibility:** benchmark records include hardware, OS, compiler revision, backend, flags, input size, repetitions, median and spread.
- **No premature claims:** report measured results only; do not label NUDL "faster than" another language without fair, repeatable comparisons.

## Initial benchmark suite
1. Integer arithmetic loop.
2. Floating-point reduction.
3. Array copy and memory bandwidth.
4. Matrix multiplication at several sizes.
5. String parsing and serialization.
6. File I/O with buffered and unbuffered modes.
7. Task scheduling and parallel reduction.
8. CPU-to-GPU transfer plus compute.
9. Cold-start time and executable size.
10. Mobile energy/thermal soak test when devices are available.

## Results schema
```json
{
  "benchmark_id": "NUDL-PERF-EX-001",
  "compiler_revision": "required",
  "platform": "required",
  "cpu": "required",
  "gpu": "optional",
  "backend": "scalar-cpu | simd-cpu | gpu",
  "input_size": 1000000,
  "warmup_iterations": 3,
  "measured_iterations": 20,
  "median_ms": null,
  "spread_ms": null,
  "peak_memory_bytes": null,
  "correctness_passed": false
}
```

Null timing fields mean the benchmark has not been run. Replace them only with measured values.
