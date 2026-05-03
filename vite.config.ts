import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  define: {
    // Thêm dòng này để fix lỗi ReferenceError: global is not defined của SockJS
    global: "window",
  },
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
});
