<template>
  <div id="login">
    <h1>Login</h1>
    <div class="form-inputs">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">
      <label for="password">Password</label>
      <div class="tooltip">
        <input type="password" id="password" name="password" v-model="input.password" @mouseover="showTooltip = true" @mouseleave="showTooltip = false" placeholder="Password" />
        <span class="tooltiptext" v-show="showTooltip">영문 숫자 특수기호 조합 8자리 이상 16자리 이하로 생성해주세요.</span>
      </div>
    </div>


<!--    <div class="form-inputs">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" v-model="input.password" @mouseover="showTooltip = true" @mouseleave="showTooltip = false" placeholder="Password" />
    </div>-->


    <button type="button" v-on:click="login">Login</button>
    <br>
    <br>
    구글 아이디가 있으신가요?<br>
    <button type="button" v-on:click="GoogleLogin">Google 로그인</button>
<br>

     <button type="button" v-on:click=" checkUsernameExistence">접속하기</button>




  </div>

</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2'
import router from '@/router';
// ---------------------------------------------------
let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
axios.defaults.withCredentials = true;






// ---------------------------------------------------
// 로그인 버튼
window.onload = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var code = urlParams.get('code');
  if (code) {
    localStorage.setItem('code', code);

  }
}
// ---------------------------------------------------

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      ismodalopen : false,
      loginstatus : false,
      usernameExists: false,
      showTooltip: false,
    }
  },
  methods: {
    async login() {
      try {
        const formData = new FormData();


        formData.append("username", this.input.username); // Add username to FormData
        formData.append("password", this.input.password); // Add password to FormData

        const response = await axios.post("http://localhost:8080/login", formData)

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

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
        await Swal.fire({
          title: 'Login failed!',
          text: '아이디 및 비밀번호를 확인해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        })
        console.error("Login failed:", error.response.data);


      }
    }, async GoogleLogin() {
      await Swal.fire({
        title: '구글 로그인 후',
        text: '접속하기를 눌러주세요!',
        icon: 'info',
        confirmButtonText: '확인'
      })

      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8080/api/v1/oauth2/google&response_type=code&scope=email%20profile%20openid&access_type=offline";





    }, async checkUsernameExistence() {
      try {
        const code = localStorage.getItem('code');
        if (code) {
          const response = await axios.post('http://localhost:8080/api/users/findallusername', { code });
          this.usernameExists = response.data.usernameExists;
          if(this.usernameExists ==true)
          {this.$emit("authenticated", true);
            this.$router.replace({name: "Secure"});

          }

        } else {
          await Swal.fire({
            title: 'Login failed!',
            text: '구글 로그인을 먼저 진행해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          })
          console.error('Code is not available in the localStorage.');
        }
      } catch (error) {
        console.error('Error checking username existence:', error);
      }
    },
  }
}
</script>

<style>

body{
  margin : 0
}

div{
  box-sizing: border-box;
}


.black-bg {
  width: 100%; height:100%;
  background: rgba(0,0,0,0.5);
  position: fixed; padding: 20px;
}
.white-bg {
  width: 100%; background: white;
  border-radius: 8px;
  padding: 20px;
}





#login .form-inputs {
  padding-bottom: 10px;
}

#login .form-inputs label {
  padding-right: 10px;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  cursor: pointer;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 250px;
  background-color: #303434;
  color: #fff;
  text-align: center;
  border-radius: 15px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 150%;
  margin-left: -60px;
  opacity: 0;
  max-height: 230%;
  overflow: visible;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 0.5;
}

</style>
