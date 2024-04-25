<template>

  <div class="login-fg">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-8 col-lg-7 col-md-12 bg" style="background-image:url('http://easyoms.store/img/market.jpg')">
          <div class="info">
            <h1>Easy OMS</h1>
            <p>로그인 혹은 회원가입 후 이용해주세요.</p>
          </div>
        </div>
        <div class="col-xl-4 col-lg-5 col-md-12 login">
          <div class="login-section">
            <div class="logo clearfix">
              <a href="/login">
                Easy OMS LOGIN
              </a>
            </div>
            <h3>Sign in into your account</h3>




            <div class="login-fg">
              <div class="form-container">
                <ul class="social">
                  <li>
                    <a href="#" class="google" @click.prevent="GoogleLogin">
                      <i class="fa fa-google google-i"></i><span>Google</span>
                    </a>
                    <img v-if="loginstatus" src="../assets/check.png" alt="Authenticated Image" height="5" width="35" align="right">
                  </li>
                </ul>
              </div>
            </div>














            <div class="or-login clearfix">
              <span v-if="!loginstatus" >Or</span>
            </div>
            <div class="form-container" v-if="!loginstatus">
              <form action="#" method="GET">
                <div class="form-group form-fg" v-if="!loginstatus">
                  <input type="text" id="username" name="username" v-if="!loginstatus" v-model="input.username" placeholder="Username" />
                  <i class="fa fa-envelope"></i>
                </div>
                <div class="form-group form-fg" v-if="!loginstatus">
                  <input type="password" id="password" name="password"  v-model="input.password"  placeholder="Password" />
                  <i class="fa fa-unlock-alt"></i>
                </div>
                <div class="checkbox clearfix" >
                  <div class="form-check checkbox-fg" v-if="!loginstatus">
                    <input class="form-check-input" type="checkbox" v-model="rememberMe"  id="remember">
                    <label class="form-check-label" for="remember">
                      아이디 기억하기
                    </label>
                  </div>
                </div>
                <div class="form-group mt-2">
                  <button type="button" class="btn-md btn-fg btn-block" v-if ="!this.loginstatus" v-on:click="login">Login</button>
                  <button type="button" class = "btn-md btn-fg btn-block" v-if ="this.loginstatus" v-on:click="checkUsernameExistence">접속하기</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.withCredentials = true;

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      ismodalopen: false,
      loginstatus: false,
      usernameExists: false,
      showTooltip: false,
      rememberMe: false,
    }
  },
  mounted() {
    this.isloggedin();
    this.eraseALL();
    this.checkAndStoreCode();
   /* this.checkCstatus();*/
    const idCookie = this.$cookies.get("idCookie");
    if (idCookie) {
      this.input.username = idCookie;
      this.rememberMe = true; // 이전에 체크된 상태로 "Remember me" 체크박스 설정
    }



  },
  methods: {
    isloggedin(){
      if(sessionStorage.getItem("user"))
      {
        this.$router.replace("/admin/overview");

      }
      else if(sessionStorage.getItem("cuser"))
      {
        const nowSession = sessionStorage.getItem("cuser");
        this.$router.replace("/buyer/status/nowSession");
      }
      else if(localStorage.getItem("code")){
        this.$router.replace("/login");
      }
    },
    checkAndStoreCode() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        localStorage.setItem('code', code);
        this.loginstatus = true;
      }


    }, async login() {
      try {
        const formData = new FormData();

        formData.append("username", this.input.username);
        const userIn = this.input.username;

        formData.append("password", this.input.password);


        const response = await axios.post("http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/login", formData);
        console.log(response.status)
        if (response.status === 200) {
        await Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        });

        const token = response.headers.authorization;
        localStorage.setItem('token', token);
        //window.sessionStorage.setItem("user",instantUserName);
        sessionStorage.setItem('user', userIn);


        if (this.rememberMe) {
          this.loginRemember();
        } else {
          this.loginRemember();
        }


        this.$emit("authenticated", true);
        this.$router.replace({name: "Overview"});
        /*this.$router.replace({ name: "Secure" });*/
        console.log("Logged in successfully!");

        console.log(response.data);
      }
        /*else{
          await Swal.fire({
            title: 'Login failed!',
            text: '아이디 및 비밀번호를 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        }*/

      } catch (error) {
        const userIn = "";


        await Swal.fire({
          title: 'Login failed!',
          text: '아이디 및 비밀번호를 확인해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        console.error("Login failed:", error.response.data);
      }
    },
    async GoogleLogin() {
      await Swal.fire({
        title: '구글 로그인 후',
        text: '접속하기를 눌러주세요!',
        icon: 'info',
        confirmButtonText: '확인'
      });
      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/api/v1/oauth2/google&response_type=code&scope=email%20profile%20openid&access_type=offline";
    },
    async checkUsernameExistence() {
      try {
        const code = localStorage.getItem('code');
        if (code) {
          const response = await axios.post('http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8079/api/users/findallusername', { code });
          this.usernameExists = response.data.usernameExists;
          console.log(this.usernameExists);
          if (this.usernameExists == true) {

            await Swal.fire({
              title: 'Login Success!',
              text: '로그인에 성공했습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });

            this.$emit("authenticated", true);
            this.$router.replace({ name: "Overview" });
          }
        } else {
          await Swal.fire({
            title: 'Login failed!',
            text: '구글 로그인을 먼저 진행해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          console.error('Code is not available in the localStorage.');
        }
      } catch (error) {
        console.error('Error checking username existence:', error);
      }
    },redirect(){
      this.$router.replace({ name: "Register" });
    },loginRemember() {
      console.log(this.rememberMe)

      const username = sessionStorage.getItem("user");
      console.log("Username retrieved from session storage:", username);

      if (this.rememberMe) {
        // Set the cookie if "Remember me" is checked
        this.$cookies.remove("idCookie");
        this.$cookies.set("idCookie", username);
      } else {
        // Remove the cookie if "Remember me" is unchecked
        this.$cookies.remove("idCookie");
      }






    },async eraseALL(){

      const a = localStorage.removeItem()("code");



    }
  }
}
</script>

<style>
.login-fg .form-container{color:#ccc;position:relative}
.login-fg .login{min-height:100vh;position:relative;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;justify-content:center;align-items:center;padding:30px 15px}
.login-fg .login-section{max-width:370px;margin:0 auto;text-align:center;width:100%}
.login-fg .form-fg{width:100%;text-align:center}
.login-fg .form-container .form-group{margin-bottom:25px}
.login-fg .form-container .form-fg{float:left;width:100%;position:relative}
.login-fg .form-container .input-text{font-size:14px;outline:none;color:#616161;border-radius:3px;font-weight:500;border:1px solid transparent;background:#fff;box-shadow:0 0 5px rgba(0,0,0,0.2)}
.login-fg .form-container img{margin-bottom:5px;height:40px}
.login-fg .form-container .form-fg input{float:left;width:100%;padding:11px 45px 11px 20px;border-radius:50px}
.login-fg .form-container .form-fg i{position:absolute;top:13px;right:20px;font-size:19px;color:#616161}
.login-fg .form-container label{font-weight:500;font-size:14px;margin-bottom:5px}
.login-fg .form-container .forgot{margin:0;line-height:45px;color:#535353;font-size:15px;float:right}
.login-fg .bg{background:rgba(0,0,0,0.04) repeat;background-size:cover;top:0;width:100%;bottom:0;opacity:1;z-index:999;min-height:100vh;position:relative;display:flex;justify-content:center;align-items:center;padding:30px}
.login-fg .info h1{font-size:60px;color:#fff;font-weight:700;margin-bottom:15px;text-transform:uppercase;text-shadow:2px 0px #000}
.login-fg .info{text-align:center}
.login-fg .info p{margin-bottom:0;color:#fff;line-height:28px;text-shadow:1px 1px #000}
.login-fg .form-container .btn-md{cursor:pointer;padding:10px 30px 9px;height:45px;letter-spacing:1px;font-size:14px;font-weight:400;font-family:'Open Sans',sans-serif;border-radius:50px;color:#d6d6d6}
.login-fg .form-container p{margin:0;color:#616161}
.login-fg .form-container p a{color:#616161}
.login-fg .form-container button:focus{outline:none;outline:0 auto -webkit-focus-ring-color}
.login-fg .form-container .btn-fg.focus,.btn-fg:focus{box-shadow:none}
.login-fg .form-container .btn-fg{background:#0f96f9;border:none;color:#fff;box-shadow:0 0 5px rgba(0,0,0,0.2)}
.login-fg .form-container .btn-fg:hover{background:#108ae4}
.login-fg .logo a{font-weight:700;color:#333;font-size:39px;text-shadow:1px 0px #000}
.login-fg .form-container .checkbox{margin-bottom:25px;font-size:14px}
.login-fg .form-container .form-check{float:left;margin-bottom:0}
.login-fg .form-container .form-check a{color:#d6d6d6;float:right}
.login-fg .form-container .form-check-input{position:absolute;margin-left:0}
.login-fg .form-container .form-check label::before{content:"";display:inline-block;position:absolute;width:18px;height:18px;top:2px;margin-left:-25px;border:none;border-radius:3px;background:#fff;box-shadow:0 0 5px rgba(0,0,0,0.2)}
.login-fg .form-container .form-check-label{padding-left:25px;margin-bottom:0;font-size:14px;color:#616161}
.login-fg .form-container .checkbox-fg input[type="checkbox"]:checked + label::before{color:#fff;background:#0f96f9}
.login-fg .form-container input[type=checkbox]:checked + label:before{font-weight:300;color:#f3f3f3;font-size:14px;content:"\2713";line-height:17px}
.login-fg .form-container input[type=checkbox],input[type=radio]{margin-top:4px}
.login-fg .form-container .checkbox a{font-size:14px;color:#616161;float:right;margin-left:3px}
.login-fg .login-section h3{font-size:20px;margin-bottom:40px;font-family:'Open Sans',sans-serif;font-weight:400;color:#505050}
.login-fg .login-section p{margin:25px 0 0;font-size:15px;color:#616161}
.login-fg .login-section p a{color:#616161}
.login-fg .login-section ul{list-style:none;padding:0;margin:0}
.login-fg .login-section .social li{display:inline-block;margin-bottom:5px}
.login-fg .login-section .social li a{font-size:12px;font-weight:600;width:120px;margin:2px 0 3px;height:35px;line-height:35px;border-radius:20px;display:inline-block;text-align:center;text-decoration:none;background:#fff;box-shadow:0 0 5px rgba(0,0,0,0.2)}
.login-fg .login-section .social li a i{height:35px;width:35px;line-height:35px;float:left;color:#fff;border-radius:20px}
.login-fg .login-section .social li a span{margin-right:7px}
.login-fg .login-section .or-login{float:left;width:100%;margin:20px 0 25px;text-align:center;position:relative}
.login-fg .login-section .or-login::before{position:absolute;left:0;top:10px;width:100%;height:1px;background:#d8dcdc;content:""}
.login-fg .login-section .or-login > span{width:auto;float:none;display:inline-block;background:#fff;padding:1px 20px;z-index:1;position:relative;font-family:Open Sans;font-size:13px;color:#616161;text-transform:capitalize}
.login-fg .facebook-i{background:#4867aa;color:#fff}
.login-fg .twitter-i{background:#3CF;color:#fff}
.login-fg .google-i{background:#db4437;color:#fff}
.login-fg .facebook{color:#4867aa}
.login-fg .twitter{color:#3CF}
.login-fg .google{color:#db4437}
@media (max-width: 1200px) {
  .login-fg .info h1{font-size:45px}
}
@media (max-width: 992px) {
  .login-fg .bg{display:none}
}
@media (max-width: 768px) {
  .login-fg .login-section .social li a{width:100px}
  .login-fg .logo a{font-size:26px;}
}
</style>
