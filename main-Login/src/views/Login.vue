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
        <br></br>
        <button type="button" v-on:click="login()">Register</button>
    </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Login',
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/login', {
          username: this.username,
          password: this.password
        });

        const token = response.data.token;
        localStorage.setItem('Token', token);

        this.$router.push('/Login');
      } catch (error) {
        console.error('로그인 실패:', error);
        alert('로그인 실패. 다시 시도해주세요.');
      }
    }
  },
  data() {
    return {
      username: "",
      password: ""
    }
  }
}
</script>
<!--<script>-->
<!--    export default {-->
<!--        name: 'Login',-->
<!--        data() {-->
<!--            return {-->
<!--                input: {-->
<!--                    username: "",-->
<!--                    password: ""-->
<!--                }-->
<!--            }-->
<!--        },-->
<!--        methods: {-->
<!--            login() {-->

<!--            }-->
<!--        }-->
<!--    }-->
<!--</script>-->

<style>

#login .form-inputs {
    padding-bottom: 10px;
}

#login .form-inputs label {
    padding-right: 10px;
}

</style>