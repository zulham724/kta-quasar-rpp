<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn
          color="deep-purple"
          flat
          dense
          icon="arrow_back"
          @click="$router.back()"
        />
        <q-toolbar-title>
          <div class="text-body2 text-deep-purple text-bold">Buat RPP baru</div>
        </q-toolbar-title>
        <q-btn flat text-color="deep-purple" label="Perbarui" @click="onSubmit()" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="q-pa-md">
        <q-form ref="form" @submit="onSubmit">
          <div class="row">
            <RecycleScroller
              direction="horizontal"
              style="height:20vh"
              :items="Cover.items"
              :item-size="150"
              key-field="id"
              v-slot="{ item }"
            >
              <div>
                <q-card
                  @click="lessonplan.lesson_plan_cover_id = item.id"
                  style="height:15vh;width:15vh"
                >
                  <q-card-section class="q-pa-none">
                    <q-img
                      :src="`${Setting.storageUrl}/${item.image}`"
                      height="200"
                      width="200"
                    ></q-img>
                  </q-card-section>
                </q-card>
                <div class="text-caption">
                  {{ item.name }}
                  <q-icon
                    v-show="lessonplan.lesson_plan_cover_id == item.id"
                    color="green"
                    name="check_circle_outline"
                  ></q-icon>
                </div>
              </div>
            </RecycleScroller>
          </div>
          <div class="row q-pt-md">
            <div class="col-12">
              <q-input
                dense
                label="Konten untuk Postingan ini"
                color="deep-purple"
                v-model="lessonplan.description"
                :rules="[val => !!val || 'Harus diisi']"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                dense
                label="Mata Pelajaran"
                color="deep-purple"
                v-model="lessonplan.subject"
                :rules="[val => !!val || 'Harus diisi']"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                dense
                label="Materi Pokok"
                color="deep-purple"
                v-model="lessonplan.topic"
                :rules="[val => !!val || 'Harus diisi']"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-select
                dense
                label="Kelas"
                color="deep-purple"
                v-model="lessonplan.grade_id"
                :options="Grade.items"
                option-value="id"
                option-label="description"
                emit-value
                :rules="[val => !!val || 'Harus diisi']"
              >
              <template v-slot:selected v-if="lessonplan.grade_id">
                <div>
                  {{Grade.items.find(item=>item.id == lessonplan.grade_id).description}}
                </div>
              </template>
              </q-select>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                dense
                label="Durasi"
                color="deep-purple"
                v-model="lessonplan.duration"
                :rules="[val => !!val || 'Harus diisi']"
              />
            </div>
          </div>
          <div
            class="row"
            v-for="content in lessonplan.contents"
            :key="content.name"
          >
            <div class="col-12">
              <div class="title">{{ content.name }}</div>
              <q-editor
                v-model="content.value"
                :rules="[val => !!val || 'Harus diisi']"
              ></q-editor>
              <div class="caption text-red text-bold" v-show="content.error">Harus diisi</div>
            </div>
          </div>
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  props:{
    lessonplanid: null
  },
  data() {
    return {
      lessonplan: {
        lesson_plan_cover_id: 1,
        contents: []
      }
    };
  },
  computed: {
    ...mapState(["Cover", "Auth", "Setting", "Grade", "LessonPlanFormat"])
  },
  created() {
    if (!this.Cover.items.length) this.$store.dispatch("Cover/index");
    if (!this.Grade.items.length) this.$store.dispatch("Grade/index");
    this.init()
  },
  methods: {
    init(){
      this.$store.dispatch('LessonPlan/show',this.lessonplanid).then(res=>{
        this.lessonplan = res.data
      })
    },
    onSubmit() {
      this.$refs.form.validate().then(success=>{
        if(success){
          const length = this.lessonplan.contents.filter(content=>{
            if(content.value.length == 0){
              content.error = true
            } else {
              content.error = false
            }
            return content.value.length != 0
          }).length

          if(length){
            this.$router.back()
            this.$store.dispatch('LessonPlan/update',this.lessonplan).then(res=>{
              this.$store.dispatch('Auth/getAuth')
              this.$q.notify('Berhasil')
            }).catch(err=>{
              this.$q.notify('Terjadi kesalahan')
            })
          }
        }
      })
    }
  }
};
</script>

<style></style>
