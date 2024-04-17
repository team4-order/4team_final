<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>
<template>
  <div id="app">
    <div id="nav">
      <router-link class = "setRight" v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link>
      <router-link v-else to="/login">Login</router-link>
      <router-link v-if="!authenticated" to="/register">Register</router-link>
    </div>
    <router-view @authenticated="setAuthenticated"/>
  </div>
</template>
<script>

import Swal from 'sweetalert2';
import axios from "axios";

  export default {
    name: 'App',
    data() {
      return {
        usernameExists: false,
        authenticated: false,
        // this is only for testing purposes no actual app will have this
        // an api call will validate user credentials

      }
    },
    mounted() {
      this.checkUsernameExistence();


      },
    methods: {
      setAuthenticated(status) {
        this.authenticated = status;

      },
      async logout() {
        Swal.fire({
          title: 'LogOut Success!',
          text: '성공적으로 로그아웃 되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'

        })
        await localStorage.removeItem('token');
        localStorage.removeItem('code');
        sessionStorage.removeItem('user');
        this.authenticated = false;

      },async checkUsernameExistence() {
        try {
          const userNowS = sessionStorage.getItem('user');
          const userNowL = localStorage.getItem('code');
          console.log(userNow);

          console.log(userNow.length)

          if (userNowS || userNowL ) {
            const response = await axios.post('http://localhost:8080/api/users/findallusername', {userNow});
            this.usernameExists = response.data.usernameExists;
            console.log(this.usernameExists);
            if (this.usernameExists == true) {
              this.authenticated = true;
            }
            else if (userNowS.length == 0 || userNowL.length == 0){
              await Swal.fire({
                title: 'Login Status Error',
                text: '비정상적인 로그인 상태입니다.',
                icon: 'error',
                confirmButtonText: '로그인 페이지로 돌아가기.'
              });
              await this.$router.replace(name="/login");
            }
            else{
              await Swal.fire({
                title: 'Login Status Error',
                text: '비정상적인 로그인 상태입니다.',
                icon: 'error',
                confirmButtonText: '로그인 페이지로 돌아가기.'
              });
              this.$router.replace(name="/login");
            }
          }
        }
      catch (error){
        Swal.fire({
          title: 'Login Status Error',
          text: '비정상적인 로그인 상태입니다.',
          icon: 'error',
          confirmButtonText: '로그인 페이지로 돌아가기.'
        });
      }
      }
    }
  }


</script>
<style>

/*.setRight{
  text-align: right;
}*/

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  text-align: right;
  padding: 10px; /* Reduced padding for a more compact look */
  /*display: inline-block; *//* Use flexbox for easier alignment */
  /*justify-content: flex-end;*/ /* Align items to the right */
}

#nav a {

  font-weight: bold;
  text-align: center;
  color: #504e2c;
  padding: 15px 1px; /* Add padding to the top and bottom for spacing */
  font-size: 20px; /* Reduced font size for better proportion */
  text-decoration: none; /* Remove default underline */
  transition: all 0.3s ease; /* Smooth transition effect */
}

#nav a:not(:first-child) {

  margin-left: 15px; /* Add margin between buttons */
}

#nav a:hover {
  color: #a48c45; /* Change color on hover */
  background-color: #ecce87; /* Add background color on hover */
  border-radius: 5px; /* Add rounded corners on hover */
}



</style>
<style lang="scss">
  .vue-notifyjs.notifications{
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }
</style>
