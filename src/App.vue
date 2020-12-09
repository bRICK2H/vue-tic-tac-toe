<template>
	<div class="tictac">
		<div class="tictac-container tictac__tictac-container">
			
			<!-- Game menu -->
			<c-menu />
			
			<!-- Next play -->
			<div class="reload-field tictac-container__reload-field">
				<transition name="reload-field">
					<img class="reload-field__icon" 
						:src="iconReload" alt="reload"
						v-if="GET_IS_FINISH_GAME"
						@click="CLEAR_STATE_FIELD"
					/>
				</transition>
			</div>
			
			<!-- Fields game -->
			<c-fields />

		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cFields from '@/components/tictac/c-fields'
import cMenu from '@/components/tictac/c-menu'

export default {
  name: 'cTitac',
  components: {
	  cFields,
	  cMenu,
  },
  data: () => ({
	  iconReload: require('@/assets/img/icons/reload.svg'),
  }),
  computed: mapGetters('tictac', ['GET_IS_FINISH_GAME']),
  methods: mapActions('tictac', ['CLEAR_STATE_FIELD', 'CLEAR_STATE_RESULT']),
  destroyed() {
	  this.CLEAR_STATE_FIELD();
	  this.CLEAR_STATE_RESULT();
  }
}
</script>

<style lang="scss">
	.tictac {
		height: 100vh;

		&__tictac-container {
			height: inherit;
		}
	}
	.tictac-container {
		background: #000;
		box-shadow: .1rem .1rem 2rem #000;
		opacity: 0;
		animation: show-tictac-conainer .8s .6s forwards;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		@keyframes show-tictac-conainer {
			100% { opacity: 1; }
		}

		&__reload-field {
			margin: 2rem 0;
		}
	}
	.reload-field {
		width: 5rem;
		height: 5rem;
		filter: invert(1);

		@media (max-width: 460px) {
			width: 3.5rem;
			height: 3.5rem;
		}

		&__icon {
			width: 100%;
			cursor: pointer;
		}
	}

  	.reload-field-enter-active {
	 	opacity: 0;
		transform: rotate(90deg);
	  	animation: reload-field-enter .4s;

		@keyframes reload-field-enter {
			100% { opacity: 1; transform: rotate(0); }
		}
 	}
  	.reload-field-leave-active {
	  	animation: reload-field-leave .4s;

		@keyframes reload-field-leave {
			100% { opacity: 0; transform: rotate(-90deg); }
		}
  	}
</style>