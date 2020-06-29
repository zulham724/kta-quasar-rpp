<template>
  <div style="width:100%">
    <q-card v-if="lessonplan != null">
      <q-card-section style="padding-bottom:0">
        <div class="row">
          <div class="col-2 self-center">
            <q-avatar
              size="lg"
            >
              <q-img
                :src="`${Setting.storageUrl}/${lessonplan.user.avatar}`"
                no-default-spinner
              />
            </q-avatar>
          </div>
          <div class="col-8 self-center">
            <div class="row">
              <div
                class="text-bold text-caption"
              >
                {{ lessonplan.user.name }}
              </div>
            </div>
          </div>
          <div class="col-2 self-center">
            <div class="row justify-end">
              <q-btn
                v-if="Auth.auth.id == lessonplan.user.id"
                flat
                round
                dense
                size="md"
                icon="more_vert"
                @click="showMenu()"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section style="padding-bottom:0;" class="q-pt-md">
        <div class="row">
          <div class="col-12">
            <div
              class="text-caption"
              style="overflow-wrap:break-word; white-space:pre-line"
              v-html="
                lessonplan.description.length > 100
                  ? isReadMore
                    ? `${lessonplan.description}`
                    : `${lessonplan.description.substring(0, 100)}... `
                  : lessonplan.description
              "
              v-linkified
            ></div>
            <div
              v-if="lessonplan.description.length > 100 && isReadMore == false"
              @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)"
              class="text-caption text-grey"
            >
              Readmore
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-img
          no-default-spinner
          :src="`${Setting.storageUrl}/${lessonplan.cover.image}`"
          @click="openLessonPlan()"
        >
          <div class="q-pa-md full-height full-width">

              <div class="row" style="position:absolute">
                  <div class="text-body1 q-pa-md text-grey text-font-weight-bold" style="transform:rotate(45deg)"  v-for="n in 150" :key="n">TRIAL</div>
              </div>
            <div class="row justify-center full-height">
              <div class="col-4 text-center self-center">
                <div class="text-caption">{{ lessonplan.topic }}</div>
                <div class="text-caption">
                  Kelas {{ lessonplan.grade.description }}
                </div>
                <div class="text-caption q-pt-md">
                  Oleh {{ lessonplan.user.name }}
                </div>
              </div>
            </div>
          </div>
        </q-img>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    lessonplan: null
  },
  components: {},
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  data() {
    return {
      slide: 0,
      isReadMore: false,
      dialog: false
    };
  },
  created() {
    this.lessonplan.rated_value_count
      ? (this.lessonplan.rated_value_count = parseInt(
          this.lessonplan.rated_value_count
        ))
      : (this.lessonplan.rated_value_count = 0);
  },
  methods: {
    openLessonPlan() {
      this.$router.push({
        name: "lessonplan",
        params: {
          lessonplan: this.lessonplan
        }
      });
    },
    destroy() {
      this.$q
        .dialog({
          title: "Yakin untuk hapus?",
          message: "RPP tidak akan dapat dikembalikan",
          cancel: true
        })
        .onOk(() => {
          this.$q.loadingBar.start();
          this.$store
            .dispatch("LessonPlan/destroy", this.lessonplan.id)
            .then(res => {
              this.$store.dispatch("Auth/getAuth");
              this.$q.notify("Berhasil menghapus RPP");
            })
            .catch(err => {
              this.$q.notify("Terjadi kesalahan");
            })
            .finally(() => {
              this.$q.loadingBar.stop();
            });
        });
    },
    like() {
      this.$store.dispatch("LessonPlan/like", this.lessonplan.id).then(res => {
        this.lessonplan.liked_count = res.data.liked_count;
        this.lessonplan.likes_count = res.data.likes_count;
        this.$forceUpdate();
      });
    },
    dislike() {
      this.$store
        .dispatch("LessonPlan/dislike", this.lessonplan.id)
        .then(res => {
          this.lessonplan.liked_count = res.data.liked_count;
          this.lessonplan.likes_count = res.data.likes_count;
          this.$forceUpdate();
        });
    },
    rate() {
      const access = {
        post_id: this.lessonplan.id,
        value: this.lessonplan.rated_value_count
      };
      this.$store.dispatch("LessonPlan/rate", access).then(res => {
        //
        this.lessonplan.rated_value_count = parseInt(
          res.data.rated_value_count
        );
        this.lessonplan.ratings_value_count = res.data.ratings_value_count;
        this.lessonplan.ratings = res.data.ratings;
      });
    },
    showMenu() {
      this.$q
        .bottomSheet({
          message: `Menu`,
          actions: [
            this.lessonplan.user.id == this.Auth.auth.id
              ? {
                  label: "Download",
                  icon: "cloud_download",
                  color: "deep-purple",
                  id: "download"
                }
              : false,
            this.lessonplan.user.id == this.Auth.auth.id
              ? {
                  label: "Edit",
                  icon: "edit",
                  color: "deep-purple",
                  id: "edit"
                }
              : false,
            this.lessonplan.user.id == this.Auth.auth.id
              ? {
                  label: "Lihat Penilai",
                  icon: "visibility",
                  color: "deep-purple",
                  id: "observer"
                }
              : false,
            this.lessonplan.user.id == this.Auth.auth.id
              ? {
                  label: "Hapus",
                  icon: "delete_outline",
                  color: "deep-purple",
                  id: "destroy"
                }
              : false,
          ]
        })
        .onOk(action => {
          // console.log('Action chosen:', action.id)
          if(action.id == 'edit'){
            this.$router.push(`/lessonplan/${this.lessonplan.id}/edit`)
          }
          if(action.id == 'download'){
            this.download()
          }
          if (action.id == "destroy") {
            this.destroy();
          }
          if(action.id == 'observer'){
            this.$router.push(`/lessonplan/${this.lessonplan.id}/observer`)
          }
        })
        .onCancel(() => {
          // console.log('Dismissed')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    download(){
      let ref = cordova.InAppBrowser.open(`${this.Setting.url}/api/v1/lessonplans/download/${this.lessonplan.id}`,'_system','location=no,zoom=no')
    }
  }
};
</script>

<style>
.q-img__content > div {
  color: black;
  background: none;
}
</style>
