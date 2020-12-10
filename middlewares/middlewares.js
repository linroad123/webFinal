import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request,session }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${request.method} ${request.url.pathname} - ${ms} ms`);
  console.log(`current time:`+Date());
  let count = await session.get('id');
  if (!count){
    console.log('user_id:anonymous');
  } else{
    console.log(`user_id:`+ await session.get('id'));
  }
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const authMiddleware = async({request, response, session}, next) => {
  const url = request.url.pathname;
  if (!url.startsWith('/api') && !url.startsWith('/auth') && !(await session.get('authenticated')) && request.url.pathname !== '/') {
    response.redirect('/auth/login');
  } else {
    await next();
  }
};

export { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware,authMiddleware };