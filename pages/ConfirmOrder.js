import React from 'react';

//paramterized date+ order
const GET_UNFULFILLED_ORDERS = gql`
query OrdersData {
    orders(first: 50, query: "fulfillment_status:unfulfilled") {
        edges {
          node {
            id
            name
            displayFulfillmentStatus
            
            channel {
              id
              name
            }
            lineItems(first: 5) {
              edges {
                node {
                  id
                  title
                  fulfillmentService {
                    id
                    location {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
}
`;

const ConfirmOrder = () => {
    return (
        <div>
            
        </div>
    );
};

export default ConfirmOrder;