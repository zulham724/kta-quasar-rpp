<template>
<div>
    <q-card class="mycard" @click="$router.push(`/user/lessonplanlist/${Auth.auth.id}/${lessonplan.id}`)">
        <q-card-section>
            <div style="height:200px" class="row justify-center">
                <q-skeleton width="100%" height="100%" style="position:relative;z-index:1" v-if="imageLoaded" />
                <div v-ripple:white class="bg-grey row justify-center" style="width:100%;height:100%;position:relative;z-index:2" v-if="!imageLoaded">
                    <div class="q-pa-md self-center text-center" style="font-size:11px">Image couldn't be Loaded.</div>
                </div>
                <!--<div v-ripple:white class="bg-grey row justify-center text-center" style="width:40vw;height:40vw;position:absolute;z-index:2">
                                                <div class="self-center">Image couldn't be Loaded.</div>
                                            </div>-->
                <q-img @error="imgError" style="z-index:3;position:absolute;" :src="lessonplan.cover == null ? `https://cdn.qubicle.id/images/2019/02/15/be26ee32-34a8-407a-a712-3a3e61cdaff8.jpg`
                    :`${Setting.storageUrl}/${lessonplan.cover.image}`"></q-img>
            </div>
            <div class="text-body1">{{ lessonplan.topic }}</div>
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
        lessonplan: {}
    },
    data() {
        return {
            settings: false,
            imageLoaded: true
        }
    },
    computed: {
        ...mapState(["Auth", "Setting"]),

    },
    methods: {
        imgError() {
            this.imageLoaded = false;
        },
    }
}
</script>

<style>
.mycard {
    width: 200px;
    background-color: #d1c4e9;
}
</style>
