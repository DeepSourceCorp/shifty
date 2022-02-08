import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    name: "shifty",
    entry: ["src/shifty.ts"],
    minify: !options.watch,
    format: ["cjs", "esm"],
    platform: "browser",
    splitting: false,
    sourcemap: true,
    clean: true,
  };
});
