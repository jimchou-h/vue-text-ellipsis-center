import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base:
    process.env.NODE_ENV === "production" ? "/vue-text-ellipsis-center/" : "/",
  plugins: [vue()],
  server: {
    port: 5000,
  },
});
