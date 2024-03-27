import DashboardLayout from '../layout/DashboardLayout.vue'// 대시보드 레이아웃 컴포넌트
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'// 404 에러 페이지 컴포넌트

// Admin pages
import Overview from 'src/pages/Overview.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'
import CustomerList from 'src/components/CustomerList.vue' // 경로가 수정되었습니다.

// 라우트 설정
const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'// 루트 경로 접근 시 '/admin/overview'로 리다이렉트
  },
  {
    path: '/admin',
    component: DashboardLayout,// '/admin' 경로에 대한 컴포넌트
    redirect: '/admin/overview',// '/admin' 경로 접근 시 자동으로 '/admin/overview'로 리다이렉트
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
        path: 'customer-list',// 루트 경로에 대한 컴포넌트
        name: 'customer List',
        component: CustomerList
      }
    ]
  },
  { path: '*', component: NotFound }// 정의되지 않은 모든 경로에 대해 NotFound 컴포넌트를 사용
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes// 설정된 라우트들을 내보냄
