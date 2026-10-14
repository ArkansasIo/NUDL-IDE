# NUDL Language Library and API Guide

Document ID: NUDL-LANG-001

This document defines the relationship between the Noodle language itself and its standard library.

## Language core

The compiler owns lexical syntax, parsing, names and scopes, types and generics, pattern matching, control flow, modules and imports, compiler diagnostics, intermediate representation, and language-level safety rules.

The library owns reusable operations such as mathematics, collections, text, files, networking, data processing, and platform services.

## Profiles

- Learn: beginner-friendly diagnostics and guided APIs.
- Standard: normal NUDL application development.
- Formal: explicit types, assumptions, symbolic mathematics, logic, and proof interfaces.
- Systems: low-level APIs, explicit resource control, and native backend features.

## Public API requirements

Every public function should specify its signature, purpose, accepted types, return value, error behavior, determinism, complexity where meaningful, platform availability, acceleration opportunities, examples, and tests.

## Planned documentation tree

08-documentation/API contains API references.
08-documentation/TUTORIALS contains progressive learning material.
08-documentation/REFERENCE contains formal language and library references.
08-documentation/DESIGN contains architecture and design decisions.
