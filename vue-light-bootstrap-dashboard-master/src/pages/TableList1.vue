<template>
  <div class="business-table">
    <h2>Business Data</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Password</th>
          <th>Number</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="business in businesses" :key="business.businessId">
          <td>{{ business.businessId }}</td>
          <td>{{ business.businessName }}</td>
          <td>{{ business.businessPassword }}</td>
          <td>{{ business.businessNumber }}</td>
          <td>{{ business.businessLink }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      businesses: []
    };
  },
  mounted() {
    // URL에서 businessId를 가져옵니다.
    const businessId = this.$route.params.businessId;
    // Spring 프로젝트의 엔드포인트로 GET 요청을 보냅니다.
    axios.get(`http://localhost:8080/api/business/${businessId}`)
      .then(response => {
        this.businesses = [response.data]; // 결과를 배열에 담습니다.
      })
      .catch(error => {
        console.error('Error fetching business data:', error);
      });
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>