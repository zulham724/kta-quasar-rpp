<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-icon name="home" color="deep-purple" size="sm" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Home</div>
        </q-toolbar-title>
        <q-btn
          round
          flat
          icon="help_outline"
          color="deep-purple"
          @click="$router.push('/information')"
        />
      </q-toolbar>
    </q-header>
    <q-page class="bg-deep-purple-1 q-pa-sm">
      <q-pull-to-refresh @refresh="onRefresh" color="deep-purple">
        <q-infinite-scroll @load="onLoad" :offset="250">
          <q-intersection
            v-for="lessonplan in LessonPlan.items.data"
            :key="lessonplan.id"
            :style="
            `min-height: 80vh;`"
          >
            <item-component :lessonplan="{...lessonplan}"></item-component>
          </q-intersection>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="deep-purple" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-pull-to-refresh>
    </q-page>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    ItemComponent: () => import("components/lessonplan/ItemComponent.vue")
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["Auth", "Setting", "LessonPlan"])
  },
  mounted() {
    if (!this.LessonPlan.items.data) this.$store.dispatch("LessonPlan/index");
  },
  methods: {
    onRefresh(done) {
      this.$store.dispatch("LessonPlan/index").then(res => {
        done();
      });
    },
    onLoad(index, done) {
      this.LessonPlan.items.next_page_url
        ? this.$store
            .dispatch("LessonPlan/next", this.LessonPlan.items.next_page_url)
            .then(res => {
              this.$store.commit("LessonPlan/next", { items: res.data });
              done();
            })
        : done();
    }
  }
};
</script>

<style></style>
