<template>
  <div style="height: 100%">
    <b-field label="Find a friend">
      <b-autocomplete
        :data="data"
        :loading="Loading"
        field="Username"
        @typing="GetData"
        @select="(option) => (Person = option.Username)"
      >
      </b-autocomplete>
    </b-field>
    <ul class="messagebox">
      <div
        class="columns"
        v-for="message in Messages"
        v-bind:key="message.createdAt"
      >
        <div v-if="Person === message.Sender" class="column is-4">
          <div class="notification is-info" style="margin: 10px">
            {{ message.Sender }} : {{ message.Message }}
          </div>
        </div>
        <div v-else class="column is-4 is-offset-8">
          <div class="notification is-info-light" style="margin: 10px">
            {{ message.Sender }} : {{ message.Message }}
          </div>
        </div>
      </div>
    </ul>
    <div class="columns">
      <div class="column is-11">
        <b-input v-model="Message"></b-input>
      </div>
      <div class="column">
        <b-button type="is-primary" v-on:click="SendMessage"
          ><b-icon icon="send"></b-icon>
        </b-button>
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
      data: [],
      Loading: false,
      Messages: [],
      Message: '',
      Person: ''
    }
  },
  methods: {
    GetData: function (Event) {
      const vm = this
      const data = JSON.stringify({
        Query: Event
      })

      var xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          vm.data = JSON.parse(this.response)
          vm.loading = false
        }
      }

      xhttp.open('POST', '/api/Query')
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(data)
      vm.loading = true
    },
    GetMessages () {
      const vm = this

      if (vm.Person === '') {
        return
      }

      const data = JSON.stringify({
        Username: vm.Person
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
        Receiver: vm.Person,
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
