<template>
  <div style="height: 100%">
    <ul class="messagebox">
      <li v-for="message in Messages" v-bind:key="message.createdAt">
        {{message.Sender}} : {{ message.Message }}
      </li>
    </ul>
    <div class="columns">
      <div class="column is-11">
        <b-input v-model="Message" ></b-input>
      </div>
      <div class="column">
        <b-button type="is-primary"  v-on:click="SendMessage"><b-icon icon="send"></b-icon> </b-button>
      </div>
    </div>
  </div>
</template>

<style>
.messagebox {
  overflow: scroll;
  width: 100%;
  height: 75%;
}
</style>

<script>
export default {
  data () {
    return {
      Messages: [],
      Message: ''
    }
  },

  methods: {
    GetMessages () {
      const vm = this
      const data = JSON.stringify({
        Username: vm.$route.params.Username
      })

      var xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          vm.Messages = JSON.parse(this.response)
        }
      }

      xhttp.open('POST', '/api/GetMessages')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
    },
    SendMessage () {
      const vm = this
      const data = JSON.stringify({
        Receiver: vm.$route.params.Username,
        Message: vm.Message
      })

      var xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          vm.Message = ''
        }
      }

      xhttp.open('POST', '/api/SendMessage')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
    }
  },
  created () {
    this.GetMessages()
    this.interval = setInterval(() => this.GetMessages(), 1000)
  }
}
</script>
