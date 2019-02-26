// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import 'normalize.css'
import axios from 'axios'

Vue.use(iView)
Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$axios', {value: axios})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
