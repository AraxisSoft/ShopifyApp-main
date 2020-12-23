import React, { useState } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Mutation } from 'react-apollo';

const CREATE_FIXED_DISCOUNT = gql`
  mutation discountCodeBxgyCreate($bxgyCodeDiscount: DiscountCodeBxgyInput!) {
    discountCodeBxgyCreate(bxgyCodeDiscount: $bxgyCodeDiscount) {
        userErrors { field message code }
     
      codeDiscountNode {
        id
          codeDiscount {
          ... on DiscountCodeBasic {
            title
            summary
            status
            codes (first:10) {
              edges {
                node {
                  code
                }
              }
            }
          }
        }
      }
    }
  }
`;

const FixedDiscount = ({ title, startsAt, endsAt, code, amount }) => {
    const [basicCodeDiscount, setBasicCodeDiscount] = useState();
    const updateParam = ({ title, startsAt, endsAt, code, amount }) => {
        // const discountParam={
        //     title:title,
        //     startsAt:startsAt,
        //     endsAt:endsAt,
        //     customerSelection:{
        //         all: true
        //       },
        //       code:code,
        //     customerGets: {
        //         value: {
        //           discountAmount:  {
        //             amount: amount,

        //           }
        //         }

        //     }
        // };
        const discountParam = {
            title: "code bxgy test",
            startsAt: "2016-01-01",
            endsAt: "2019-04-18T02:38:45Z",
            usageLimit : 2,
            code: "TESTCODE1001234",
            customerSelection: {
              all: true
            },
            customerBuys: {
                value: {
                    quantity: "1"
                  },
                items: {
                  products: {
                    productsToAdd: ["gid://shopify/Product/6103188537538"]
                  }
                }
              },
            
            customerGets: {
              value: {
                discountOnQuantity: {
                  quantity: "1",
                  effect: {
                    percentage: 1.00
                  }
                }
              },
              items: {
                products: {
                  productsToAdd: ["gid://shopify/Product/6103188537538"]
                }
              }
            }}
            console.log(discountParam);
        setBasicCodeDiscount(discountParam);

    }




    return (
        <div>
            <Mutation mutation={CREATE_FIXED_DISCOUNT}>
                {(changeAvailability, { error, data }) => {
                    console.log(error);
                    console.log(data);
                    return(
                    <div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            updateParam(title, startsAt, endsAt, code, amount);
                            console.log(basicCodeDiscount);
                            changeAvailability({

                                variables: { bxgyCodeDiscount: basicCodeDiscount }
                            })
                        }}>
                            Create Discount
                          </button>
                    </div>

                    )
}}
            </Mutation>
        </div>
    );
};

FixedDiscount.propTypes = {

};

export default FixedDiscount;