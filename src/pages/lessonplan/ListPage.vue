<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-btn color="purple" flat dense icon="arrow_back" @click="$router.back()" />
            <q-toolbar-title>
                <div class="text-body2 text-purple text-bold">RPP</div>
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page v-if="user">
        <q-intersection v-for="lessonplan in user.lesson_plans" :key="lessonplan.id" :style="
        `min-height: 80vh;`" :id="`item${lessonplan.id}`">
            <item-component :isSelf="true" :lessonplan="lessonplan"></item-component>
        </q-intersection>
    </q-page>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import {
    scroll
} from "quasar";
const {
    getScrollTarget,
    setScrollPosition
} = scroll;
export default {
    props: {
        lessonplanId: null,
        userId: null
    },
    components: {
        ItemComponent: () => import("components/lessonplan/ItemComponent.vue")
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
        this.init().then(res => {
            this.handleScroll()
        })
    },
    methods: {
        init(done) {
            return new Promise((resolve, reject) => {
                this.$store
                    .dispatch("User/show", this.userId)
                    .then(res => {
                        this.user = res.data;
                        resolve(res);
                        if (done) done();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        handleScroll() {
            const ele = document.getElementById(`item${this.lessonplanId}`) // You need to get your element here
            // console.log(ele)
            const target = getScrollTarget(ele)
            const offset = ele.offsetTop
            const duration = 10
            setScrollPosition(target, offset, duration)
        },
    }
};
</script>

<style></style>
