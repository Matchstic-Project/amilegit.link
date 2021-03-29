import API from '@/lib';

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
	interface Vue {
		$api: API;
	}
}