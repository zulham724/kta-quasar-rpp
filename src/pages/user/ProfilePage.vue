<template>
  <div>
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
          <div class="text-body2 text-deep-purple text-bold" v-if="user">
            {{ user.name }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page v-if="user">
      <q-pull-to-refresh @refresh="getAuth" color="deep-purple">
        <div class="q-pa-md">
          <div class="row">
            <div class="col-3">
              <div class="row justify-start align-center">
                <q-avatar size="20vw" @click="zoom(user.avatar)">
                  <q-img
                    :src="`${Setting.storageUrl}/${user.avatar}`"
                    no-default-spinner
                  />
                </q-avatar>
              </div>
            </div>
            <div class="col-3 self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{ user.lesson_plans_my_likes_count }}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Menyukai</div>
              </div>
            </div>
            <div class="col-3 self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{ user.lesson_plans_count }}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">RPP</div>
              </div>
            </div>
            <div class="col-3 self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{ user.lesson_plans_likes_count }}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Disukai</div>
              </div>
            </div>
          </div>
          <div class="row q-pt-md">
            <div class="text-caption text-deep-purple q-pb-sm" v-if="user.kta_id">
              No Anggota: {{ user.kta_id }}
            </div>
          </div>
          <div class="row">
            <div class="text-caption q-pb-sm">
              {{ user.email }}
            </div>
          </div>
          <div class="row">
            <div class="text-caption" v-linkified style="overflow-wrap:break-word; white-space:pre-line">
              {{ user.profile.long_bio }}
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-4"
            v-for="lessonplan in user.lesson_plans"
            :key="lessonplan.id"
          >
            <div class="row">
              <q-img
                @click="$router.push(`/user/lessonplanlist/${user.id}/${lessonplan.id}`)"
                :src="
                  lessonplan.cover == null
                    ? `https://cdn.qubicle.id/images/2019/02/15/be26ee32-34a8-407a-a712-3a3e61cdaff8.jpg`
                    : `${Setting.storageUrl}/${lessonplan.cover.image}`"
              >
              </q-img>
            </div>
          </div>
        </div>
      </q-pull-to-refresh>
    </q-page>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImageZoomer from "components/ImageZoomerComponent.vue";
export default {
  props: {
    userId: null
  },
  computed: {
    ...mapState(["Auth", "Setting"])
  },
  data(){
    return {
      user: null
    }
  },
  mounted(){
    if (this.userId == this.Auth.auth.id)
      this.$router.push({ name: "account" });
    this.init()
  },
  methods: {
    init(){
      this.$store.dispatch('User/show',this.userId).then(res=>{
        this.user = res.data
      })
    },
    onLogout() {
      this.$router.push("/login").then(() => {
        this.$store.dispatch("Auth/logout");
      });
    },
    getAuth(done) {
      this.$store.dispatch("Auth/getAuth").then(res => {
        if (done) done();
      });
    },
    zoom(src) {
      this.$q
        .dialog({
          component: ImageZoomer,
          parent: this,
          src: src
        })
        .onOk(() => {
          console.log("OK");
        })
        .onCancel(() => {
          console.log("Cancel");
        })
        .onDismiss(() => {
          console.log("Called on OK or Cancel");
        });
    },
    openLessonPlan() {}
  }
};
</script>

<style></style>
