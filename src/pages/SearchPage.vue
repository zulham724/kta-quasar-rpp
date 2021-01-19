<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.back()" />
            <q-toolbar-title>
                <q-input dense color="deep-purple" square v-model="search" label="Cari" borderless class="q-ml-sm q-mr-sm" @input="onSearch">
                    <template v-slot:after>
                        <q-icon name="search" color="deep-purple" />
                    </template>
                </q-input>
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page class="bg-deep-purple-1 q-pa-sm">
        <div class="row">
            <div class="col-12 q-mb-sm">
              <q-select :loading="loading" @input="onSearch" option-value="id" option-label="name" v-model="model" :options="EducationalLevel.items" label="Pilih Jenjang" />

            </div>
        </div>
        <q-infinite-scroll @load="onLoad" :offset="250">
            <q-intersection v-for="lessonplan in lessonplans.data" :key="lessonplan.id" :style="
            `min-height: 70vh`">
                <item-component :isSelf="true" :lessonplan="lessonplan"></item-component>
            </q-intersection>
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner-dots color="deep-purple" size="40px" />
                </div>
            </template>
        </q-infinite-scroll>
    </q-page>
</div>
</template>

<script>
import {
    debounce
} from "quasar";
import {
    mapState
} from "vuex";
export default {
    components: {
        ItemComponent: () => import("components/lessonplan/ItemComponent.vue")
    },
    data() {
        return {
            search: "",
            loading: false,
            lessonplans: {},
            model:null,
           
        };
    },
    computed: {
        ...mapState(["EducationalLevel","Auth"])
    },
    created(){
        //get auth educationallevel
        this.model = {id:this.Auth.auth.profile.educational_level_id, name:this.Auth.auth.profile.educational_level.name};
        this.onSearch();
        //cek items educationallevel modul
        if(this.EducationalLevel.items.length==0){
            this.$store.dispatch("EducationalLevel/index");
        }
    },
    mounted() {
        this.onSearch = debounce(this.onSearch, 1000);
    },
    methods: {
        onSearch() {
            if (this.search!=null) {
                this.loading = true;
                this.$store
                    .dispatch("LessonPlan/search", {search:this.search, educational_level_id:this.model.id})
                    .then(res => {
                        this.lessonplans = res.data;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        onLoad(index, done) {
            this.lessonplans.next_page_url ?
                this.$store
                .dispatch("LessonPlan/next", this.lessonplans.next_page_url)
                .then(res => {
                    const lessonplans = {
                        ...res.data,
                        data: [...this.lessonplans.data, ...res.data.data]
                    };
                    this.lessonplans = lessonplans;
                    done();
                }) :
                done();
        }
    }
};
</script>

<style>
</style>
