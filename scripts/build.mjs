import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ["index.html", "styles", "src", "assets"]) {
  await cp(resolve(root, name), resolve(output, name), { recursive: true });
}
// data: ship only the runtime scene file (scene-master-extended.json is a dev-time QA source)
await cp(resolve(root, "data", "scenes.js"), resolve(output, "data", "scenes.js"));
console.log(`Cloudflare Pages output prepared at ${output}`);
