
<script setup>

import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { myRoutes } from './route.js';
import { countiesArr } from './County';

const router = useRouter();

onMounted(() => {
	let r = Math.floor(Math.random() * countiesArr.length);
	let randomCounty = countiesArr[r];
	let obj = {name: myRoutes.mainInfo.name, params: {n2: randomCounty['n2']}};
	router.replace(obj);
});
</script>


<template>
</template>