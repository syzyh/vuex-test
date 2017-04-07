import * as types from './mutation-types'
import Vue from 'vue'

export default {
  addTotalTime ({ commit }, time) {
    commit(types.ADD_TOTAL_TIME, time)
  },
  decTotalTime ({ commit }, time) {
    commit(types.DEC_TOTAL_TIME, time)
  },
  savePlan ({ commit }, plan) {
    Vue.http.post('http://localhost:8888/create', plan)
      .then(response => {
        commit(types.SAVE_PLAN, response.body)
      })
  },
  deletePlan ({ commit }, { index, id }) {
    Vue.http.delete('http://localhost:8888/delete/' + id)
      .then(response => {
        commit(types.DELETE_PLAN, index)
      })
  },
  findPlan ({ commit }) {
    Vue.http.get('http://localhost:8888/plans')
      .then(response => {
        commit(types.CLEAR_PLANS)
        response.body.forEach(plan => {
          commit(types.SAVE_PLAN, plan)
        })
      })
  }
}
