<template>
  <div class="secure">
    <h1>This is an secure page</h1>
    <br></br>
    <h1>이 화면을 중간 화면으로 만들어서 이 화면을 통해서 우리 원래 대쉬보드로 옮길 수 있게 만들 예정입니다.</h1>
    <div>

    </div>
    </div>
</template>


<script>
    export default {
        name: 'Secure',
        data() {
          return {}
        },
        mounted() {
            if(!this.$parent.authenticated) {
                this.$router.replace({ name: "Login" });
            }
        },
        methods: {
        }
    }
</script>