import Vue from 'vue';
import Router from 'vue-router';
import test from '../views/forTest';
import testH from '../views/testH';
import testA from '../views/testA';
import forDisplay from '../views/forDisplay';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: forDisplay, name: 'forDisplay' },
    { path: '/t', component: test, name: 'test' },
    { path: '/h', component: testH, name: 'testH' },
    { path: '/a', component: testA, name: 'testA' },
  ],
});
