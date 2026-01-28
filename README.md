jstatico
==========================
As simple as static web site generation gets.

Creates a JSON tree from a directory, applies built-in filters (Markdown, Nunjucks templating, syntax highlighting), and outputs to a destination directory.

## Requirements

- [Bun](https://bun.sh) runtime

## Installation

    bun install jstatico

## Usage

    jstatico /path/to/inputDirectory /path/to/outputDirectory

## Development

Run tests:

    bun test

Type check:

    bun run typecheck

That's it!

I use this to generate egeozcan.com

An example site is included. See the folder named "test".

TODO
----
* Add support for custom processors and preprocessors
* Add documentation for custom generators (example available in test/src/blog)

License: MIT
