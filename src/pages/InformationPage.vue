<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn
          color="deep-purple"
          flat
          dense
          icon="arrow_back"
          @click="$router.back()"
        />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">
            Informasi
          </div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-list bordered padding class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-item-label lines="1">Jumlah Guru di RPP Digital</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label lines="2"
              >{{LessonPlan.information.users_count || 0}}</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label lines="1">Jumlah RPP</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label lines="2"
              >{{LessonPlan.information.lesson_plans_count || 0}}</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label lines="1">Jumlah Pengawas</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label lines="2"
              >{{LessonPlan.information.observers_count || 0}}</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      provinces: [],
      loading: false
    };
  },
  mounted() {
    this.getDetailTotalMember()
    this.getInformation()
    if (this.provinces.length == 0) {
      this.loading = true;
      this.getProvinces().finally(() => {
        this.loading = false;
      });
    }
  },
  computed: {
    ...mapState(["Setting", "Auth",'LessonPlan'])
  },
  methods: {
    getProvinces() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("Province/index")
          .then(res => {
            this.provinces = res.data
              .sort((a, b) => {
                return b.users_count - a.users_count;
              })
              .slice(0, 10);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getCountUser() {
      this.$store.dispatch("Setting/getDetailTotalMember");
    },
    getDetailTotalMember() {
      this.$store.dispatch("Setting/getCountUser");
    },
    getInformation(){
        this.$store.dispatch('LessonPlan/getInformation')
    }
  }
};
</script>

<style></style>
