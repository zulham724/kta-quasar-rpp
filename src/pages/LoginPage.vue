<template>
  <div
    style="height:100vh;background-image:linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url('statics/images/bg-login.jpg');background-size:cover"
  >
    <div class="q-pa-md full-height">
      <div
        class="row justify-center align-center content-center full-height full-width"
      >
        <div class="col-12">
          <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
            <q-input
              color="deep-purple"
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              label="Email anda"
              v-model="credential.username"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Harus diisi'
              ]"
            />
            <q-input
              color="deep-purple"
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              label="Password"
              v-model="credential.password"
              type="password"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Harus diisi'
              ]"
            />
          </q-form>
        </div>
      </div>

      <q-btn
        style="position:absolute;bottom:10vh;right:5vw"
        label="Login"
        @click="onSubmit()"
        rounded
        type="submit"
        color="deep-purple"
        icon="input"
        :loading="loading"
        :disable="loading"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data(){
    return {
      credential:{},
      loading: false
    }
  },
  computed:{
    ...mapState(['Auth'])
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate().then(success=>{
        if(success){
          this.loading = true
          this.$store.dispatch('Auth/login',this.credential).then(res=>{
              this.$router.push('/')
              window.history.pushState(null, null ,window.location.href)
          }).catch(err=>{
            this.$q.notify('Email atau Password salah')
          }).finally(()=>{
              this.loading = false
          })
        }
      })
    },
    forgotPassword(){
      cordova.InAppBrowser.open(
        "https://agpaiidigital.org/password/reset",
        "_blank",
        "location=no"
      )
    }
  }
};
</script>

<style></style>
