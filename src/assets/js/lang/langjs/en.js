import enLocale from 'element-ui/lib/locale/lang/en' //引入element语言包
const en = {
    message: {
        'Welcome': 'Welcome to use！',
        'sysname': 'PextSan',
        'system': 'About us',
        'sysinfo': 'System message',
        'account': 'Account Management',
        'group': 'Group Management',
        'user': 'User Management',
        'network': 'Network management',
        'gateway': 'Gateway Configuration',
        'net_setting': 'Network settings',
        'bond': 'Bond Management',
        'storage': 'Storage Management',
        'pool': 'Pool',
        'sysdisk': 'Storage disk',
        'diskuse': 'Disk usage',
        'net': 'Network overview',
        'dd': 'Disk overview',
        'sent': 'Send',
        'recv': 'Receive',
        'read': 'Reading speed',
        'write': 'Write speed',
        'disk': 'Disk',
        'logical': 'Logical Volume',
        'softraid': 'Raid management',
        'hardraid': 'Array card management',
        'diskMgr': 'Array management',
        'sharing': 'Shared management',
        'input': 'Please select a shared directory',
        'external': 'External storage',
        'file': 'File sharing',
        'share_file': 'Shared Directories',
        'block': 'Block-level',
        'change': 'Lang',
        'cha': 'Chinese',
        'eng': 'English',
        'exit': 'Exit',
        'logout': 'Log out of your account',
        'sure': 'Sure',
        'cancel': 'Cancel',
        'add': 'Add',
        'failed': 'Operation failed',
        'success': 'Operation succeeded',
        'delete': 'Delete',
        'submit': 'Submit',
        'reset': 'Reset',
        'oper': 'Operation',
        'modify': 'Modify',
        'state': 'State',
        'note': 'Note',
        'expend': 'Expansion',
        'size': 'Size',
        'uint': 'Unit',
        'management': 'Management',
        'service': 'Service',
        'user': 'Users',
        'open': 'Open',
        'close': 'Close',
        'author': 'Authorization information',
        'authorcode': 'Authorization code',
        'authortime': 'Authorization duration',
        'warn': 'Warning',
        'authorerror': 'Authorization has expired, please contact the staff',
        'opr': 'operating',
        'tips': 'Tips',
        'select': 'Please select a logical volume',
        'notice': 'Notification mailbox',
        'setemail': 'Set notification mailbox',
        'email': 'Email',
        'inpute': 'Please input the email address',
        'inpute1': 'Please input the correct email address',
        'tech': 'Technical Support',
        'backup': 'Backup management',
        'sqlback': 'Database backup',
        'fileback': 'File backup',
        'timing': 'Scheduled backup list',
        'taskname': 'File name',
        'create': 'Creation time',
        'backtype': 'Backup type'
    },
    sys: {
        'basic': 'Basic information',
        'version': 'Version',
        'model': 'Model',
        'suppliers': 'Suppliers',
        'hardware': 'Hardware information',
        'kernel': 'Kernel',
        'board': 'Board',
        'cpu': 'CPU Models',
        'cpu_used': 'Data processor utilization',
        'mem_used': 'Cache utilization'
    },
    group: {
        'name': 'name',
        'id': 'ID',
        'new': 'Create a new group',
        'input1': 'Please enter a group name',
        'delete': 'To delete a group',
        'Attribution': 'Attribution group',
        'input': 'Please select a home group',
        'input2': 'Please enter a group name with a length greater than 3'
    },
    user: {
        'name': 'Username',
        'id': 'ID',
        'type': 'Type',
        'new': 'New users',
        'new_pass': 'New password',
        'confirm': 'Confirm Password',
        'u_type': 'User type',
        'sys': 'System users',
        'smb': 'SMB Users',
        'afp': 'AFP Users',
        'ftp': 'FTP Users',
        'sftp': 'SFTP Users',
        'modify': 'Modify a user',
        'old': 'Old Password',
        'cancel': 'Deleting a user',
        'input': 'Please enter a new password',
        'input2': 'Please enter your new password again',
        'input3': 'Please select a user type',
        'input4': 'Please enter your old password',
        'input5': 'Inconsistent input password twice',
        'muser': 'Change Password',
        'mgroup': 'Modify the attribution group',
        'reg': 'Please do not include special characters and Chinese, except for underscores',
        'reg1': 'Please do not include special characters, except for underscores',
        'nouser': "No users can't use"
    },
    gateway: {
        'interface': 'Gateway Interface',
        'ip': 'Gateway Address',
        'modify': 'Modifying the Gateway',
        'create': 'Create a gateway',
        'input': 'Please enter the gateway address',
        'input1': 'Please enter the correct gateway address',
        'select': 'Please select the network port',
        'iface': 'Current network port',
        'mode': 'Mode',
        'port': 'Port'
    },
    network: {
        'interface': 'interface',
        'ip': 'IP Address',
        'mask': 'Mask',
        'mac': 'Network cable',
        'dns': 'DNS',
        'modify': 'Modify the Network',
        'Speed': 'Speed',
        'input': 'Please enter the correct IP address',
        'input1': 'Please enter the mask address',
        'input2': 'Please enter the correct mask address',
        'input3': 'Please enter the correct dns address'
    },
    pool: {
        'name': 'Name',
        'capacity': 'Capacity',
        'new': 'Create a new storage pool',
        'input': 'Please enter a name',
        'disk': 'Physical Disk',
        'select': 'Optional disks',
        'input1': 'Please enter a name with a length of at least 3.',
        'select1': 'Please select a disk',
        'alaway': 'Selected disks',
        'expend': 'Storage Pool Expansion',
        'delete': 'Deleting a storage pool',
        'sele': 'Select disk Expansion'
    },
    disk: {
        'name': 'Name',
        'used': 'Usage status',
        'format': 'Formatted or not',
        'capacity': 'Capacity',
        'addspare': 'Increase hot spare disk',
        'delspare': 'Remove hot spare',

        'select': 'Selected disk',
        'type': 'Please choose the type',
        'global': 'Global hot standby',
        'local': 'Local hot standby',
        'raid': 'Select array ID',
        'inter': 'Interface rate',
    },
    lv: {
        'name': 'Name',
        'pool': 'Pool',
        'path': 'Path',
        'capacity': 'Capacity',
        'new': 'New logical Volumes',
        'input': 'Please enter a logical volume name',
        'input1': 'Please select a storage pool',
        'input2': 'Please enter the capacity size',
        'input3': 'Please select a capacity unit',
        'pool_ca': 'Total Storage Pool Capacity',
        'now': 'Current size',
        'avli': 'Available capacity',
        'e_size': 'Expansion size',
        'e_uint': 'Expansion Unit',
        'input4': 'Please enter the expansion size',
        'input5': 'Please select the expansion unit',
        'delete': 'Delete logical Volumes'
    },
    raid: {
        'can': 'Removable disk',
        'name': 'Name',
        'level': 'Level',
        'chunk': 'Chunk',
        'all': 'Total',
        'spare': 'Hot standby',
        'active': 'active',
        'working': 'working',
        'failed': 'corrupted',
        'new': 'Create a new array',
        'select': 'Please select a level',
        'select2': 'Please select a block of data',
        'select3': 'Please select the data disk',
        'ddisk': 'Data disk',
        'ddisks': 'Hot Spare',
        'disk1': 'Optional disks',
        'disk2': 'Selected disks',
        'delete': 'Deleting an array',
        'use': 'Use disk',
        'detail': 'See more',
        'gps': 'Positioning',
        'stopgps': 'Stop positioning',
        'Positioning': 'Positioning disk',
        'stop': 'Stop positioning',
        'successadd': 'Successfully added hot spare disk',
        'diskraid': 'Disk Array',
        'select4': 'Initialization method',
        'select5': 'Please select the initialization method',
        'notinit': 'Not initialized',
        'quit': 'Fast initialization',
        'all': 'Initialize all',
        'read': 'Reading strategy',
        'select6': 'Please select a reading strategy',
        'ss': 'Read ahead',
        'ss1': 'Not pre-read',
        'write': 'Write strategy',
        'select7': 'Please choose a write strategy',
        'select8': 'Please select a RAID level',
        'aa': 'Write back',
        'aa1': 'Write back when there is a BBU',
        'aa2': 'Write through',
        'input': 'Please select a disk array',
        'select6': 'Please select the array ID',
        'select7': 'Please select the hot spare type'
    },
    raidMgr: {
        'alarm': 'Alarm status',
        'global': 'Global Settings',
        'start': 'Enable alarm',
        'stop': 'Stop alarm',
        'check': 'Verify/mirror capacity',
        'set': 'Configuring RAID',
        'startinit': 'Start initialization',
        'stopinit': 'Stop initialization',
        'srebuild': 'Start rebuilding',
        'stopreb': 'Stop rebuilding',
        'delraid': 'Delete RAID',
        'rebuild': 'reconstruction',
        'bad': 'Damaged disk',
        'replace': 'Replace disk',
        'startgood': 'Start the Make good operation',
        'source': 'Ratio of resources'
    },
    nfs: {
        'path': 'Path',
        'per': 'Permissions',
        'ok': 'Accessible network segments',
        'new': 'New NFS',
        'p_name': 'Path name',
        'input': 'Please enter a path name',
        'input1': 'Please select configuration permissions',
        'input2': 'Please enter a path name longer than 3',
        'input3': 'Please enter the network segment',
        'input4': 'Please enter the correct ip network segment',
        'input5': 'Please select permission',
        'input6': 'Please select a shared directory',
        'write': 'Read-only',
        'read': 'Write-Read',
        'reli': 'Reliable Mesh Segment',
        'delete': 'Delete NFS',
        'note': 'Note: multiple network segments require  ", " split'
    },
    smb: {
        'name': 'Name',
        'path': 'Path',
        'not': 'Whether anonymous access',
        'new': 'Add SMB',
        'p_name': 'Path name',
        'user': 'Username',
        'write': 'Read-only',
        'read': 'Write-Read',
        'input': 'Please enter a name',
        'input1': 'Please enter a path name',
        'input2': 'Please select a user',
        'input3': 'Please enter a name longer than 2',
        'per': 'Permissions',
        'gest': 'Visitor visits',
        'delete': 'Delete SMB'
    },
    afp: {
        'name': 'Name',
        'path': 'Path',
        'new': 'Added AFP',
        'p_name': 'Path name',
        'user': 'Username',
        'input': 'Please enter a name',
        'input1': 'Please enter a path name',
        'input2': 'Please select a user',
        'delte': 'Remove AFP'
    },
    iscsi: {
        'name': 'Logical Unit Name',
        'path': 'Logical Unit Path',
        'size': 'Logical unit size',
        'per': 'Permissions',
        'new': 'Creating iSCSI',
        'input': 'Please enter IQN',
        'gateway': 'Gateway',
        'input1': 'Please enter the Gateway',
        'port': 'Please enter the port slogan',
        'uint': 'Logical Unit Type',
        'select': 'Please select a logical unit type',
        'select1': 'Please select a logical unit',
        'input2': 'Please enter an IQN less than 7 in length',
        'logic': 'Logical volumes',
        'disk': 'Disk',
        'dy': 'Logical Unit',
        'sele1': 'Optional volumes',
        'sele2': 'Selected Volumes',
        'disk1': 'Optional disks',
        'disk2': 'Selected disks',
        'delete': 'Remove iSCSI'
    },
    bond: {
        'bond': 'Bond',
        'unbond': 'Unbond',
        'netbond': 'Network bond',
        'select': 'Select Network card',
        'model': 'Mode',
        'select1': 'Optional net-card',
        'select2': 'Selected net-cards',
        'select3': 'Please select mode',
        'model1': 'Balancing Load Mode',
        'model2': 'Auto Standby mode',
        'model3': 'Balancing Load Mode(6)',
        'delete': 'Confirm the solution',
        'ip': 'Please enter the ip address',
        'input1': 'Please select a network card',
        'input2': 'Please select two to aggregate with the network card'
    },
    rbd: {
        'name': 'Name',
        'pool': 'External Storage Pool',
        'device': 'Mapping disks',
        'target': 'Mount Catalog',
        'map': 'Map',
        'unmap': 'Unmap'
    },
    global: {
        'rebuild': 'Disk reconstruction（%）',
        'check': 'Disk detection（%）',
        'init': 'RAID background initialization（%）',
        'consisten': 'RAID data consistency check',
        'num': 'RAID data reconstruction（%）',
        'input1': 'Please enter the percentage of disk rebuild resources',
        'input2': 'Please enter the percentage of disk detection resources',
        'input3': 'Please enter the background initialization resource ratio',
        'input4': 'Please enter the proportion of data consistency detection resources',
        'input5': 'Please enter the proportion of data reconstruction resources'
    },
    backup: {
        'smb': 'SMB configuration',
        'type': 'Database type',
        'port': 'The port number',
        'start': 'Start backup',
        'renew': 'Restore',
        'del': 'Delete backup file',
        'new': 'Create a database backup',
        'server': 'Server IP',
        'name': 'Database username',
        'input1': 'Please enter the server ip',
        'input2': 'Please select a database type',
        'input3': 'Please enter the database username',
        'input4': 'Please enter SID',
        'input5': 'Please enter the port number',
        'input6': 'Please enter your password',
        'param': 'Modify backup parameters',
        'pass': 'Password',
        'modi': 'Modify backup parameters',
        'back': 'Backup',
        'filename': 'Backup file name',
        'content': 'Backup description',
        'table': 'Backup table',
        'func': 'Backup form',
        'fzl': 'Non incremental',
        'zl': 'Increment',
        'plan': 'Backup plan',
        'plana': 'Instant backup',
        'planb': 'Scheduled backup',
        'time': 'Time',
        'day': 'Daily',
        'week': 'Weekly',
        'month': 'Per month',
        'mon': 'Monday',
        'tues': 'Tuesday',
        'wed': 'Wednesday',
        'thur': 'Thursday',
        'fri': 'Friday',
        'sat': 'Saturday',
        'sun': 'Sunday',
        'input7': 'Please enter the backup file name',
        'input8': 'Backup description',
        'input9': 'Please enter a table name',
        'input10': 'Please select a backup form',
        'tips': '(Please use multiple tables to separate)',
        'input11': 'Please select time',
        'input12': 'Any time',
        'input13': 'Choose week',
        'renewdata': 'Recovery database',
        'file': 'Backup file',
        'select1': 'Please select SMB',
        'net': 'The internet',
        'input14': 'Please select a network',
        'del': 'Delete backup file',
        'had': 'Existing backup file',
        'select2': 'Please select a backup file',
        'input15': 'Please enter the server username',
        'select3': 'Please select a task type',
        'filereco': 'File recovery',
        'filepath': 'Server path',
        'fileclient': 'Client IP',
        'select4': 'Select path',
        'path': 'Path',
        'select5': 'Please select a path',
        'select6': 'Options',
        'has': 'Already',
        'new': 'New',
        'path1': 'Please enter the path',
        'sure': 'Confirm backup',
        'sure1': 'Confirm recovery',
        'ff': 'File name',
        'ff1': 'Backup time',
        'tips': 'This action will permanently delete the file, whether to continue',
        'dataname': 'Data storage name',
        'input16':'Please enter the database name'
    },
    ...enLocale
}

export default en;