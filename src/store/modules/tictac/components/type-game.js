export default {
   state: {
      typeGame: 'computer',
   },
   getters: {
      GET_TYPE_GAME: state => state.typeGame,
      GET_IS_BLOCK_TYPE_OF_GAME(s, g, { tictac: { field } }) {
         return field.countStep > 0
               && field.countStep < 9
					&& !Boolean(field.isFinishGame);
      },
      GET_CLASS_BLOCK_TYPE_OF_GAME: (s, getters) => ({ 'select-type__label--disabled': getters.GET_IS_BLOCK_TYPE_OF_GAME }),
   },
   mutations: {
      SET_TYPE_GAME: (state, type) => state.typeGame = type,
   },
   actions: {
      SET_TYPE_GAME({ dispatch, commit }, type) {
         commit('SET_TYPE_GAME', type);
         dispatch('CLEAR_STATE_FIELD');
      },
   },
}