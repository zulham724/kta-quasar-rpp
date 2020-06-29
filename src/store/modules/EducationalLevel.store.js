import axios from "axios";

const state = {
    items: []
};

const mutations = {
    set(state, payload) {
        state.items = [...payload.items];
    }
};

const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/educationallevel`)
                .then(res => {
                    commit("set", { items: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    show({ commit }, educationallevelid) {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${this.state.Setting.url}/api/v1/lessonplans/getbyeducationallevel/${educationallevelid}`
                )
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getByCity() {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${this.state.Setting.url}/api/v1/educationallevels/getbycity/${this.state.Auth.auth.profile.city_id}`
                )
                .then(res => {
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