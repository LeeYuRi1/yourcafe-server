// @flow
import Router from 'koa-router';
import * as cafesCtrl from './cafes.ctrl';

const cafes: Router = new Router();

cafes.get('/', cafesCtrl.listCafes);

export default cafes;