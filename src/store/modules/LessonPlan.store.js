import axios from "axios";
const state = {
  items: {},
  information: {}
};

const mutations = {
  set(state, payload) {
    state.items = payload.items;
  },
  remove(state, payload) {
    const index = state.items.data.findIndex(item => item.id == payload.id);
    state.items.data.splice(index, 1);
  },
  add(state, payload) {
    state.items.data = [payload.item, ...state.items.data];
  },
  next(state, payload) {
    state.items = {
      ...payload.items,
      data: [...state.items.data, ...payload.items.data]
    };
  },
  like(state, payload) {
    const index = state.items.data.findIndex(item => item.id == payload.id);
    state.items.data[index].liked_count = payload.liked_count;
    state.items.data[index].likes_count = payload.likes_count;
  },
  dislike(state, payload) {
    const index = state.items.data.findIndex(item => item.id == payload.id);
    state.items.data[index].liked_count = payload.liked_count;
    state.items.data[index].likes_count = payload.likes_count;
  },
  setInformation(state, payload) {
    state.information = payload.information;
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
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
