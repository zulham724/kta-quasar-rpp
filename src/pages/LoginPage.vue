<template>
  <div>
    <div class="full-width">
      <q-img src="../statics/images/bg-login-1.jpeg"></q-img>
    </div>
    <div class="full-height bg-deep-purple-8">
      <div
        class="row justify-center align-center content-center full-height full-width bg-white q-px-md q-py-xl"
        style="border-radius:30px 30px 0 0 "
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
              :type="show_password?'text':'password'"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Harus diisi'
              ]"
            >
            <template v-slot:append>
                  <q-btn flat round color="deep-purple" :icon="show_password?'visibility':'visibility_off'" @click="show_password=!show_password" />
            </template>
            </q-input>
          </q-form>
        </div>
        <q-btn
          label="Login"
          @click="onSubmit()"
          rounded
          type="submit"
          color="deep-purple-8"
          icon="input"
          :loading="loading"
          :disable="loading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      credential: {},
      loading: false,
      show_password:false,
    };
  },
  computed: {
    ...mapState(["Auth"])
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$store
            .dispatch("Auth/login", this.credential)
            .then(res => {
              this.$router.push("/");
              window.history.pushState(null, null, window.location.href);
            })
            .catch(err => {
              this.$q.notify("Email atau Password salah");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    forgotPassword() {
      cordova.InAppBrowser.open(
        "https://agpaiidigital.org/password/reset",
        "_blank",
        "location=no"
      );
    }
  }
};
</script>

<style></style>
