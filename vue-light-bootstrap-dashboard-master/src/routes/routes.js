import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import Overview from 'src/pages/Overview.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'
import BusinessTable from 'src/pages/TableList1.vue'
//import OrderList from 'src/pages/TableList2.vue'
import OrderList from 'src/pages/TableList6.vue'
import OrderDetail from 'src/pages/TableList3.vue'
import CustomerOrderList from 'src/pages/TableList4.vue'
import CustomerOrderDetail from 'src/pages/TableList5.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'upgrade',
        name: 'Upgrade to PRO',
        component: Upgrade
      },
      {
        path: 'orders',
        name: 'OrderList',
      component: OrderList
      }
      // ,
      // {
      //   path: '/customer/:customerCode', // 라우트 경로에 매개변수를 추가합니다.
      //   name: 'OrderList',
      //   component: OrderList
      // }
    ]
  },
  {
    path: '/business/:businessId', 
    name: 'Business',
    component: BusinessTable
  },
  // {
  //   //주문 목록(기업)
  //   path: '/orders/:customerCode', 
  //   name: 'OrderList',
  //   component: OrderList
  // },
  {
      //주문 목록(기업)
      path: '/orders',
      name: 'OrderList',
      component: OrderList
    },
  {
    //주문 상세(기업)
    path: '/orders/detail/:orderNumber', 
    name: 'OrderDetail',
    component: OrderDetail,
    props: true
  },
  {
    //주문 목록(판매처)
    path: '/buyer/:customerCode', 
    name: 'CustomerOrderList',
    component: CustomerOrderList
    //, props: true
  },
  {
    //주문 상세(판매처)
    path: '/buyer/detail/:orderNumber', 
    name: 'CustomerOrderDetail',
    component: CustomerOrderDetail,
    props: true
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
var res= require('../components/Dashboard/Views/' + name + '.vue');
return res;
};**/

export default routes
