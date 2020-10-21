<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
            <q-toolbar-title>
                <div class="text-body2 text-deep-purple text-bold" v-if="user">{{ user.name }}</div>
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page v-if="user">
        <q-pull-to-refresh @refresh="getAuth" color="deep-purple">
            <div class="profile-header text-white">
                <div class="q-pa-md profile-header-inner">
                    <div class="row">
                        <div class="col-4">
                            <div class="row justify-start align-center">
                                <q-avatar size="27vw" @click="zoom(user.avatar)">
                                    <q-img :src="`${Setting.storageUrl}/${user.avatar}`" no-default-spinner />
                                </q-avatar>
                            </div>
                        </div>
                        <div class="col-8">
                            <div class="row">
                                <div class="text-h6">{{user.name }}</div>
                            </div>
                            <div class="row">
                                <div class="text-caption" v-if="user.kta_id">No Anggota: {{ user.kta_id }}</div>
                            </div>
                            <div class="row">
                                <div class="text-caption" v-linkified style="overflow-wrap:break-word; white-space:pre-line">{{ user.profile.long_bio }}</div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row q-pa-sm">
                                <div class="col-3">
                                    <div class="text-h5 text-bold">{{ user.lesson_plans_count }}</div>
                                    <div class="text-body2 text-grey-4">RPP</div>
                                </div>
                                <q-separator vertical color="grey-4" />
                                <div class="col-4 q-ml-lg">
                                    <div class="text-h5 text-bold">{{ user.lesson_plans_my_likes_count }}</div>
                                    <div class="text-body2 text-grey-4">Menyukai</div>
                                </div>

                                <div class="col-4">
                                    <div class="text-h5 text-bold">{{ user.lesson_plans_likes_count }}</div>
                                    <div class="text-body2 text-grey-4">Disukai</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-content full-height">
                <div class="q-pt-sm profile-content-inner">
                    <div class="q-pa-sm q-px-md">
                        <div class="row justify-between">
                            <div class="text-h6 q-ml-md">Buku RPP</div>
                            <q-btn class="text-white q-px-sm" rounded dense style="background-color:#564395" @click="$router.push(`/MoreLessonPlans/${user.id}`)">Lihat Semua</q-btn>
                        </div>
                    </div>
                    <div class="q-ml-xl q-mt-md">
                        <RecycleScroller direction="horizontal" style="height:300px" :items="user.lesson_plans" :item-size="210" key-field="id" v-slot="{ item }">
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
export default {
    props: {
        userId: null
    },
    components: {
        ItemComponent: () => import("components/lessonplan/account/ItemComponent.vue")
    },
    computed: {
        ...mapState(["Auth", "Setting"])
    },
    data() {
        return {
            user: null
        };
    },
    mounted() {
        if (this.userId == this.Auth.auth.id)
            this.$router.push({
                name: "account"
            });
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch("User/show", this.userId).then(res => {
                this.user = res.data;
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
        openLessonPlan() {}
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
