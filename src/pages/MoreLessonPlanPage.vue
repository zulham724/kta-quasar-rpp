<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Buku RPP</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page padding class="bg-deep-purple-2">
      <!-- content -->
      <q-list v-for="lessonplan in user.lesson_plans" :key="lessonplan.id">
        <q-item
          clickable
          class="lessonplan row q-mb-xs bg-white"
          @click="$router.push(`/user/lessonplanlist/${user.id}/${lessonplan.id}`)"
        >
          <q-item-section top class="col-4">
            <q-img
              :src="lessonplan.cover == null ? `https://cdn.qubicle.id/images/2019/02/15/be26ee32-34a8-407a-a712-3a3e61cdaff8.jpg`
                    :`${Setting.storageUrl}/${lessonplan.cover.image}`"
            ></q-img>
          </q-item-section>
          <q-item-section top class="col-8">
            <div class="text-body1 text-bold">{{ lessonplan.topic }}</div>
            <div class="text-body2">{{ lessonplan.subject }}</div>
            <div class="text-body2">{{ lessonplan.grade.description }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    userId: null
  },
  data() {
    return {
      user: null
    };
  },
  computed: {
    ...mapState(["Auth", "Setting"])
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch("User/show", this.userId).then(res => {
        this.user = res.data;
      });
    }
  }
};
</script>
<style>
.lessonplan {
  /*border: 4px solid #b39ddb; */
  border-radius: 10px;
}
</style>
