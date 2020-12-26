import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const AbandonCart = () => {

    const [data1, setData1] = useState([]);

    const getAbandonedCarts = useCallback(async () => {
        const res = await api.get('/checkouts');
      
       console.log(res);
        if(res.data.data.checkouts){
            console.log("IN RESP "+res);
            setData1(res.data.data.checkouts);
        }
        
      }, []);

    useEffect(() => {
        getAbandonedCarts()
      }, [getAbandonedCarts])

    const columns = [
       "Checkout, User",
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
        label: "Message 1",
        options: {
            filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
         
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
            <h1>Inside MUIDataTable</h1>
        <MUIDataTable
        title={"ACME Employee list"}
        data={data1.map(item => {
            return [
                item.abandoned_checkout_url,
                item.currency +" " + item.total_price,
                item.created_at,

                
            ]
        })}
        columns={columns}
        options={options}
      />
      </div>
    );
};

export default AbandonCart;