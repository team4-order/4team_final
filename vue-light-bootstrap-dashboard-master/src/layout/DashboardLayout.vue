<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/overview">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>User Profile</p>
      </sidebar-link>
      <sidebar-link to="/admin/table-list">
        <i class="nc-icon nc-notes"></i>
        <p>Table list</p>
      </sidebar-link>
      <sidebar-link to="/admin/typography">
        <i class="nc-icon nc-paper-2"></i>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/admin/maps">
        <i class="nc-icon nc-pin-3"></i>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/admin/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>Notifications</p>
      </sidebar-link>
      <sidebar-link to="/admin/warehouses">
        <i class="nc-icon nc-bank"></i>
        <p>창고 관리</p>
      </sidebar-link>
      <sidebar-link to="/admin/inventoryAll">
        <i class="nc-icon nc-app"></i>
        <p>재고</p>
      </sidebar-link>

<!--      <sidebar-link to="/admin/cstoragePage">-->
<!--        <i class="nc-icon nc-delivery-fast"></i>-->
<!--        <p>거래처 창고관리</p>-->
<!--      </sidebar-link>-->


      <sidebar-link to="/admin/cstoragePage">
        <template v-slot:icon>
          <!-- SVG 아이콘을 여기에 넣습니다 -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" height="18" width="18">
            <title>{{ title }}</title>
            <g fill="#212121">
              <path d="M10.43,3.26c-.217-.742-.908-1.26-1.68-1.26h-3c-.965,0-1.75,.785-1.75,1.75v4.25h-1.25c-1.517,0-2.75,1.233-2.75,2.75v2.75c0,1.378,1.122,2.5,2.5,2.5,1.207,0,2.217-.86,2.449-2h2.101c.232,1.14,1.242,2,2.449,2,1.378,0,2.5-1.122,2.5-2.5v-4.464c0-.261-.037-.52-.11-.77l-1.46-5.005Zm-4.93,.49c0-.138,.112-.25,.25-.25h3c.11,0,.209,.074,.24,.18l1.26,4.32H5.5V3.75ZM2.5,14.5c-.551,0-1-.449-1-1s.449-1,1-1,1,.449,1,1-.449,1-1,1Zm7,0c-.551,0-1-.449-1-1s.449-1,1-1,1,.449,1,1-.449,1-1,1Z"/>
              <path d="M17.25,14.5h-2.5c-.138,0-.25-.112-.25-.25V1.75c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75V14.25c0,.965,.785,1.75,1.75,1.75h2.5c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75Z"/>
            </g>
          </svg>
        </template>
        <p>거래처 창고관리</p>
      </sidebar-link>




<!--      <template slot="bottom-links">-->
<!--        <sidebar-link class="active"-->
<!--                      to="/admin/upgrade">-->
<!--          <i class="nc-icon nc-alien-33"></i>-->
<!--          <p>Upgrade to PRO</p>-->
<!--        </sidebar-link>-->
<!--      </template>-->
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },

    // 거래처별 창고관리 아이콘
    props: {
      title: {
        type: String,
        default: "forklift"
      }
    }
  }


</script>
