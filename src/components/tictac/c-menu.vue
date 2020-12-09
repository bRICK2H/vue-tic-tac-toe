<template>
  <div class="tictac-menu tictac-container__tictac-menu">
	  
	  <div class="select-type tictac-menu__select-type">
		  <h3 class="select-type__type">Режим игры:</h3>
		  <ul class="select-type__box-list">
			  <li class="select-type__item">
					<label for="select-computer" class="select-type__label"
						:class="[{ 'select-type__label--active': GET_TYPE_GAME === 'computer' }, GET_CLASS_BLOCK_TYPE_OF_GAME]"
					>
				  		<input class="select-type__input"
						  	id="select-computer"
						  	type="radio"
							v-model="typeGame"
							value="computer"
							:disabled="GET_IS_BLOCK_TYPE_OF_GAME"
						>
					</label>
					c ботом
			  </li>
			  <li class="select-type__item">
					<label for="select-self" class="select-type__label"
						:class="[{ 'select-type__label--active': GET_TYPE_GAME === 'self' }, GET_CLASS_BLOCK_TYPE_OF_GAME]"
					>
				  		<input class="select-type__input"
						  id="select-self"
						  type="radio"
						  v-model="typeGame"
						  value="self"
						  :disabled="GET_IS_BLOCK_TYPE_OF_GAME"
						>
					</label>
					с собой
			  </li>
		  </ul>
	  </div>
	  <div class="result-game tictac-menu__result-game">
		  <h3 class="result-game__title-result">Результат</h3>
		  	<div class="result-game__computer-box"
		  		v-if="GET_TYPE_GAME === 'computer'"
			>
			  	<div class="counter-item result-game__counter-item">
					<span class="counter-item__sign counter-item__sign--x">X</span>
					<span class="counter-item__result counter-item__result--x"
						:class="GET_CLASS_ROTATE_COUNT_RESULT('X')"
					>{{ GET_COMPUTER_COUNT_RESULT_X }}</span>
				</div>
			  	<div class="counter-item result-game__counter-item">
					<span class="counter-item__result counter-item__result--o"
						:class="GET_CLASS_ROTATE_COUNT_RESULT('O')"
					>{{ GET_COMPUTER_COUNT_RESULT_O }}</span>
					<span class="counter-item__sign counter-item__sign--o">O</span>
				</div>
		  	</div>
			<div class="result-game__self-box"
		  		v-else
			>
			  	<div class="counter-item result-game__counter-item">
					<span class="counter-item__sign counter-item__sign--x">X</span>
					<span class="counter-item__result counter-item__result--x"
						:class="GET_CLASS_ROTATE_COUNT_RESULT('X')"
					>{{ GET_SELF_COUNT_RESULT_X }}</span>
				</div>
			  	<div class="counter-item result-game__counter-item">
					<span class="counter-item__result counter-item__result--o"
						:class="GET_CLASS_ROTATE_COUNT_RESULT('O')"
					>{{ GET_SELF_COUNT_RESULT_O }}</span>
					<span class="counter-item__sign counter-item__sign--o">O</span>
				</div>
		  	</div>
			<transition name="throw-game">
				<span class="result-game__throw-game"
					v-if="GET_IS_THROW_GAME"
				>
					Ничья
				</span>
			</transition>
	  </div>
	
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'cMenu',
	computed: {
		...mapGetters('tictac', [
			'GET_WINNER_SIGN',
			'GET_IS_THROW_GAME',
			'GET_TYPE_GAME',
			'GET_IS_BLOCK_TYPE_OF_GAME',
			'GET_COMPUTER_COUNT_RESULT_X',
			'GET_COMPUTER_COUNT_RESULT_O',
			'GET_SELF_COUNT_RESULT_X',
			'GET_SELF_COUNT_RESULT_O',
			
			'GET_CLASS_BLOCK_TYPE_OF_GAME',
			'GET_CLASS_ROTATE_COUNT_RESULT',
		]),
		typeGame: {
			get() {
				return this.GET_TYPE_GAME;
			},
			set(type) {
				this.SET_TYPE_GAME(type);
			}
		}
	},
	methods: {
		...mapActions('tictac', ['SET_TYPE_GAME', 'SET_COUNT_RESULT']),
	},
	watch: {
		GET_WINNER_SIGN(winnerSign) {
			if (!!winnerSign) {
				setTimeout(() => {
					this.SET_COUNT_RESULT({ winnerSign, type: this.GET_TYPE_GAME })
				}, 300);
			};
		}
	}
}
</script>

