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
          <div class="text-body2 text-deep-purple text-bold">RPP</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-md">
      <div class="row q-pt-md">
        <div class="col">
          <div class="text-body2">Mata Pelajaran: {{ lessonplan.subject }}</div>
          <div class="text-body2">Materi Pokok: {{ lessonplan.topic }}</div>
          <div class="text-body2">
            Kelas: {{ lessonplan.grade.description }}
          </div>
        </div>
      </div>
      <div
        class="row"
        v-for="content in lessonplan.contents"
        :key="content.name"
      >
        <div class="col">
          <div class="text-title">{{ content.name }}</div>
          <div class="text-caption" v-html="content.value"></div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  props: {
    lessonplan: null
  },
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    if (this.lessonplan == null) {
      this.$router.push("dashboard");
    }
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  methods: {
    back() {
      this.$router.back();
    },
    download() {
      let ref = cordova.InAppBrowser.open(
        `${this.url}/api/lessonplans/download/${this.lessonplan.id}`,
        "_system",
        "location=no,zoom=no"
      );
    }
  }
};
</script>

<style></style>
