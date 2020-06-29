/* Module1.store.js */
import axios from "axios";
// State object
const state = {};

// Mutations
const mutations = {};

// Actions
const actions = {
    store({ commit }, childId) {
        return new Promise((resolve, reject) => {
            const access = {
                child_id: childId
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/follow`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    destroy({ commit }, childId) {
        return new Promise((resolve, reject) => {
            const access = {
                _method: "delete"
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/follow/${childId}`, access)
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