
# Development Steps

------------------------------------------------------------

Start with `npm init` to have a `package.json`.

Check and install npm packages:

```
npm list
npm install vite --save-dev
npm install vue --save
npm install @vitejs/plugin-vue --save-dev
```

Create file `.gitignore`:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

/cypress/videos/
/cypress/screenshots/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

Create file `vite.config.js`:

```
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [
		vue(),
	]
});
```

Create file `index.html`

Create folder `src`

Create file `src/main.js`

Create file `src/App.vue`

------------------------------------------------------------

Get a map of Taiwan (SVG format) into the first page, and make it be sized appropriately.

Add Bootstrap to simplify RWD:

```
npm install @popperjs/core --save
npm install bootstrap --save
```

------------------------------------------------------------

Prepare functions to parse data.

------------------------------------------------------------

Extract cwa authorization to a single file `/auth/Authorization.js`, and add that file to `.gitignore`.

------------------------------------------------------------

Add date-fns to simplify date processing:

```
npm install date-fns --save
```

------------------------------------------------------------

Add fontawesome (icon):

```
npm install @fortawesome/fontawesome-svg-core --save
npm install @fortawesome/free-solid-svg-icons --save
npm install @fortawesome/free-regular-svg-icons --save
npm install @fortawesome/vue-fontawesome@latest-3 --save
```

docs:
*	https://fontawesome.com/docs/web/use-with/vue/
*	https://fontawesome.com/docs/web/use-with/vue/add-icons

------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------

(to be continued)

------------------------------------------------------------
(end)

