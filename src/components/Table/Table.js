import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont,
} from "assets/jss/nextjs-material-dashboard.js";
import MaterialTable from "material-table";
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableData,
    filter,
    editable,
    actions,
    onRowClick,
    search,
    paging,
  } = props;
  return (
    <div className={classes.tableResponsive}>
      <div className={classes.table}>
        <MaterialTable
          onRowClick={onRowClick}
          title=""
          editable={editable}
          actions={actions}
          columns={tableHead}
          data={tableData}
          options={{
            filtering: filter,
            paging: paging === undefined ? true : paging,
            search: search === undefined ? true : search,
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
          }}
        />
      </div>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
};
