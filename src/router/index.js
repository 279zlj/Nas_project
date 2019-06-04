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
import gateway from '@/components/network_manager/gateway/gateway'
import lv from '@/components/storage_manager/lv_manager/lv'
import nfs from '@/components/sharing_manager/nfs_manager/nfs'
import smb from '@/components/sharing_manager/smb_manager/smb'
import afp from '@/components/sharing_manager/afp_manager/afp'
import pool from '@/components/storage_manager/pool/pool'
import iscsi from '@/components/sharing_manager/iSCSI_manager/iSCSI'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: Login,
            meta: { requiresAuth: true }
        },
        {
            path: '/system',
            name: 'system',
            components: {
                default: bar,
                content: system
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/user',
            name: 'user',
            components: {
                default: bar,
                content: user
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/network',
            name: 'network',
            components: {
                default: bar,
                content: network
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/bond',
            name: 'bond',
            components: {
                default: bar,
                content: bond
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/disk',
            name: 'disk',
            components: {
                default: bar,
                content: disk
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/raid',
            name: 'raid',
            components: {
                default: bar,
                content: raid
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/group',
            name: 'group',
            components: {
                default: bar,
                content: group
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/gateway',
            name: 'gateway',
            components: {
                default: bar,
                content: gateway
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/lv',
            name: 'lv',
            components: {
                default: bar,
                content: lv
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/nfs',
            name: 'nfs',
            components: {
                default: bar,
                content: nfs
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/smb',
            name: 'smb',
            components: {
                default: bar,
                content: smb
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/afp',
            name: 'afp',
            components: {
                default: bar,
                content: afp
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/pool',
            name: 'pool',
            components: {
                default: bar,
                content: pool
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/iscsi',
            name: 'iscsi',
            components: {
                default: bar,
                content: iscsi
            },
            meta: { requiresAuth: true }
        }
    ]
})