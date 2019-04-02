// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import axios from 'axios';
import cafes from './cafes';

const router: Router = new Router();

router.use('/cafes', cafes.routes());

export default router;