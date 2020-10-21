<template>
<div style="width:100%">
    <q-card class="q-mb-sm" v-if="lessonplan != null">
        <q-card-section style="padding-bottom:0">
            <div class="row">
                <div class="col-2 self-center">
                    <q-avatar size="xl" @click="$router.push(`/user/profile/${lessonplan.user.id}`)">
                        <q-img :src="`${Setting.storageUrl}/${lessonplan.user.avatar}`" no-default-spinner />
                    </q-avatar>
                </div>
                <div class="col-8 self-center">
                    <div class="row">
                        <div class="text-bold text-body1 text-weight-bold" @click="$router.push(`/user/profile/${lessonplan.user.id}`)">{{ lessonplan.user.name }}</div>
                    </div>
                </div>
                <div class="col-2 self-center">
                    <div class="row justify-end">
                        <q-btn v-if="Auth.auth.id == lessonplan.user.id" flat round dense size="md" icon="more_vert" @click="showMenu()" />
                    </div>
                </div>
            </div>
        </q-card-section>
        <q-card-section style="padding-bottom:0;" class="q-pt-md">
            <div class="row">
                <div class="col-12">
                    <div class="text-body2 q-pb-sm" style="overflow-wrap:break-word; white-space:pre-line" v-html="
                lessonplan.description.length > 100
                  ? isReadMore
                    ? `${lessonplan.description}`
                    : `${lessonplan.description.substring(0, 100)}... `
                  : lessonplan.description
              " v-linkified></div>
                    <div v-if="lessonplan.description.length > 100 && isReadMore == false" @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)" class="text-caption text-grey">Readmore</div>
                </div>
            </div>
        </q-card-section>
        <q-card-section class="q-pa-none">

            <div :style="`min-height:${minHeight};min-width:100%;`">
                <q-skeleton size="100%" style="position:absolute;z-index:1" />
                <div @click="()=>{useDefaultImage=true}" v-ripple:white class="bg-grey row justify-center" style="width:100%;height:100%;position:absolute;z-index:2" v-if="!imageLoaded">
                    <div class="self-center">Image couldn't be Loaded.</div>
                </div>
                <q-img @error="imgError" style="position:relative;z-index:3" no-default-spinner :src="lessonPlanImage" @click="openLessonPlan()">
                    <div class="q-pa-md full-height full-width">
                        <div class="row" style="position:absolute;right:5%" v-if="lessonplan.user.id == Auth.auth.id">
                            <div v-if="lessonplan.ratings_value_count">
                                <q-icon name="star" size="sm" color="deep-purple"></q-icon>
                                <div class="text-caption text-deep-purple">{{ lessonplan.ratings_value_count/lessonplan.ratings.length }}</div>
                            </div>
                        </div>
                        <div class="row justify-center full-height">
                            <div class="col-4 text-center self-center">
                                <div class="text-caption">{{ lessonplan.topic }}</div>
                                <div class="text-caption">Kelas {{ lessonplan.grade.description }}</div>
                                <div class="text-caption q-pt-md">Oleh {{ lessonplan.user.name }}</div>
                            </div>
                        </div>
                    </div>
                </q-img>
            </div>
        </q-card-section>
        <q-card-section>
            <div class="row">
                <div class="col self-center">
                    <div class="row">
                        <div class="text-caption text-bold" v-show="lessonplan.likes_count" @click="$router.push(`/lessonplan/like/${lessonplan.id}`)">{{ lessonplan.likes_count }} Suka</div>
                    </div>
                </div>
                <div v-if="Auth.auth.role_id === 7" class="col self-center">
                    <q-rating v-if="
              Auth.auth.profile.city_id
                ? lessonplan.user.profile
                  ? Auth.auth.profile.city_id ===
                    lessonplan.user.profile.city_id
                  : false
                : false
            " color="deep-purple" v-model="lessonplan.rated_value_count" @input="rate()"></q-rating>
                </div>
                <div class="col">
                    <div class="row justify-end">
                        <div v-show="lessonplan.is_lock === 0">
                            <q-btn flat round icon="edit" @click="duplicate()" />
                        </div>
                        <q-btn flat round :color="lessonplan.liked_count ? 'red' : null" :icon="lessonplan.liked_count ? 'favorite' : 'favorite_border'" @click="lessonplan.liked_count ? dislike() : like()" />

                        <q-btn @click="$router.push(`/lessonplan/${lessonplan.id}/review`)" icon="spellcheck" round flat v-if="
                  Auth.auth.profile.city_id
                    ? lessonplan.user.profile
                      ? (Auth.auth.profile.city_id ===
                          lessonplan.user.profile.city_id && Auth.auth.role_id == 7) ||
                        lessonplan.user.id == Auth.auth.id
                      : false
                    : false
                "></q-btn>
                        <q-btn v-if="Auth.auth.role_id !== 7" flat round icon="message" @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)" />
                    </div>
                </div>
            </div>
            <div class="row justify-between">
                <div class="text-caption text-grey" @click="$router.push(`/lessonplan/${lessonplan.id}/comment`)">
                    {{
            lessonplan.comments.length
            ? `Lihat Semua ${lessonplan.comments.length} Komentar`
            : "Lihat Komentar"
            }}
                </div>
                <div class="text-caption text-grey">{{ lessonplan.created_at | moment("from", "now") }}</div>
            </div>
        </q-card-section>
    </q-card>
