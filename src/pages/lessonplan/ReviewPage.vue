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
          <div class="text-body2 text-deep-purple text-bold">Saran</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="lessonplan != null">
      <div class="q-pa-md">
        <div class="row q-pb-md">
          <div class="col-2 self-center">
            <q-avatar>
              <q-img
                :src="`${Setting.storageUrl}/${lessonplan.user.avatar}`"
                no-default-spinner
              />
            </q-avatar>
          </div>
          <div class="col-10 self-center">
            <div class="q-pl-md text-caption text-black text-bold">
              {{ lessonplan.user.name }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div
              class="text-caption"
              style="overflow-wrap:break-word; white-space:pre-line"
              v-html="lessonplan.description"
              v-linkified
            ></div>
          </div>
        </div>
        <div class="row justify-start q-pt-md">
          <div class="text-caption text-grey">
            {{ lessonplan.created_at | moment("from", "now") }}
          </div>
        </div>
      </div>
      <q-list bordered class="rounded-borders">
        <q-item-label header>Komentar</q-item-label>

        <item-component
          v-for="review in lessonplan.reviews"
          :key="review.id"
          :review="review"
        ></item-component>
      </q-list>
    </q-page-container>

    <q-footer style="padding:5px;background-color:white">
      <q-input
        dense
        label="Tulis sesuatu"
        v-model="review.value"
        flat
        borderless
        color="deep-purple"
        bg-color="white"
        ref="keyboard"
      >
        <template v-slot:after>
          <div>
            <q-btn
              flat
              round
              icon="send"
              :loading="loading"
              :disable="loading"
              @click="store()"
            />
          </div>
        </template>
      </q-input>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    ItemComponent: () => import("components/lessonplan/review/ItemComponent")
  },
  props: {
    lessonplanid: null
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  data() {
    return {
      lessonplan: null,
      review: {
        value: ""
      },
      loading: false
    };
  },
  mounted() {
    this.lessonplan == null ? this.init() : null;
    this.$refs.keyboard.focus();
  },
  methods: {
    init() {
      this.$store.dispatch("LessonPlan/show", this.lessonplanid).then(res => {
        this.lessonplan = res.data;
      });
    },
    store() {
      this.loading = true;
      const payload = {
        lessonplan_id: this.lessonplan.id,
        user_id: this.Auth.auth.id,
        value: this.review.value
      };
      this.$store
        .dispatch("LessonPlanReview/store", payload)
        .then(res => {
          // if (this.lessonplan.user.id != this.Auth.auth.id) this.sendNotif();
          this.lessonplan.reviews.splice(0, 0, res.data);
          this.lessonplan.reviews_like += 1;
          this.review.value = "";
        })
        .catch(err => {})
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style></style>
