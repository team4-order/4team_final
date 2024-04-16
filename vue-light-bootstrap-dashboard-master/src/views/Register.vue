<template>
  <div id="login">
    <h2 id="logo">Register</h2>
    <div class="form-inputs">
      <label for="username" >Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">

      <div class="form-inputs">

        <label for="password" >Password</label> <br>
        <div class=" tooltip">
          <input type="password" id="password" name="password" v-model="input.password" @mouseover="showTooltip = true" @mouseleave="showTooltip = false" placeholder="Password" />

          <span class="tooltiptext" v-show="showTooltip">영문 숫자 특수기호 조합 8자리 이상 16자리 이하로 생성해주세요.</span>
        </div>
      </div>
      <button type="button" v-on:click="register">Register</button><br><br><br><br><br>
    </div>
  </div>


</template>

<script>
import axios from 'axios';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2'


import router from '@/router'; // Import your Vue Router instance





let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;




export default {
  name: 'Login',
  data() {
    return {
      input: {
        username: "",
        password: ""
      },showTooltip: false,
    }
  },
  methods: {
    async register() {
      try {
        const formData = new FormData();
        if (reg.test(this.input.password)) {

          formData.append("username", this.input.username); // Add username to FormData
          formData.append("password", this.input.password); // Add password to FormData
        }
        /*else{
          Swal.fire({
            title: 'Password Error!',
            text: '비밀번호가 너무 짧습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          })
          console.log("비밀번호가 너무 단순합니다.")
        }*/
        const response = await axios.post('http://localhost:8080/join', formData);
        // Assuming your backend returns some data upon successful registration
        console.log("Registered successfully!");

        Swal.fire({
          title: 'Register Success!',
          text: '계정이 생성되었습니다. 로그인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

        this.$router.replace({ name: "Login" });

      } catch (error) {
        if(!reg.test(this.input.password)){

          Swal.fire({
            title: 'Password Error!',
            text: '비밀번호를 확인해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          })
          console.log("비밀번호가 너무 단순합니다.")
        }
        else {
          Swal.fire({
            title: 'Username Exist!',
            text: '이미 존재하는 username입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          })
        }
        console.error("Registration failed:", error.response.data);
        // Handle registration failure (display error message, clear inputs, etc.)
      }
    }
  }
}
</script>

<style>

body {
  margin: 70px;
  font-family: Arial, Tahoma, sans-serif;
  font-size: 10px;
  font-weight: bold;
  direction: ltr;
  background: #b6b5a7;
}

#login {
  margin: 0 auto;
  padding: 30px;
  width: 400px;
  height: auto;
  overflow: hidden;
  background: #fcf4d4;
  border-radius: 20px;
  text-align: left;
  opacity: 0.78;
}

#login h2 {
  margin: 0 auto;
  width: 200px;
  font-family: 'Lily Script One', cursive;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  color: #ecce87;
  transition: 0.2s ease all;
}

.font{
  margin: 0 auto;
  width: 400px;

  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
#login h2:hover {
  color: #e3e29e;
}

.form-inputs {
  margin: 15px 0;
}

.form-inputs label {
  font-size: 14px;
  color: #565555;
  cursor: pointer;
}

.form-inputs input {
  margin: 15px 0;
  padding: 15px 15px;
  width: 100%;
  outline: none;
  border: 1px solid #bbb;
  border-radius: 20px;
  /*display: inline-block;*/
  box-sizing: border-box;
  transition: 0.2s ease all;
}

.form-inputs input[type=text]:focus,
.form-inputs input[type=password]:focus {
  border-color: #efe1a5;
  width: 100%;
}

.tooltip {
  position: relative;
  /*display: inline-block;*/
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  height: auto;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 100%;
  margin-left: -300px;
  opacity: 0;
  transition: opacity 1.3s;

}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 0.7;
}

button {
  padding: 15px 30px;
  width: 150px;
  background: #d2a389;
  border: none;
  color: white;
  cursor: pointer;
  display: inline-block;
  float: right;
  /*clear: right;*/
  transition: 0.2s ease all;
  margin-right: 10px; /* 조절하여 간격 조절 가능 */
  border-radius: 20px;
}

button:hover {
  opacity: 0.8;
}

button:active {
  opacity: 0.4;
}

.forgot,
.register {
  margin: 10px;
  float: left;
  clear: left;
  display: inline-block;
  color: cornflowerblue;
  text-decoration: none;
}

.forgot:hover,
.register:hover {
  color: darkgray;
}

/*#login button {
  margin-right: 150px; !* 조절하여 간격 조절 가능 *!
  border-radius: 20px; !* 버튼을 둥글게 만듭니다. *!

}

#login button:last-child {
  margin-right: 150px; !* 마지막 버튼의 오른쪽 여백을 없앱니다. *!
}*/
</style>
