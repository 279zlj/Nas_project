import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import bar from '@/components/common/bar'
import system from '@/components/system_manager/system'
import user from '@/components/user_manager/user/user'
import network from '@/components/network_manager/network'
import bond from '@/components/network_manager/bond'
import disk from '@/components/storage_manager/disk'
import raid from '@/components/raid_manager/raid'
import group from '@/components/user_manager/group/group'

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
        },
        {
            path: '/disk',
            name: 'disk',
            components: {
                default: bar,
                content: disk
            }
        },
        {
            path: '/raid',
            name: 'raid',
            components: {
                default: bar,
                content: raid
            }
        },
        {
            path: '/group',
            name: 'group',
            components: {
                default: bar,
                content: group
            }
        }
    ]
})