import Vue from 'vue'
import Vuex from 'vuex'

import tictac from './modules/tictac/tictac'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tictac,
  }
})
