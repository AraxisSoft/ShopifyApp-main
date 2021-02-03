import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// layout for this page
import moment from "moment";
import Pro from "layouts/Pro.js";
// core components

import api from "api/api";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  GET_METAFIELD_WITH_KEY,
  SET_METAFIELD_WITH_KEY,
} from "Gql/GqlConstants";
import { useQuery, useMutation } from "@apollo/client";
import { get } from "js-cookie";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

function Settings() {
  const [shopOrigin, setshopOrigin] = useState("");
  const [updateMetafield] = useMutation(SET_METAFIELD_WITH_KEY);
  const [tableData, setTableData] = useState([]);
  const setConfig = async (data) => {
    // updateMetafield({
    //   variables: {
    //     namespace: "floatButton",
    //     key: "config",
    //     value: JSON.stringify(data),
    //     value_type: "json_string",
    //   },
    // });
    data.map((x) =>
      x.logo == "messenger"
        ? (x.link = `apps/floatbutton/api/redirect/${shopOrigin}/${x.name}/https://www.facebook.com`)
        : (x.link = `apps/floatbutton/api/redirect/${shopOrigin}/${x.name}/https://web.whatsapp.com`)
    );
    console.log(data);
    const obj = {
      metafield: {
        namespace: "floatButton",
        key: "config",
        value: JSON.stringify(data),
        value_type: "json_string",
      },
    };
    const res = await api.post("/metafields", obj);
    console.log(res.data);
  };
  useQuery(GET_METAFIELD_WITH_KEY, {
    variables: { namespace: "floatButton", key: "config" },
    onCompleted: (returnedData) => {
      console.log(returnedData);
      let data = returnedData.shop.metafield.value;
      console.log(data);
      data = JSON.parse(data);

      setTableData(data);
      console.log("onComplete");
    },
    onError: (err) => {
      console.log("onError " + err);
    },
  });
  const getShopOrigin = async () => {
    let shopOrigin = await api.get("/shoporigin");
    setshopOrigin(shopOrigin.data.data);
  };
  useEffect(() => {
    getShopOrigin();
  }, []);
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Social Links</h4>
            <p className={classes.cardCategoryWhite}>
              Here you can edit lnks for socail buttons
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                {
                  title: "Name",
                  field: "name",
                },
                {
                  title: "Social Button",
                  field: "logo",
                  lookup: { whatsapp: "Whatsapp", messenger: "Messenger" },
                },
                { title: "Link/Number", field: "inputLink" },
              ]}
              tableData={tableData}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        const dataUpdate = [...tableData];
                        const index = oldData.tableData.id;
                        console.log(index);
                        dataUpdate[index] = newData;
                        dataUpdate[index].changed = true;
                        setTableData([...dataUpdate]);
                        setConfig(dataUpdate);
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...tableData];
                      const index = oldData.tableData.id;
                      dataDelete.splice(index, 1);
                      setTableData([...dataDelete]);
                      setConfig(dataDelete);
                      resolve();
                    }, 1000);
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      setTableData([...tableData, newData]);
                      setConfig([...tableData, newData]);
                      resolve();
                    }, 1000);
                  }),
              }}
              //   actions={[
              //     (rowData) => ({
              //       icon: "delete",
              //       tooltip: "Delete Button",
              //       onClick: (event, rowData) => {
              //         if (window.confirm("You want to delete " + rowData.name)) {
              //           console.log("here");
              //           //dispatch(deleteSale(rowData.id));
              //         }
              //       },
              //     }),
              //   ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

Settings.layout = Pro;
export default Settings;
