import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL;

export default defineConfig({
  ...(site ? { site } : {}),
  trailingSlash: "always",
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: site ? [sitemap()] : [],
});
