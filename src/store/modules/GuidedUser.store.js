import axios from 'axios'
const state = {

}

const mutations = {

}

const actions = {
    store({ commit }, childId) {
        return new Promise((resolve, reject) => {
            const access = {
                child_id: childId
            }
            axios.post(`${this.state.Setting.url}/api/v1/lessonplanguideduser`, access).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    destroy({ commit }, childId) {
        return new Promise((resolve, reject) => {
            const access = {
                _method: 'delete'
            }
            axios.post(`${this.state.Setting.url}/api/v1/lessonplanguideduser/${childId}`, access).then(res => {
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