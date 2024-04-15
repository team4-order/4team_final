import CustomerDashboardLayout from '../layout/CustomerDashboardLayout.vue'
import DashboardLayout from '../layout/DashboardLayout.vue'// 대시보드 레이아웃 컴포넌트

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
import OrderApply1 from 'src/pages/TableList2.vue'
import OrderApply from 'src/pages/TableList7.vue'
import Overview1 from 'src/pages/Overview1.vue'
import OpenAI from 'src/pages/OpenAI.vue'
import { component } from 'vue/types/umd.js'
import CustomerList from 'src/components/CustomerList.vue'
import BCustomerList from 'src/pages/BCustomerList.vue'
import BAdjustment from 'src/pages/BAdjustment.vue' // 경로 수정
import CustomerList from 'src/pages/CustomerList.vue'
import InputCustomer from 'src/pages/InputCustomer.vue'
import Delivery from 'src/pages/Delivery.vue'
import CustomerDetail from 'src/pages/CustomerDetail.vue'
import CAdjustment from 'src/pages/CAdjustment.vue'

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
      },
      {
        path: 'overview1/:businessId',
        name: 'Overview1',
        component: Overview1
      },
      {
        path: 'ask',
        name: 'OpenAI',
        component: OpenAI
      },
        path: 'bcustomer_list',
        name: 'B Customer List',
        component: BCustomerList
      },
      {
        path: '/bcustomer_list/b_adjustment/:customerCode',
        name: 'B Adjustment List',
        component: BAdjustment,
        props: true
      },
      {
        path: 'customer_list',
        name: 'Customer List',
        component: CustomerList
      },
      {
        path: 'input_customer',
        name: 'Input Customer',
        component: InputCustomer,
        props: true
      },
      {
        path: 'delivery',
        name: 'Delivery',
        component: Delivery,
      },
      {
        path: 'customer_list/customer_detail/:customerCode',
        name: 'Customer Detail',
        component: CustomerDetail,
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
        //주문 등록 - temp (판매처)
        path: 'apply1/:customerCode',
        name: 'OrderApply1',
        component: OrderApply1
      }
      ,
      {
        //주문 등록(판매처)
        path: 'apply/:customerCode',
        name: 'OrderApply',
        component: OrderApply
      },
      {
	path: '/customer/overview',
	name: 'Overview',
	component: Overview
      },
      {
	path: '/customer/icons',
	name: 'Icons',
	component: Icons
      },
      {
	path: ':customerCode',
	name: 'customer Adjustment',
	component: CAdjustment
      }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes;
