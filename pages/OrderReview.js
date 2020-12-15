import React from 'react';

const GET_FULFILLED_ORDERS = gql`
query OrdersData {
    orders(first: 50, query: "fulfillment_status:fulfilled") {
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


const OrderReview = () => {
    return (
        <div>
            
        </div>
    );
};

export default OrderReview;