import axios from "axios";
const state = {
  build: {
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
  },
};

const mutations = {
    resetBuild(state){
        state.build =  {
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
    },
    setContents(state, payload){
        state.build.contents = [...payload.contents.map(content=>{
            return {...content}
        })]
        console.log(state.build.contents)
    },
    setDescription(state, payload){
        state.build.description = payload.description;
    },
    setSubject(state, payload){
        state.build.subject = payload.subject
    },
    setTopic(state, payload){
        state.build.topic = payload.topic
    },
    setGradeId(state, payload){
        state.build.grade_id = payload.grade_id
    },
    setDuration(state, payload){
        state.build.duration = payload.duration
    },
    setLessonPlanCoverId(state, payload){
        state.build.lesson_plan_cover_id = payload.lesson_plan_cover_id;
    },
    setLessonPlanCover(state, payload){
        state.build.lesson_plan_cover = payload.lesson_plan_cover;
        state.build.lesson_plan_cover_id = payload.lesson_plan_cover.id;
        console.log( state.build.lesson_plan_cover)
    },
    setCanvasData(state, payload){
        state.build.canvas_data.items = [...payload.canvas_data.map(item=>{
            return {...item}
        })];
        state.build.canvas_data.image = payload.image;
    },
    setCanvasImage(state, payload){
        state.build.canvas_image = payload.canvas_image
    }
};

const actions = {
  duplicate({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplan`, item)
        .then(res => {
          commit("add", { item: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  index({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplan`)
        .then(res => {
          commit("set", { items: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  next({ commit, state }, url) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  show({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplan/${id}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  store({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplan`, item)
        .then(res => {
          commit("add", { item: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  update({ commit, dispatch }, item) {
    return new Promise((resolve, reject) => {
      const access = {
        _method: "put",
        ...item
      };
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplan/${item.id}`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  destroy({ commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      const access = {
        _method: "delete"
      };
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplan/${id}`, access)
        .then(res => {
          commit("remove", { id: id });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  rate({ commit }, access) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplanrating`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  like({ commit }, id) {
    return new Promise((resolve, reject) => {
      const access = {
        post_id: id
      };
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplanlike`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  dislike({ commit }, id) {
    return new Promise((resolve, reject) => {
      const access = {
        _method: "delete"
      };
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplanlike/${id}`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  search({ commit }, key) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplans/search/${key}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getitemsbycity({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplans/getbycity/${id}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getItemsByGuidedUser() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplans/getbyguideduser`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  rate({ commit }, access) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/lessonplanrating`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getInformation({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/lessonplans/information`)
        .then(res => {
          commit("setInformation", { information: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
