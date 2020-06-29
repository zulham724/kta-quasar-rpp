<template>
  <div>
    <q-item clickable v-ripple v-if="review != null">
      <q-item-section avatar top class="q-mt-md" @click="$router.push(`/user/profile/${review.user.id}`)">
        <q-avatar>
          <q-img :src="`${Setting.storageUrl}/${review.user.avatar}`" no-default-spinner />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <div class="text-caption text-black text-bold" @click="$router.push(`/user/profile/${review.user.id}`)">{{ review.user.name }}</div>
        </q-item-label>
        <q-item-label caption>
          <div class="text-caption text-black" v-linkified>{{ review.value }}</div>
        </q-item-label>
        <q-item-label caption>
          <div class="row">
            <div class="text-caption text-grey q-pr-md">
              {{review.created_at | moment('from','now')}}
            </div>
            <div class="text-caption text-grey text-bold" v-show="review.likes_count" @click="$router.push(`/post/review/like/${review.id}`)">{{review.likes_count}} suka</div>
          </div>
        </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-btn
          flat
          size="sm"
          class="q-mt-md"
          round
          :color="review.liked_count ? 'red' : null"
          :icon="review.liked_count ? 'favorite' : 'favorite_border'"
          @click="review.liked_count ? dislike(review.id) : like(review.id)"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    review: null,
  },
  computed: {
    ...mapState(["Setting",'Auth'])
  },
  methods: {
    like(reviewId) {
      this.$store.dispatch("LessonPlanReview/like", reviewId).then(res => {
        this.review.liked_count = res.data.liked_count
        this.review.likes_count = res.data.likes_count
      });
    },
    dislike(reviewId) {
      this.$store.dispatch("LessonPlanReview/dislike", reviewId).then(res => {
        this.review.liked_count = res.data.liked_count
        this.review.likes_count = res.data.likes_count
      });
    }
  }
};
</script>

<style></style>
