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

    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button><br>

    <button type="button" v-on:click="login">Login</button>
    <br>
    <br>
    구글 아이디가 있으신가요?<br>
    <button type="button" v-on:click="GoogleLogin()">GLogin로 로그인하기</button>
<br>

    <button type="button" v-on:click="loginstatus = true">접속하기</button>


    <!-- ------------------------------------------------------------------------------------------>
    <div class = "Nblack-bg" v-if="loginstatus == true">

      <div class = "Nwhite-bg">

       <button type="button"  v-on:click="ismodalopen = true">처음 사용자</button>
        <button type="button"  v-on:click="getDatas()">기존 사용자</button>

      </div>

    </div>



    <!-- ------------------------------------------------------------------------------------------>

<div class = "black-bg" v-if="ismodalopen == true">

  <div class = "white-bg">

    <h4>사용하실 계정명을 입력해주세요.</h4>
    <div class="form-inputs">
      <label for="NickName">계정명</label>
      <input type="NickName" id="NickName" name="NickName" v-model="input.NickName" placeholder="계정명을 입력해주세요." />
      <p>중복확인</p>
       <button v-on:click="[ismodalopen = false, refresh()]" >확인 및 돌아가기</button>
    </div>

  </div>
</div>



    <!-- ------------------------------------------------------------------------------------------>


    <!-- ------------------------------------------------------------------------------------------>
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

// ---------------------------------------------------

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      input: {
        username: "",
        password: "",
        NickName: "",
      },
      ismodalopen : false,
      loginstatus : false,
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



        // Handle login failure (display error message, clear inputs, etc.)
      }
    },async GoogleLogin(){

      window.location.href ="https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:8081/login/&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com"


},async getDatas(){
      //const formData = new FormData();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const NickName = this.input.NickName;


      const formData = new FormData();
      formData.append("code", code);
      formData.append("NickName", NickName);
      console.log("code : "+code+ "  /  "+" NickName: "+NickName);



    await axios.post("http://localhost:8080/glogin/access", formData)
        .then(response => {
              console.log("spring에서온 응답" + JSON.stringify(response.data));
            }
        ).catch(error => {
          console.error("access code 데이터 전송에 문제가 생겼습니다.", error);
        });

      if(code==params.get("code"))
      {
        this.$emit("authenticated", true);

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })
        /*this.$router.replace({name: "Secure"});*/
      }
}, async refresh(){
      this.$emit("authenticated", true);

       Swal.fire({
        title: 'Login Success!',
        text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
        icon: 'success',
        confirmButtonText: '확인'

      })
      await this.$router.replace({name: "Secure"});
    }
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
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  position: fixed; padding: 20px;
}
.white-bg {
  width: 100%; background: white;
  border-radius: 8px; padding: 20px;
}

.Nblack-bg {
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  position: fixed; padding: 20px;
}
.Nwhite-bg {
  width: 100%; background: white;
  border-radius: 8px; padding: 20px;
}






#login .form-inputs {
  padding-bottom: 10px;
}

#login .form-inputs label {
  padding-right: 10px;
}


</style>
