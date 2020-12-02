<template>
<div>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-icon name="home" color="deep-purple" size="sm" />
            <q-toolbar-title>
                <div class="text-body2 text-deep-purple text-bold">Buat RPP baru</div>
            </q-toolbar-title>
            <q-btn flat text-color="deep-purple" label="Kirim" @click="onSubmit()" />
        </q-toolbar>
    </q-header>
    <q-page class="bg-deep-purple-8">
        <div>
            <q-form ref="form" @submit="onSubmit">
                <div class="row q-py-md q-pl-md bg-white q-mb-md" style="width:95%;border-radius:0 0 30px 0;">
                    <div class="text-h6 text-grey-10">Sampul Buku RPP</div>
                    <RecycleScroller direction="horizontal" style="height:20vh;padding-top:10px;" :items="Cover.items" :item-size="150" key-field="id" v-slot="{ item }">
                        <div>
                            <q-card @click="selectCover(item)" style="height:15vh;width:15vh">
                                <q-card-section class="q-pa-none">
                                    <q-img v-if="lessonplan.lesson_plan_cover.id == item.id && lessonplan.canvas_image" no-default-spinner :src="`${lessonplan.canvas_image}`" height="200" width="200"></q-img>
                                    <q-img v-else no-default-spinner :src="`${Setting.storageUrl}/${item.image}`" height="200" width="200"></q-img>
                                </q-card-section>
                            </q-card>
                            <div class="text-caption">
                                {{ item.name }}
                                <q-icon v-show="lessonplan.lesson_plan_cover.id == item.id" color="green" name="check_circle_outline"></q-icon>
                            </div>
                        </div>
                    </RecycleScroller>
                </div>
                <div class="row justify-end">
                    <div class="bg-deep-purple-2 text-white q-pa-md justify-end q-mb-sm" style="width:95%;border-radius:30px 0 0 30px;">
                        <div class="text-h6 q-mb-sm text-grey-10">Detail Informasi</div>
                        <div class="row">
                            <div class="col-12">
                                <div class="text-body-2 text-deep-purple-9">Konten untuk Postingan ini</div>
                                <q-input class="detail-input" dense placeholder="Konten untuk Postingan ini" color="deep-purple" v-model="lessonplan.description" :rules="[val => !!val || 'Harus diisi']" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="text-body-2 text-deep-purple-9">Mata Pelajaran</div>
                                <q-input dense placeholder="Mata Pelajaran" color="deep-purple" v-model="lessonplan.subject" :rules="[val => !!val || 'Harus diisi']" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="text-body-2 text-deep-purple-9">Materi Pokok</div>
                                <q-input dense placeholder="Materi Pokok" color="deep-purple" v-model="lessonplan.topic" :rules="[val => !!val || 'Harus diisi']" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="text-body-2 text-deep-purple-9">Kelas</div>
                                <q-select dense placeholder="Kelas" color="deep-purple" v-model="lessonplan.grade_id" :options="Grade.items" option-value="id" option-label="description" emit-value :rules="[val => !!val || 'Harus diisi']">
                                    <template v-slot:selected v-if="lessonplan.grade_id">
                                        <div>{{Grade.items.find(item=>item.id == lessonplan.grade_id).description}}</div>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="text-body-2 text-deep-purple-9">Durasi</div>
                                <q-input dense placeholder="Durasi" color="deep-purple" v-model="lessonplan.duration" :rules="[val => !!val || 'Harus diisi']" />
                            </div>
                        </div>
                    </div>  
                </div>
                <div class="bg-white q-py-md q-px-sm" style="width:95%; border-radius:0 30px 0 0;">
                    <div class="text-h6 q-mb-sm text-grey-10">Isi RPP</div>
                    <div class="row" v-for="(content,i) in lessonplan.contents" :key="i">
                        <div class="col-12 q-pa-xs">
                            <div class="text-body1 text-weight-medium">{{ content.name }}</div>
                            <q-editor v-model="content.value" :rules="[val => !!val || 'Harus diisi']"></q-editor>
                            <div class="caption text-red text-bold" v-show="content.error">Harus diisi</div>
                        </div>
                    </div>
                </div>
            </q-form>
        </div>
    </q-page>

    <sampul-maker v-show="false" ref="sampulMaker1"></sampul-maker>
    
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
    components: {
        'SampulMaker': SampulMaker
    },
    data() {
        return {
            lessonplan: {
                lesson_plan_cover_id: null,
                contents: [],
                description:null,
                subject:null,
                topic:null,
                grade_id:null,
                duration:null,
                canvas_data:{
                    image:null,
                    items:[]
                },
                lesson_plan_cover:{},
                canvas_image:null
            }
        };
    },
    computed: {
        ...mapState(["Cover", "Auth", "Setting", "Grade", "LessonPlanFormat","LessonPlanDraft"])
    },
    created(){
        this.setContents = debounce(this.setContents,500);

        this.lessonplan = {
            ...this.LessonPlanDraft.build,
            //contents: [...this.Module.build.contents]
            contents: [...this.LessonPlanDraft.build.contents.map(content => {
                return {
                    ...content
                }
            })]
        }
    },
    watch:{
        'lessonplan.contents': {
            handler: function (newVal, oldVal) {
                this.setContents(newVal);
            },
            deep: true
        },
        'lessonplan.description': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setDescription", {
                description: newVal
            });

        }, 500),
        'lessonplan.subject': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setSubject", {
                subject: newVal
            });

        }, 500),
         'lessonplan.topic': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setTopic", {
                topic: newVal
            });

        }, 500),
         'lessonplan.grade_id': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setGradeId", {
                grade_id: newVal
            });

        }, 500),
        'lessonplan.duration': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setDuration", {
                duration: newVal
            });

        }, 500),
        'lessonplan.lesson_plan_cover':function (newVal, oldVal) {
            this.$store.commit("LessonPlanDraft/setLessonPlanCover", {
                lesson_plan_cover: newVal
            });

        }
        
    },
    mounted() {
        if (!this.Cover.items.length) this.$store.dispatch("Cover/index").then(res=>{
            if(this.lessonplan.lesson_plan_cover.id==null) {
                this.lessonplan.lesson_plan_cover_id= res.data[0].id
                this.lessonplan.lesson_plan_cover= {...res.data[0]}
            }
        });
        if (!this.Grade.items.length) this.$store.dispatch("Grade/index");
        if(!this.lessonplan.contents.length){
            this.$store.dispatch("LessonPlanFormat/index").then(res => {
                res.data.lesson_plan_formats.forEach((val, key) => {
                    this.lessonplan.contents.push({
                        name: val.name,
                        value: "",
                        error: false
                    });
                });
            });
        }
        // if (!this.LessonPlanFormat.items.length) {
        //     this.$store.dispatch("LessonPlanFormat/index").then(res => {
        //         this.LessonPlanFormat.items.forEach((val, key) => {
        //             this.lessonplan.contents.push({
        //                 name: val.name,
        //                 value: "",
        //                 error: false
        //             });
        //         });
        //     });
        // } else {
        //     this.LessonPlanFormat.items.forEach((val, key) => {
        //         this.lessonplan.contents.push({
        //             name: val.name,
        //             value: "",
        //             error: false
        //         });
        //     });
        // }
    },
    methods: {
        selectCover(lesson_plan_cover){
            // this.lessonplan.lesson_plan_cover_id = lesson_plan_cover.id;
            // this.$store.commit("LessonPlanDraft/setLessonPlanCoverId", {lesson_plan_cover_id:lesson_plan_cover.id});
            // this.$store.commit("LessonPlanDraft/setLessonPlanCover", {lesson_plan_cover:lesson_plan_cover});
            this.$router.push({name:'editcoverdesign',params:{lesson_plan_cover:lesson_plan_cover}});
        },
        setContents(newVal){
            //let newVal = this.lessonplan.contents;
            this.$store.commit("LessonPlanDraft/setContents", {
                contents: newVal
            });
                //console.log('cok')
            console.log(newVal)
        },
        onSubmit() {    
            this.$refs.form.validate().then(success => {
                if (success) {
                    const length = this.lessonplan.contents.filter(content => {
                        if (content.value.length == 0) {
                            content.error = true;
                        } else {
                            content.error = false;
                        }
                        return content.value.length != 0;
                    }).length;

    
                    if (length) {

                        let grade = this.Grade.items.find(item=>item.id == this.LessonPlanDraft.build.grade_id);
                        let items = [
                        {
                            text:this.LessonPlanDraft.build.topic,
                            y:250,
                            size: 7,
                            fontfamily: 'Arial',
                            color:'#000000'
                        },{
                            text:this.LessonPlanDraft.build.subject?"Mata Pelajaran: "+this.LessonPlanDraft.build.subject:'',
                            y:600,
                            size: 6,
                            fontfamily: 'Arial',
                            color:'#000000'
                        }
                        ,{
                            text:grade?'Kelas '+grade.description:null,
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

                        this.LessonPlanDraft.build.canvas_data.items.forEach((item, i) => {
                            //console.log(item)
                            items[i].x = item.x;
                            items[i].y = item.y;
                            items[i].fontfamily = item.fontfamily ? item.fontfamily : 'Arial';
                            items[i].color = item.color;
                            items[i].size = item.size;
                        });

                        this.lessonplan.canvas_data ={
                            items:items,
                            image:this.lessonplan.lesson_plan_cover.image
                        }
                        //  return;


                         
                        let image = `${this.Setting.storageUrl}/${this.LessonPlanDraft.build.lesson_plan_cover.image}`;
                        this.$refs.sampulMaker1.setImage(image);
                        this.$refs.sampulMaker1.setItems(items)
                        this.$refs.sampulMaker1.initialize().then(res => {
                            const imageData = this.$refs.sampulMaker1.toDataURL();

                           
                            this.lessonplan.canvas_image = imageData;
                            this.$store.commit("LessonPlanDraft/setCanvasImage", {
                                 canvas_image: imageData
                            });
                            // alert(1)
                           
                            
                            this.$router.push("/");
                            this.$store
                                .dispatch("LessonPlan/store", this.lessonplan)
                                .then(res => {
                                    this.$store.commit("LessonPlanDraft/resetBuild");
                                    this.$q.notify("Berhasil");
                                })
                                .catch(err => {
                                    this.$q.notify("Terjadi kesalahan");
                                });
                        });
                    }


                    // if (length) {
                    //     this.$router.push("/");
                    //     this.$store
                    //         .dispatch("LessonPlan/store", this.lessonplan)
                    //         .then(res => {
                    //             this.$q.notify("Berhasil");
                    //         })
                    //         .catch(err => {
                    //             this.$q.notify("Terjadi kesalahan");
                    //         });
                    // }
                }
            });
        }
    }
};
</script>

<style></style>
