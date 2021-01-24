import { ApolloProvider } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import store from "app/store";
import React from "react";

import { useDispatch } from "react-redux";
import { setPro, setFree } from "features/authSlice";
import ReactDOM from "react-dom";
import "assets/css/nextjs-material-dashboard.css?v=1.0.0";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { Provider } from "react-redux";
import Router from "next/router";
import PageChange from "components/PageChange/PageChange.js";
Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }) {
  //const dispatch = useDispatch();

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </Provider>
  );
}
MyApp.getStaticProps = async ({ Component, router, ctx }) => {
  console.log(Component);
  console.log("Hi its me");
  let pageProps = {};
  console.log("called");
  if (Component.getStaticProps) {
    console.log("called too");
    pageProps = await Component.getStaticProps(ctx);
  }

  return { pageProps };
};
export default MyApp;
