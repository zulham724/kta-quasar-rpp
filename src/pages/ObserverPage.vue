<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-icon name="person" color="deep-purple" size="sm" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">
            {{ Auth.auth.name }}
          </div>
        </q-toolbar-title>
        <q-btn color="deep-purple" flat dense icon="exit_to_app" @click="onLogout" />
      </q-toolbar>
    </q-header>
    <q-page>
      <q-pull-to-refresh @refresh="getAuth" color="deep-purple">
        <div class="q-pa-md">
          <div class="row">
            <div class="col-3">
              <div class="row justify-start align-center">
                <q-avatar size="20vw" @click="zoom(Auth.auth.avatar)">
                  <q-img
                    :src="`${Setting.storageUrl}/${Auth.auth.avatar}`"
                    no-default-spinner
                  />
                </q-avatar>
              </div>
            </div>
            <div class="col self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{Auth.auth.lesson_plans_my_ratings_count || 0}}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Menilai</div>
              </div>
            </div>
            <div class="col self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{Auth.auth.lesson_plans_likes_count || 0}}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Menyukai</div>
              </div>
            </div>
            <div class="col self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{Auth.auth.lesson_plans_likes_count || 0}}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Saran</div>
              </div>
            </div>
            <div class="col self-center">
              <div class="row justify-center">
                <div class="text-body1 text-bold">
                  {{Auth.auth.lesson_plans_comments_count || 0}}
                </div>
              </div>
              <div class="row justify-center">
                <div class="text-caption">Rating</div>
              </div>
            </div>
          </div>
          <div class="row q-pt-md">
            <div class="text-caption text-deep-purple q-pb-sm" v-if="Auth.auth.kta_id">
              No Anggota: {{ Auth.auth.kta_id }}
            </div>
          </div>
          <div class="row">
            <div class="text-caption q-pb-sm">
              {{ Auth.auth.email }}
            </div>
          </div>
          <div class="row">
            <div class="text-caption" v-linkified style="overflow-wrap:break-word; white-space:pre-line">
              {{ Auth.auth.profile.long_bio }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-btn-group spread>
              <q-btn dense @click="$router.push('/account/edit')">
                <div class="text-caption">Edit Profile</div>
              </q-btn>
            </q-btn-group>
          </div>
        </div>
        <div class="row">
          <div
            class="col-4"
            v-for="lessonplan in lessonplans"
            :key="lessonplan.id"
          >
            <div class="row">
              <q-img
                no-default-spinner
                @click="$router.push(`/observer/${Auth.auth.id}/follow/lessonplan/${lessonplan.id}`)"
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
  computed: {
    ...mapState(["Auth", "Setting"])
  },
  data(){
    return {
      lessonplans: []
    }
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
      this.lessonplans = []
      this.Auth.auth.follows.forEach(follow=>{
        follow.lesson_plans.forEach(lessonplan=>{
          this.lessonplans.push(lessonplan)
        })
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
