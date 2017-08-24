// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueResource from 'vue-resource'
//import VueHighcharts from 'vue-highcharts';
import iView from 'iview'
import './assets/css/common.less'
import 'iview/dist/styles/iview.css'

Vue.config.debug = true;
Vue.config.productionTip = false

//Vue.use(VueHighcharts);
Vue.use(vueResource);
Vue.use(iView);

/* eslint-disable no-new */
/*new Vue({
 el: '#app',
 router,
 template: '<App/>',
 components: { App }
 })*/
new Vue({

	router: router,
	render: h => h(App)
}).$mount('#app');
