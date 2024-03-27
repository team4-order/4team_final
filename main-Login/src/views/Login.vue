<template>
  <div id="login">
    <h1>Login</h1>
    <div class="form-inputs">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" v-model="input.password" placeholder="Password" />
    </div>
    <button type="button" v-on:click="login()">Login</button>
    <button type="button" v-on:click="register()">Register</button>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router'; // Import your Vue Router instance

export default {
  name: 'Login',
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    async login() {
      try {
        const formData = new FormData();
        formData.append("username", this.input.username); // Add username to FormData
        formData.append("password", this.input.password); // Add password to FormData
        const response = await axios.post('http://localhost:8080/login', formData);
        // Assuming your backend returns a JWT token upon successful login
        const token = response.headers.authorization;
        // You can store the token in localStorage or Vuex for future API requests
        localStorage.setItem('token', token);
        // Redirect to the '/secure' route upon successful login
        this.$emit("authenticated", true);
        this.$router.replace({name: "Secure"});
        console.log("Logged in successfully!");
        console.log(response.data);

      } catch (error) {
        console.error("Login failed:", error.response.data);
        // Handle login failure (display error message, clear inputs, etc.)
      }
    },
    async register() {
      try {
        const formData = new FormData();
        formData.append("username", this.input.username); // Add username to FormData
        formData.append("password", this.input.password); // Add password to FormData
        const response = await axios.post('http://localhost:8080/join', formData);
        // Assuming your backend returns some data upon successful registration
        console.log("Registered successfully!");
        window.location.reload()

      } catch (error) {
        console.error("Registration failed:", error.response.data);
        // Handle registration failure (display error message, clear inputs, etc.)
      }
    }
  }
}
</script>

<style>

#login .form-inputs {
  padding-bottom: 10px;
}

#login .form-inputs label {
  padding-right: 10px;
}

</style>
