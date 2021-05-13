<template>
  <div>
    <b-field label="Username">
      <b-input required v-model="Username"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input
        required
        type="password"
        password-reveal
        v-model="Password"
      ></b-input>
    </b-field>
    <b-button type="is-primary" v-on:click="Login">Login</b-button>
    <router-link to="/Register">
      <b-button type="is-primary is-light"> register </b-button>
    </router-link>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      Password: '',
      Username: ''
    }
  },

  methods: {
    Login: function (event) {
      var buefy = this.$buefy
      var Router = this.$router
      if (this.Password === '' || this.Username === '') {
        buefy.toast.open({
          message: 'You gotta type somthing you idiot',
          position: 'is-bottom',
          type: 'is-danger'
        })
        return
      }

      var data = JSON.stringify({
        Username: this.Username,
        Password: this.Password
      })
      var xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          buefy.toast.open({
            message: 'Logged in',
            position: 'is-bottom',
            type: 'is-success'
          })
          Router.push('/FrontPage')
        }
      }

      xhttp.open('POST', '/api/login')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
    }
  }
}
</script>
