import React , { useEffect, useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import {gql,useQuery ,useLazyQuery} from '@apollo/client';
import ScrollMenu from "react-horizontal-scrolling-menu";
import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const GET_METAFIELD = gql`
query OrdersData($namespace: String!) {
    shop {
       metafields(first:10, namespace: $namespace) {
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

const GET_DISCOUNTCODE = gql`
{
    priceRules (first:10) {
      edges {
        node {
          id
          discountCodes (first:10) {
            edges {
              node {
                code
                id
              }
            }
          }
        }
      }
    }
  }
`;

const allConstants = {
    abandon1: '{{shop_name}}: Hi {{first_name}}, we noticed there were a few items left in your shopping cart 🛒{{cart_items}} If you’re ready to complete your order, your cart awaits you at 👉 {{checkout_url}}',
    abandon2: '{{shop_name}}: Hi {{first_name}}, looks like you left some great items in your cart 🤗 {{cart_items}} Still on the edge with your purchase? Here’s a {{discount}}% OFF if you complete your purchase now. Offer automatically applied at checkout. Thank you 👋 Let’s go 👉 {{checkout_url}}',
    confirmation1:'',
    confirmation2:'',
    review1:'',
    review2:''
   
  };

function MessageTemplate({parentComponent}) {
    const [open, setOpen] = useState(false); // for Dialogue box
    const [section, setSection] = useState(null); // Abandon | Review | Order Confirmation

    const [variable, setVariable] = useState(''); // For checkbox
    const [textBefore, setTextBefore]= useState('');
    const [textAfter, setTextAfter]= useState('');
    const [msgContent, setMsgContent]= useState(''); //

    const [namespace, setNamespace]= useState('');

    

    const [checked, setChecked]= useState(false);

    const [state, setState]= useState('');

    const [current,setCurrent]=useState(0);// 0 | 1 | 2

    //For Abandon | Review | Order Confirmation
    const [msg1,setMsg1]=useState(null);
    const [msg2,setMsg2]=useState(null);

    const [messages,setMessages]=useState(null);

    const  {loading, data, error } = useQuery(
        GET_METAFIELD,
        { variables: { namespace: namespace } },{onCompleted: setMessages}
    );

    const [loadDiscountCodes, { called, loading: discountLoading, data: discountData, error: discountError }] = useLazyQuery(
        GET_DISCOUNTCODE,
    );


    useEffect(() => {
        setNamespace(parentComponent);
    },[])
    // useEffect(() => {
    //     setNamespace(parentComponent);
    //     //infinte recursion???
    //     if()
    //     loadMetafields();
    //     if(data){
    //         console.log("INSIDE WARNINGGGGGGGGGGGG "+JSON.stringify(data));
    //         for (var i = 0; i < data.shop.metafields.edges.length; i++) {
    //             const retValue = data.shop.metafields.edges[i].node.value;
    //             if(retValue && i === 0){
    //                 setMsg1(retValue);
    //             }if(retValue && i === 1){
    //                 setMsg2(retValue);
    //             }
    //         }
    //         // console.log(ab + JSON.stringify(ab));
    //         // console.log(data.shop.metafields.edges[0].node.value);
    //       }

       
    //   }, [data])


   
       
      
     

    



    const saveMsgTemplate=async()=> {

        let newKey= null;
        if (current === 1){
            newKey= "msg1";
        }else{
            newKey= "msg2";
        }
      
        const obj={
          "metafield": {
            namespace: namespace, // Abandon | Review | Order
            key: newKey,             // msg1 || msg2
            value: JSON.stringify(msgContent),
            value_type: "json_string"
          }
          
        }
        const res = await api.post('/metafields', obj);
        //console.log(res.data);
    }
    

    const insertMyText = e => {

        let textToInsert = variable
        let cursorPosition = e.target.selectionStart
        let textBeforeCursorPosition = e.target.value.substring(0, cursorPosition)
        let textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length)
        e.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition
    
        setTextBefore(textBeforeCursorPosition)
        setTextAfter(textAfterCursorPosition)
        setMsgContent(textBeforeCursorPosition + variable + textAfterCursorPosition)
        setVariable('');
    
      }

      const handleChange = (event) => {
        setVariable(event.target.value);
        console.log(event.target.value);
        setVariable('name');
        setMsgContent(textBefore+ ' ' +event.target.value+ ' ' + textAfter);
        setVariable('');
        
      };

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        saveMsgTemplate();
      };

      const updateMsgTemplate = (msgNum) =>{
        console.log("OPEN");
        setOpen(true);
        console.log(messages);
        if(current === 1){
            if(messages && messages.shop.metafields.edges.length>0){
                setMsgContent( data.shop.metafields.edges[0].node.value);
                
            }else if(section === 'Abandon'){
                setMsgContent(allConstants.abandon1);

            }
            else if(section === 'Review'){
                setMsgContent(allConstants.review1);

            }
            else if(section === 'OrderConfirmation'){
                setMsgContent(allConstants.confirmation1);

            }

        }
        else if(current === 2 ){
            if(messages && messages.shop.metafields.edges.length>1){
                setMsgContent(data.shop.metafields.edges[1].node.value);
                
            }else if(section === 'Abandon'){
                setMsgContent(allConstants.abandon2);

            }
            else if(section === 'Review'){
                setMsgContent(allConstants.review2);

            }
            else if(section === 'OrderConfirmation'){
                setMsgContent(allConstants.confirmation2);

            }
        }

      }
    
    return (
        <div>
            <div>
                <button onClick={(e)=>{
                    e.preventDefault();
                    console.log("OPEN");
                    setCurrent(1);
                    updateMsgTemplate( "msg1");
                    
                }
                    }>Edit Msg1</button>

                <button onClick={(e)=>{
                    e.preventDefault();
                    console.log("OPEN");
                    setCurrent(2);
                    updateMsgTemplate( "msg2");
                    
                }
                    }>Edit Msg1</button>
            </div>
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
             <DialogTitle id="form-dialog-title">Edit Message</DialogTitle>
             <DialogContent>
                    <div >
                       
                        <InputLabel id="demo-simple-select-outlined-label">Variable</InputLabel>
                        <Select variant="outlined"
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={variable}

                            onChange={handleChange}
                            label="Variable"
                        >
                            {/* <MenuItem value=""> Variable </MenuItem> */}
                            <MenuItem value="{{first_name}}">First Name</MenuItem>
                            <MenuItem value="{{shop_name}}">Shop Name</MenuItem>
                            <MenuItem value="{{cart_items}}">Cart Items</MenuItem>
                            <MenuItem value="{{checkout_url}}">Checkout url</MenuItem>
                            <MenuItem value="{{order_value}}">Total Amount</MenuItem>
                        </Select>

                    </div>
                    <TextField
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Message"
                        multiline
                        rows={5}
                        onChange={insertMyText}
                        value={msgContent}
                        fullWidth
                    />
                    <div>
                        <Checkbox
                            value="checkedA"
                            onChange={e => {
                                this.setState({ isTrue: e.target.checked });
                              }}
                            label="Create discount code (creates a unique code for each customer)"
                            inputProps={{ 'aria-label': 'Checkbox A' }}
                        />

                        Apply discount code (Automatic Discount)
                    </div>
                       
             </DialogContent>
             
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
     
        </div>
    );
}

export default MessageTemplate;