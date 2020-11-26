<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Edit Profile</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container v-if="auth != null">
      <div class="q-pa-lg">
        <div class="row q-pb-md">
          <div class="col-3">
            <q-avatar size="20vw">
              <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" no-default-spinner />
            </q-avatar>
          </div>
          <div class="col-9 self-center q-pl-sm">
            <div class="text-h6">{{ Auth.auth.name }}</div>
          </div>
        </div>
        <q-form ref="form">
          <q-input
            color="deep-purple"
            outlined
            rounded
            type="textarea"
            v-model="auth.profile.long_bio"
            label="Bio"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <q-input
            color="deep-purple"
            outlined
            rounded
            dense
            v-model="auth.profile.nip"
            label="NIP"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <q-select
            class="q-mb-md"
            color="deep-purple"
            v-if="auth.role_id != 7"
            dense
            rounded
            outlined
            :options="educationallevels"
            option-value="id"
            option-label="name"
            :loading="loadingEducational"
            label="Jenjang pendidikan yang diajar"
            v-model="auth.profile.educational_level"
            @input="item => (auth.profile.educational_level_id = item.id)"
          />
          <q-input
            color="deep-purple"
            v-if="auth.role_id != 7"
            outlined
            rounded
            dense
            v-model="auth.profile.headmaster_name"
            label="Nama Kepala Sekolah"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <q-input
            color="deep-purple"
            v-if="auth.role_id != 7"
            outlined
            rounded
            dense
            v-model="auth.profile.headmaster_nip"
            label="NIP Kepala Sekolah"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <div class="row justify-end">
            <q-btn
              label="Submit"
              @click="onSubmit()"
              color="deep-purple"
              outline
              rounded
              :loading="loading"
              :disabled="loading"
            />
          </div>
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      educationallevels: [],
      auth: null,
      provinces: [],
      cities: [],
      districts: [],
      loading: false,
      loadingEducational:false,
      file: null,
      isDisabled: true
    };
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  created() {
    // console.log('umur ',moment(this.Auth.auth.created_at).diff(moment(), 'days'))
    // umur lebih sehari dan district sudah diisi
    if (
      moment(this.Auth.auth.created_at).diff(moment(), "days") < -3 &&
      this.Auth.auth.profile.city_id != null &&
      this.Auth.auth.profile.province_id != null
    ) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    "Auth.auth.avatar": {
      handler: function() {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.auth = {
        ...this.Auth.auth,
        profile: {
          ...this.Auth.auth.profile
        }
      };
      this.getEducationalLevels();
      this.getProvinces();
      if (this.auth.profile.province_id) {
        this.getCities().then(res => {
          if (this.auth.profile.city_id) {
            this.getDistricts();
          }
        });
      }
    },
    onSubmit() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$store
            .dispatch("Auth/updateProfile", this.auth)
            .then(res => {
              this.$router.back();
              this.$q.notify("Berhasil update profile");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    getEducationalLevels() {
      this.loadingEducational=true;
      this.$store.dispatch("EducationalLevel/index").then(res => {
        this.educationallevels = res.data;
        this.loadingEducational=false;
      });
    },
    getProvinces() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("Province/index")
          .then(res => {
            this.provinces = res.data;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getCities() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("City/byProvinceId", this.auth.profile.province_id)
          .then(res => {
            this.cities = res.data.cities;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getDistricts() {
      return new Promise((resolve, rejeve) => {
        this.$store
          .dispatch("District/byCityId", this.auth.profile.city_id)
          .then(res => {
            this.districts = res.data.districts;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>

<style></style>
