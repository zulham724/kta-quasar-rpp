<template>
<q-layout>
    <q-header elevated>
        <q-toolbar class="bg-white">
            <q-btn color="deep-purple" flat dense icon="arrow_back" @click="$router.push('/')" />
            <q-toolbar-title>
                <div class="text-body2 text-deep-purple text-bold">Edit RPP</div>
            </q-toolbar-title>
            <q-btn flat text-color="deep-purple" :loading="loading"  label="Perbarui" @click="onSubmit()" />
        </q-toolbar>
    </q-header>
    <q-page-container class="bg-deep-purple-8">
        <div>
            <q-form ref="form" @submit="onSubmit">
                <div class="row q-py-md q-pl-md bg-white q-mb-md" style="width:95%;border-radius:0 0 30px 0;">
                    <div class="text-h6 text-grey-10">Sampul Buku RPP</div>
                    <RecycleScroller direction="horizontal" style="height:20vh;padding-top:10px;" :items="Cover.items" :item-size="150" key-field="id" v-slot="{ item }">
                        <div>
                            <q-card @click="selectCover(item)" style="height:15vh;width:15vh">
                                <q-card-section class="q-pa-none">
                                    <!--<q-img :src="`${Setting.storageUrl}/${item.image}`" height="200" width="200"></q-img>-->

                                    <q-img v-if="lessonplan.lesson_plan_cover.id == item.id && lessonplan.canvas_image" no-default-spinner :src="`${lessonplan.canvas_image}`" height="200" width="200"></q-img>
                                    <q-img v-else no-default-spinner :src="`${Setting.storageUrl}/${item.image}`" height="200" width="200"></q-img>

                                </q-card-section>
                            </q-card>
                            <div class="text-caption">
                                {{ item.name }}
                                <q-icon v-show="lessonplan.lesson_plan_cover_id == item.id" color="green" name="check_circle_outline"></q-icon>
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
                                <q-select dense placeholder="Kelas" color="deep-purple" v-model="lessonplan.grade" :options="Grade.items" option-value="id" option-label="description" :rules="[val => !!val || 'Harus diisi']">
                                    <template v-slot:selected v-if="lessonplan.grade_id">
                                        <div>{{lessonplan.grade.description}}</div>
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
                    <div class="row" v-for="content in lessonplan.contents" :key="content.name">
                        <div class="col-12 q-pa-xs">
                            <div class="text-body1 text-weight-medium">{{ content.name }}</div>
                            <q-editor v-model="content.value" :rules="[val => !!val || 'Harus diisi']"></q-editor>
                            <div class="caption text-red text-bold" v-show="content.error">Harus diisi</div>
                        </div>
                    </div>
                </div>
            </q-form>
        </div>
    </q-page-container>

    <sampul-maker v-show="false" ref="sampulMaker1"></sampul-maker>

