<template>
  <q-layout view="hHh Lpr fFf">
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
          <div class="text-body2 text-deep-purple text-bold">Penilai</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list bordered class="rounded-borders">
          <div v-if="loading">
            <q-item
              style="max-width: 300px;"
              v-for="n in 9"
              :key="`loading-${n}`"
            >
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="65%" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-if="lessonplan">
            <q-item clickable v-ripple 
                v-for="(rating, r) in lessonplan.ratings"
                    :key="rating.id"
             @click="$router.push(`/user/profile/${rating.user.id}`)">
                <q-item-section avatar>
                    <q-avatar>
                    <q-img :src="`${Setting.storageUrl}/${rating.user.avatar}`" width="15vw" no-default-spinner />
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label lines="3">{{ rating.user.name }}</q-item-label>
                    <q-item-label caption lines="2">Memberikan rating bintang {{rating.value}}</q-item-label>
                </q-item-section>
            </q-item>
          </div>
        </q-list>
    </q-page-container>
  </q-layout>
</template>

<script>
import {mapState} from 'vuex'
export default {
    props:{
        lessonplanid: null
    },
    data(){
        return{
            lessonplan: null,
            loading: false
        }
    },
    computed:{
        ...mapState(['Setting','Auth'])
    },
    mounted(){
        this.lessonplan == null ? this.init() : null
    },
    methods:{
        init(){
            this.$store.dispatch('LessonPlan/show', this.lessonplanid).then(res=>{
                this.lessonplan = res.data
            }).catch(err=>{

            })
        }
    }
}
</script>

<style></style>
