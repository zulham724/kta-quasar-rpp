<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Komentar</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="lessonplan != null">
      <div class="q-px-md q-py-md">
        <div class="row q-pb-md">
          <div class="col-2 self-center">
            <q-avatar>
              <q-img :src="`${Setting.storageUrl}/${lessonplan.user.avatar}`" no-default-spinner />
            </q-avatar>
          </div>
          <div class="col-10 self-center">
            <div class="q-pl-sm text-body1 text-black text-bold">{{ lessonplan.user.name }}</div>
            <div
              class="q-pl-sm text-caption text-grey"
            >{{ lessonplan.created_at | moment("from", "now") }}</div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div
              class="text-body2"
              style="overflow-wrap:break-word; white-space:pre-line"
              v-html="lessonplan.description"
              v-linkified
            ></div>
          </div>
        </div>
        <!-- <div class="row justify-start q-pt-md"></div> -->
      </div>
      <q-separator />
      <q-list class="rounded-borders q-pt-sm">
        <!-- <q-item-label header>Komentar</q-item-label> -->

        <item-component v-for="comment in lessonplan.comments" :key="comment.id" :comment="comment"></item-component>
      </q-list>
    </q-page-container>

    <q-footer style="padding:10px;background-color:#d1c4e9; max-height:500px;">
      <q-input
        dense
        rounded
        outlined
        clearable
        autogrow
        type="textarea"
        label="Tulis sesuatu"
        v-model="comment.value"
        color="deep-purple"
        bg-color="white"
        ref="keyboard"
        rows="3"
      >
        <template v-slot:after>
          <div>
            <q-btn flat round icon="send" :loading="loading" :disable="loading" @click="store()" />
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
    ItemComponent: () => import("components/lessonplan/comment/ItemComponent")
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
      comment: {
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
        value: this.comment.value
      };
      this.$store
        .dispatch("LessonPlanComment/store", payload)
        .then(res => {
          // if (this.lessonplan.user.id != this.Auth.auth.id) this.sendNotif();
          this.lessonplan.comments.splice(0, 0, res.data);
          this.lessonplan.comments_like += 1;
          this.comment.value = "";
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
