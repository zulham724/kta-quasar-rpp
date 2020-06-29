<template>
  <div style="width:100%">
    <q-card v-if="lessonplan != null">
      <q-card-section style="padding-bottom:0">
        <div class="row">
          <div class="col-2 self-center">
            <q-avatar
              size="lg"
              @click="$router.push(`/user/profile/${lessonplan.user.id}`)"
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
                @click="$router.push(`/user/profile/${lessonplan.user.id}`)"
              >
                {{ lessonplan.user.name }}
              </div>
            </div>
          </div>
          <div class="col-2 self-center">
            <div class="row justify-end">
              <q-btn
                flat
                round
                dense
                size="md"
                icon="more_vert"
                v-if="lessonplan.user.id == Auth.auth.id"
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
        <q-img :src="`${Setting.storageUrl}/${lessonplan.cover.image}`" @click="openLessonPlan()">
          <div class="q-pa-md full-height full-width">
              <div class="row justify-center full-height">
                <div class="col-4 text-center self-center">
                  <div class="text-caption">{{lessonplan.topic}}</div>
                  <div class="text-caption">Kelas {{lessonplan.grade.description}}</div>
                  <div class="text-caption q-pt-md">Oleh {{lessonplan.user.name}}</div>
                </div>
              </div>
          </div>
        </q-img>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6 self-center">
            <div class="row">
              <div
                class="text-caption text-bold"
                v-show="lessonplan.likes_count"
                @click="$router.push(`/lessonplan/like/${lessonplan.id}`)"
              >
                {{ lessonplan.likes_count }} Suka
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row justify-end">
              <q-btn
                flat
                round
                :color="lessonplan.liked_count ? 'red' : null"
                :icon="lessonplan.liked_count ? 'favorite' : 'favorite_border'"
                @click="lessonplan.liked_count ? dislike() : like()"
              />
              <q-btn
                flat
                round
                icon="message"
                @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)"
              />
            </div>
          </div>
        </div>
        <div class="row justify-between">
          <div
            class="text-caption text-grey"
            @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)"
          >
            {{
              lessonplan.comments.length
                ? `Lihat Semua ${lessonplan.comments.length} Komentar`
                : "Lihat Komentar"
            }}
          </div>
          <div class="text-caption text-grey">
            {{ lessonplan.created_at | moment("from", "now") }}
          </div>
        </div>
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
  methods: {
    openLessonPlan(){
      this.$router.push({
        name: 'lessonplan',
        params: {
          lessonplan: this.lessonplan
        }
      })
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
      this.$store.dispatch("LessonPlan/dislike", this.lessonplan.id).then(res => {
        this.lessonplan.liked_count = res.data.liked_count;
        this.lessonplan.likes_count = res.data.likes_count;
        this.$forceUpdate();
      });
    },
    showMenu() {
      this.$q
        .bottomSheet({
          message: `Action`,
          actions: [
            this.lessonplan.user.id == this.Auth.auth.id
              ? {
                  label: "Hapus",
                  icon: "delete_outline",
                  color: "purple",
                  id: "destroy"
                }
              : false
          ]
        })
        .onOk(action => {
          // console.log('Action chosen:', action.id)
          if (action.id == "destroy") {
            this.destroy();
          }
        })
        .onCancel(() => {
          // console.log('Dismissed')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
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
