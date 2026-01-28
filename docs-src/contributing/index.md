---
layout: _layouts._doc.html
title: How to Contribute
description: Contributing to jstatico
currentPath: /contributing/
---

Thanks for your interest in contributing to jstatico!

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies with Bun

```bash
git clone https://github.com/YOUR_USERNAME/jstatico.git
cd jstatico
bun install
```

## Development

Run tests:

```bash
bun test
```

Type check:

```bash
bun run typecheck
```

Build the test site:

```bash
bun run src/cli.ts test/src test/output
```

## Test Structure

Tests compare output against `test/reference/`:

```
test/
├── src/           # Test input site
├── reference/     # Expected output
└── jstatico.test.ts
```

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Run tests to ensure nothing broke
4. Submit a pull request

## Code Style

- TypeScript with strict mode
- Functional style preferred
- Keep it simple - avoid over-abstraction

## Questions?

Open an issue on [GitHub](https://github.com/egeozcan/jstatico/issues).
