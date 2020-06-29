<template>
  <q-layout view="hHr lpR fFr">
    <q-page-container>
      <!-- <keep-alive> -->
      <router-view />
      <!-- </keep-alive> -->
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-tabs
        v-model="tab"
        no-caps
        stretch
        class="text-grey"
        active-color="deep-purple"
        indicator-color="transparent"
        align="justify"
      >
        <q-tab
          name="home"
          icon="home"
          @click="$route.name == 'home' ? null : $router.push('/')"
        />
        <!-- Menu untuk pengawas  -->
        <q-tab
          v-if="Auth.auth.role_id == 7"
          name="guidedusers"
          icon="supervisor_account"
          @click="$route.name == 'guidedusers' ? null : $router.push('/follow')"
        />
        <!-- -------------------- -->
        <q-tab
          v-else
          name="create"
          icon="add"
          @click="$route.name == 'create' ? null : $router.push('/create')"
        />
        <q-tab
          name="search"
          icon="search"
          @click="$route.name == 'search' ? null : $router.push('/search')"
        />
        <q-tab
          name="account"
          @click="
            $route.name == 'account'
              ? null
              : Auth.auth.role_id == 7
              ? $router.push('/observer')
              : $router.push('/account')
          "
        >
          <template v-slot:default>
            <div>
              <q-avatar size="sm">
                <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" />
              </q-avatar>
            </div>
          </template>
        </q-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MainLayout",
  data() {
    return {
      tab: this.$route.name
    };
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  mounted() {},
  methods: {}
};
</script>
