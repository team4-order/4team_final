<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <!-- <sidebar-link to="/buyer">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/admin/icons">
        <i class="nc-icon nc-atom"></i>
        <p>Icons</p>
      </sidebar-link> -->
      <sidebar-link to="/buyer/status/:customerCode">
        <i class="nc-icon nc-cart-simple"></i>
        <p>주문 현황</p>
      </sidebar-link>
      <sidebar-link to="/buyer/apply">
        <i class="nc-icon nc-paper-2"></i>
        <p>주문 등록</p>
      </sidebar-link>
      <sidebar-link to="/buyer/customer">
        <i class="nc-icon nc-cctv"></i>
        <p>정산</p>
      </sidebar-link>
      <template slot="bottom-links">
        <sidebar-link class="active"
                      to="/admin/upgrade">
          <i class="nc-icon nc-alien-33"></i>
          <p>Upgrade to PRO</p>
        </sidebar-link>
      </template>
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
    }
  }

</script>
