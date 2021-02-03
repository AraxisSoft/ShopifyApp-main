const handleSubmit = async (event) => {
  event.preventDefault();
  let shopOrigin = await api.get("/shoporigin");
  shopOrigin = shopOrigin.data.data;
  const temp = [
    {
      link: `apps/floatbutton/api/redirect/${shopOrigin}/fb/https://www.facebook.com`,
      logo: "twitter",
    },
    {
      link: `apps/floatbutton/api/redirect/${shopOrigin}/whatsapp1/https://web.whatsapp.com`,
      logo: "twitter",
    },
    {
      link: `apps/floatbutton/api/redirect/${shopOrigin}/whatsapp2/https://web.whatsapp.com`,
      logo: "twitter",
    },
  ];
  console.log(value);

  const obj = {
    metafield: {
      namespace: "floatButton",
      key: "config",
      value: JSON.stringify(temp),
      value_type: "json_string",
    },
  };
  const res = await api.post("/metafields", obj);
  console.log(res.data);
};
const test = async () => {
  console.log("i updated");
  try {
    let count = await api.get("/getsocialcount");
    console.log(count);
    let data = await api.get("/metafields");
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
const getTheme = async () => {
  console.log("fetching Theme");
  try {
    const id = await getthemeid();
    let res = await api.get("/themes/" + id + "/theme.liquid");
    const themeData = res.data.data.asset.value;
    return themeData;
  } catch (err) {
    console.log(err);
  }
};
const saveTheme = async (themeData) => {
  console.log("saving backup");
  try {
    const id = await getthemeid();
    let res = await api.post("/save/" + id + "theme.liquid", {
      data: themeData,
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};
const loadData = async (file) => {
  console.log("loading file");
  try {
    let res = await api.get("/load/file/" + file);
    console.log(res.data.data);
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};
const updateItems = async (key, data) => {
  try {
    const updatedTheme = {
      asset: {
        key: key,
        attachment: btoa(data),
      },
    };
    const id = await getthemeid();
    let res = await api.post(
      "/themes/" + id + "/assets",
      JSON.stringify(updatedTheme)
    );
    console.log(res.data);
    return true;
  } catch (err) {
    console.log(err);
  }
};
const updateTheme = async (themeData) => {
  console.log(typeof themeData);
  console.log("updating theme");
  try {
    if (themeData.includes("% section 'socialmedia' %")) {
      console.log("already theme updated");
      return true;
    }
    const splitted = themeData.split("</body>");
    const finalData =
      "" +
      splitted[0] +
      "\n {% section 'socialmedia' %} \n </body> \n " +
      splitted[1];
    let res = await updateItems("layout/theme.liquid", finalData);
    console.log("updated Successfully theme");
    return true;
  } catch (err) {
    console.log(err);
  }
};
const saveShopData = async () => {
  console.log("shop origin index");
  const shopOrigin = await api.get("/shoporigin");
  const temp = {
    shopOrigin: shopOrigin.data.data,
  };
  const obj = {
    metafield: {
      namespace: "floatButton",
      key: "shopOrigin",
      value: JSON.stringify(temp),
      value_type: "json_string",
    },
  };
  const res = await api.post("/metafields", obj);
  console.log(res.data);
};
const uploadAssets = async (filename, path) => {
  try {
    console.log("uploading " + filename);
    const load = await loadData(filename);
    console.log("read data");
    let res = await updateItems(path, load);
    console.log("upload done!");
  } catch (err) {
    console.log(err);
  }
};
const install = async () => {
  console.log("hi theme");
  try {
    const themeData = await getTheme();
    saveTheme(themeData);
    const res = await updateTheme(themeData);
    console.log("installed successfully");
    uploadAssets("socialmedia.liquid", "sections/socialmedia.liquid");

    uploadAssets("socialmedia.css.liquid", "assets/socialmedia.css");
    uploadAssets("twitter.svg", "assets/twitter.svg");
    //saveShopData()
    //console.log(themeData);
  } catch (err) {
    console.log(err);
  }
};
const getthemeid = async () => {
  // const themeId = themes.themes.filter(({ role }) => role === "main")[0].id;
  const res = await api.get("/themes");
  const themeId = res.data.data.themes.filter(({ role }) => role === "main")[0]
    .id;
  return themeId;
};
