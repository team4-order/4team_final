<template>
  <card>
    <h4 slot="header" class="card-title">Edit Profile</h4>
    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-5">
          <base-input
            type="text"
            label="Company"
            :disabled="true"
            placeholder="Company Name"
            v-model="customer.contactName"
          ></base-input>
        </div>
        <div class="col-md-3">
          <base-input
            type="text"
            label="Username"
            placeholder="Username"
            v-model="customer.username"
          ></base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="email"
            label="Email"
            placeholder="Email"
            v-model="customer.email"
          ></base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="First Name"
            placeholder="First Name"
            v-model="customer.firstName"
          ></base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="Last Name"
            placeholder="Last Name"
            v-model="customer.lastName"
          ></base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <base-input
            type="text"
            label="Address"
            placeholder="Address"
            v-model="customer.address"
          ></base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <base-input
            type="text"
            label="City"
            placeholder="City"
            v-model="customer.city"
          ></base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Country"
            placeholder="Country"
            v-model="customer.country"
          ></base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label class="control-label">About Me</label>
            <textarea
              class="form-control"
              v-model="customer.aboutMe"
              rows="5"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-info btn-fill float-right">
          Update Profile
        </button>
      </div>
      <div class="clearfix"></div>
    </form>
  </card>
</template>

<script>
import Card from 'src/components/Cards/Card.vue'; // Card 컴포넌트를 import

export default {
  components: {
    Card,
  },
  data() {
    return {
      customer: {
        contactName: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: '',
        aboutMe: '',
      },
    };
  },
  mounted() {
    this.fetchCustomerDetails();
  },
  methods: {
    fetchCustomerDetails() {
      const customerCode = this.$route.params.customerCode;
      axios
        .get(`http://localhost:8080/api/contact/customer/${customerCode}`)
        .then((response) => {
          this.customer = response.data;
        })
        .catch((error) => {
          console.error('Failed to fetch customer details.', error);
        });
    },
    updateProfile() {
      axios
        .put(
          `http://localhost:8080/api/contact/customer/${this.customer.contactCode}`,
          this.customer
        )
        .then((response) => {
          console.log('Profile updated successfully!');
        })
        .catch((error) => {
          console.error('Failed to update profile.', error);
        });
    },
  },
};
</script>

<style scoped>
/* Custom CSS 스타일링 */
</style>
