<template>
  <div id="app">
    <div id="nav">
<!--      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>-->
      <router-link v-if="authenticated" to="/secure">Secure</router-link>
      <router-link v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link>
      <router-link v-else to="/login">Login</router-link>
      <router-link to="/Register">Register</router-link>
    </div>
    <router-view @authenticated="setAuthenticated"/>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from "sweetalert2";
    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                // this is only for testing purposes no actual app will have this
                // an api call will validate user credentials

            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;

            },
            logout() {
              Swal.fire({
                title: 'LogOut Success!',
                text: '성공적으로 로그아웃 되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'

              })
                localStorage.removeItem('token');
              localStorage.removeItem('code');
                this.authenticated = false;
            }

        }
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  padding-left: 57px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding-right: 10px;
  font-size: 40px;
}

#nav a:not(:first-child) {
  border-left: 1px solid #2c3e50;
  padding-left: 10px; 
}

#nav a.router-link-exact-active {
  color: #efe1a5;
}
</style>
