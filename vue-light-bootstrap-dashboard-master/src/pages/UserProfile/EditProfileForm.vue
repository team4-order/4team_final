<template>
  <card>
    <h4 slot="header" class="card-title">회원 탈퇴</h4>
    <form>

      <div class="row">
        <div class="col-md-3">
          <base-input type="text"
                    label="Username"
                    placeholder="Username"
                    v-model="user.username" readonly>
          </base-input>
        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label>경고!</label>
            <textarea  rows="2" class="form-control"
                      placeholder="탈퇴 버튼을 누르면 되돌릴 수 없습니다.
  버튼을 누르는 즉시 계정이 삭제됩니다."
                      v-model="user.aboutMe" readonly>
              </textarea>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button  class="btn btn-info btn-fill float-right" v-on:click="delUser">
          회원 탈퇴
        </button>
      </div>
      <div class="clearfix"></div>
    </form>
  </card>
</template>
<script>
import axios from 'axios';


  export default {
    components: {

    },
    mounted() {
      this.setUsername();
    },
    data () {
      return {
        user: {
          username: '',
          aboutMe: ``,
        }
      }
    },
    methods: {
      async delUser () {

        const username = this.user.username;
        alert(username);
        try {

          const response = await axios.post('http://localhost:8079/api/delete-username', { username: username });
          this.user.username = ''; // Reset the input after sending


        }
        catch (error) {
          console.error('Failed to delete username:', error);
          alert('Error deleting username');
        }
      }, async setUsername(){
        const Lusername = localStorage.getItem("code");
        const Susername = sessionStorage.getItem("user");

        if(Lusername)
        {
          this.user.username = Lusername;
        }
        else if(Susername)
        {
          this.user.username = Susername;
        }

      }
    }
  }

</script>
<style>

</style>
