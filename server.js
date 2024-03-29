require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
const Router = require("koa-router");
const {
  receiveWebhook,
  registerWebhook,
} = require("@shopify/koa-shopify-webhooks");
const { log } = require("console");
//firebase
const { admin, db } = require("./util/admin");
const config = require("./util/config");
const firebase = require("firebase");
firebase.initializeApp(config);
// const signin=async()=>{
//   const data = await firebase
//       .auth()
//       .signInWithEmailAndPassword("abdulrehman1937@gmail.com", "ASnvjkdnuABC@09v74nx");
// }
const incrementSocial = async (user, social) => {
  try {
    let finalobj = {};
    //await signin()
    let obj = await db.doc(`/${user}/social`).get();
    if (obj.exists) {
      finalobj = obj.data();
      if (social in finalobj) {
        finalobj[social] = parseInt(finalobj[social]) + 1;
      } else {
        finalobj[social] = 1;
      }
    } else {
      finalobj[social] = 1;
    }
    console.log(finalobj);
    await db.doc(`/${user}/social`).set(finalobj);
    console.log("success");
  } catch (err) {
    console.log(err);
  }
};
var bodyParser = require("koa-body")();
dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const getMetafieldValue = async (namespace, key) => {
  const results = await fetch(
    "https://" +
      ctx.cookies.get("shopOrigin") +
      "/admin/api/2020-10/metafields/" +
      key +
      ".json/",
    {
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
};
const setMetafieldValue = async (namespace, key) => {
  const results = await fetch(
    "https://" +
      ctx.cookies.get("shopOrigin") +
      "/admin/api/2020-10/metafields.json",
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ctx.request.body),
    }
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
};
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;
const getSubscriptionStatus = async (accessToken, shop) => {
  const query = JSON.stringify({
    query: `{
  currentAppInstallation {
    activeSubscriptions {
      
          createdAt
          id
          name
          status
          test
        }
      }
    }
  
`,
  });

  const response = await fetch(
    `https://${shop}/admin/api/2020-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: query,
    }
  );

  const responseJson = await response.json();
  //console.log(responseJson.currentAppInstallation.allSubscriptions);
  return responseJson;
};
const getSubscriptionUrl = async (
  accessToken,
  shop,
  returnUrl = process.env.HOST
) => {
  const query = JSON.stringify({
    query: `mutation {
      appSubscriptionCreate(
        name: "Super Duper Plan"
        returnUrl: "${returnUrl}"
        test: true,
        trialDays: 7,
        lineItems: [
          
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: 10, currencyCode: USD }
              }
            }
          }
        ]
      )
      
      {
        userErrors {
          field
          message
        }
        confirmationUrl
        appSubscription {
          id
        }
      }
    }`,
  });

  const response = await fetch(
    `https://${shop}/admin/api/2020-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: query,
    }
  );

  const responseJson = await response.json();
  return responseJson.data.appSubscriptionCreate.confirmationUrl;
};
app.prepare().then(() => {
  const router = new Router();
  const server = new Koa();
  server.use(session({ secure: true, sameSite: "none" }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        "write_products",
        "read_products",
        "read_themes",
        "write_themes",
        "read_content",
        "read_script_tags",
        "write_script_tags",
        "write_orders",
        "write_discounts",
        "read_discounts",
        "read_price_rules",
      ],
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        console.log(shop + accessToken);
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.cookies.set("accessToken", accessToken, {
          sameSite: "None",
          httpOnly: false,
          secure: true,
        });
        ctx.redirect("/");
        const registration = await registerWebhook({
          address: `${HOST}/webhooks/products/create`,
          topic: "PRODUCTS_CREATE",
          accessToken,
          shop,
          apiVersion: ApiVersion.July20,
        });

        if (registration.success) {
          console.log("Successfully registered webhook!");
        } else {
          console.log("Failed to register webhook", registration.result);
        }

        const returnUrl = `${HOST}?shop=${shop}`;
        const subscriptionUrl = await getSubscriptionUrl(
          accessToken,
          shop,
          returnUrl
        );
        ctx.redirect(subscriptionUrl);
      },
    })
  );
  server.use(graphQLProxy({ version: ApiVersion.October19 }));

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });
  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post("/webhooks/products/create", webhook, (ctx) => {
    console.log("received webhook: ", ctx.state.webhook);
    console.log("received webhook: ", ctx.state.webhook.topic);
  });
  router.get("/api/upgradetopro", async (ctx) => {
    try {
      const returnUrl = `${HOST}?shop=${ctx.cookies.get("shopOrigin")}`;
      const res = await getSubscriptionUrl(
        ctx.cookies.get("accessToken"),
        ctx.cookies.get("shopOrigin"),
        returnUrl
      );
      ctx.body = {
        status: "success",
        data: res,
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/getsubscription", async (ctx) => {
    try {
      const res = await getSubscriptionStatus(
        ctx.cookies.get("accessToken"),
        ctx.cookies.get("shopOrigin")
      );
      ctx.body = {
        status: "success",
        data: res,
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/getsocialcount", async (ctx) => {
    try {
      //await signin()
      let obj = await db.doc(`/${ctx.cookies.get("shopOrigin")}/social`).get();
      if (obj.exists) {
        ctx.body = {
          status: "success",
          data: obj.data(),
        };
        return;
      }
      ctx.body = {
        status: "success",
        data: "Data does not exists",
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/test", async (ctx) => {
    try {
      console.log("hehe got hit");
      ctx.body = {
        status: "success",
        data: "Success",
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/shoporigin", bodyParser, async (ctx) => {
    try {
      console.log("in shop origin " + ctx.cookies.get("shopOrigin"));
      ctx.body = {
        status: "success",
        data: ctx.cookies.get("shopOrigin"),
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/redirect/:user/:social/*", async (ctx) => {
    try {
      console.log(ctx.params);
      console.log(ctx.request.querystring);
      await incrementSocial(ctx.params.user, ctx.params.social);
      ctx.redirect(ctx.params[0] + "?" + ctx.request.querystring);
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/api/:object", async (ctx) => {
    console.log("Inside");
    console.log(ctx.cookies.get("shopOrigin"));
    console.log("accessToken" + ctx.cookies.get("accessToken"));
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json"
      );
      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json",
        {
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/:object/:sub", async (ctx) => {
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          "/" +
          ctx.params.sub +
          ".json"
      );
      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          "/" +
          ctx.params.sub +
          ".json",
        {
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/api/themes/:id/theme.liquid", async (ctx) => {
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/themes/" +
          ctx.params.id +
          "/assets.json?asset[key]=layout/theme.liquid&theme_id=" +
          ctx.params.id
      );
      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/themes/" +
          ctx.params.id +
          "/assets.json?asset[key]=layout/theme.liquid&theme_id=" +
          ctx.params.id,
        {
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/themes", async (ctx) => {
    console.log("on server");
  });

  router.post("/api/themes/:id/assets", bodyParser, async (ctx) => {
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/themes/" +
          ctx.params.id +
          "/assets.json"
      );

      console.log(ctx.request.body);

      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/themes/" +
          ctx.params.id +
          "/assets.json",
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ctx.request.body),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });
  router.post("/api/save/:ext", bodyParser, async (ctx) => {
    try {
      console.log("here");
      fs = require("fs");
      fs.writeFile(
        ctx.cookies.get("shopOrigin") + ctx.params.ext,
        ctx.request.body.data,
        function (err) {
          if (err) return console.log(err);
          console.log("wrote file");
        }
      );
      ctx.body = {
        status: "success",
        data: "done",
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/api/load/file/:ext", async (ctx) => {
    try {
      fs = require("fs");
      const util = require("util");
      const readFile = (fileName) =>
        util.promisify(fs.readFile)(fileName, "utf8");

      let fdata = await readFile(ctx.params.ext);
      ctx.body = {
        status: "success",
        data: fdata,
      };
      return;
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/api/:object", bodyParser, async (ctx) => {
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json"
      );
      console.log(ctx.request.body);
      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json",
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ctx.request.body),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });

  router.put("/api/:object", bodyParser, async (ctx) => {
    try {
      console.log(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json"
      );
      console.log(ctx.request.body);
      const results = await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/" +
          ctx.params.object +
          ".json",
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ctx.request.body),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });
  router.get("(.*)", verifyRequest(), async (ctx) => {
    //console.log(ctx.req.url);
    // console.log(ctx.cookies.get("shopOrigin"));
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
