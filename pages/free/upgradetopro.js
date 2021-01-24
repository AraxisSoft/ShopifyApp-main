import React from "react";

import Free from "layouts/Free.js";
import Router from "next/router";
import api from "api/api";
function UpgradeToPro(props) {
  const redirectToPro = async () => {
    let res = await api.get("/upgradetopro");
    console.log(res.data.data);
    Router.push(res.data.data);
  };
  React.useEffect(() => {
    redirectToPro();
  }, []);

  return (
    <div>
      <div className="main">
        {/* { props.stats.map((number) =>
                <div className="color">
                    <h2>Hello </h2>
                    <p> editihappen!</p>
                </div>
            )} */}
      </div>
    </div>
  );
}

UpgradeToPro.layout = Free;
export default UpgradeToPro;
