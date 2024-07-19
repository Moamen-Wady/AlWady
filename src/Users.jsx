import { ArrowLeft } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
const columns = [
  { field: "id", headerName: "ID", width: 200 },
  {
    field: "userName",
    headerName: "User Name",
    width: 400,
    editable: true,
  },
  {
    field: "role",
    headerName: "Role",
    width: 200,
    editable: true,
  },
];
const sorter = (a, b) => {
  const nameA = a.userName.toUpperCase();
  const nameB = b.userName.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};
export default function Users({ ipcRenderer, setBackBtn }) {
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
  }, []);
  var [rows, setRows] = useState([]);
  var [dg, setDg] = useState(<></>);
  var [selectedRowData, setSelectedRowData] = useState([]);
  function makeAdmin() {
    if (selectedRowData.toString() !== "[]") {
      ipcRenderer.send("makeAdmin", selectedRowData);
    } else return;
  }
  function makeCashier() {
    if (selectedRowData.toString() !== "[]") {
      ipcRenderer.send("makeCashier", selectedRowData);
    } else return;
  }
  function delUser() {
    if (selectedRowData.toString() !== "[]") {
      ipcRenderer.send("delUser", selectedRowData);
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
    ipcRenderer.send("getUsers");
    ipcRenderer.on("Users", (u) => {
      var newRows = [];
      u.result.sort(sorter).map((i) => {
        newRows = [
          ...newRows,
          { id: i._id, userName: i.userName, role: i.role },
        ];
        setRows(newRows);
        return "ok";
      });
    });
  }, []);
  useEffect(() => {
    setDg(
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
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
        sx={{ mr: 1, mt: 1, height: "2.4rem", padding: 0 }}
        color="success"
      >
        <Link
          to="/adduser"
          style={{
            all: "unset",
            textDecoration: "none",
            cursor: "pointer",
            padding: "1rem",
          }}
        >
          Add User
        </Link>
      </Button>
      <Button
        variant="contained"
        sx={{ mr: 1, mt: 1 }}
        color="primary"
        onClick={makeAdmin}
      >
        Make Admin
      </Button>
      <Button
        variant="contained"
        sx={{ mr: 1, mt: 1 }}
        color="secondary"
        onClick={makeCashier}
      >
        Revoke Admin
      </Button>
      <Button
        variant="contained"
        sx={{ mr: 1, mt: 1 }}
        color="error"
        onClick={delUser}
      >
        Delete User
      </Button>
    </>
  );
}
