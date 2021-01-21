import MessageTemplate from "components/MessageTemplate";
import { useLazyQuery } from "@apollo/client";
import AbandonCartTable from "components/AbandonCartTable";

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
      <button onClick={getMetaFields}>GQL</button>
      <AbandonCartTable />
      <MessageTemplate section="Abandon"></MessageTemplate>
    </div>
  );
};

export default AbandonCart;
