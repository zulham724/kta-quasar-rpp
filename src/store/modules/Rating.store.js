import axios from 'axios'
const state = {

}

const mutations = {
    setRatings(state, payload) {

    },
}

const actions = {
    store({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`${this.state.Setting.url}/api/v1/lessonplanrating`, payload).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};