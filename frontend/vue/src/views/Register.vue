<template>
  <div>
    <b-field label="UserName">
      <b-input required v-model="Username"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input required type="password" v-model="Password" password-reveal></b-input>
    </b-field>
    <b-field label="Enter password again please:">
      <b-input required type="password" v-model="Password2" password-reveal></b-input>
    </b-field>
    <router-link to="/Login">
      <b-button type="is-primary is-light"> Login</b-button></router-link
    >
    <b-button v-on:click="Register" type="is-primary"> Register </b-button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      Password: '',
      Password2: '',
      Username: ''
    }
  },

  methods: {
    Register: function (event) {
      var buefy = this.$buefy
      if (this.Password !== this.Password2) {
        buefy.toast.open({
          message: 'Passwords has to match',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }

      if (this.Password === this.Password2) {
        var data = JSON.stringify({
          Username: this.Username,
          Password: this.Password
        })
        var xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            buefy.toast.open({
              message: this.response,
              position: 'is-bottom',
              type: 'is-succes'
            })
          }
        }

        xhttp.open('POST', '/api/register')
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(data)
      }
    }
  }
}
</script>
