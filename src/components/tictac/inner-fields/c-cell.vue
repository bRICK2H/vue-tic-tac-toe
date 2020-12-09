<template>
	<div class="field-cell"
		:class="[{ 'field-cell__winner': GET_CLASS_WINNER(currId) }, GET_CLASS_SELECT_CELL_BLOCK ]"
		@click="addStep"
	>
		<transition name="sign">
			<span class="field-cell__sign"
				v-if="active"
			>
				{{ sign }}
			</span>
		</transition>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'cCell',
	props: {
		currId: {
			type: Number,
			required: true,
		},
		active: {
			type: Boolean,
			default: false,
		},
		sign: {
			type: String,
			default: '',
		},
	},
	computed: mapGetters('tictac', [
		'GET_TYPE_GAME',

		'GET_IS_BLOCK_USED_STEP',
		
		'GET_CLASS_WINNER',
		'GET_CLASS_SELECT_CELL_BLOCK',
	]),
	methods: {
		...mapActions('tictac', [
			'SET_STEP',
			'SET_COMPUTER_STEP',
		]),
		addStep() {
			if (this.GET_IS_BLOCK_USED_STEP(this.currId)) return;

			switch (this.GET_TYPE_GAME) {
				case 'self': this.SET_STEP(this.currId);		
					break;
				case 'computer':
					this.SET_COMPUTER_STEP(this.currId)
					break;
			}
		}
	}
}
</script>

<style lang="scss">
	.field-cell {
		flex: 0 1 calc(33.3333% - .2rem);
		margin: .1rem;
		background: #fff;
		box-shadow: inset 0 0 4rem #646464;
		cursor: pointer;
		user-select: none;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		transition: .3s;
		
		&:active {
			transform: scale(.95);
			box-shadow: inset 0 0 4rem #000;
		}

		&__sign {
			font-size: 5rem;
			color: #000;
			font-weight: 500;
			position: absolute;

			@media (max-width: 414px) {
				font-size: 4rem;
			}
		}
		&__winner {
			will-change: transform;
			animation: winner .5s ease-out forwards;

			@keyframes winner {
				25% {
					transform: scale(.5);
				}
				50% { transform: scale(1.2); }
				75% { transform: scale(.9); }
				100% {
					transform: scale(1);
					background: #41b883;
				}
			}
		}
		&__select-cell-block {
			&:active {
				background: tomato !important;
				transform: scale(1);
			}
		}
	}

	.sign-enter-active {
		opacity: 0;
		transform: scale(0);

		animation: sign .5s;
	}
	@keyframes sign {
		33% { opacity: 1; transform: scale(1.2)}
		66% { opacity: 1; transform: scale(.8)}
		100% { opacity: 1; transform: scale(1)}
	}
</style>