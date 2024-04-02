import DashboardLayout from '../layout/DashboardLayout.vue'
import CustomerDashboardLayout from '../layout/CustomerDashboardLayout.vue'
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
import OrderList from 'src/pages/TableList6.vue'
import OrderDetail from 'src/pages/TableList3.vue'
import CustomerOrderList from 'src/pages/TableList4.vue'
import CustomerOrderDetail from 'src/pages/TableList5.vue'
import OrderApply from 'src/pages/TableList2.vue'

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
        path: 'orders/:businessId',
        name: 'OrderList',
        component: OrderList
      },
      {
        path: '/orders/detail/:orderNumber', 
        name: 'OrderDetail',
        component: OrderDetail,
        props: true
      }
    ]
  },
  {
    // 판매처
    path: '/buyer',
    component: CustomerDashboardLayout,
    redirect: '/buyer/:customerCode',
    children: [
      {
        //주문 목록(판매처)
        path: ':customerCode',
        name: 'CustomerOrderList',
        component: CustomerOrderList
      },
      {
        //주문 상세(판매처)
        path: 'detail/:orderNumber', 
        name: 'CustomerOrderDetail',
        component: CustomerOrderDetail,
        props: true
      }
      ,
      {
        //주문 등록(판매처)
        path: 'apply/:customerCode',
        name: 'OrderApply',
        component: OrderApply
      }
    ]
  },
  // {
  //   // 판매처
  //   path: '/apply',
  //   name: 'OrderApply',
  //   component: OrderApply
  // }, 
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
