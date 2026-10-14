# Omni to NUDL Translation Guide

## Purpose

NUDL can use the documented Omni concepts as design input while remaining an independent language. This guide maps concepts rather than copying Omni implementation code.

## Mapping

| Omni concept | NUDL representation |
|---|---|
| Source program | .nudl module |
| Compiler stages | lexer, parser, semantic checker, typed IR, backend |
| UIR/IR concepts | NUDL typed IR |
| Input/output declarations | schemas and pipeline input/output |
| Transform operations | typed functions and collection operators |
| Validation | Result types and schema constraints |
| Native interoperability | explicit extern/foreign boundaries |
| Deterministic execution | documented evaluation and ordering rules |
| Audio/DSP stages | optional streaming library |
| Quantum examples | optional simulation library |
| WASM/native targets | compiler backend milestones |

## Safety and licensing boundary

Do not copy Omni implementation code, proprietary examples, or project-specific assets into NUDL. For any future compatibility layer, record the exact source project, version, license, and files used.

## Status

The examples in examples/omni-to-nudl are design examples. They should become executable conformance tests only after the corresponding NUDL grammar and runtime features are implemented.
