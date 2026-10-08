import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ["index.html", "styles", "src", "data"]) {
  await cp(resolve(root, name), resolve(output, name), { recursive: true });
}
console.log(`Cloudflare Pages output prepared at ${output}`);
