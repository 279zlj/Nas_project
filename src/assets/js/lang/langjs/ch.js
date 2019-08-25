import zhLocale from 'element-ui/lib/locale/lang/zh-CN' //引入element语言包
const cn = {
    message: {
        'Welcome': '欢迎使用！',
        'sysname': '五舟NAS存储系统',
        'system': '关于我们',
        'sysinfo': '系统信息',
        'account': '账号管理',
        'group': '组管理',
        'user': '用户管理',
        'network': '网络管理',
        'gateway': '网关配置',
        'net_setting': '网卡设置',
        'bond': '聚合管理',
        'storage': '存储管理',
        'pool': '存储池',
        'sysdisk': '存储磁盘',
        'diskuse': '磁盘使用率',
        'net': '网络概览',
        'dd': '磁盘概览',
        'sent': '发送',
        'recv': '接收',
        'read': '读速度',
        'write': '写速度',
        'disk': '磁盘',
        'logical': '逻辑卷管理',
        'softraid': '软阵列管理',
        'hardraid': '硬阵列管理',
        'diskMgr': '阵列管理',
        'sharing': '共享管理',
        'input': '请选择共享目录',
        'external': '外部存储管理',
        'file': '文件共享',
        'share_file': '共享目录',
        'block': '块级存储',
        'change': '语言',
        'cha': '中文',
        'eng': '英语',
        'exit': '退出',
        'logout': '登出账号',
        'sure': '确定',
        'cancel': '取消',
        'add': '添加',
        'failed': '操作失败',
        'success': '操作成功',
        'delete': '删除',
        'submit': '提交',
        'reset': '重置',
        'oper': '操作',
        'modify': '修改',
        'state': '状态',
        'note': '说明',
        'expend': '扩容',
        'size': '大小',
        'uint': '单位',
        'management': '管理',
        'service': '服务',
        'user': '用户',
        'open': '开',
        'close': '关',
        'author': '授权信息',
        'authorcode': '授权码',
        'authortime': '授权时长',
        'warn': '警告',
        'authorerror': '授权已过期,请联系工作人员',
        'opr': '更多操作',
        'tips': '提示',
        'select': '请选择逻辑卷'
    },
    sys: {
        'basic': '基础信息',
        'version': '版本',
        'model': '型号',
        'suppliers': '供应商',
        'hardware': '硬件信息',
        'kernel': '内核',
        'board': '主板',
        'cpu': 'CPU型号',
        'cpu_used': '数据处理器利用率',
        'mem_used': '缓存利用率',
        'modify': '修改'
    },
    group: {
        'name': '组名',
        'id': '组ID',
        'new': '新建组',
        'input1': '请输入组名',
        'delete': '删除组',
        'Attribution': '归属组',
        'input': '请选择归属组',
        'input2': '请输入长度大于3的组名'
    },
    user: {
        'name': '用户名',
        'id': '用户ID',
        'type': '类型',
        'new': '新增用户',
        'new_pass': '新密码',
        'confirm': '确认密码',
        'u_type': '用户类型',
        'sys': '系统用户',
        'smb': 'SMB用户',
        'afp': 'AFP用户',
        'ftp': 'FTP用户',
        'sftp': 'SFTP用户',
        'modify': '修改用户',
        'old': '旧密码',
        'cancel': '删除用户',
        'input': '请输入新密码',
        'input2': '请再次输入新密码',
        'input3': '请选择用户类型',
        'input4': '请输入旧密码',
        'input5': '两次输入密码不一致',
        'muser': '修改密码',
        'mgroup': '修改归属组',
        'reg': '用户名不能包含特殊字符'
    },
    gateway: {
        'interface': '网关接口',
        'ip': '网关地址',
        'modify': '修改网关',
        'create': '创建网关',
        'input': '请输入网关地址',
        'input1': '请输入正确的网关地址',
        'select': '请选择网口',
        'iface': '当前网口',
        'mode': '模式',
        'port': '端口'
    },
    network: {
        'interface': '网口',
        'ip': 'IP地址',
        'mask': '子网掩码',
        'mac': '通/断',
        'dns': 'DNS',
        'modify': '修改网络',
        'Speed': '网速',
        'input': '请输入正确的IP地址',
        'input1': '请输入mask地址',
        'input2': '请输入正确的mask地址',
        'input3': '请输入正确的DNS地址'
    },
    pool: {
        'name': '名称',
        'capacity': '容量',
        'new': '新建存储池',
        'input': '请输入名称',
        'input1': '请输入长度至少为3的名称',
        'select1': '请选择磁盘',
        'disk': '物理磁盘',
        'select': '可选磁盘',
        'alaway': '已选磁盘',
        'expend': '存储池扩容',
        'delete': '删除存储池',
        'sele': '选择磁盘扩容'
    },
    disk: {
        'name': '名称',
        'used': '使用状态',
        'format': '是否已格式化',
        'capacity': '容量',
        'addspare': '增加热备盘',
        'delspare': '移除热备盘',
        'select': '所选磁盘',
        'type': '请选择类型',
        'global': '全局热备',
        'local': '局部热备',
        'raid': '选择阵列ID',
        'inter': '接口速率',
    },
    lv: {
        'name': '名称',
        'pool': '存储池',
        'path': '路径',
        'capacity': '容量',
        'new': '新增逻辑卷',
        'input': '请输入逻辑卷名称',
        'input1': '请选择存储池',
        'input2': '请输入容量大小',
        'input3': '请选择容量单位',
        'pool_ca': '存储池总容量',
        'now': '当前大小',
        'avli': '可用容量',
        'e_size': '扩容大小',
        'e_uint': '扩容单位',
        'input4': '请输入扩容大小',
        'input5': '请选择扩容单位',
        'delete': '删除逻辑卷'
    },
    raid: {
        'can': '可移除磁盘',
        'name': '名称',
        'level': '级别',
        'chunk': '数据块',
        'all': '磁盘总数',
        'spare': '热备磁盘数',
        'active': '激活磁盘数',
        'working': '工作磁盘数',
        'failed': '损坏磁盘数',
        'new': '新建阵列',
        'select': '请选择级别',
        'select2': '请选择数据块',
        'select3': '请选择数据盘',
        'ddisk': '数据盘',
        'ddisks': '热备盘',
        'disk1': '可选磁盘',
        'disk2': '已选磁盘',
        'delete': '删除阵列',
        'use': '使用磁盘',
        'detail': '查看详情',
        'gps': '定位',
        'stopgps': '停止定位',
        'Positioning': '定位磁盘',
        'stop': '停止定位',
        'successadd': '成功添加热备盘',
        'diskraid': '磁盘阵列',
        'select4': '初始化方式',
        'select5': '请选择初始化方式',
        'notinit': '不初始化',
        'quit': '快速初始化',
        'all': '全部初始化',
        'read': '读策略',
        'select6': '请选择读策略',
        'ss': '预读',
        'ss1': '不预读',
        'write': '写策略',
        'select7': '请选择写策略',
        'select8': '请选择RAID级别',
        'aa': '写回',
        'aa1': '有BBU时写回',
        'aa2': '写通',
        'input': '请选择磁盘阵列',
    },
    raidMgr: {
        'alarm': '警报状态',
        'global': '全局设置',
        'start': '启用报警',
        'stop': '停止报警',
        'check': '校验/镜像容量',
        'set': '配置RAID',
        'startinit': '开始初始化',
        'stopinit': '停止初始化',
        'srebuild': '开始重建',
        'stopreb': '停止重建',
        'delraid': '删除RAID',
        'rebuild': '重建',
        'bad': '损坏磁盘',
        'replace': '替换磁盘',
        'startgood': '开始进行Make good操作',
        'source': '资源占比'
    },
    nfs: {
        'path': '路径',
        'per': '权限',
        'ok': '可访问网段',
        'new': '新增NFS',
        'p_name': '路径名称',
        'input': '请输入路径名称',
        'input1': '请选择配置权限',
        'inout2': '请输入长度超过3的路径名称',
        'input3': '请输入网段',
        'input4': '请输入正确的ip网段',
        'input5': '请选择权限',
        'input6': '请选择共享目录',
        'write': '只读',
        'read': '读写',
        'reli': '可靠网段',
        'delete': '删除NFS',
        'note': '注意：多个网段需要用","分割'
    },
    smb: {
        'name': '名称',
        'path': '路径',
        'not': '是否允许匿名访问',
        'new': '新增SMB',
        'p_name': '路径名称',
        'user': '用户',
        'write': '只读',
        'read': '读写',
        'input': '请输入名称',
        'input1': '请输入路径名称',
        'input2': '请选择用户',
        'input3': '请输入长度超过2的名称',
        'per': '权限',
        'gest': '游客访问',
        'delete': '删除SMB'
    },
    afp: {
        'name': '名称',
        'path': '路径',
        'new': '新增AFP',
        'p_name': '路径名称',
        'user': '用户',
        'input': '请输入名称',
        'input1': '请输入路径名称',
        'input2': '请选择用户',
        'delte': '删除AFP'
    },
    iscsi: {
        'name': '逻辑单元名称',
        'path': '逻辑单元路径',
        'size': '逻辑单元大小',
        'per': '权限',
        'new': '创建iSCSI',
        'input': '请输入iqn',
        'gateway': '网关',
        'input1': '请输入网关',
        'port': '请输入端口号',
        'uint': '逻辑单元类型',
        'select': '请选择逻辑单元类型',
        'select1': '请选择逻辑单元',
        'input2': '请输入长度少于7的IQN',
        'logic': '逻辑卷',
        'disk': '磁盘',
        'dy': '逻辑单元',
        'sele1': '可选逻辑卷',
        'sele2': '已选逻辑卷',
        'disk1': '可选磁盘',
        'disk2': '已选磁盘',
        'delete': '删除iSCSI'
    },
    bond: {
        'bond': '聚合',
        'unbond': '解聚',
        'netbond': '网络聚合',
        'select': '选择聚合网卡',
        'model': '聚合模式',
        'select1': '可选网卡',
        'select2': '已选网卡',
        'select3': '请选择聚合模式',
        'model1': '平衡负载模式',
        'model2': '自动备援模式',
        'model3': '平衡负载模式(6)',
        'delete': '确认解聚',
        'ip': '请输入ip地址',
        'input1': '请选择网卡',
        'input2': '请选择两个以上网卡进行聚合'
    },
    rbd: {
        'name': '名称',
        'pool': '外部存储池',
        'device': '映射磁盘',
        'target': '挂载目录',
        'map': '映射',
        'unmap': '解除映射'
    },
    ...zhLocale
}

export default cn;