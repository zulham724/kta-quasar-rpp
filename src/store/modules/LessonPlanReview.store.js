/* Module1.store.js */
import axios from "axios";
// State object
const state = {};

// Mutations
const mutations = {};

// Actions
const actions = {
    store({ commit }, payload) {
        return new Promise((resolve, reject) => {
            const access = {
                lessonplan_id: payload.lessonplan_id,
                user_id: payload.user_id,
                value: payload.value
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/lessonplanreview`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    destroy() {},
    like({ commit }, reviewId) {
        return new Promise((resolve, reject) => {
            const access = {
                review_id: reviewId
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/reviewlike`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    dislike({ commit }, reviewId) {
        return new Promise((resolve, reject) => {
            const access = {
                _method: `delete`
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/reviewlike/${reviewId}`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};

// Getter functions
const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};