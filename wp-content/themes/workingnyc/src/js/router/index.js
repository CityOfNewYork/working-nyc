'use strict';

import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router/dist/vue-router.common'
import qs from 'qs/dist/qs';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/programs',
      name: 'programs',
      props: [Array]
    },
  ],
  parseQuery(query) {
    let q = qs.parse(query)
    Object.keys(q).forEach(function (key) {
      if (!Array.isArray(q[key])) {
        q[key] = q[key].split()
      }
    });
    return q;
  },
});