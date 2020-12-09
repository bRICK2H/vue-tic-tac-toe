export default {
   state: {
      comuterCountResultX: 0,
      comuterCountResultO: 0,
      selfCountResultX: 0,
      selfCountResultO: 0,
   },
   getters: {
		GET_COMPUTER_COUNT_RESULT_X: state => state.comuterCountResultX,
		GET_COMPUTER_COUNT_RESULT_O: state => state.comuterCountResultO,
		GET_SELF_COUNT_RESULT_X: state => state.selfCountResultX,
		GET_SELF_COUNT_RESULT_O: state => state.selfCountResultO,

		GET_CLASS_ROTATE_COUNT_RESULT: (s, g, rS, rootGetters) => sign => {
			return { 'counter-item__result--active': rootGetters['tictac/GET_WINNER_SIGN'] === sign } 
		}
   },
   mutations: {
		CLEAR_STATE_RESULT(state) {
			state.comuterCountResultX = 0;
			state.comuterCountResultO = 0;
			state.selfCountResultX = 0;
			state.selfCountResultO = 0;
		},
		SET_COUNT_RESULT: (state, { winnerSign, type }) => {
			if (type === 'computer') {
				state[`comuterCountResult${winnerSign}`]++;
			} else {
				state[`selfCountResult${winnerSign}`]++;
			}
		},
   },
   actions: {
		CLEAR_STATE_RESULT: ({ commit }) => commit('CLEAR_STATE_RESULT'),
      SET_COUNT_RESULT: ({ commit }, settings) => commit('SET_COUNT_RESULT', settings),
   },
}