</div>
</template>

<script>
import {
    mapState
} from "vuex";

export default {
    props: {
        lessonplan: null,
        isSelf: false,
    },
    components: {},
    computed: {
        ...mapState(["Setting", "Auth"]),
        lessonPlanImage: function () {
            if (!this.imageLoaded && this.useDefaultImage) {
                if (this.isSelf) {
                    this.lessonplan.cover.image = this.defaultImage;
                }
                this.$store.commit("LessonPlan/setCoverImage", {
                    lesson_plan_id: this.lessonplan.id,
                    image: this.defaultImage
                });
                return `${this.Setting.storageUrl}/${this.defaultImage}`;
            } else {
                return `${this.Setting.storageUrl}/${this.lessonplan.cover.image}`;
            }
        },
        minHeight: function () {
            return this.$q.platform.is.mobile ? '80vw' : '30vw';
        }
    },
    data() {
        return {
            slide: 0,
            isReadMore: false,
            dialog: false,
            imageLoaded: true,
            defaultImage: 'templates/October2020/UfVdGqHQYyZW3lq7TWye.png',
            lessonplan_duplicate: {},
            useDefaultImage: false,
            srcSuccess: false
        };
    },
    created() {
        this.lessonplan.rated_value_count ?
            (this.lessonplan.rated_value_count = parseInt(
                this.lessonplan.rated_value_count
            )) :
            (this.lessonplan.rated_value_count = 0);
    },
    methods: {
        imgError() {
            this.imageLoaded = false;
        },
        duplicate() {
            this.$q
                .dialog({
                    title: "Konten untuk Postingan Ini",
                    prompt: {
                        model: "",
                        type: "text" // optional
                    },
                    cancel: true,
                    persistent: true
                })
                .onOk(data => {
                    this.lessonplan_duplicate = this.lessonplan;
                    this.lessonplan_duplicate.user = this.Auth.auth;
                    this.lessonplan_duplicate.id = null;
                    this.lessonplan_duplicate.user_id = this.Auth.auth.id;
                    this.lessonplan_duplicate.description = data;
                    this.$store
                        .dispatch("LessonPlan/duplicate", this.lessonplan_duplicate)
                        .then(res => {
                            this.$q.notify("RPP Berhasil Terduplikat");
                        })
                        .catch(err => {
                            this.$q.notify("Terjadi kesalahan");
                        });
                });
        },
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
                        this.lessonplan.user.id == this.Auth.auth.id ? {
                            label: "Download",
                            icon: "cloud_download",
                            color: "deep-purple",
                            id: "download"
                        } :
                        false,
                        this.lessonplan.user.id == this.Auth.auth.id ? {
                            label: "Edit",
                            icon: "edit",
                            color: "deep-purple",
                            id: "edit"
                        } :
                        false,
                        this.lessonplan.user.id == this.Auth.auth.id ? {
                            label: "Lihat Penilai",
                            icon: "visibility",
                            color: "deep-purple",
                            id: "observer"
                        } :
                        false,
                        this.lessonplan.user.id == this.Auth.auth.id ? {
                            label: "Hapus",
                            icon: "delete_outline",
                            color: "deep-purple",
                            id: "destroy"
                        } :
                        false
                    ]
                })
                .onOk(action => {
                    // console.log('Action chosen:', action.id)
                    if (action.id == "edit") {
                        this.$router.push(`/lessonplan/${this.lessonplan.id}/edit`);
                    }
                    if (action.id == "download") {
                        this.download();
                    }
                    if (action.id == "destroy") {
                        this.destroy();
                    }
                    if (action.id == "observer") {
                        this.$router.push(`/lessonplan/${this.lessonplan.id}/observer`);
                    }
                })
                .onCancel(() => {
                    // console.log('Dismissed')
                })
                .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                });
        },
        download() {
            let ref = cordova.InAppBrowser.open(
                `${this.Setting.url}/api/v1/lessonplans/download/${this.lessonplan.id}`,
                "_system",
                "location=no,zoom=no"
            );
        }
    }
};
</script>

<style>
.q-img__content>div {
    color: black;
    background: none;
}
</style>
