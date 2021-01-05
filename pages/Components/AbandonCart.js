import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Cookies from 'js-cookie';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MessageTemplate from './MessageTemplate';
import {gql,useLazyQuery,useQuery} from '@apollo/client';


import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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




const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

//for dropdown tags
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const allConstants = {
  msg_sent: '1',
  msg_1:'msg1',
  msg_2:'msg2'
 
};

const AbandonCart = () => {

    const [data1, setData1] = useState([]);
    const [metaInfo, setMetaInfo] = useState({});
    const [tags, setTags] = useState(['Oliver Hansen','Van Henry',"2", "3", "4", "5"]);
    const [namespace, setNamespace]= useState('messages');

    //const [addTodo, {  loading: mutationLoading, error: mutationError, data:mutationData }] = useMutation(ADD_TODO);
    const  { called: discountCalled, loading: discountLoading, data: discountData, error: discountError } = useQuery(
      GET_DISCOUNTCODE,
  );

    const [loadMetafields, { called: metaCalled, loading, data, error }] = useLazyQuery(
      GET_METAFIELD,
      { variables: { namespace: namespace } }
    );

    const classes = useStyles();

    if(discountError){
      console.log("discountError");
      console.log(JSON.stringify(discountError));
    }
    if(discountCalled){
      console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
      console.log(JSON.stringify(discountCalled));
    }

    //const getMetaFields = () => loadMetafields({ variables: { ... } })

    const getMetaFields = () => {
      loadMetafields();
      if (loading) { 
        console.log(loading) ;
      
    };if(error){
      console.log(error) ;
    }
      // console.log("ERRORRRRRRRRRR "+error) ;
      // console.log("WARNINGGGGGGGGGGGG "+data);
      if(data){
        
      console.log("WARNINGGGGGGGGGGGG "+JSON.stringify(data));
      }
    
    };

    if(data){
      console.log("INSIDE WARNINGGGGGGGGGGGG "+JSON.stringify(data));
      const ab = data.shop.metafields.edges[0].node.value;
      console.log(ab + JSON.stringify(ab));
      console.log(data.shop.metafields.edges[0].node.value);
      
    }

    
const saveMsgStatus=async(cart_id, value )=> {
    //console.log(cart_id); 
   
      
    const obj={
      "metafield": {
        namespace: "messages",
        key: cart_id,
        value: JSON.stringify(value),
        value_type: "json_string"
      }
      
    }
    const res = await api.post('/metafields', obj);
    //console.log(res.data);
}



const handleChange = (event, key) => {
   
    let arr= event.target.value + '';
   
   // metaInfo[key].tag = event.target.value;
    let tempState = null;
    try{
      tempState =  JSON.parse(metaInfo);
    }catch(e){
      tempState = metaInfo;
    }

    let tempState1=null;
    try{
      tempState1 =  JSON.parse(tempState[key]);
    }catch(e){
      tempState1 = tempState[key];
    }
    //console.log("tempState1" + tempState1);
    let result = tempState[key];
    
    //console.log("W JSON.parse"+JSON.stringify(result));
    //console.log("W JSON.parse"+result); // 0 OR 1 0-> not sent || 1 -> sent
    
    try{
      result =  JSON.parse(result);
    }catch(e){
      console.log(e);
    }
    //console.log(result.tag);

    // result.tag=event.target.value;  =>THROWS AN ERROR OF TAG ON STRING
    //console.log("JSON.parse"+result);
    //result=  JSON.parse(result);

    result.tag=arr;     //=>THROWS AN ERROR OF TAG ON STRING

    tempState[key]=result;
    //console.log("tempState"+JSON.stringify(tempState));
    
    //tempState=JSON.parse(tempState);
     setMetaInfo(JSON.stringify(tempState));
     const temp={
      msg1:result.msg1, // 0 OR 1 0-> not sent || 1 -> sent
      msg2:result.msg2,
      tag:result.tag
    }
    //console.log(temp);
    saveMsgStatus(key, temp)
  };

  const updateMsg = (key , msgNum) =>{

    if(msgNum === "1"){


    }else{

    }

    let tempState = null;
    try{
      tempState =  JSON.parse(metaInfo);
    }catch(e){
      tempState = metaInfo;
    }

    let tempState1=null;
    try{
      tempState1 =  JSON.parse(tempState[key]);
    }catch(e){
      tempState1 = tempState[key];
    }
    console.log("tempState1" + tempState1);
    let result = tempState[key];

    try{
      result =  JSON.parse(result);
    }catch(e){
      console.log(e);
    }
   if(msgNum === allConstants.msg_1){
    if("1" !== result.msg1){
      result.msg1= "1";

    tempState[key]=result;
    console.log("tempState"+JSON.stringify(tempState));
    
    //tempState=JSON.parse(tempState);
     setMetaInfo(JSON.stringify(tempState));
     const temp={
      msg1:result.msg1, // 0 OR 1 0-> not sent || 1 -> sent
      msg2:result.msg2,
      tag:result.tag
    }
    saveMsgStatus(key, temp);
  }
    
   
  
  }
  else{
    if("1" !== result.msg2){
      result.msg2= "1";

    tempState[key]=result;
    console.log("tempState"+JSON.stringify(tempState));
    
    //tempState=JSON.parse(tempState);
     setMetaInfo(JSON.stringify(tempState));
     const temp={
      msg1:result.msg1, // 0 OR 1 0-> not sent || 1 -> sent
      msg2:result.msg2,
      tag:result.tag
    }
    saveMsgStatus(key, temp);
  }
    
    
  }



  }

 


  const test = useCallback(async () => {
   
    try{
    const obj = {};
    const res = await api.get('/metafields');
    console.log(res);
    for (var i = 0; i < res.data.data.metafields.length; i++) {
      if( res.data.data.metafields[i].namespace === "messages"){
            const k  = res.data.data.metafields[i].key;
            const v = res.data.data.metafields[i].value;
            obj[k] = v;
            console.log("k v "+ k + " " + v + obj);
      }
    } 
    setMetaInfo(JSON.stringify(obj));
    //console.log("final metainfo "+metaInfo[18611289424066]  );
  }
   catch(err){
     console.log(err);
   }
   
    
  }, []);

    const getAbandonedCarts = useCallback(async () => {
        const res = await api.get('/checkouts');
      
       console.log(res);
        if(res.data.data.checkouts){
            console.log("IN RESP "+res);
            setData1(res.data.data.checkouts);
        }
        
      }, []);

    useEffect(() => {
        getAbandonedCarts();
        test();
      }, [])

    const columns = [
       {
        label: "Checkout, User",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                let arr= value ;
                arr= arr.split(' ');
                let hyperlink = window.location.href;
                hyperlink =hyperlink.split('/');
                hyperlink = Cookies.get('shopOrigin')+"/admin/checkouts/"+arr[2];
                return  <div> <a target="_blank" href={hyperlink}>Cart Details</a>  <span> {arr[0]+ " "+arr[1]}</span></div>;
            }
        }
        },
       {
        label: "Date",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                let arr= value ;
                arr= arr.split('T');
                return arr[0];
            }}
        }
       ,"Amount","Status",
       {
        label: "TAGS",
        options: {

            customBodyRender: (value, tableMeta, updateValue) => {
                const localtags = metaInfo;
                console.log("localtags"+ metaInfo);
                let a=null;
                try{
                a =JSON.parse(localtags);
                }catch(e){
                  a=localtags;
                }
                let b = null;
                try{
                  b = JSON.parse(a[tableMeta.rowData[3]]);
                  }catch(e){
                  b = a[tableMeta.rowData[3]];
                }

                // console.log("a "+ b.tag + "tag" );
                // console.log(typeof b.tag);
                let c = []
                if(b && b.tag){
                  c = b.tag.split(",");
                  console.log("BBBBBBBB" + c + typeof c);
                }
                //let c = b.tag.split(",");
                
                

                return (
                    <div>
                     <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                        <Select
                          labelId="demo-mutiple-chip-label"
                          id="demo-mutiple-chip"
                          multiple
                          value={ c}
                          onChange={(e) => {
                            handleChange(e, tableMeta.rowData[3])}}
                          input={<Input id="select-multiple-chip" />}
                          renderValue={(selected) => (
                           
                            <div className={classes.chips}>
                                {console.log(typeof selected)}
                              {selected.map((value) => (
                                <Chip key={value} label={value} className={classes.chip} />
                              ))}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {tags.map((tag) => (
                            <MenuItem key={tag} value={tag} >
                              {tag}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                       </div>
                  );
            

        
            }}
        },
      {
        label: "Message 1",
        options: {
            filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const localtags = metaInfo;
                console.log("localtags"+ metaInfo);
                let a=null;
                try{
                a =JSON.parse(localtags);
                }catch(e){
                  a=localtags;
                }
                let b = null;
                try{
                  b = JSON.parse(a[tableMeta.rowData[3]]);
                  }catch(e){
                  b = a[tableMeta.rowData[3]];
                }

                // console.log("a "+ b.tag + "tag" );
                // console.log(typeof b.tag);
                let c = null
                if(b && b.msg1){
                  c = b.msg1;
                  console.log("BBBBBBBB" + c + typeof c);
                }
           
            return (
                
            <button onClick={(e)=>{
             
                e.preventDefault();

                updateMsg( tableMeta.rowData[3], "msg1");}}>
           
            { c === "1"? "Message Sent" : "Send Message"}</button>
            )
        }
      }
        }
    

      ,
      {
        label: "Message 2",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              const localtags = metaInfo;
              console.log("localtags"+ metaInfo);
              let a=null;
              try{
              a =JSON.parse(localtags);
              }catch(e){
                a=localtags;
              }
              let b = null;
              try{
                b = JSON.parse(a[tableMeta.rowData[3]]);
                }catch(e){
                b = a[tableMeta.rowData[3]];
              }

              // console.log("a "+ b.tag + "tag" );
              // console.log(typeof b.tag);
              let c = null
              if(b && b.msg2){
                c = b.msg2;
                console.log("BBBBBBBB" + c + typeof c);
              }
                return (
                    <button onClick={(e) => {
                
                      e.preventDefault();
      
                      updateMsg( tableMeta.rowData[3], "msg2");} }>
                        { c === "1"? "Message Sent" : "Send Message"}
                    </button>
                )}
            }
        }
      
    ];
    const options = {
        onFilterChange: (changedColumn, filterList) => {
          console.log(changedColumn, filterList);
        },
        selectableRows: false,
    
        responsive: "scrollMaxHeight",
        rowsPerPage: 10,
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
          console.log(rowData, rowMeta);
          return (
            <React.Fragment>
              <tr>
                <td colSpan={6}>
                  <TableContainer component={Paper}>
                    <Table style={{ minWidth: "650" }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" size="medium">
                            Email
                          </TableCell>
                          <TableCell align="right">Phone</TableCell>
                          <TableCell align="right">Landing&nbsp;URL</TableCell>
                          <TableCell align="right">Referring&nbsp;Site</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={data1[rowMeta.rowIndex].id}>
                          <TableCell component="th" scope="row">
                            {data1[rowMeta.rowIndex].referring_site}
                          </TableCell>
                          <TableCell align="right">
                            {data1[rowMeta.rowIndex].referring_site}
                          </TableCell>
                          <TableCell align="right">
                            {data1[rowMeta.rowIndex].total_discounts}
                          </TableCell>
                          <TableCell align="right">
                            {data1[rowMeta.rowIndex].total_discounts}
                          </TableCell>
                          <TableCell align="right">
                            {data1[rowMeta.rowIndex].total_discounts}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </td>
              </tr>
            </React.Fragment>
          );
        },
        page: 1
      };

     
    return (
        <div>
          <button onClick={getMetaFields}>GQL</button>
          
            <MessageTemplate></MessageTemplate>
        <MUIDataTable
        title={"Abandoned Cart Recovery"}
        data={data1.map(item => {
            return [
                item.customer.first_name+ " "+item.customer.last_name+" "+item.id,
                item.created_at,
                item.currency + " " + item.total_price,
                item.id,
                item.id

            ]
        })}
        columns={columns}
        options={options}
      />

      </div>
    );
};

export default AbandonCart;