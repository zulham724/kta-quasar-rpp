import multiguard from "vue-router-multiguard";
import store from "./../store";
import moment from "moment";
import { Notify } from "quasar";

// cek auth apakah sudah login atau belum
const auth = function(to, from, next) {
    let isLoggedIn = store().getters["Auth/isLoggedIn"];
  let isUnAuthorized = store().getters["Auth/isUnAuthorized"];
  if (isLoggedIn && !isUnAuthorized) {
    next();
    } else {
        next("/login");
    }
};

// cek apakah user yg login sudah verifikasi email atau belum
const verified = function(to, from, next) {
    if (
        store().getters["Auth/auth"] &&
        store().getters["Auth/auth"].email_verified_at != null
    ) {
        next();
    } else {
        next("/verifyemail");
    }
};

const checkprofile = (to, from, next) => {
    if (
        store().getters["Auth/auth"].profile.educational_level_id != null ||
        store().getters["Auth/auth"].role_id == 7
    ) {
        // klo kosong harus isi atau klo pengawas lewat aja
        next();
    } else {
        next("/editprofile");
    }
};

// kalo belum bayar atau masa aktif berakhir cma bisa lihat halaman trial
const isTrial = (from, to, next) => {
    store().dispatch('Auth/getAuth').then(res => {
        let user_activated_at = store().getters['Auth/auth'].user_activated_at
        const monthDifference = moment(new Date()).diff(
            new Date(user_activated_at),
            "months",
            true
        );
        // console.log(user_activated_at, monthDifference < 6, store().getters['Auth/auth'], res.data)
        if (user_activated_at != null && monthDifference < 6) from.name == 'trial' ? next('/') : next()
        else from.name != 'trial' ? next('/trial') : next()
    })
};

const routes = [{
        path: "",
        beforeEnter: multiguard([auth, isTrial]),
        component: () =>
            import ("layouts/MainLayout.vue"),
        children: [
            {
                path: "/editcoverdesign",
                name: "editcoverdesign",
                beforeEnter: multiguard([auth]),
                component: () => import("pages/lessonplan/CoverEditPage.vue"),
                props:true,
              },
              {
                path: "/edit/editcoverdesign",
                name: "editcoverdesignedit",
                beforeEnter: multiguard([auth]),
                component: () => import("pages/lessonplan/edit/CoverEditPage.vue"),
                props:true,
              },
            {
                path: "/",
                component: () =>
                    import ("pages/HomePage.vue")
            },
            {
                path: "/create",
                name: "create",
                beforeEnter: multiguard([auth]),
                component: () =>
                    import ("pages/CreatePage.vue")
            },
            {
                path: "/search",
                name: "search",
                component: () =>
                    import ("pages/SearchPage.vue")
            },
            {
                path: "/account",
                name: "account",
                beforeEnter: multiguard([auth]),
                component: () =>
                    import ("pages/AccountPage.vue")
            },
            // -------------------------------------------
            {
                path: "/observer",
                name: "observer",
                component: () =>
                    import ("pages/ObserverPage.vue")
            },
            {
                path: "/follow",
                name: "follow",
                component: () =>
                    import ("pages/FollowPage.vue")
            },
            // -------------------------------------------
            {
                path: "/user/profile/:userId",
                name: "userprofile",
                beforeEnter: multiguard([auth]),
                component: () =>
                    import ("pages/user/ProfilePage.vue"),
                props: true
            },
            {
                path: "/user/lessonplanlist/:userId/:lessonplanId",
                name: "lessonplanlist",
                component: () =>
                    import ("pages/lessonplan/ListPage.vue"),
                props: true
            },
            {
                path: "/observer/:userId/follow/lessonplan/:lessonplanId",
                component: () =>
                    import ("pages/observer/follow/lessonplan/ListPage.vue"),
                props: true
            },
            {
                path: "/announcement",
                beforeEnter: multiguard([auth]),
                component: () =>
                    import ("pages/AnnouncementPage.vue")
            }     
        ]
    },
    {
        path: "/trial",
        name: "trial",
        beforeEnter: multiguard([isTrial]),
        component: () =>
            import ("pages/TrialPage.vue")
    },
    {
        path: "/lessonplan/:lessonplanid/edit",
        beforeEnter: multiguard([auth, isTrial]),
        name: "lessonplanedit",
        component: () =>
            import ("pages/lessonplan/EditPage.vue"),
        props: true
    },
    {
        path: "/account/edit",
        name: "accountedit",
        beforeEnter: multiguard([auth, isTrial]),
        component: () =>
            import ("pages/account/EditPage.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import ("pages/LoginPage.vue")
    },
    {
        path: "/lessonplan",
        name: "lessonplan",
        component: () =>
            import ("pages/LessonPlanPage.vue"),
        props: true
    },
    {
        path: "/lessonplan/:lessonplanid/comment",
        name: "lessonplancomment",
        beforeEnter: multiguard([auth, isTrial]),
        component: () =>
            import ("pages/lessonplan/CommentPage.vue"),
        props: true
    },
    {
        path: "/lessonplan/:lessonplanid/review",
        name: "lessonplanreview",
        beforeEnter: multiguard([auth, isTrial]),
        component: () =>
            import ("pages/lessonplan/ReviewPage.vue"),
        props: true
    },
    {
        path: "/lessonplan/:lessonplanid/observer",
        beforeEnter: multiguard([auth, isTrial]),
        component: () =>
            import ("pages/lessonplan/observer/ListPage.vue"),
        props: true
    },
    {
        path: "/information",
        name: "information",
        component: () =>
            import ("pages/InformationPage.vue")
    },
    {
        path: "/lessonplan/like/:lessonPlanId",
        name: "lessonplanlike",
        beforeEnter: multiguard([auth]),
        component: () =>
            import ("pages/lessonplan/LikePage.vue"),
        props: true
    },
    {
        path: "/lessonplan/comment/like/:commentId",
        name: "lessonplancommentlike",
        beforeEnter: multiguard([auth]),
        component: () =>
            import ("pages/lessonplan/comment/LikePage.vue"),
        props: true
    },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
    routes.push({
        path: "*",
        component: () =>
            import ("pages/Error404.vue")
    });
}

export default routes;