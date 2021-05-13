<template>
  <div>
    <b-field
      label="UserName"
      :type="PasswordTaken"
      :loading="Loading"
      v-on:keyup.native="GetData"
    >
      <b-input required v-model="Username"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input
        required
        type="password"
        v-model="Password"
        password-reveal
      ></b-input>
    </b-field>
    <b-field label="Enter password again please:">
      <b-input
        required
        type="password"
        v-model="Password2"
        password-reveal
      ></b-input>
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
      Username: '',
      Loading: false,
      PasswordTaken: ''
    }
  },

  methods: {
    Register: function (event) {
      var buefy = this.$buefy
      const vm = this
      if (this.Password !== this.Password2) {
        buefy.toast.open({
          message: 'Passwords has to match',
          position: 'is-bottom',
          type: 'is-danger'
        })
        return
      }

      if (this.Password === '' || this.Username === '') {
        buefy.toast.open({
          message: 'You gotta type somthing you idiot',
          position: 'is-bottom',
          type: 'is-danger'
        })
        return
      }

      if (this.PasswordTaken === 'is-danger') {
        buefy.toast.open({
          message: 'That username is taken',
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
            message: this.response,
            position: 'is-bottom',
            type: 'is-success'
          })
          vm.$router.push('/frontpage')
        }
      }

      xhttp.open('POST', '/api/register')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
    },
    GetData: function (event) {
      const vm = this
      var xhttp = new XMLHttpRequest()

      const data = JSON.stringify({
        Username: vm.Username
      })

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          if (this.response === 'Taken') {
            vm.PasswordTaken = 'is-danger'
          }
          if (this.response === 'Free') {
            vm.PasswordTaken = 'is-succes'
          }
          vm.Loading = false
        }
      }

      xhttp.open('POST', '/api/CheckUser')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
      vm.Loading = true
    }
  }
}
</script>
