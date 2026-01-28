---
layout: _layouts._doc.html
title: API Reference Overview
description: Complete API reference for jstatico
currentPath: /api/
---

jstatico can be used via CLI or programmatically.

## CLI

Run jstatico from the command line:

```bash
jstatico <source> <destination>
```

See [CLI Reference](/jstatico/api/cli/) for details.

## Programmatic

Use jstatico in your Node.js/Bun scripts:

```typescript
import { generate } from 'jstatico';

await generate('src', 'dist');
```

See [Programmatic API](/jstatico/api/programmatic/) for the full API.
