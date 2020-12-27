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
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const AbandonCart = () => {

    const [data1, setData1] = useState([]);
    const [metaInfo, setMetaInfo] = useState({});
    const [tags, setTags] = useState(['Oliver Hansen','Van Henry']);
     const classes = useStyles();
  const theme = useTheme();

    
const saveMsgStatus=async(cart_id )=> {
    console.log(cart_id);
    const temp={
          msg1:'https://www.facebook.com', // 0 OR 1 0-> not sent || 1 -> sent
          msg2:'twitter',
          tag:"['fgfd','hjhj']"
        }
      
    const obj={
      "metafield": {
        namespace: "messages",
        key: cart_id,
        value: JSON.stringify(temp),
        value_type: "json_string"
      }
    }
    const res = await api.post('/metafields', obj);
    console.log(res.data);
}

// const test=async ()=>{
//     console.log("GET META");
//     try{
        
//     const data = await api.get('/metafields');
//     console.log("GET META");
//     console.log("META DATA" + data);
//     }
//     catch(err){
//       console.log(err);
//     }
//   }


// TBC  LEARN PrMTERS PASSING
const handleChange = (event) => {
    console.log(event.target.value);
    setMetaInfo[]
    setMetaInfo
    JSON.parse(event.target.value
  };


  const test = useCallback(async () => {

   
   
    try{
    const obj = {};
    const res = await api.get('/metafields');
    for (var i = 2; i < res.data.data.metafields.length; i++) {
            let k  = res.data.data.metafields[i].key;
            let v = res.data.data.metafields[i].value;

            obj[k] = v;
            console.log("k v "+ k + " " + v + obj);
    } 
    setMetaInfo(obj);
    console.log("final metainfo "+JSON.stringify(metaInfo));

  
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
                let localtags = metaInfo;
                console.log("localtags"+ metaInfo);
                let a=null;
                try {
                 a = JSON.parse(metaInfo);
                } catch (e) {
                    a=metaInfo;

                }
                // console.log("a "+ a);
                // let tag = JSON.parse(a[tableMeta.rowData[3]]).tag;
                // console.log("a "+a[tableMeta.rowData[3]] + "tag" + tag);

                return (
                    <div>
                     <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                        <Select
                          labelId="demo-mutiple-chip-label"
                          id="demo-mutiple-chip"
                          multiple
                          value={JSON.parse(metaInfo[tableMeta.rowData[3]]).tag}
                          onChange={handleChange}
                          input={<Input id="select-multiple-chip" />}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
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
            //    let id = tableMeta.rowData[3]
            //    let val= metaInfo.id;
            //    console.log("val"  + val);
            //    if(val){
                   
            //     return val;
            //    }
            //         return "";

        
            }}
        },
      {
        label: "Message 1",
        options: {
            filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
           
            return (
                
            <button onClick={(e)=>{
                
                e.preventDefault();

                saveMsgStatus( tableMeta.rowData[3]);}}>
            
            { tableMeta.rowData[3]}</button>
            )
        }
      }
        }
    

      ,
      {
        label: "Message 2",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <button onClick={() => console.log(value, tableMeta.rowData[3]) }>
                        Edit
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
                        <TableRow key={data[rowMeta.rowIndex][0]}>
                          <TableCell component="th" scope="row">
                            {rows[rowMeta.rowIndex].name}
                          </TableCell>
                          <TableCell align="right">
                            {data[rowMeta.rowIndex][0]}
                          </TableCell>
                          <TableCell align="right">
                            {rows[rowMeta.rowIndex].fat}
                          </TableCell>
                          <TableCell align="right">
                            {rows[rowMeta.rowIndex].carbs}
                          </TableCell>
                          <TableCell align="right">
                            {rows[rowMeta.rowIndex].protein}
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

     

    const  sdfsdf = async ()=>{
        // const params = JSON.stringify({

        //     "status": "closed",
            
        //     });
        //const res = await api.get('/checkouts',{ params: { "status":"open","limit":"0" }});
         const res = await api.get('/checkouts');
         console.log(res);
         return res.data.checkouts;
        //  res.data.checkouts[0].created_at
        //  res.data.checkouts[0].customer.phone
        //  res.data.checkouts[0].abandoned_checkout_url
        //  res.data.checkouts[0].subtotal_price
        //  storeurl+admin/checkouts/+temp1.data.checkouts[0].id

        //  temp1.data.checkouts[0].line_items
        //  temp1.data.checkouts[0].completed_at
        //  temp1.data.checkouts[0].closed_at

        
       }
    return (
        <div>
            
        <MUIDataTable
        title={"Abandoned Cart Recovery"}
        data={data1.map(item => {
            return [
                item.customer.first_name+ " "+item.customer.last_name+" "+item.id,
                item.created_at,
                item.currency +" " + item.total_price,
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