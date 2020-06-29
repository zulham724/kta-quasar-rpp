<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-icon color="deep-purple" size="sm" name="supervisor_account"></q-icon>
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Daftar guru binaan</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          v-for="educationallevel in educationallevels"
          :key="educationallevel.id"
          expand-separator
          icon="perm_identity"
          :label="educationallevel.name"
        >
          <q-card>
            <q-card-section>
              <q-list v-for="person in educationallevel.users" :key="person.id">
                <q-item>
                  <q-item-section
                    avatar
                    @click="
                      Auth.auth.follows.filter(guide => guide.id == person.id)
                        .length
                        ? unfollow(person.id)
                        : follow(person.id)
                    "
                  >
                    <q-btn color="deep-purple" flat icon="check_box" v-if="
                        Auth.auth.follows.filter(guide => guide.id == person.id)
                          .length
                      "></q-btn>
                    <q-btn color="deep-purple" flat v-else icon="check_box_outline_blank"></q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ person.name }}</q-item-label>
                    <q-item-label caption
                      >Memiliki
                      {{ person.lesson_plans_count }} RPP</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-page>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  // name: 'PageName',
  computed: {
    ...mapState(["EducationalLevel", "Auth"])
  },
  data() {
    return {
      educationallevels: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch("EducationalLevel/getByCity").then(res => {
        this.educationallevels = res.data;
      });
    },
    follow(childId) {
      this.$store.dispatch("Follow/store", childId).then(res => {
        this.$store.dispatch("Auth/getAuth");
      });
    },
    unfollow(childId) {
      this.$store.dispatch("Follow/destroy", childId).then(res => {
        this.$store.dispatch("Auth/getAuth");
      });
    }
  }
};
</script>
