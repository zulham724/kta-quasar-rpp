<template>
<q-infinite-scroll @load="onLoad" :offset="250">
   <div v-if="announcementList">
        <div v-for="(item, n) in announcementList" :key="`announcement-${n}`" class="q-py-xs bg-purple-1">
            <div v-if="item.data">
                <q-intersection style="min-height:50px" v-if="item.type=='App\\Notifications\\LikedLessonPlanCommentNotification' || item.type=='LikedLessonPlanCommentEvent'">
                    <announcement-item-liked-module-comment :item="item"></announcement-item-liked-module-comment>
                </q-intersection>
                <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\CommentedLessonPlanNotification' || item.type=='CommentedLessonPlanEvent'">
                    <announcement-item-commented-module :item="item"></announcement-item-commented-module>
                </q-intersection>
                 <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\LikedLessonPlanNotification' || item.type=='LikedLessonPlanEvent'">
                    <announcement-item-liked-module :item="item"></announcement-item-liked-module>
                </q-intersection>
            </div>

        </div>
    </div>
    <template v-slot:loading>
        <div class="row justify-center q-my-md">
            <q-spinner-dots color="teal" size="40px" />
        </div>
    </template>
</q-infinite-scroll>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    components: {
    //     AnnouncementItemAssigment: () => import('components/announcement/assigment/AnnouncementItem.vue'),
    //     AnnouncementItemSharedAssigment: () => import('components/announcement/sharedassigment/AnnouncementItem.vue'),
    // AnnouncementItemPostComment: () => import('components/announcement/postcomment/AnnouncementItem.vue'),
    // AnnouncementItemCommentLike: () => import('components/announcement/commentlike/AnnouncementItem.vue'),
    // AnnouncementItemPostLike: () => import('components/announcement/postlike/AnnouncementItem.vue'),    //     AnnouncementItemAssigmentLike: () => import('components/announcement/assigmentlike/AnnouncementItem.vue'),
    //     AnnouncementItemAssigmentComment: () => import('components/announcement/assigmentcomment/AnnouncementItem.vue'),
    AnnouncementItemCommentedModule:()=>import('components/announcement/commentedlessonplan/AnnouncementItem.vue'), 
    AnnouncementItemLikedModule:()=>import('components/announcement/likedlessonplan/AnnouncementItem.vue'), 
    AnnouncementItemLikedModuleComment:()=>import('components/announcement/likedlessonplancomment/AnnouncementItem.vue'), 

    },
    data() {
        return {

        };
    },
    computed: {
        ...mapState(["Auth", "Setting", "EchoNotification"]),
        announcementList: function () {
            return this.EchoNotification.items.data ? this.EchoNotification.items.data.filter(item => {
                return item.data != '';
            }) : null;
        }
    },
    created() {

    },
    mounted() {
        this.$store.dispatch("EchoNotification/markAsRead");
    },
    methods: {
        onLoad: function (index, done) {
            //alert(this.EchoNotification.items.next_page)
            if (this.EchoNotification.items.next_page_url) {
                this.$store.dispatch("EchoNotification/next").then(res => {
                    done();
                });
            } else done();
        },
    }
}
</script>
