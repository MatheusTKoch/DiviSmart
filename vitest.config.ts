import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/DiviSmart/",
  test: {
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,ts,vue}"],
      exclude: ["src/server.js", "src/scripts/run-*.js"],
    },
  },
});
