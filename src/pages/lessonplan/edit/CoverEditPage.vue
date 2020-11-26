<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-btn flat dense icon="arrow_back" class="text-deep-purple" @click="$router.back()" />
            <q-toolbar-title>
                <div class="text-body2 text-deep-purple text-bold">Edit Sampul RPP</div>
            </q-toolbar-title>
            <q-btn flat text-color="deep-purple" @click="saveCover" :disable="loading" label="SIMPAN" />
        </q-toolbar>
    </q-header>
    <q-page>
         <div class="row justify-center q-ma-sm">
            <sampul-maker :configs="[{name:'size'},{name:'fontfamily'},{name:'color'}]" ref="myCanvas">
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
                <template v-slot:color="{item}">
                    Warna teks
                    <q-color v-model="item.color" />

                </template>
                <template v-slot:size="{item}">
                    Ukuran teks
                    <q-slider label v-model="item.size" :min="1" :max="20" />
                </template>
                <template v-slot:fontfamily="{item}">
                    Jenis font

                    <q-select dense outlined v-model="item.fontfamily" :options="fontoptions" label="Jenis font" />

                </template>
            </sampul-maker>
         </div>
    </q-page>
</div>
</template>

<script>
import SampulMaker from 'components/SampulMaker/SampulMaker.vue';

import {
    mapState
} from "vuex";
import {
    debounce
} from 'quasar';
export default {
    props:{
        lesson_plan_cover:null,
    },
     components: {
        'SampulMaker': SampulMaker
    },
    data() {
        return {
            loading:false,
            fontoptions: ['Arial', 'Dancing Script', 'Roboto', 'Vampiro One', 'Domine'],
               items: [],
        };
    },
    computed: {
        ...mapState(["Cover", "Auth", "Setting", "Grade", "LessonPlanFormat","LessonPlanEditDraft"])
    },
    created(){
       console.log(this.LessonPlanEditDraft.build)
    },
    watch:{
       
    },
    mounted() {
        if(!this.lesson_plan_cover){
            this.$router.back();
            this.$q.notify('Pilih sampul dulu');
            return;
        }
        // this.$store.commit("LessonPlanEditDraft/setCanvasImage", {
        //     canvas_image: null
        // });

        // let grade = this.Grade.items.find(item=>item.id == this.LessonPlanEditDraft.build.grade_id);
        this.items = [
        {
            text:this.LessonPlanEditDraft.build.topic,
            y:250,
            size: 7,
            fontfamily: 'Arial',
            color:'#000000'
        },{
            text:this.LessonPlanEditDraft.build.subject?"Mata Pelajaran: "+this.LessonPlanEditDraft.build.subject:'',
            y:600,
            size: 6,
            fontfamily: 'Arial',
             color:'#000000'
        }
        ,{
            text:'Kelas '+this.LessonPlanEditDraft.build.grade.description,
            y:1200,
            size: 6,
            fontfamily: 'Arial',
            color:'#000000'
        },{
            text:'Oleh '+this.Auth.auth.name,
            y:1400,
            size: 6,
            fontfamily: 'Arial',
            color:'#000000'
        }];

        this.LessonPlanEditDraft.build.canvas_data.items.forEach((item, i) => {
            //console.log(item)
            this.items[i].x = item.x;
            this.items[i].y = item.y;
            this.items[i].fontfamily = item.fontfamily ? item.fontfamily : 'Arial';
            this.items[i].color = item.color;
            this.items[i].size = item.size;
        });

        this.$refs.myCanvas.setImage(this.Setting.storageUrl+'/'+this.lesson_plan_cover.image);
        this.$refs.myCanvas.setItems(this.items);
        this.$refs.myCanvas.initialize().then(res => {
            // this.loading = false;
            // console.log(this.$refs.myCanvas.toDataURL());
        });
    },
    methods: {
       saveCover() {

            let canvas_data = [];
            this.loading=true;
            this.$refs.myCanvas.getContainers().forEach(container => {
                console.log(container.index)
                canvas_data.push({
                    x: container.x,
                    y: container.y,
                    fontfamily: this.items[container.index].fontfamily,
                    color: this.items[container.index].color,
                    size: this.items[container.index].size,
                    //color:container.
                })
            });
          
            this.$store.commit("LessonPlanEditDraft/setCanvasData", {
                canvas_data: canvas_data,
                image: this.LessonPlanEditDraft.build.lesson_plan_cover.image
            });
            this.$store.commit("LessonPlanEditDraft/setCanvasImage", {
                canvas_image: this.$refs.myCanvas.toDataURL()
            });
             this.$store.commit("LessonPlanEditDraft/setLessonPlanCover", {
                lesson_plan_cover: this.lesson_plan_cover
            });
            // console.log('babi')
            // console.log(this.Module.build.canvas_image)
            this.$router.push('/lessonplan/'+this.LessonPlanEditDraft.build.id+'/edit');

        },
        resetCover() {
            //   this.items = ;
            const default_attr = [
            {
                text:this.LessonPlanEditDraft.build.topic,
                y:300,
                size: 10,
                fontfamily: 'Arial'
            },{
            text:'Kelas '+this.LessonPlanEditDraft.build.grade.description,
                y:500,
                size: 6,
                fontfamily: 'Arial'
            },{
                text:'Oleh '+this.Auth.auth.name,
                y:1000,
                size: 6,
                fontfamily: 'Arial'
            }];
            default_attr.forEach((item, i) => {
                // this.items[i].x = item.x
                this.items[i].fontfamily = 'Arial';
                this.items[i].y = item.y
                this.items[i].size = item.size
            });
            this.$refs.myCanvas.refreshCanvas();
        },
    }
};
</script>

<style></style>
