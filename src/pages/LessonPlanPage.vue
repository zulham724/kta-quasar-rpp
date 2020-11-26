<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">RPP</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="lesson-header q-px-md q-pt-md q-pb-lg text-white">
        <div class="text-center text-h6 q-pb-xs">{{ lessonplan.topic }}</div>
        <div class="row q-pa-xs">
          <q-img
            class="col-5"
            style="border-radius:10px;"
            :src="lessonPlanImage"
          ></q-img>
          <div class="col-7 q-px-sm">
            <div class="text-deep-purple-3 text-body2">Kelas</div>
            <div class="text-body2 text-bold">{{ lessonplan.grade.description }}</div>
            <div class="text-deep-purple-3">Mata Pelajaran</div>
            <div class="text-body2 text-bold">{{ lessonplan.subject }}</div>
          </div>
        </div>
      </div>
      <div class="lesson-details q-pa-md">
        <div class="lesson-detail q-pa-sm row justify-center">
          <div class="text-body1 text-bold">Detail Informasi</div>
          <q-separator inset size="md" color="deep-purple" />
          <div class="row items-center q-py-sm">
            <div class="col-3">Dibuat Oleh</div>
            <div class="col-1">:</div>
            <div class="col-8">{{creator?creator.name:''}}</div>
            <div class="col-3">Disunting Oleh</div>
            <div class="col-1">:</div>
            <div class="col-8">{{lessonplan.user.name}}</div>
            <div class="col-3">Sekolah</div>
            <div class="col-1">:</div>
            <div class="col-8">{{lessonplan.school}}</div>
            <div class="col-3">Durasi</div>
            <div class="col-1">:</div>
            <div class="col-8">{{lessonplan.duration}}</div>
          </div>
        </div>
        <div class="row q-pt-sm" v-for="content in lessonplan.contents" :key="content.name">
          <div class="col">
            <div class="text-h6">{{ content.name }}</div>
            <div class="text-body2" v-html="content.value"></div>
          </div>
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
      loading: false,
      creator: null
    };
  },
  mounted() {
    if (this.lessonplan == null && creator == null) {
      this.$router.push("dashboard");
    }
    this.init();
  },
  computed: {
    ...mapState(["Setting", "Auth"]),
     lessonPlanImage:function(){
            return  this.lessonplan.template? `${this.Setting.storageUrl}/${this.lessonplan.template.image}`: this.lessonplan.cover == null ? `https://cdn.qubicle.id/images/2019/02/15/be26ee32-34a8-407a-a712-3a3e61cdaff8.jpg`
                    :`${this.Setting.storageUrl}/${this.lessonplan.cover.image}`
        }
  },
  methods: {
    init() {
      this.$store
        .dispatch("User/show", this.lessonplan.creator_id)
        .then(res => {
          this.creator = res.data;
        });
    },
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

<style>
.lesson-header {
  background-color: #564395;
  width: 100%;
}
.lesson-detail {
  background-color: #e0d7ff;
  width: 100%;
  border-radius: 20px;
}
.lesson-details {
  margin-top: -15px;
  background-color: white;
  border-radius: 20px 20px 0px 0px;
}
</style>
