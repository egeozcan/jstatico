---
layout: _layouts._doc.html
title: Installation
description: How to install jstatico
currentPath: /getting-started/
---

jstatico requires [Bun](https://bun.sh) as its runtime.

## Install Bun

If you don't have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Install jstatico

### As a project dependency

```bash
bun add jstatico
```

### Globally

```bash
bun add -g jstatico
```

## Verify Installation

```bash
bun run jstatico --help
```

You should see the usage information.

## Next Steps

Continue to [Quick Start](/jstatico/getting-started/quick-start/) to create your first site.