<style lang="scss">
.tictac-container {
	&__tictac-menu {
		display: flex;
		align-items: flex-start;
	}
}
.tictac-menu {
	width: 40rem;
	display: flex;

	@media (max-width: 1024px) {
		width: 30rem;
	}
	@media (max-width: 460px) {
		width: 100%;
	}

	&__select-type {
		flex: 0 1 50%;
	}
	&__result-game {
		flex: 0 1 50%;
		position: relative;
	}
}

.select-type {
	display: flex;
	flex-direction: column;
	align-items: center;
	
	&__type {
		font-size: 2rem;
		margin-bottom: 1rem;

		@media (max-width: 1024px) {
			font-size: 1.8rem;
		}
	}
	&__item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: .5rem 0;
		margin-left: 1rem;

		@media (max-width: 1024px) {
			font-size: 1.6rem;
		}
	}
	&__label {
		width: 2.6rem;
		height: 2.6rem;
		margin-right: 1rem;
		border-radius: 50%;
		background: #fff;

		@media (max-width: 1024px) {
			width: 2.4rem;
			height: 2.4rem;
		}

		&--active {
			position: relative;
			background: #0174fe;

			&::after {
				content: '';
				display: block;
				width: 1rem;
				height: 1rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				border: .4rem solid #fff;
				border-radius: 50%;

				@media (max-width: 1024px) {
					border: .3rem solid #fff;
				}
			}
		}
		&--disabled {
			transition: .5s;
			background: #616161;
		}
	}
	&__input {
		display: none;
	}
}
.result-game {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	&__title-result {
		font-size: 2rem;
		margin-bottom: 1rem;

		@media (max-width: 1024px) {
			font-size: 1.8rem;
		}
	}
	&__computer-box, &__self-box {
		width: 100%;
		margin: auto;
		display: flex;
		justify-content: space-around;
	}
	&__counter-item {
		display: flex;
		justify-content: space-around;
	}
	&__throw-game {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);

		@media (max-width: 1024px) {
			font-size: 1.6rem;
		}
	}
}
.counter-item {
	width: 7rem;
	height: 5rem;

	@media (max-width: 1024px) {
		width: 6rem;
		height: 4rem;
		font-size: 1.8rem;
	}

	&__sign, &__result {
		flex: 1 1 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&__sign {
		height: 3.5rem;
		align-self: center;

		@media (max-width: 1024px) {
			height: 3rem;
		}
		
		&--x { background: linear-gradient(90deg, #603d98, transparent); }
		&--o { background: linear-gradient(-90deg, #3d6698, transparent); }
	}
	&__result {
		background: #252525;
		font-size: 3rem;
		padding: 0 1rem;
		transform: perspective(10rem) rotateY(0deg);
		backface-visibility: hidden;

		@media (max-width: 1024px) {
			font-size: 2.5rem;
		}

		&--x { background: #603d98; }
		&--o { background: #3d6698; }
		&--active {
			animation: rotate-result .6s;

			@keyframes rotate-result {
				100% { transform: perspective(10rem) rotateY(-360deg); }
			}
		}
	}
}

.throw-game-enter, .throw-game-leave-to {
	opacity: 0;
}
.throw-game-enter-active,
.throw-game-leave-active {
	top: 90%;
	transition: .4s;
}
.throw-game-enter-to {
	opacity: 1;
	top: 100%;
}
</style>