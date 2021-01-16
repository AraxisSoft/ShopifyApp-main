export const GET_DISCOUNTCODE = gql`
{
    priceRules (first:10) {
      edges {
        node {
          id
          discountCodes(first:10)  {
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
       metafields(first:10, namespace: $namespace) {
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



