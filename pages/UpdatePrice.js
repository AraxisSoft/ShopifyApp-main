import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Mutation } from 'react-apollo';

const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;


const UpdatePrice = () => {
    const productVariableInput = {
        id: "gid://shopify/ProductVariant/37684535558338",
        price: 2000,
    };
    
    return (
        <div>
            
            <Mutation mutation={UPDATE_PRICE}>
                      {(changeAvailability, { data }) => (
                        <div>
                         
                          <button onClick = {(e) => {
                            e.preventDefault();
                            changeAvailability({
                              variables: { input: productVariableInput}
                            })
                          }}>
                            Change Availability
                          </button>
                        </div>
                      )}
                    </Mutation>
    
        </div>
    );
};

export default UpdatePrice;