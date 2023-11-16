import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			// 哪些檔案是「測試程式」
			include: ['**/*.test.js'],
			// 是否global自動引入測試所需指令/function (ex: describe, it, expect ... etc)
			globals: true,
		},
	}),
);


