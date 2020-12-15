import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


const GET_METAFIELD = gql`
query OrdersData {
    shop {
       metafields(first:10, namespace: "whatsapp_number") {
         edges {
           node {
             
             id
             value
             valueType
             description
             legacyResourceId
           }
         }
       }
     }
   }
`;

const GetAbandonedOrders = () => {
    return (
        <Query query={GET_METAFIELD} >
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
          return (
            <p>data</p>

          );
        }}
      </Query>
    );
};

export default GetAbandonedOrders;