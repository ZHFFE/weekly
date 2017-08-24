import Vue from 'vue'
import Router from 'vue-router'
import Summary from '../components/summary.vue'
import WeekDesc from '../components/weekDesc.vue'
import WeekAdd from '../components/weekAdd.vue'
Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			component: Summary
		},
		{
			path: '/week',
			component: WeekDesc
		},
		{
			path: '/add',
			component: WeekAdd
		}
	]
})
