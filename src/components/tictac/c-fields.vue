<template>
  <div class="fields tictac-container__fields">
	  
		<cCell
			v-for="cell of GET_CELLS"
			:key="cell.id"
			:currId="cell.id"
			:active="cell.active"
			:sign="cell.sign"
		/>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import cCell from '@/components/tictac/inner-fields/c-cell'

export default {
	name: 'cFields',
	components: {
		cCell,
	},
	computed: mapGetters('tictac', [
		'GET_CELLS',
	]),
}
</script>

<style lang="scss">
	.fields {
		width: 40rem;
		height: 40rem;
		display: flex;
		flex-wrap: wrap;

		@media (max-width: 1024px) {
			width: 30rem;
			height: 30rem;
		}
		@media (max-width: 460px) {
			width: calc(100% - 4rem);
			height: calc(100vw - 6rem);
		}
	}
</style>