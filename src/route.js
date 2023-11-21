
import { createRouter, createWebHistory } from 'vue-router';

import Home from './Home.vue';
import MainInfo from './MainInfo.vue';
import NotFound from './NotFound.vue';

const myRoutes = {
	home: {name: 'home'},
	mainInfo: {name: 'mainInfo'},
	notFound: {name: 'notFound'},
	notFound404: {name: 'notFound404'},
};

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ 
			path: '/', 
			// name: 'home', 
			name: myRoutes.home.name,
			component: Home, 
		},
		{ 
			path: '/of/:n2', 
			// name: 'mainInfo',
			name: myRoutes.mainInfo.name, 
			component: MainInfo, 
		},
		{
			path: '/notFound',
			// name: 'notFound404',
			name: myRoutes.notFound404.name,
			component: NotFound,
		},
		{ 
			path: '/:pathMatch(.*)*', 
			// name: 'notFound', 
			name: myRoutes.notFound.name,
			component: NotFound,
		},
	],
});

export { router, myRoutes };
