# NUDL 0.3 Proposed Specification

## 1. Values

Initial value families: `null`, `bool`, signed/unsigned integers, floating point, `text`, `bytes`, arrays, records, and named schema values.

## 2. Declarations

Proposed declarations include `schema`, `data`, `const`, `let`, and `fn`.

## 3. Records

Records use named fields and braces. Field order is significant for serialization only when explicitly defined by a schema.

## 4. Validation

Schemas may mark fields `required`, provide defaults, and attach constraints. Validation should report structured diagnostics instead of silently coercing invalid data.

## 5. Execution model

The reference implementation should parse source into an AST, validate declarations, then execute or compile a deterministic intermediate representation.

## 6. Compatibility

JSON/CSV/SQL/XLSX are interoperability targets, not native NUDL syntax. Import/export must be explicit and must not execute imported SQL.

## 7. Status

This is a versioned design proposal for NUDL 0.3. Grammar and implementation details may change until a conformance suite is established.