</q-layout>
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
    props: {
        lessonplanid: null,
        overwriteDialog:true, 
        //jika true maka setiap page ini terbuka, akan ada pesan konfirmasi. Jika tidak, akan langsung mengambil data sebelumnya dari store vuex
    },
    data() {
        return {
            loading:false,
              lessonplan: {
                id:null,
                lesson_plan_cover_id: null,
                contents: [],
                description:null,
                subject:null,
                topic:null,
                grade_id:null,
                grade:{
                    id:null,
                    description:null
                },
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
        ...mapState(["Cover", "Auth", "Setting", "Grade", "LessonPlanFormat","LessonPlanEditDraft"]),
        selectedGrade: function () {
            if (this.lessonplan.grade_id && this.Cover.items.length > 0) {
                console.log(this.Grade.items)
                console.log(this.lessonplan.grade_id)
                const obj = this.Grade.items.find(item => item.id == this.lessonplan.grade_id);
                console.log(obj)
            } else return '';
        }
    },
    created() {
        this.setContents = debounce(this.setContents,500);

        if (!this.Cover.items.length) this.$store.dispatch("Cover/index");
        if (!this.Grade.items.length) this.$store.dispatch("Grade/index");
        this.init();
    },
    watch:{
        'lessonplan.id': function(newVal){
             this.$store.commit("LessonPlanEditDraft/setId", {
                id: newVal
            });
        },
        'lessonplan.contents': {
            handler: function (newVal, oldVal) {
                this.setContents(newVal);
            },
            deep: true
        },
        'lessonplan.description': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setDescription", {
                description: newVal
            });

        }, 500),
        'lessonplan.subject': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setSubject", {
                subject: newVal
            });

        }, 500),
         'lessonplan.topic': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setTopic", {
                topic: newVal
            });

        }, 500),
         'lessonplan.grade_id': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setGradeId", {
                grade_id: newVal
            });

        }, 500),
        'lessonplan.grade': function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setGrade", {
                grade: newVal
            });

        },
        'lessonplan.duration': debounce(function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setDuration", {
                duration: newVal
            });

        }, 500),
        'lessonplan.lesson_plan_cover':function (newVal, oldVal) {
            this.$store.commit("LessonPlanEditDraft/setLessonPlanCover", {
                lesson_plan_cover: newVal
            });

        }
        
    },
    methods: {
        selectCover(lesson_plan_cover){
            // @click="lessonplan.lesson_plan_cover_id = item.id" 
            // this.lessonplan.lesson_plan_cover_id = lesson_plan_cover.id;
            // this.$store.commit("LessonPlanDraft/setLessonPlanCoverId", {lesson_plan_cover_id:lesson_plan_cover.id});
            // this.$store.commit("LessonPlanDraft/setLessonPlanCover", {lesson_plan_cover:lesson_plan_cover});
            this.$router.push({name:'editcoverdesignedit',params:{lesson_plan_cover:lesson_plan_cover}});
        },
        init() {
            //mengeset lessonplan dari data store
            this.lessonplan = {
                ...this.LessonPlanEditDraft.build,
                //contents: [...this.Module.build.contents]
                canvas_data:{
                    image:this.LessonPlanEditDraft.build.canvas_data.image,
                    items:[...this.LessonPlanEditDraft.build.canvas_data.items.map(item=>{
                        return {
                            ...item
                        }
                    })]
                },
                contents: [...this.LessonPlanEditDraft.build.contents.map(content => {
                    return {
                        ...content
                    }
                })]
            }
            if(!this.LessonPlanEditDraft.build.id){
                  this.$store.dispatch("LessonPlan/show", this.lessonplanid).then(res => {
                        this.lessonplan = res.data;
                        console.log('lnte')
                        console.log(this.lessonplan.canvas_data)
                        //perlu pengecekan karena data lessonPlan yang lama canvas_data nya masih kosong (NULL)
                        if(res.data.canvas_data){
                            // this.lessonplan.canvas_data = JSON.parse(res.data.canvas_data);
                            this.$store.commit("LessonPlanEditDraft/setCanvasData", {
                                canvas_data: this.lessonplan.canvas_data.items,
                                image: this.lessonplan.lesson_plan_cover.image
                            });
                            this.$refs.sampulMaker1.setImage(`${this.Setting.storageUrl}/${this.lessonplan.lesson_plan_cover.image}`);
                            this.$refs.sampulMaker1.setItems(this.lessonplan.canvas_data.items);
                            this.$refs.sampulMaker1.initialize().then(res=>{
                                const imageData = res.toDataURL();
                                this.lessonplan.canvas_image = imageData;
                                this.$store.commit("LessonPlanEditDraft/setCanvasImage", {
                                    canvas_image: imageData
                                });
                            });
                        }
                       
                        //console.log(this.LessonPlanEditDraft.build.canvas_data)
                       
                        // this.$refs.sampulMaker1.setImage(`${this.Setting.storageUrl}/${this.lessonplan.lesson_plan_cover.image}`);
                        // this.$refs.sampulMaker1.setItems(this.lessonplan.canvas_data.items);
                        // this.$refs.sampulMaker1.initialize().then(res=>{
                        //     const imageData = res.toDataURL();
                        //     this.lessonplan.canvas_image = imageData;
                        //     this.$store.commit("LessonPlanEditDraft/setCanvasImage", {
                        //         canvas_image: imageData
                        //     });
                        // })
                        // console.log(this.lessonplan)
                    });
            }else if(this.LessonPlanEditDraft.build.id!=this.lessonplanid){
                this.$q.dialog({
                    title: 'Konfirmasi',
                    message: 'Ada RPP yang belum disimpan sebelumnya. Lanjutkan mengedit RPP sebelumnya?',
                    cancel: true,
                    ok:true,
                    // persistent: true,
                    ok:{
                        label:'YA',
                        outline:false,
                        color:'deep-purple'
                    },
                    cancel:{
                        label:'Tidak',
                        flat:true,
                        color:'deep-purple'
                    }
                }).onOk(() => {
                    // alert('a')
                //    this.getEditDraft(); //mengambil data RPP sebelumnya yang diedit tapi belum disubmit
                }).onOk(() => {
                    // console.log('>>>> second OK catcher')
                }).onCancel(() => {
                    this.$store.dispatch("LessonPlan/show", this.lessonplanid).then(res => {
                        this.lessonplan = res.data;
                    });
                }).onDismiss(() => {
                    // this.$store.dispatch("LessonPlan/show", this.lessonplanid).then(res => {
                    //     this.lessonplan = res.data;
                    // });
                })
            }
            // else{
            //      this.$store.dispatch("LessonPlan/show", this.lessonplanid).then(res => {
            //             this.lessonplan = res.data;
            //         });
            // }
           
        },
        getEditDraft(){
             this.lessonplan = {
                ...this.LessonPlanEditDraft.build,
                //contents: [...this.Module.build.contents]
                contents: [...this.LessonPlanEditDraft.build.contents.map(content => {
                    return {
                        ...content
                    }
                })]
            }
        },
         setContents(newVal){
            //let newVal = this.lessonplan.contents;
            this.$store.commit("LessonPlanEditDraft/setContents", {
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
                        this.loading=true;
                        let items = [
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
                            items[i].x = item.x;
                            items[i].y = item.y;
                            items[i].fontfamily = item.fontfamily ? item.fontfamily : 'Arial';
                            items[i].color = item.color;
                            items[i].size = item.size;
                        });
                        this.lessonplan.canvas_data.items = items;
                        this.lessonplan.canvas_data.image = this.lessonplan.lesson_plan_cover.image;

                        this.$refs.sampulMaker1.setImage(`${this.Setting.storageUrl}/${this.lessonplan.lesson_plan_cover.image}`);
                        this.$refs.sampulMaker1.setItems(items)
                        this.$refs.sampulMaker1.initialize().then(res => {
                            const imageData = res.toDataURL();
                            //console.log(imageData)
                            this.lessonplan.canvas_image = imageData;
                            this.$store.commit("LessonPlanEditDraft/setCanvasImage", {
                                canvas_image: imageData
                            });
                            this.lessonplan.grade_id = this.lessonplan.grade.id;
                            this.$store
                                .dispatch("LessonPlan/update", this.lessonplan)
                                .then(res => {
                                    this.$store.commit("LessonPlanEditDraft/resetBuild");
                                    this.$store.dispatch("Auth/getAuth");
                                    this.$q.notify("Berhasil");
                                    this.$store.commit("LessonPlan/setLessonPlan", {lessonplan:res.data});
                                    this.$router.push('/');
                                    

                                })
                                .catch(err => {
                                    console.log(err)
                                    this.$q.notify("Terjadi kesalahan");
                                }).finally(res=>{
                                    this.loading=false;
                                });
                        });
                        //return 
                     
                    }
                }
            });
        }
    }
};
</script>

<style>
.detail-input input {
    padding: 0;
}

.q-field__native {
    padding: 0;
}
</style>
