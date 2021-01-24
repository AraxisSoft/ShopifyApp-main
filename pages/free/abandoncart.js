import MessageTemplate from "components/MessageTemplate";
import { useLazyQuery } from "@apollo/client";
import AbandonCartTable from "components/AbandonCartTable";

import Free from "layouts/Free.js";
import { GET_METAFIELD } from "Gql/GqlConstants";

const AbandonCart = () => {
  const [
    loadMetafields,
    { called: metaCalled, loading, data, error },
  ] = useLazyQuery(GET_METAFIELD, {
    variables: { namespace: "messages" },
  });
  const getMetaFields = () => {
    loadMetafields();
    if (loading) {
      console.log(loading);
    }
    if (error) {
      console.log(error);
    }
    // console.lo\("ERRORRRRRRRRRR "+error) ;
    // console.log("WARNINGGGGGGGGGGGG "+data);
    if (data) {
      console.log("WARNINGGGGGGGGGGGG " + JSON.stringify(data));
    }
  };
  return (
    <div>
      <AbandonCartTable />
      {/* <button onClick={getMetaFields}>GQL</button>
      
      <MessageTemplate section="Abandon"></MessageTemplate> */}
    </div>
  );
};
AbandonCart.layout = Free;
export default AbandonCart;
