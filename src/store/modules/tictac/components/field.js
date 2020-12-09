import Vue from 'vue'

const vm = new Vue();
const GET_DEFAULT_STATE_FIELD = () => {
   return {
      cells: [
         { id: 1, active: false, sign: '' },
         { id: 2, active: false, sign: '' },
         { id: 3, active: false, sign: '' },
         { id: 4, active: false, sign: '' },
         { id: 5, active: false, sign: '' },
         { id: 6, active: false, sign: '' },
         { id: 7, active: false, sign: '' },
         { id: 8, active: false, sign: '' },
         { id: 9, active: false, sign: '' }
      ],
      wins: [
         [1, 2, 3], [4, 5, 6], [7, 8, 9],
         [1, 4, 7], [2, 5, 8], [3, 6, 9],
         [1, 5, 9], [3, 5, 7]
      ],
		winner: [],
		winnerSign: '',
		isThrowGame: false,
		
      stepsX: [],
      stepsO: [],
      isPlay: true,
      isStep: false,
      isComputerStep: true,
		isFinishGame: false,
      countStep: 0,
   };
}

const INITIAL_STATE = GET_DEFAULT_STATE_FIELD();

export default {
   state: INITIAL_STATE,
   getters: {
      GET_CELLS: state => state.cells,
      GET_IS_PLAY: state => state.isPlay,
      GET_CURR_SIGN: state => state.isStep ? 'X' : 'O',
      GET_CURR_ARRAY_STEPS: (state, getters) => state[`steps${getters.GET_CURR_SIGN}`],
      GET_CURR_ACTIVE_CELL: (state, getters) => id => state.cells[getters.GET_INDEX_ACTIVE_CELL(id)].active,
      GET_INDEX_ACTIVE_CELL: state => id => state.cells.findIndex(curr => curr.id === id),
      GET_IS_BLOCK_USED_STEP: state => id => state.stepsO.includes(id) || state.stepsX.includes(id) || state.winner.length,
      GET_WINNER_SIGN: state => state.winnerSign,
		GET_IS_THROW_GAME: state => state.isThrowGame,
		GET_IS_FINISH_GAME: state => state.isFinishGame,

      GET_CLASS_WINNER: state => id => state.winner.includes(id),
      GET_CLASS_SELECT_CELL_BLOCK: state => ({ 'field-cell__select-cell-block': state.winner.length }),
   },
   mutations: {
      CLEAR_STATE_FIELD: state => Object.assign(state, GET_DEFAULT_STATE_FIELD()),

      SET_STEP: state => {
         state.isStep = !state.isStep
         state.countStep++;
      },

      SET_RESULT_STEPS: (s, { id, currArraySteps }) => currArraySteps.push(id),
      SET_ACTIVE_CELL: (state, { index, isActive }) => vm.$set(state.cells[index], 'active', isActive),
      SET_SIGN_CELL: (state, { index, currSign }) => vm.$set(state.cells[index], 'sign', currSign),

      FIND_WINNER(state, { currArraySteps, currSign }) {
         const winner = state.wins
            .map(currArr => currArr
               .filter(currId => currArraySteps.includes(currId)))
            .find(curr => curr.length === 3);

         if (winner) {
            state.isPlay = false;
            state.winner = winner;
				state.winnerSign = currSign;
				state.isFinishGame = true;
         }

         if (state.countStep === 9 && !winner) {
				state.isThrowGame = true;
				state.isFinishGame = true;
         }
      },
      IS_COMPUTER_STEP: (state, isComputerStep) => state.isComputerStep = isComputerStep,
   },
   actions: {
      CLEAR_STATE_FIELD: ({ commit }) => commit('CLEAR_STATE_FIELD'),
      SET_STEP({ dispatch, commit, getters }, id) {
         const [isPlay, currActiveCell] = [
            getters.GET_IS_PLAY,
            getters.GET_CURR_ACTIVE_CELL(id),
         ]

         if (!isPlay || currActiveCell) return;

         commit('SET_STEP');

         const [index, currSign, currArraySteps] = [
            getters.GET_INDEX_ACTIVE_CELL(id),
            getters.GET_CURR_SIGN,
            getters.GET_CURR_ARRAY_STEPS
         ]

         dispatch('SET_RESULT_STEPS', { id, currArraySteps });
         dispatch('SET_ACTIVE_CELL', { index, isActive: true });
         dispatch('SET_SIGN_CELL', { index, currSign });

         dispatch('FIND_WINNER', { currArraySteps, currSign });
      },
      async SET_COMPUTER_STEP({ dispatch, commit, state }, id) {
         if (!state.isComputerStep) return;

         dispatch('SET_STEP', id);
         commit('IS_COMPUTER_STEP', false);

         if (state.countStep === 9) return;

         const COMPUTER_ID = await dispatch('FIND_COMPUTER_ID');

         setTimeout(() => {
            dispatch('SET_STEP', COMPUTER_ID);
            commit('IS_COMPUTER_STEP', true);
         }, 500);
      },

      FIND_COMPUTER_ID({ state }) {
         const WINS_ARRAY = state.wins;
         const STEPS_X = state.stepsX;
         const STEPS_O = state.stepsO;

         // Найти все оставшиеся выйгрышные ходы для Х или О, в зависимости от аргументов
         const FIND_REST_EMPTY_STEPS = (primaryArr, secondaryArr, winArr) => primaryArr.reduce((elAcc, step) => {
            if (winArr.includes(step)) {
               const winArrayFilter = winArr
                  .filter(curr => !primaryArr.includes(curr));
               const isContainWinArray = winArrayFilter.some(curr => secondaryArr.includes(curr));
               if (!isContainWinArray) {
                  elAcc = winArrayFilter;
               }
            }
            return elAcc;
         }, false);

         // Создать объект из оставшихся выйгрышных ходов Х и О
         const CREATE_REST_EMPTY_STEPS = () => {
            return WINS_ARRAY.reduce((parentAcc, winArr) => {
               const REST_EMPTY_STEPS_O = FIND_REST_EMPTY_STEPS(STEPS_O, STEPS_X, winArr);
               const REST_EMPTY_STEPS_X = FIND_REST_EMPTY_STEPS(STEPS_X, STEPS_O, winArr);

               if (REST_EMPTY_STEPS_O) {
                  parentAcc['o'].push(REST_EMPTY_STEPS_O);
               }
               if (REST_EMPTY_STEPS_X) {
                  parentAcc['x'].push(REST_EMPTY_STEPS_X);
               }

               return parentAcc;
            }, { o: [], x: [] });
         }

         const [FIRST_STEP_X] = state.stepsX;
         const COUNT_STEP = state.countStep;
         const REST_EMPTY_STEPS = CREATE_REST_EMPTY_STEPS();
         // Критический ход будет, если в массиве остается один ход до победы
         const IS_CRITICAL_STEP = (arr) => arr.some(curr => curr.length === 1);
         // Подилучить критический ход
         const GET_CRITICAL_STEP = (arr) => arr.find(curr => curr.length === 1)[0];
         // Вернуть любое число из переданного массива
         const GET_RANDOM_ID = (arr) => arr[Math.floor(Math.random() * arr.length)];
         // Завернуть оставщиеся ходы до победы Х и О в один массив
         const CONCAT_REST_EMPTY_STEPS = (arr) => arr.reduce((acc, curr) => {
            acc.push(...curr);
            return acc;
         }, []);


         /**
          * ? ПЕРВИЧНОСТЬ
          * TODO: исходя из превого хода пользователя, определяем первый ход компьютера.
          */
         if (COUNT_STEP === 1) {
            return FIRST_STEP_X !== 5
               ? 5
               : GET_RANDOM_ID([1, 3, 7, 9]);
         }

         /**
          * ? АТАКА
          * TODO: компьютеру остается один ход до победы, закрываем эту ячейку.
          */
         if (IS_CRITICAL_STEP(REST_EMPTY_STEPS['o'])) {
            return GET_CRITICAL_STEP(REST_EMPTY_STEPS['o']);
         }

         /**
          * ? ЗАЩИТА
          * TODO: пользователю остается один ход до победы, закрываем эту ячейку.
          */
         if (IS_CRITICAL_STEP(REST_EMPTY_STEPS['x'])) {
            return GET_CRITICAL_STEP(REST_EMPTY_STEPS['x']);
         }

         /**
          * ? ИМПРОВИЗАЦИЯ
          * TODO: берем любую свободную ячейку, т.к. ход не имеет никакого значения
          */
         if (!REST_EMPTY_STEPS['o'].length) {
            return GET_RANDOM_ID(REST_EMPTY_STEPS['x'][0]);
         }

         /**
         * ? НЕОДНОЗНАЧНОСТЬ
         * TODO: вариация выйгрышних ситуаций больше одной, выстраиваем логику
         */
         const REST_EMPTY_STEP_O = CONCAT_REST_EMPTY_STEPS(REST_EMPTY_STEPS['o']);
         const REST_EMPTY_STEP_X = CONCAT_REST_EMPTY_STEPS(REST_EMPTY_STEPS['x']);

         const OFFSET_REST_STEPS = REST_EMPTY_STEP_O
            .reduce((acc, curr_o_id) => {
               const isRepeatStep = REST_EMPTY_STEP_X
                  .map(curr_x_id => curr_x_id === curr_o_id)
                  .filter(isTrue => isTrue);

               if (isRepeatStep.length === 2) {
                  acc['repeat'].push(curr_o_id);
               }

               if (!acc['repeat'].includes(curr_o_id)) {
                  acc['single'].push(curr_o_id);
               }
               return acc;
            }, { single: [], repeat: [] });

         switch (OFFSET_REST_STEPS['repeat'].length) {
            case 1:
               return OFFSET_REST_STEPS['repeat'][0];
            case 2:
               return FIRST_STEP_X === 5
                  ? GET_RANDOM_ID(OFFSET_REST_STEPS['repeat'])
                  : GET_RANDOM_ID(OFFSET_REST_STEPS['single']);
            default:
               return GET_RANDOM_ID(OFFSET_REST_STEPS['single']);
         }
      },

      SET_RESULT_STEPS: ({ commit }, settings) => commit('SET_RESULT_STEPS', settings),
      SET_ACTIVE_CELL: ({ commit }, settings) => commit('SET_ACTIVE_CELL', settings),
      SET_SIGN_CELL: ({ commit }, settings) => commit('SET_SIGN_CELL', settings),

      FIND_WINNER: ({ commit }, settings) => commit('FIND_WINNER', settings),
   },
}