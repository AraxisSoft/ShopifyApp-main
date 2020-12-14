require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');
const { log } = require('console');

var bodyParser = require('koa-body')();
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;
app.prepare().then(() => {
  
const router = new Router();
  const server = new Koa();
  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products','read_themes','write_themes','read_content','read_script_tags','write_script_tags'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, { httpOnly: false,sameSite: 'None' });
        ctx.cookies.set('accessToken', accessToken,{sameSite: 'None'});
        ctx.redirect('/');
      },
    })
  );
  
server.use(router.routes())
  server.use(verifyRequest());
  
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });
  

router.get('/api/:object', async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json")
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json", {
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
      },
    })
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})
router.get('/api/:object/:sub', async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object+"/"+ ctx.params.sub + ".json")
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object+"/" + ctx.params.sub + ".json", {
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
      },
    })
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})

router.get('/api/themes/:id/theme.liquid', async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/themes/"+ctx.params.id+"/assets.json?asset[key]=layout/theme.liquid&theme_id="+ctx.params.id)
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/themes/"+ctx.params.id+"/assets.json?asset[key]=layout/theme.liquid&theme_id="+ctx.params.id, {
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
      },
    })
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})

router.post('/')

router.post('/api/themes/:id/assets',bodyParser, async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/themes/"+ctx.params.id+"/assets.json")
    
    console.log(ctx.request.body)
    
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/themes/"+ctx.params.id+"/assets.json", {
      method: 'PUT',  
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(ctx.request.body),
    },)
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})
router.post('/api/save/:ext',bodyParser, async (ctx) => {
  try {
    console.log('here');
    fs = require('fs');
  fs.writeFile(ctx.cookies.get('shopOrigin')+ctx.params.ext, ctx.request.body.data, function (err) {
  if (err) return console.log(err);
  console.log('wrote file');
  
});
ctx.body = {
  status: 'success',
  data: "done"
};
return
  } catch (err) {
    console.log(err)
  }
})
router.get('/api/load/file/:ext', async (ctx) => {
  try {
    const util = require('util');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');

    let fdata=await readFile(ctx.params.ext)
    ctx.body = {
      status: 'success',
      data: fdata
    };
    return
  } 

  catch (err) {
    console.log(err)
  }
})
router.post('/api/:object',bodyParser, async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json")
    console.log(ctx.request.body);
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json", {
      method: 'POST',
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(ctx.request.body),
    },)
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})
router.put('/api/:object',bodyParser, async (ctx) => {
  try {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json")
    console.log(ctx.request.body);
    const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-10/" + ctx.params.object + ".json", {
      method: 'PUT',
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(ctx.request.body),
    },)
    .then(response => response.json())
    .then(json => {
      return json;
    });
    ctx.body = {
      status: 'success',
      data: results
    };
  } catch (err) {
    console.log(err)
  }
})
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});


