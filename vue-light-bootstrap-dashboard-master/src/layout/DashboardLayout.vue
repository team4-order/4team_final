<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>

<!--      <sidebar-link to="/admin/overview">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>-->

      <sidebar-link to="/admin/overview">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>계정 정보</p>
      </sidebar-link>

      <sidebar-link to="/admin/cstoragePage">
        <i class="nc-icon nc-delivery-fast"></i>
        <p>거래처 관리</p>
      </sidebar-link>

      <sidebar-link to="/admin/vendorList">
        <i class="nc-icon nc-delivery-fast"></i>
        <p>공급처 관리</p>
      </sidebar-link>

      <sidebar-link to="/admin/orders">
        <i class="nc-icon nc-cart-simple"></i>
        <p>주문</p>
      </sidebar-link>

      <sidebar-link to="/admin/warehouses">
        <i class="nc-icon nc-bank"></i>
        <p>창고 관리</p>
      </sidebar-link>

      <sidebar-link to="/admin/inventoryAll">
        <i class="nc-icon nc-app"></i>
        <p>재고</p>
      </sidebar-link>

      <!-- <sidebar-link to="/admin/fruit">
        <i class="nc-icon nc-chart-pie-36"></i>
        <p>과일 목록</p>
      </sidebar-link> -->

<!--      <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>User Profile</p>
      </sidebar-link>-->

<!--      <sidebar-link to="/admin/table-list">
        <i class="nc-icon nc-notes"></i>
        <p>Table list</p>
      </sidebar-link>-->

<!--      <sidebar-link to="/admin/typography">
        <i class="nc-icon nc-paper-2"></i>
        <p>Typography</p>
      </sidebar-link>-->
<!-- 
      <sidebar-link to="/admin/maps/:orderNumber">
        <i class="nc-icon nc-pin-3"></i>
        <p>Maps</p>
      </sidebar-link> -->

<!--      <sidebar-link to="/admin/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>Notifications</p>
      </sidebar-link>-->

      

      <!-- <sidebar-link to="/admin/customer_list">
        <i class="nc-icon nc-badge"></i>
        <p>거래처 관리</p>
      </sidebar-link> -->

      <!-- <sidebar-link to="/admin/delivery">
        <i class="nc-icon nc-spaceship"></i>
        <p>배송</p>
      </sidebar-link> -->

      <sidebar-link to="/admin/delivery">
        <i class="nc-icon nc-ambulance"></i>
        <p>배송 현황</p>
      </sidebar-link>

      <sidebar-link to="/admin/bcustomer_list">
        <i class="nc-icon nc-money-coins"></i>
        <p>정산</p>
      </sidebar-link>

    </side-bar>


    <div class="main-panel">

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>

    </div>
  </div>

</template>
<style lang="scss">

</style>
<script>
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
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
