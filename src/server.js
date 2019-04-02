// @flow
import Koa from 'koa';
import router from './router';

export default class Server {
  app: Koa;

  constructor() {
    this.app = new Koa();
  }

  middleware(): void {
    const { app } = this;
    app.use(router.routes()).use(router.allowedMethods);
  }

  listen(port: number): void {
    const { app } = this;
    app.listen(port);
    console.log(`Listening to port ${port}`);
  }
}