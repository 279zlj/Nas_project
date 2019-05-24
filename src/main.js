// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import '@/assets/js/jquery-3.3.1.min'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/icon/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(Element)
Vue.prototype.$axios = axios
Vue.prototype.$host = 'http://192.168.5.35:8000/api/'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    axios,
    components: { App },
    template: '<App/>'
})