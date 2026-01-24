#!/usr/bin/env bun

import { resolve } from "path";
import { generate } from "./index";

const homePath = resolve(process.argv[2] || "./");
const destinationPath = resolve(process.argv[3] || "../output");

await generate(homePath, destinationPath);
