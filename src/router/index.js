import Vue from 'vue'
import Router from 'vue-router'
import bar from '@/components/common/bar'
import headerBar from '@/components/common/headerBar'
import { readFile } from 'fs';

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: () =>
                import ('../components/Login'),
            meta: { requiresAuth: true }
        },
        {
            path: '/system',
            name: 'system',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/system_manager/system.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/user',
            name: 'user',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/user_manager/user/user.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/network',
            name: 'network',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/network_manager/network.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/bond',
            name: 'bond',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/network_manager/bond.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/sysdisk',
            name: 'sysdisk',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/storage_manager/disk.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/rbd',
            name: 'rbd',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/storage_manager/rbd/rbd.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/raid',
            name: 'raid',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/raid_manager/raid.vue')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/group',
            name: 'group',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/user_manager/group/group')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/gateway',
            name: 'gateway',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/network_manager/gateway/gateway')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/lv',
            name: 'lv',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/storage_manager/lv_manager/lv')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/ftp',
            name: 'ftp',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/sharing_manager/ftp_manager/ftp'),
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/nfs',
            name: 'nfs',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/sharing_manager/nfs_manager/nfs')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/smb',
            name: 'smb',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/sharing_manager/smb_manager/smb')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/afp',
            name: 'afp',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/sharing_manager/afp_manager/afp')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/pool',
            name: 'pool',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/storage_manager/pool/pool')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/iscsi',
            name: 'iscsi',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/sharing_manager/iSCSI_manager/iSCSI')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/raiddisk',
            name: 'raiddisk',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/hard_raid/raidMgr')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/diskMgr',
            name: 'diskMgr',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/hard_raid/hard_disk')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/back',
            name: 'back',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/backup/oracle/back')
            },
            meta: { requiresAuth: true }
        },
        {
            path: '/rfile',
            name: 'rfile',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/backup/rfile/rfile')
            }
        },
        {
            path: '/myback',
            name: 'myback',
            components: {
                top: headerBar,
                aside: bar,
                content: () =>
                    import ('../components/backup/mysql/mysql')
            }
        },
        {
            path: '*',
            name: '*',
            component: () =>
                import ('../components/common/Error')
        },

    ]
})