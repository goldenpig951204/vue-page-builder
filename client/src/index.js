import Vue from 'vue'
import 'vue-resize/dist/vue-resize.css'
import App from './App.vue'
import slider from './components/slider.vue'
import toast from './components/toast.vue'
import uploader from './components/uploader.vue'
import popbox from './components/popbox.vue'
import icon from './components/icon.vue'
import './app.scss'
import VueResize from 'vue-resize'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(VueResize)
window.$ = require('jquery')
// Global registration component
Vue.component('slider', slider)
Vue.component('toast', toast)
Vue.component('uploader', uploader)
Vue.component('popbox', popbox)
Vue.component('icon', icon)
export default App
