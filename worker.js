import { handle } from './build/handler.js';

export default {
  async fetch(request, env, ctx) {
    return handle(request);
  }
};
