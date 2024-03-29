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
import WarehouseList from 'src/components/WarehouseList.vue'
import InventoryList from "src/components/InventoryList.vue";
import InventoryAll from "../components/InventoryAll.vue";
import CstoragePage from "src/components/CStoragePage.vue";
import vendorList from "../components/VendorList.vue";
import VendorDetails from "src/components/VendorDetails.vue";


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
      }
    ]
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
