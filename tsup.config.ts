import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: { index: "src/shifty.ts" },
    minify: false,
    target: "ES2021",
    format: ["cjs", "esm"],
    splitting: false,
    dts: true,
    sourcemap: true,
    clean: true,
  };
});
