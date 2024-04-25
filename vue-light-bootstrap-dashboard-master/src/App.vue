<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>
<template>
  <div id="app">
    <div id="nav">
      <router-link class = "link" v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link>

      <router-link  v-if="!authenticated" to="/login">Login</router-link>
      <router-link   v-if="!authenticated" to="/register">Register</router-link>
      <router-link class = "link" v-if="!authenticated" to="/tlogin">
        거래처 페이지</router-link>
    </div>
    <router-view @authenticated="setAuthenticated"/>
  </div>
</template>
<script>

import Swal from 'sweetalert2';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDolly } from '@fortawesome/free-solid-svg-icons'


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
      window.addEventListener("beforeunload", this.handleBeforeUnload);
      },beforeUnmount() {
      // 컴포넌트가 언마운트되기 전에 이벤트 핸들러를 제거합니다.
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
    },
    methods: {
      handleBeforeUnload(event) {
        // 브라우저 탭이 닫힐 때 localStorage의 값을 삭제합니다.
        localStorage.clear();
      },
      setAuthenticated(status) {
        this.authenticated = status;

      },
      async logout() {

        localStorage.removeItem('token');
        localStorage.removeItem('code');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('cuser');


        await Swal.fire({
          title: 'Logout Success!',
          text: '성공적으로 로그아웃 되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'

        });
        this.authenticated = false;

        window.location.reload();


      }, async checkUsernameExistence() {
        try {
          const userNowS = sessionStorage.getItem('user');
          const code = localStorage.getItem('code');
          const cuser = sessionStorage.getItem('cuser');

          if (code) {

            if (code.length > 0) {
              const response = await axios.post('http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/api/users/findallusername', {code});
              this.usernameExists = response.data.usernameExists;
              console.log(this.usernameExists);
              if (this.usernameExists == true) {
                this.authenticated = true;
                await Swal.fire({
                  title: 'Logged In!',
                  text: '이미 로그인되었습니다. 페이지로 넘어갑니다.',
                  icon: 'info',
                  confirmButtonText: '확인'
                });


                this.$router.replace({name: "Overview"});

              } else if (this.usernameExists == false) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '로그인이 해제되었습니다. 다시 로그인해주세요.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");
              } else if (code.length < 0) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '세션이 만료되었습니다.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");

              }
            } else if (code.length < 0) {
              await Swal.fire({
                title: 'Login Status Error',
                text: '세션이 만료되었습니다.',
                icon: 'error',
                confirmButtonText: '돌아가기',
              });
              this.authenticated = false;
              this.$router.replace(name = "/login");

            } else {
              await Swal.fire({
                title: 'Login Status Error',
                text: '비정상적인 로그인입니다.',
                icon: 'error',
                confirmButtonText: '돌아가기',
              });
              this.authenticated = false;
              this.$router.replace(name = "/login");

            }
          } else if (userNowS) {

            if (userNowS.length > 0) {
              const response = await axios.post('http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/api/ausers/findallusername', {userNowS});
              this.usernameExists = response.data.usernameExists;
              console.log(this.usernameExists);
              if (this.usernameExists == true) {
                this.authenticated = true;
              } else if (this.usernameExists == false) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '로그인이 해제되었습니다. 다시 로그인해주세요.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");
              } else if (userNowS.length < 0) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '세션이 만료되었습니다.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");
              }


            } else if (userNowS.length < 0) {
              await Swal.fire({
                title: 'Login Status Error',
                text: '세션이 만료되었습니다.',
                icon: 'error',
                confirmButtonText: '돌아가기',
              });
              this.authenticated = false;
              this.$router.replace(name = "/login");
            } else {
              await Swal.fire({
                title: 'Login Status Error',
                text: '비정상적인 로그인 상태입니다.',
                icon: 'error',
                confirmButtonText: '돌아가기',
              });
              this.authenticated = false;
              this.$router.replace(name = "/login");

            }
          } else if (cuser) {
            if (cuser.length > 0) {
              const response = await axios.post('http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/api/cusers/findallusername', {cuser});
              this.usernameExists = response.data.usernameExists;
              console.log(this.usernameExists);
              if (this.usernameExists == true) {

                this.authenticated = true;
              } else if (this.usernameExists == false) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '로그인이 해제되었습니다. 다시 로그인해주세요.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");
              } else if (cuser.length < 0) {
                await Swal.fire({
                  title: 'Login Status Error',
                  text: '세션이 만료되었습니다.',
                  icon: 'error',
                  confirmButtonText: '돌아가기',
                });
                this.authenticated = false;
                this.$router.replace(name = "/login");

              }
            } else {
              await Swal.fire({
                title: 'Login Status Error',
                text: '비정상적인 로그인입니다.',
                icon: 'error',
                confirmButtonText: '돌아가기',
              });
              this.authenticated = false;
              this.$router.replace(name = "/login");

            }
          } else {
            await Swal.fire({
              title: 'Require Login',
              text: '로그인을 진행해주세요!',
              icon: 'info',
              confirmButtonText: '확인'
            });
            this.authenticated = false;
            this.$router.replace(name = "/login");
          }


        } catch (error) {
          await Swal.fire({
            title: 'Require Login',
            text: '로그인을 진행해주세요!',
            icon: 'info',
            confirmButtonText: '확인'
          });
          this.$router.replace(name = "/login");
        }
      }}
  }


</script>
<style>

.link {

  padding: 5px; /* 링크 내부에 약간의 여백을 제공 */
  margin: 0px; /* 링크 간의 간격을 조금 추가 */
  text-decoration: none; /* 기본 링크 밑줄 제거 */
  color: black; /* 텍스트 색상을 검은색으로 설정 */
  border-radius: 25px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: #2c3e50;
}

#nav {
  outline : solid 1px darkgrey;

  text-align: right;
  padding: 20px;
  /* Reduced padding for a more compact look */
  /*display: inline-block; *//* Use flexbox for easier alignment */
  /*justify-content: flex-end;*/ /* Align items to the right */
}

#nav a {

  font-weight: bold;
  text-align: center;
  color: #070707;
  padding: 24px 1px; /* Add padding to the top and bottom for spacing */
  font-size: 20px; /* Reduced font size for better proportion */
  text-decoration: none; /* Remove default underline */
  transition: all 0.3s ease; /* Smooth transition effect */
}

#nav a:not(:first-child) {

  margin-left: 10px; /* Add margin between buttons */
}

#nav a:hover {
  color: #282727; /* Change color on hover */
  background-color: #8ebde8; /* Add background color on hover */
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
