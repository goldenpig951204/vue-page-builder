import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
	mode: 'history',
	routes: [
    {
    	path: '/',
    	component: App,
    },
    {
        path: '/builder',
        component: App,
    },
    {
    	path: '/preview',
    	component: App,
    }
  ]
})
new Vue({ // eslint-disable-line no-new
  router
}).$mount('#app')
