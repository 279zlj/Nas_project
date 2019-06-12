// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import i18n from '@/assets/js/lang/lang';
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import '@/assets/js/jquery-3.3.1.min'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/icon/iconfont.css'
import axios from 'axios'
import echarts from 'echarts'
import { Verify } from 'crypto';

Vue.config.productionTip = false
Vue.use(Element)

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$host = 'http://14.18.153.83:5678/'
Vue.prototype.ip = '192.168.5.33:8000'
Vue.prototype.ceph = 'http://192.168.5.33:8001/'
    // Vue.prototype.$host = 'http://' + location.hostname + ':8000/'
    // Vue.prototype.ip = location.hostname + ':8000'
    // Vue.prototype.ip = location.hostname + ':8001'

router.beforeEach((to, from, next) => { // 路由守卫
    if (to.meta.requiresAuth) {
        var name = sessionStorage.getItem('loginname');
        if (name) {
            next();
        } else {
            next();
        }
    } else {
        next();
    }
    if (from.name == 'Login' && name == null || from.name == '*' && name == null) {
        next('/')
    }
    if (to.name == 'Login' && name || from.name == '*' && name) {
        sessionStorage.removeItem('loginname')
        next('/')
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    axios,
    i18n,
    echarts,
    components: { App },
    template: '<App/>'
})()