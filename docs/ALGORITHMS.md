# NUDL IDE Algorithm Library

The IDE now exposes a catalog of **200 NUDL algorithm examples** through `src/nudl/algorithmCatalog.ts`.

## Categories

- Mathematics
- Bitwise
- Collections
- Strings
- Graphs
- Dynamic Programming
- Number Theory
- Sorting
- Searching & Selection
- Statistics
- Utilities
- Geometry
- Optimization
- Cryptography
- Data Structures
- Scheduling
- Machine Learning
- Parsing
- Simulation

Each catalog item has an identifier, display name, category, description, and `.ndf` source representation. The IDE converts these entries into virtual files under `algorithms/<category>/<algorithm>.ndf`, so they can be opened, edited, analyzed, executed, and passed through the existing code-generation pipeline.

The regression suite verifies the exact count, unique IDs/paths, and presence of NDF function fixtures.
