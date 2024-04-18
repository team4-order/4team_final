// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'
import CustomerDashboardLayout from '../layout/CustomerDashboardLayout.vue'
import DashboardLayout from '../layout/DashboardLayout.vue'// 대시보드 레이아웃 컴포넌트
import Vue from 'vue';
// Admin pages
import Overview from 'src/pages/Overview.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import WarehouseList from 'src/components/WarehouseList.vue'
import InventoryList from "src/components/InventoryList.vue";
import InventoryAll from "../components/InventoryAll.vue";
import CstoragePage from "src/components/CStoragePage.vue";
import vendorList from "../components/VendorList.vue";
import VendorDetails from "src/components/VendorDetails.vue";
import Fruit from "src/components/Fruit_Information";
import DeliveryStatus from "src/components/DeliveryStatus.vue";
import OrderList from 'src/pages/TableList6.vue'
import OrderDetail from 'src/pages/TableList3.vue'
import CustomerOrderList from 'src/pages/TableList4.vue'
import CustomerOrderDetail from 'src/pages/TableList5.vue'
import OrderApply1 from 'src/pages/TableList2.vue'
import OrderApply from 'src/pages/TableList7.vue'
import Overview1 from 'src/pages/Overview1.vue'
import OpenAI from 'src/pages/OpenAI.vue'
/*import { component } from 'vue/types/umd.js'*/
/*import CustomerList from 'src/components/CustomerList.vue'*/
import BCustomerList from 'src/pages/BCustomerList.vue'
import BAdjustment from 'src/pages/BAdjustment.vue' // 경로 수정
import CustomerList from 'src/pages/CustomerList.vue'
import InputCustomer from 'src/pages/InputCustomer.vue'
import Delivery from 'src/pages/Delivery.vue'
import CustomerDetail from 'src/pages/CustomerDetail.vue'
import CAdjustment from 'src/pages/CAdjustment.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import Login from "../loginpage/Login.vue";
import Register from "../loginpage/Register.vue";


// import { component } from 'vue/types/umd.js'

const routes = [
  /*{
    path: '/login',
    name: 'App',
    component: function (){
      return import('../App.vue')
    }
  },*/
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/',
    component: Login,
  },
  {


    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAuth: true },

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
        path: 'cstoragePage',
        name: 'CstoragePage',
        component: CstoragePage // 거래처 창고관리 페이지
      },
      {
        path: 'warehouses',
        name: 'Warehouses',
        component: WarehouseList // 추가된 컴포넌트 라우트 창고페이지
      },

      {
        path: 'inventory/:storageCode',
        name: 'Inventory',
        component: InventoryList,
        props: true // 이렇게 설정하면 컴포넌트 내에서 $route.params를 통해 파라미터에 접근할 수 있습니다.
      },

      // {
      //   path: 'inventory',
      //   name: 'Inventory',
      //   component: InventoryList // 추가된 컴포넌트 라우트 창고별 인벤토리
      // },
      {
        path: 'inventoryAll',
        name: 'InventoryAll',
        component: InventoryAll // 모든재고목록 페이지
      },

      {
        path: 'vendorList',
        name: 'VendorList',
        component: vendorList // 공급처 관리 페이지
      },
      {
        path: '/vendor/:contactCode',
        name: 'VendorDetails',
        component: VendorDetails, // 공급처 상세정보 페이지
        props: true
      },
      {
        path: 'fruit',
        name: 'Fruit',
        component: Fruit, // 공급처 상세정보 페이지
      },
      {
        path: 'deliveryStatus',
        name: 'DeliveryStatus',
        component: DeliveryStatus, // 배송 현황
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
        path: 'orders',
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
        path: 'overview1',
        name: 'Overview1',
        component: Overview1
      },
      {
        path: 'ask',
        name: 'OpenAI',
        component: OpenAI
      },
      {
        path: 'bcustomer_list',
        name: 'B Customer List',
        component: BCustomerList
      },
      {
        path: '/bcustomer_list/b_adjustment',
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
        path: 'customer_list/customer_detail',
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

	      path: 'customer/:customerCode',
        name: 'customer Adjustment',
        component: CAdjustment
      }
    ]
  },
  { path: '*',
    component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 function view(name) {
 var res= require('../components/Dashboard/Views/' + name + '.vue');
 return res;
 };**/




export default routes;
