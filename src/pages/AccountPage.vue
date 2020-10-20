<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-icon name="person" color="deep-purple" size="sm" />
            <q-toolbar-title>
                <div class="text-body2 text-deep-purple text-bold">Profil</div>
            </q-toolbar-title>
            <q-btn icon="settings" color="deep-purple" dense flat @click="settings = true" />
            <q-dialog v-model="settings" transition-show="scale" transition-hide="scale">
                <q-card flat class="q-pa-md bg-grey-3" style="width:60vw">
                    <div class="text-h6 text-center q-mb-sm">Pengaturan</div>
                    <q-btn color="deep-purple" class="full-width q-my-xs" @click="$router.push('/account/edit')">
                        <span class="material-icons q-mr-xs text-h6">edit</span>
                        <span class="vertical-middle q-mx-xs">UBAH PROFIL</span>
                    </q-btn>
                    <q-btn color="deep-purple" class="full-width q-my-xs" @click="onLogout">
                        <span class="material-icons q-mr-xs text-h6">exit_to_app</span>
                        <span class="vertical-middle q-mx-xs">KELUAR</span>
                    </q-btn>
                    <q-btn color="deep-purple" class="full-width q-my-xs" v-close-popup>
                        <span class="vertical-middle q-mx-xs">CANCEL</span>
                    </q-btn>
                </q-card>
            </q-dialog>
        </q-toolbar>
    </q-header>
    <q-page>
        <q-pull-to-refresh @refresh="getAuth" color="deep-purple">
            <div class="profile-header text-white">
                <div class="q-pa-md profile-header-inner">
                    <div class="row">
                        <div class="col-4">
                            <div class="row justify-start align-center">
                                <q-avatar size="27vw" @click="zoom(Auth.auth.avatar)">
                                    <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" no-default-spinner />
                                </q-avatar>
                            </div>
                        </div>
                        <div class="col-8">
                            <div class="row">
                                <div class="text-h6">{{ Auth.auth.name }}</div>
                            </div>
                            <div class="row">
                                <div class="text-caption" v-if="Auth.auth.kta_id">
                                    No Anggota: {{ Auth.auth.kta_id }}
                                </div>
                            </div>
                            <div class="row">
                                <div class="text-caption" v-linkified style="overflow-wrap:break-word; white-space:pre-line">
                                    {{ Auth.auth.profile.long_bio }}
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row q-pa-sm">
                                <div class="col-3">
                                    <div class="text-h5 text-bold">
                                        {{ Auth.auth.lesson_plans_count }}
                                    </div>
                                    <div class="text-body2 text-grey-4">RPP</div>
                                </div>
                                <q-separator vertical color="grey-4" />
                                <div class="col-4 q-ml-lg">
                                    <div class="text-h5 text-bold">
                                        {{ Auth.auth.lesson_plans_my_likes_count }}
                                    </div>
                                    <div class="text-body2 text-grey-4">Menyukai</div>
                                </div>

                                <div class="col-4">
                                    <div class="text-h5 text-bold">
                                        {{ Auth.auth.lesson_plans_likes_count }}
                                    </div>
                                    <div class="text-body2 text-grey-4">Disukai</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--
        <div class="row">
          <div class="col-12">
            <q-btn-group spread>
              <q-btn dense @click="$router.push('/account/edit')">
                <div class="text-caption">Edit Profile</div>
              </q-btn>
            </q-btn-group>
          </div>
        </div>
        -->
            <div class="profile-content full-height">
                <div class="q-pt-sm profile-content-inner">
                    <div class="q-pa-sm q-px-md">
                        <div class="row justify-between">
                            <div class="text-h6 q-ml-md">Buku RPP</div>
                            <q-btn class="text-white q-px-sm" rounded dense style="background-color:#564395" @click="$router.push(`/MoreLessonPlans/${Auth.auth.id}`)">Lihat Semua</q-btn>
                        </div>
                    </div>
                    <div class="q-ml-xl q-mt-md">
                        <RecycleScroller direction="horizontal" style="height:300px" :items="Auth.auth.lesson_plans" :item-size="210" key-field="id" v-slot="{ item }">
                            <item-component :lessonplan="item" />
                        </RecycleScroller>
                    </div>
                </div>
            </div>
        </q-pull-to-refresh>
    </q-page>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import ImageZoomer from "components/ImageZoomerComponent.vue";
import Slick from "vue-slick";
export default {
    props: {
        item: null
    },
    data() {
        return {
            settings: false
        };
    },
    components: {
        ItemComponent: () => import("components/lessonplan/account/ItemComponent.vue")
    },
    computed: {
        ...mapState(["Auth", "Setting"])
    },
    created() {
        this.onRefresh();
    },
    methods: {

        next() {
            this.$refs.slick.next();
        },

        prev() {
            this.$refs.slick.prev();
        },

        reInit() {
            // Helpful if you have to deal with v-for to update dynamic lists
            this.$nextTick(() => {
                this.$refs.slick.reSlick();
            });
        },
        onRefresh(done) {
            this.$store.dispatch("Auth/getAuth").then(res => {
                this.$store.dispatch("LessonPlan/index").then(res => {
                    if (done) done();
                });
            });
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
        openLessonPlan() {
            this.$router.push({
                name: "lessonplan",
                params: {
                    lessonplan: this.item
                }
            });
        }
    }
};
</script>

<style>
.profile-header {
    background-color: #ffffff;
    width: 100%;
}

.profile-header-inner {
    background-color: #564395;
    border-radius: 0px 0px 70px 0px;
    width: 100%;
}

.profile-header-inner a {
    color: #d1c4e9;
}

.profile-content {
    background-color: #564395;
    width: 100%;
}

.profile-content-inner {
    background-color: #ffffff;
    width: 100%;
    border-radius: 70px 0px 0px 0px;
}

.mycard {
    width: 200px;
    background-color: #d1c4e9;
}
</style>
