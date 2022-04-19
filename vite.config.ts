import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
	root: "./src",
	publicDir: "./src/extension/public",
	build: {
		outDir: "../build-extension",
		rollupOptions: {
			input: {
				popup: "./src/extension/popup.html",
			},
		},
	},
	plugins: [
		react(),
		copy({
			targets: [
				{
					src: "./src/extension/manifest.json",
					dest: "./build-extension",
				},
			],
			hook: "writeBundle",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
