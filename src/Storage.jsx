import { ArrowLeft, ArrowRightAlt, Close } from "@mui/icons-material";
import { Button, TextField, Grid, Box, Typography, Paper } from "@mui/material";
import { blueGrey, deepOrange } from "@mui/material/colors";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Storage({ ipcRenderer, notify, setBackBtn }) {
  var [newItemList, setNIL] = useState([]);
  var [theNewList, setTNL] = useState(<></>);

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

  function addtoNIL() {
    let fprice = document.querySelector("#fprice").value;
    let cprice = document.querySelector("#cprice").value;
    let itemName = document.querySelector("#itemname").value;
    let units = document.querySelector("#units").value;
    if (
      cprice !== "" &&
      fprice !== "" &&
      itemName !== "" &&
      units !== "" &&
      typeof Number(units) == "number"
    ) {
      var newItem = {
        itemName: itemName,
        cprice: Number(cprice),
        fprice: Number(fprice),
        count: Number(units),
      };
      var match = newItemList.filter((i) => {
        return (
          JSON.stringify(i.itemName) === JSON.stringify(newItem.itemName) &&
          JSON.stringify(i.cprice) === JSON.stringify(newItem.cprice) &&
          JSON.stringify(i.fprice) === JSON.stringify(newItem.fprice)
        );
      });
      var newer;
      if (match.length > 0) {
        match[0].count = Number(match[0].count) + Number(newItem.count);
        newer = [
          match[0],
          ...newItemList.filter((i) => {
            return (
              JSON.stringify(i.itemName) !== JSON.stringify(newItem.itemName) ||
              JSON.stringify(i.cprice) !== JSON.stringify(newItem.cprice) ||
              JSON.stringify(i.fprice) !== JSON.stringify(newItem.fprice)
            );
          }),
        ];
        setNIL(newer);
      } else {
        newer = [...newItemList, newItem];
        setNIL(newer);
      }
      clearer();
    } else {
      notify("error", "please fill all the fields");
    }
  }

  const remove = useCallback(
    (o) => {
      if (newItemList.length === 1) {
        setNIL([]);
        setTNL(<></>);
      } else {
        var newer = [
          ...newItemList.filter((i) => {
            return (
              JSON.stringify(i.itemName) !== JSON.stringify(o.itemName) ||
              JSON.stringify(i.cprice) !== JSON.stringify(o.cprice) ||
              JSON.stringify(i.fprice) !== JSON.stringify(o.fprice)
            );
          }),
        ];
        if (newer.length === 0) {
          setNIL([]);
          setTNL(<></>);
        } else {
          setNIL(newer);
        }
      }
    },
    [newItemList]
  );

  function sendNIL() {
    if (JSON.stringify(newItemList) === "[]") {
      notify("error", "Please Add Items To The List First");
      return;
    } else {
      notify("info", "Please Wait...");
      ipcRenderer.send("addItem", newItemList);
    }
  }

  function clearer() {
    document.querySelector("#fprice").value = "";
    document.querySelector("#cprice").value = "";
    document.querySelector("#itemname").value = "";
    document.querySelector("#units").value = 1;
  }

  var [cheight, setCH] = useState(0);

  useEffect(() => {
    if (document.getElementById("pcont")) {
      setCH(document.getElementById("pcont").clientHeight);
    } else {
      setCH(0);
    }
  }, [cheight]);

  useEffect(() => {
    if (JSON.stringify(newItemList) === "[]") {
      setTNL(<></>);
    } else {
      var newhtml = newItemList.map((i) => {
        return (
          <Box
            p={1}
            mb={1}
            sx={{ width: "100%", backgroundColor: blueGrey[100] }}
            key={i.itemName + i.cprice + i.fprice}
          >
            <Button sx={{ float: "right" }} onClick={() => remove(i)}>
              <Close />
            </Button>
            <Typography
              component="p"
              textAlign="center"
              textTransform="capitalize"
              color={"darkblue"}
              variant="h5"
            >
              {i.itemName}
              <br />
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
              }}
            >
              <Typography
                component="p"
                textTransform="capitalize"
                color={deepOrange[500]}
                variant="h6"
              >
                {i.cprice + " $"}
              </Typography>
              <Typography
                component="p"
                textTransform="capitalize"
                color={deepOrange[500]}
                variant="h6"
              >
                {i.fprice + " $"}
              </Typography>
              <Typography
                component="p"
                textTransform="capitalize"
                color={"darkblue"}
                variant="h6"
              >
                {i.count + " units"}
              </Typography>
            </Box>
          </Box>
        );
      });
      setTNL(newhtml);
    }
  }, [newItemList, remove]);

  return (
    <>
      <Paper
        elevation={3}
        id="pcont"
        component="main"
        sx={{
          margin: "auto",
          marginTop: "1rem",
          width: "80%",
          height: "max(80dvh,max-content)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          border: "2px solid black",
        }}
      >
        <Box
          p={2}
          sx={{
            width: "50%",
            height: "85%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add Item
          </Typography>
          <Box component="form" id="addItemForm" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={10} sx={{ display: "block", m: "auto" }}>
                <TextField
                  name="itemname"
                  required
                  fullWidth
                  id="itemname"
                  label="Item Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  name="fprice"
                  label="Factory Price"
                  id="fprice"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  name="cprice"
                  label="Customer Price"
                  id="cprice"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type="text"
                  inputMode="decimal"
                  required
                  fullWidth
                  name="units"
                  label="Units"
                  id="units"
                  defaultValue={1}
                />
              </Grid>
              <Grid item xs={4} sx={{ display: "block", m: "auto" }}>
                <Button
                  onClick={addtoNIL}
                  variant="contained"
                  sx={{ display: "block", m: "auto", width: "100%" }}
                >
                  Add Item{" "}
                  <ArrowRightAlt
                    sx={{ height: "100%", verticalAlign: "bottom" }}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <div
          style={{
            width: "1px",
            height: cheight * 0.9,
            marginTop: cheight * 0.05,
            backgroundColor: "#1976d2",
          }}
        ></div>

        <Box
          p={2}
          sx={{
            width: "40%",
            height: "85%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            pt={1}
            sx={{
              width: "100%",
              height: cheight * 0.85 * 0.85,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "scroll",
              border: "1px inset grey",
            }}
          >
            {theNewList}
          </Box>
          <Box width="100%">
            <Button
              onClick={sendNIL}
              variant="contained"
              sx={{
                display: "block",
                m: "auto",
                mt: 3,
                mb: 2,
                width: "fit-content",
              }}
            >
              Submit List
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
