import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ApolloProvider } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import store from "app/store";
import Router from "next/router";
import api from "api/api";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";

import { selectIsPro } from "features/authSlice";

export default function Home() {
  const [value, setValue] = useState("");
  const isPro = useSelector(selectIsPro);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const getSubStatus = async () => {
    console.log("hello");
    let res = await api.get("/getsubscription");
    console.log(res);
    const subs = res.data.data.data.currentAppInstallation.activeSubscriptions;
    console.log(subs);
    if (Array.isArray(subs) && subs.length && subs[0].status == "ACTIVE") {
      console.log("setting pro");
      //dispatch(setPro);
      //store.dispatch(setPro);

      Router.push("/proplus/dashboard");
      return;
    }
    Router.push("/free/dashboard");
    console.log("setting free");

    //dispatch(setFree);
    //store.dispatch(setFree);
  };
  React.useEffect(() => {
    getSubStatus();
  }, []);
  return (
    <div>
      <h1>Hello World</h1>
      {/* <button onClick={test}>Hello</button>
      <button onClick={install}>Install</button>  */}
      {/* <AbandonedCart/> */}
      {/* <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={value} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>  */}
    </div>
  );
}
