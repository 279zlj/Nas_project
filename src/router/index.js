import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import bar from '@/components/common/bar'
import system from '@/components/system_manager/system'
import user from '@/components/user_manager/user/user'
import network from '@/components/network_manager/network'
import bond from '@/components/network_manager/bond'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/system',
            name: 'system',
            components: {
                default: bar,
                content: system
            }
        }, ,
        {
            path: '/user',
            name: 'user',
            components: {
                default: bar,
                content: user
            }
        },
        {
            path: '/network',
            name: 'network',
            components: {
                default: bar,
                content: network
            }
        },
        {
            path: '/bond',
            name: 'bond',
            components: {
                default: bar,
                content: bond
            }
        }
    ]
})