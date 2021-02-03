import { gql } from "@apollo/client";
export const GET_DISCOUNTCODE = gql`
  {
    priceRules(first: 10) {
      edges {
        node {
          id
          discountCodes(first: 10) {
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
`;

export const GET_METAFIELD = gql`
  query OrdersData($namespace: String!) {
    shop {
      metafields(first: 10, namespace: $namespace) {
        edges {
          node {
            key
            value
          }
        }
      }
    }
  }
`;
export const GET_METAFIELD_WITH_KEY = gql`
  query config($namespace: String!, $key: String!) {
    shop {
      metafield(namespace: $namespace, key: $key) {
        value
      }
    }
  }
`;
export const SET_METAFIELD_WITH_KEY = gql`
  mutation addmetafield(
    $namespace: String!
    $key: String!
    $value: String!
    $value_type: String!
  ) {
    shop {
      metafield(
        namespace: $namespace
        key: $key
        value: $value
        value_type: $value_type
      ) {
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;
