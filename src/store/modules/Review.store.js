import axios from 'axios'
const state = {

}

const mutations = {
    increment(state) {
        state.user.lesson_plans_reviews_count += 1
        localStorage.setItem('user', JSON.stringify(state.user))
    },
    decrement(state) {
        state.user.lesson_plans_reviews_count -= 1
        localStorage.setItem('user', JSON.stringify(state.user))
    }
}

const actions = {
    store({ commit }, payload) {
        return new Promise((resolve, reject) => {
            const access = {
                lessonplan_id: payload.id,
                user_id: this.state.user.id,
                value: payload.review.value
            }
            axios.post(`${this.state.Setting.url}/api/v1/lessonplanreview`, access).then(res => {
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