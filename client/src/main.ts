import Vue from 'vue';
import App from './App.vue';

import 'vue-loaders/dist/vue-loaders.css';
import VueLoadersLineScaleParty from 'vue-loaders/dist/loaders/line-scale-party';
Vue.use(VueLoadersLineScaleParty);

import API from '@/lib';

Vue.config.productionTip = false;
const api = new API();

Vue.prototype.$api = api;

new Vue({
  render: h => h(App),
  data: {
    api
  }
}).$mount('#app')
