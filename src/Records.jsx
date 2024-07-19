import { ArrowLeft } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "action",
    headerName: "Action",
    editable: true,
  },
  {
    field: "item",
    headerName: "Item",
    editable: true,
  },
  {
    field: "units",
    headerName: "Units",
    editable: true,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    editable: true,
  },
  {
    field: "change",
    headerName: "Change",
    editable: true,
  },
  {
    field: "at",
    headerName: "At",
    editable: true,
  },
];
const sorter = (a, b) => {
  const timeA = a.time;
  const timeB = b.time;
  if (timeA < timeB) {
    return -1;
  }
  if (timeA > timeB) {
    return 1;
  }
  return 0;
};
export default function Records({ ipcRenderer, setBackBtn }) {
  var [rows, setRows] = useState([]);
  var [dg, setDg] = useState(<></>);
  var [selectedRowData, setSelectedRowData] = useState([]);

  useEffect(() => {
    setBackBtn(
      <Button
        variant="contained"
        sx={{
          width: "fit-content",
          background: "darkblue",
          display: "inline-block",
          mr: 1,
          ml: 1,
          mt: "0.3rem",
          mb: "0.3rem",
          height: "2.4rem",
          padding: 0,
        }}
      >
        <ArrowLeft sx={{ verticalAlign: "bottom", width: "fit-content" }} />
        <Link
          to="/dboard"
          style={{
            all: "unset",
            textDecoration: "none",
            cursor: "pointer",
            padding: "1rem",
          }}
        >
          Back to Dashboard
        </Link>
      </Button>
    );
    ipcRenderer.send("getRecords");
    ipcRenderer.on("recordsSent", (u) => {
      var newRows = [];
      u.result.sort(sorter).map((i) => {
        newRows = [
          ...newRows,
          {
            id: i._id,
            action: i.name,
            item: i.item,
            units: i.units,
            unitPrice: i.unitPrice + " $",
            change: i.change + " $",
            at: i.time,
          },
        ];
        setRows(newRows);
        return "ok";
      });
    });
  }, [ipcRenderer]);
  function delRecord() {
    if (selectedRowData.toString() !== "[]") {
      ipcRenderer.send("delRecord", selectedRowData);
    } else return;
  }
  const onCheckedId = useCallback(
    (ids) => {
      var selections = rows.filter((row) => {
        return ids.includes(row.id);
      });
      setSelectedRowData(selections);
    },
    [rows]
  );
  useEffect(() => {
    setDg(
      <DataGrid
        sx={{ textAlign: "center" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        pageSizeOptions={[8]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => onCheckedId(ids)}
      />
    );
  }, [rows, onCheckedId]);

  return (
    <>
      <Box sx={{ height: "auto", width: "100%" }}>{dg}</Box>
      <Button
        variant="contained"
        sx={{ mr: 1, mt: 1 }}
        color="error"
        onClick={delRecord}
      >
        Delete Record
      </Button>
    </>
  );
}
