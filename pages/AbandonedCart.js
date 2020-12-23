
import {
  DataGrid,
  ColDef,
  ValueGetterParams,
  CellParams,
  GridApi
} from "@material-ui/core";
import Button from '@material-ui/core';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import GetAbandonedOrders from './GetAbandonedOrders';
import { ApolloProvider } from 'react-apollo';
//import CreateDiscount from './CreateDiscount';
import UpdatePrice from './UpdatePrice';
import FixedDiscount from './FixedDiscount';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
});

import React, { useState } from 'react';
import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const AbandonedCart = () => {

    const [msg1,setMsg1]=useState('{{shop_name}}: Hi {{first_name}}, we noticed there were a few items left in your shopping cart 🛒{{cart_items}} If you’re ready to complete your order, your cart awaits you at 👉 {{checkout_url}}');
    const [msg2,setMsg2]=useState('{{shop_name}}: Hi {{first_name}}, looks like you left some great items in your cart 🤗 {{cart_items}} Still on the edge with your purchase? Here’s a {{discount}}% OFF if you complete your purchase now. Offer automatically applied at checkout. Thank you 👋 Let’s go 👉 {{checkout_url}}');

    const [discount, setDiscount] =useState(0);
    const tempvar = 'arsal';
    const [num1, setNum1] =useState(null);
    const [operator, setOperator1] =useState(null);
    
  function replaceit(str, find, replace) {
    let parts = str.split(find);
    console.log(parts);
    const result = [];
    for(let i = 0;  i < parts.length; i++) {
        result.push(parts[i]);
        
        result.push(replace);
    }
    result.pop(replace);
    return (
        result
    );
    }

    const ab = ()=>{
      let res = replaceit("{{shop_name}}: Hi {{first_name}}, looks like you left some great items in your cart 🤗", "{{shop_name}}", "tfm");
      res = (replaceit(res.toString(), "{{first_name}}", "arsal"));
      let newstr ;
      for(let i = 0;  i < res.length; i++) {
        newstr=newstr+res[i];
        
       
    }
    console.log(newstr);
    }

    const savewhatsappnum=async(event)=> {
        const temp=[
            {
              operator:operator,
              num:num1
            },
          ]
        event.preventDefault();
        const obj={
          "metafield": {
            namespace: "whatsapp_number",
            key: "num1",
            value: JSON.stringify(temp),
            value_type: "json_string"
          }
        }
        const res = await api.post('/metafields', obj);
        console.log(res.data);
      }



    const sendmsg1 = ()=>{


    }

    const sendmsg2 = ()=>{

    }
    


    const  getAbandonedCarts = async ()=>{
       
        const params = JSON.stringify({

            "status": "closed",
            
            });
           // const res = await api.get('/checkouts',{ params: { "status":"open","limit":"0" }});
         const res = await api.get('/checkouts');
         console.log(res);
         //res.data.checkouts[0].created_at
         //res.data.checkouts[0].customer.phone
         //res.data.checkouts[0].abandoned_checkout_url
         //res.data.checkouts[0].subtotal_price
         // storeurl+admin/checkouts/+temp1.data.checkouts[0].id

         //temp1.data.checkouts[0].line_items
         //temp1.data.checkouts[0].completed_at
         //temp1.data.checkouts[0].closed_at




     
        
       }
       

    return (
        <div>
            <button onClick={getAbandonedCarts}>getAbandonedCartitems</button>
            <input placeholder="Whatsapp" value = {num1} onChange={e => setNum1(e.target.value)}></input>
            <input placeholder="Operator" value = {operator} onChange={e => setOperator1(e.target.value)}></input>
            <button onClick={savewhatsappnum}>savenum</button> 
            <button onClick={sendmsg1}>replace placeholder</button>

            <ApolloProvider client={client}>
              <GetAbandonedOrders />
            </ApolloProvider>

            {/* {CreateDiscount} */}
            <ApolloProvider client={client}>
                <UpdatePrice/>
                <FixedDiscount title="basic tes" startsAt="2021-01-01" endsAt="2021-03-01" code="34231" amount="123456" />
                </ApolloProvider> 

            
            
          
            
        </div>
    );
};

export default AbandonedCart;