import React, { useEffect, useState, useCallback } from "react";
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Grid from "@material-ui/core/Grid";
const fstyles = {
  ...styles,
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  MuiTableCell: {
    head: {
      color: "inherit",
      height: "56px",
      outline: "none",
      verticalAlign: "middle",
      color: "inherit",
      ...defaultFont,
      "&, &$tableCell": {
        fontSize: "1em",
      },
    },
    root: {
      ...defaultFont,
      lineHeight: "1.42857143",
      padding: "12px 8px",
      verticalAlign: "middle",
      fontSize: "0.8125rem",
    },
  },
};
import {
  primaryColor,
  defaultFont,
} from "assets/jss/nextjs-material-dashboard.js";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import {
  selectMsg1,
  selectMsg2,
  setMsg1,
  setMsg2,
} from "features/messageSlice";
import { replaceit } from "HelperFunctions/allfunctions";

import { GET_DISCOUNTCODE, GET_METAFIELD } from "Gql/GqlConstants";

import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const msgConstants = {
  abandon1:
    "{{shop_name}}: Hi {{first_name}}, we noticed there were a few items left in your shopping cart 🛒{{cart_items}} If you’re ready to complete your order, your cart awaits you at 👉 {{checkout_url}}",
  abandon2:
    "{{shop_name}}: Hi {{first_name}}, looks like you left some great items in your cart 🤗 {{cart_items}} Still on the edge with your purchase? Here’s a {{discount}}% OFF if you complete your purchase now. Offer automatically applied at checkout. Thank you 👋 Let’s go 👉 {{checkout_url}}",
};

const useStyles = makeStyles(fstyles);
// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//     maxWidth: 300,
//   },
//   chips: {
//     display: "flex",
//     flexWrap: "wrap",
//   },
//   chip: {
//     margin: 2,
//   },
//   noLabel: {
//     marginTop: theme.spacing(3),
//   },
// }));

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
  msg_sent: "1",
  msg_1: "msg1",
  msg_2: "msg2",
};

