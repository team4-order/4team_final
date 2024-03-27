<template>
  <div class="cstorage-page">
    <h2>CStorage Management</h2>
    <div class="form-group">
      <label for="customerCode">Customer Code</label>
      <input type="text" id="customerCode" v-model="cStorage.customerCode" class="form-control">
    </div>
    <div class="form-group">
      <label for="storageCode">Storage Code</label>
      <input type="text" id="storageCode" v-model="cStorage.storageCode" class="form-control">
    </div>
    <button @click="addOrUpdateCStorage" class="btn btn-primary">Submit</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cStorage: {
        customerCode: '',
        storageCode: ''
      }
    };
  },
  methods: {
    addOrUpdateCStorage() {
      axios.post('/api/cstorage/addOrUpdate', this.cStorage)
        .then(response => {
          alert('CStorage updated successfully.');
          this.cStorage = { customerCode: '', storageCode: '' }; // Reset form
        })
        .catch(error => {
          console.error('Error updating CStorage:', error);
          alert('Error updating CStorage.');
        });
    }
  }
}
</script>
