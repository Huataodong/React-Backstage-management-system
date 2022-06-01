import {
    AppstoreOutlined,
    UserOutlined,
    AreaChartOutlined,
    HomeOutlined,
    SafetyOutlined,
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    DatabaseOutlined,
    BarcodeOutlined,
} from '@ant-design/icons';

const menuList = [
    {
        title: 'Home', // 菜单标题名称 
        key: '/home', // 对应的 path 
        icon: HomeOutlined, // 图标名称
        isPublic: true, //公开的
    },
    {
        title: 'Products',
        key: '/products',
        icon: AppstoreOutlined,
        children: [ // 子菜单列表
            {
                title: 'Categories',
                key: '/category',
                icon: DatabaseOutlined
            }, {
                title: 'Management',
                key: '/product',
                icon: BarcodeOutlined
            },
        ]
    },
    {
        title: 'User',
        key: '/user',
        icon: UserOutlined,
    },
    {
        title: 'Authorization',
        key: '/role',
        icon: SafetyOutlined,
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: AreaChartOutlined,
        children: [
            {
                title: 'Bar chart',
                key: '/charts/bar',
                icon: BarChartOutlined
            },
            {
                title: 'Line chart',
                key: '/charts/line',
                icon: LineChartOutlined
            },
            {
                title: 'Pie Chart',
                key: '/charts/pie',
                icon: PieChartOutlined
            },
        ]
    },
]

export default menuList