export default function AbandonCartTable(props) {
  const classes = useStyles();
  const msgTemplate1 = useSelector(selectMsg1);
  const msgTemplate2 = useSelector(selectMsg2);
  const [msgText1, setMsgText1] = useState(null);
  const [msgText2, setMsgText2] = useState(null);

  const [data1, setData1] = useState([]);
  const [metaInfo, setMetaInfo] = useState({});
  const [tags, setTags] = useState([
    "Oliver Hansen",
    "Van Henry",
    "2",
    "3",
    "4",
    "5",
  ]);
  const [namespace, setNamespace] = useState("messages");

  const [discounts, setDiscounts] = useState([]);

  const abandonMetaField = {
    msg1: 0, // 0 OR 1 0-> not sent || 1 -> sent
    msg2: 0,
    tag: "",
    lastDiscountCode: "",
  };

  //const [addTodo, {  loading: mutationLoading, error: mutationError, data:mutationData }] = useMutation(ADD_TODO);
  const {
    called: discountCalled,
    loading: discountLoading,
    data: discountData,
    error: discountError,
  } = useQuery(GET_DISCOUNTCODE, {
    onCompleted: (allDiscountData) => {
      let allDiscounts = [];
      if (allDiscountData && allDiscountData.priceRules) {
        for (var i = 0; i < allDiscountData?.priceRules?.edges?.length; i++) {
          let currNode = allDiscountData?.priceRules?.edges[i];
          for (var j = 0; j < currNode.node.discountCodes.edges.length; j++) {
            let discCode = currNode?.node?.discountCodes?.edges[j]?.node?.code;
            allDiscounts.push(discCode);
          }
        }
      }
      setDiscounts(allDiscounts);
      console.log(allDiscounts);
    },
    onError: (err) => {
      console.log("onError" + err);
    },
  });

  const { loading: metaLoading, data: metaData, error: metaError } = useQuery(
    GET_METAFIELD,
    {
      variables: { namespace: "messages" },
      onCompleted: (returnedData) => {
        console.log(returnedData);
        console.log("onComplete");
        const filteredResponse = {};
        if (returnedData) {
          for (
            var i = 0;
            i < returnedData?.shop?.metafields?.edges?.length;
            i++
          ) {
            if (returnedData?.shop?.metafields?.edges[i]?.node) {
              const k = returnedData?.shop?.metafields?.edges[i]?.node?.key;
              const v = returnedData?.shop?.metafields?.edges[i]?.node?.value;
              let parsedResponse = null;
              try {
                parsedResponse = JSON.parse(v);
              } catch (e) {
                parsedResponse = v;
                console.log(e);
              }
              filteredResponse[k] = parsedResponse;
              console.log("k v " + k + " " + v + filteredResponse);
            }
          }
        }
        setMetaInfo(filteredResponse);
      },
      onError: (err) => {
        console.log("onError " + err);
      },
    }
  );

  //const getMetaFields = () => loadMetafields({ variables: { ... } })

  const saveMsgStatus = async (cart_id, value) => {
    //console.log(cart_id);

    const obj = {
      metafield: {
        namespace: "messages",
        key: cart_id,
        value: JSON.stringify(value),
        value_type: "json_string",
      },
    };
    const res = await api.post("/metafields", obj);
    //console.log(res.data);
  };

  const updateParams = (key, param, value) => {
    let tempState = metaInfo;
    let metaFieldValue = tempState[key];

    if (metaFieldValue) {
      metaFieldValue[param] = value;
    } else {
      //default metafield for newly created
      metaFieldValue = abandonMetaField;
      metaFieldValue[param] = value; //updated value
    }

    tempState[key] = metaFieldValue;
    setMetaInfo({ ...metaInfo, key: metaFieldValue });
    console.log(metaInfo);
    saveMsgStatus(key, metaFieldValue);
  };

  const handleChange = (event, key) => {
    let arr = event.target.value + "";
    updateParams(key, "tag", arr);
  };

  const parseParams = (key, param) => {
    let metaFieldValue = metaInfo[key];

    let retValue = null;
    if (metaFieldValue) {
      retValue = metaFieldValue[param];
    }

    return retValue;
  };

  const updateMsg = (key, msgNum) => {
    let val = parseParams(key, msgNum);

    if (val !== 1) {
      updateParams(key, msgNum, 1);
    }
  };
  const sendMessage = (index) => {
    let finalMsg = replaceAllPlaceholders(index);

    let url =
      "https://web.whatsapp.com/send?phone=" +
      data1[index]?.phone +
      "?text=" +
      finalMsg;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const replaceAllPlaceholders = (index) => {
    let variableList = [
      "{{first_name}}",
      "{{shop_name}}",
      "{{checkout_url}}",
      "{{order_value}}",
    ];
    let replaceList = [
      data1[index]?.customer?.first_name,
      data1[index]?.currency + " " + data1[index]?.total_price,
      data1[index]?.web_url,
      data1[index]?.id,
    ];
    let localMsg = msgTemplate1;
    for (var i = 0; i < variableList.length; i++) {
      localMsg = replaceit(localMsg, variableList[i], replaceList[i]);
    }
    return localMsg;
  };
  const columns = [
    {
      label: "Checkout, User",
      // options: {
      //   customBodyRender: (value, tableMeta, updateValue) => {
      //     let arr = value;
      //     arr = arr.split(' ');
      //     console.log("INDEXXXXXXXXXXXXXXXXXXXX" +arr);
      //     let hyperlink = window.location.href;
      //     hyperlink = hyperlink.split('/');
      //     hyperlink = Cookies.get('shopOrigin') + "/admin/checkouts/" + arr?.[2];
      //     //return <div> <a target="_blank" href={hyperlink}>Cart Details</a>  <span> {arr?.[0] + " " + arr?.[1]}</span></div>;
      //   }
      // }
    },
    {
      label: "Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let arr = value;
          arr = arr.split("T");
          console.log(arr?.[0]);
          console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAA1" + data1);
          return arr?.[0];
        },
      },
    },
    "Amount",
    "Status",
    {
      label: "Last Discount Applied",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let metaFieldValue = metaInfo?.[tableMeta.rowData?.[3]];

          let param = "lastDiscountCode";
          let retValue = "";
          if (metaFieldValue) {
            retValue = metaFieldValue[param];
          }

          //let code = parseParams(tableMeta.rowData[3], "lastDiscountCode");
          return (
            <div>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                <Select
                  native
                  value={retValue}
                  onChange={(e) => {
                    e.target.value;
                    updateParams(
                      tableMeta.rowData[3],
                      "lastDiscountCode",
                      e.target.value
                    );
                  }}
                  label=""
                  inputProps={{
                    name: "",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  {discounts.map((number) => (
                    <option value={number}>{number}</option>
                  ))}
                </Select>
              </FormControl>
            </div>
          );
        },
      },
    },
    {
      label: "TAGS",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const localtags = metaInfo;
          console.log("localtags" + metaInfo);
          let a = null;
          try {
            a = JSON.parse(localtags);
          } catch (e) {
            a = localtags;
          }
          let b = null;
          try {
            b = JSON.parse(a?.[tableMeta.rowData?.[3]]);
          } catch (e) {
            b = a?.[tableMeta.rowData?.[3]];
          }

          // console.log("a "+ b.tag + "tag" );
          // console.log(typeof b.tag);
          let c = [];
          if (b && b.tag) {
            c = b.tag.split(",");
            console.log("BBBBBBBB" + c + typeof c);
          }

          return (
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                <Select
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  multiple
                  value={c}
                  onChange={(e) => {
                    handleChange(e, tableMeta.rowData[3]);
                  }}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {console.log(typeof selected)}
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          );
        },
      },
    },
    {
      label: "Message 1",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const localtags = metaInfo;
          console.log("localtags" + metaInfo);
          let a = null;
          try {
            a = JSON.parse(localtags);
          } catch (e) {
            a = localtags;
          }
          let b = null;
          try {
            b = JSON.parse(a?.[tableMeta.rowData?.[3]]);
          } catch (e) {
            b = a?.[tableMeta.rowData?.[3]];
          }

          // console.log("a "+ b.tag + "tag" );
          // console.log(typeof b.tag);
          let c = null;
          if (b && b.msg1) {
            c = b.msg1;
            console.log("BBBBBBBB" + c + typeof c);
          }

          return (
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log(tableMeta.rowData);
                sendMessage(tableMeta.rowData[3]);
                updateMsg(tableMeta.rowData[3], "msg1");
              }}
            >
              {c === "1" ? "Message Sent" : "Send Message"}
            </button>
          );
        },
      },
    },
    {
      label: "Message 2",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const localtags = metaInfo;
          console.log("localtags" + metaInfo);
          let a = null;
          try {
            a = JSON.parse(localtags);
          } catch (e) {
            a = localtags;
          }
          let b = null;
          try {
            b = JSON.parse(a?.[tableMeta.rowData?.[3]]);
          } catch (e) {
            b = a?.[tableMeta.rowData?.[3]];
          }

          // console.log("a "+ b.tag + "tag" );
          // console.log(typeof b.tag);
          let c = null;
          if (b && b.msg2) {
            c = b.msg2;
            console.log("BBBBBBBB" + c + typeof c);
          }
          return (
            <button
              onClick={(e) => {
                e.preventDefault();

                updateMsg(tableMeta.rowData[3], "msg2");
              }}
            >
              {c === "1" ? "Message Sent" : "Send Message"}
            </button>
          );
        },
      },
    },
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
      console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAA1" + data1);
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
                    <TableRow key={data1[rowMeta.rowIndex]?.id}>
                      <TableCell component="th" scope="row">
                        {data1[rowMeta.rowIndex]?.referring_site}
                      </TableCell>
                      <TableCell align="right">
                        {data1[rowMeta.rowIndex]?.referring_site}
                      </TableCell>
                      <TableCell align="right">
                        {data1[rowMeta.rowIndex]?.total_discounts}
                      </TableCell>
                      <TableCell align="right">
                        {data1[rowMeta.rowIndex]?.total_discounts}
                      </TableCell>
                      <TableCell align="right">
                        {data1[rowMeta.rowIndex]?.total_discounts}
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
    page: 1,
    headerStyle: {
      color: primaryColor[0],
    },
    table: {
      marginBottom: "0",
      width: "100%",
      maxWidth: "100%",
      backgroundColor: "transparent",
      borderSpacing: "0",
      borderCollapse: "collapse",
    },
    tableHeadCell: {
      color: "inherit",
      ...defaultFont,
      "&, &$tableCell": {
        fontSize: "1em",
      },
    },
    tableCell: {
      ...defaultFont,
      lineHeight: "1.42857143",
      padding: "12px 8px",
      verticalAlign: "middle",
      fontSize: "0.8125rem",
    },
    tableResponsive: {
      width: "100%",

      overflowX: "auto",
    },
    tableHeadRow: {
      height: "56px",
      color: "inherit",
      display: "table-row",
      outline: "none",
      verticalAlign: "middle",
    },
    tableBodyRow: {
      height: "48px",
      color: "inherit",
      display: "table-row",
      outline: "none",
      verticalAlign: "middle",
    },
  };
  const getAbandonedCarts = useCallback(async () => {
    const res = await api.get("/checkouts");

    console.log(res);
    if (res.data.data.checkouts) {
      console.log("IN RESP " + res);
      setData1(res?.data?.data?.checkouts);
      console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAA1 " + data1);
    }
  }, []);
  useEffect(() => {
    getAbandonedCarts();
    //test();
    console.log("        useEffect       Called");
  }, []);
  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableHead: {
          root: {
            color: primaryColor[0],

            ...defaultFont,

            "&, &$tableCell": {
              fontSize: "1em",
            },
            fontWeight: "bold",
          },
        },
        MuiTable: {
          root: {
            marginBottom: "0",
            width: "100%",
            maxWidth: "100%",
            backgroundColor: "transparent",
            borderSpacing: "0",
            borderCollapse: "collapse",
          },
        },
        MuiToolbar: {
          root: {},
        },
        MuiTableCell: {
          head: {
            color: "inherit",
            height: "56px",
            outline: "none",
            verticalAlign: "middle",
            color: "inherit",
            ...defaultFont,
            "&, &$tableCell": {
              fontSize: "1em",
              fontWeight: "bold",
            },
          },
          root: {
            ...defaultFont,
            lineHeight: "1.42857143",
            padding: "12px 8px",
            verticalAlign: "middle",
            fontSize: "0.8125rem",
          },
        },

        tableResponsive: {
          width: "100%",

          overflowX: "auto",
        },
        tableHeadRow: {
          color: "inherit",
          display: "table-row",
          outline: "none",
          verticalAlign: "middle",
        },
      },
      MuiTableFooter: {
        root: {
          ...defaultFont,
          lineHeight: "1.42857143",
          padding: "12px 8px",
          verticalAlign: "middle",
          fontSize: "0.8125rem",
        },
      },
    });
  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <div className={classes.tableResponsive}>
        <div className={classes.table}>
          <Grid container justify="center">
            <GridItem xs={12} justify="flex-start">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>
                        Abandoned Cart Recovery
                      </h4>
                      <p className={classes.cardCategoryWhite}>
                        Abandon Cart of Customers
                      </p>
                    </CardHeader>
                    <CardBody>
                      <GridItem xs={12} sm={12} md={12}>
                        {data1.length > 0 && (
                          <MUIDataTable
                            data={data1.map((item) => {
                              return [
                                item?.customer?.first_name +
                                  " " +
                                  item?.customer?.last_name +
                                  " " +
                                  item?.id,
                                item?.created_at,
                                item?.currency + " " + item?.total_price,
                                item?.id,
                                ,
                                item?.id,
                              ];
                            })}
                            columns={columns}
                            options={options}
                          />
                        )}
                      </GridItem>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>
          </Grid>
        </div>
      </div>
    </MuiThemeProvider>
  );
}
