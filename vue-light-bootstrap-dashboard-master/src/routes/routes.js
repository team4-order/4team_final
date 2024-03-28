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
import BCustomerList from 'src/pages/BCustomerList.vue'
import BAdjustment from 'src/pages/BAdjustment.vue' // 경로 수정
import CustomerList from 'src/pages/CustomerList.vue'

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
        path: 'bcustomer_list',
        name: 'B Customer List',
        component: BCustomerList
      },
      {
        path: '/bcustomer_list/b_adjustment/:contactCode', // 변경된 부분: customerCode -> contactCode
        name: 'B Adjustment List',
        component: BAdjustment,
        props: true
      },
      {
        path: 'customer_list',
        name: 'Customer List',
        component: CustomerList
      }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes;
