# NUDL Accelerator API

The accelerator API exposes hardware capability without making hardware mandatory.

Noodle source -> Typed NUDL IR -> capability analysis -> scalar CPU, SIMD CPU, or GPU/accelerator.

A program may request an execution policy such as auto. The runtime may select an implementation only when semantics remain equivalent.

Required capabilities include device discovery, feature detection, memory and buffer management, parallel dispatch, synchronization, fallback selection, benchmark metadata, and explicit error reporting.

GPU support must never be represented as implemented merely because a UI target exists.
