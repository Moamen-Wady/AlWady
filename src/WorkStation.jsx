import { ArrowLeft, Close } from "@mui/icons-material";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { blueGrey, deepOrange, indigo } from "@mui/material/colors";
import React, { useCallback, useEffect, useState } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { Link } from "react-router-dom";

const sorter = (a, b) => {
  const nameA = a.itemName.toUpperCase();
  const nameB = b.itemName.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

export default function WorkStation({
  notify,
  ipcRenderer,
  setBackBtn,
  currUser,
}) {
  var [fullItemsList, setFIL] = useState([]);
  var [itemsList, setItemsList] = useState([]);
  useEffect(() => {
    ipcRenderer.send("getItems");
    ipcRenderer.on("itemsSent", (is) => {
      let newitems = is.result;
      let newer = [...newitems];
      setFIL(newer);
    });
  }, [ipcRenderer]);

  useEffect(() => {
    var n = [...fullItemsList];
    setItemsList([...n]);
  }, [fullItemsList]);

  useEffect(() => {
    if (currUser?.role === "admin") {
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
    } else {
      setBackBtn(
        <>
          <Typography
            ml={1}
            component="h1"
            variant="h5"
            color="white"
            textTransform="capitalize"
          >
            Welcome {currUser?.userName}
          </Typography>
        </>
      );
    }
  }, [currUser, setBackBtn]);

  //CASHOUT LIST
  var [cashoutList, setCOL] = useState([]);
  var [theNewList, setTNL] = useState(<></>);
  var [cheight, setCH] = useState(0);
  const addtoCOL = useCallback(
    (e) => {
      var newItem = {
        itemName: e.itemName,
        cprice: e.cprice,
        fprice: e.fprice,
        count: 1,
      };
      var tcol = [...cashoutList];
      var match = tcol.filter((i) => {
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
          ...tcol.filter((i) => {
            return (
              JSON.stringify(i.itemName) !== JSON.stringify(newItem.itemName) ||
              JSON.stringify(i.cprice) !== JSON.stringify(newItem.cprice) ||
              JSON.stringify(i.fprice) !== JSON.stringify(newItem.fprice)
            );
          }),
        ];
        setCOL([...newer]);
      } else {
        newer = [...cashoutList, newItem];
        setCOL([...newer]);
      }
    },
    [cashoutList]
  );

  const remove = useCallback(
    (o) => {
      if (cashoutList.length === 1) {
        setCOL([]);
        setTNL(<></>);
      } else {
        var newer = [
          ...cashoutList.filter((i) => {
            return (
              JSON.stringify(i.itemName) !== JSON.stringify(o.itemName) ||
              JSON.stringify(i.cprice) !== JSON.stringify(o.cprice) ||
              JSON.stringify(i.fprice) !== JSON.stringify(o.fprice)
            );
          }),
        ];
        if (newer.length === 0) {
          setCOL([]);
          setTNL(<></>);
        } else {
          setCOL(newer);
        }
      }
    },
    [cashoutList]
  );

  const incr1 = (index) => {
    var newList = [...cashoutList];
    newList[index].count++;
    setCOL(newList);
  };
  const decr1 = (index) => {
    var newList = [...cashoutList];
    newList[index].count--;
    setCOL(newList);
  };

  const confirmCount = (index) => {
    var newList = [...cashoutList];
    newList[index].count = document.getElementById(index + "count").value;
    setCOL(newList);
    document.getElementById(index + "count").value = "";
  };

  function sendNIL() {
    if (JSON.stringify(cashoutList) === "[]") {
      notify("error", "Please Add Items To The List First");
      return;
    } else {
      notify("info", "Please Wait...");
      ipcRenderer.send("cashout", cashoutList);
    }
  }

  var [merch, setMerch] = useState(<></>);
  var [total, setTotal] = useState(0);

  useEffect(() => {
    setMerch(
      <Grid container justifyContent="space-evenly">
        {itemsList?.sort(sorter).map((i) => {
          return (
            <Grid
              onClick={() => addtoCOL(i)}
              item
              m={1}
              xs={2.5}
              key={i.itemName + i.cprice + i.fprice}
            >
              <Paper
                elevation={3}
                sx={{
                  cursor: "pointer",
                  backgroundColor: indigo[200],
                  border: "1px solid black",
                }}
              >
                <Typography
                  component="p"
                  textAlign="center"
                  textTransform="capitalize"
                  color="white"
                  variant="h5"
                >
                  {i.itemName}
                </Typography>
                <br />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    component="p"
                    textTransform="capitalize"
                    color={"red"}
                    variant="h6"
                  >
                    {i.cprice + " $"}
                  </Typography>
                  <br />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  }, [itemsList, cashoutList, addtoCOL]);

  useEffect(() => {
    if (document.getElementById("pcont")) {
      setCH(document.getElementById("pcont").clientHeight);
    } else {
      setCH(0);
    }
  }, [cheight]);

  useEffect(() => {
    if (JSON.stringify(cashoutList) === "[]") {
      setTNL(<></>);
      setTotal(0);
    } else {
      var newhtml = cashoutList.map((i, index) => {
        return (
          //box of whole item
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
            {/* box of Count manipulation*/}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  m: 1,
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  sx={{
                    display: "inline-block",
                    maxWidth: "20%",
                    width: "20%",
                  }}
                  onClick={() => decr1(index)}
                >
                  <IndeterminateCheckBoxIcon
                    fontSize={"large"}
                    color="primary"
                    sx={{ display: "inline", verticalAlign: "bottom" }}
                  />
                </Button>
                <TextField
                  variant="outlined"
                  sx={{ maxWidth: "50%", width: "50%" }}
                  id={index + "count"}
                  placeholder={i.count}
                  type="number"
                  min={0}
                />
                <Button
                  sx={{
                    display: "inline-block",
                    maxWidth: "20%",
                    width: "20%",
                  }}
                  onClick={() => incr1(index)}
                >
                  <LocalHospitalIcon
                    fontSize={"large"}
                    color="primary"
                    sx={{ display: "inline", verticalAlign: "bottom" }}
                  />
                </Button>
              </Box>
              <Button
                onClick={() => confirmCount(index)}
                variant="contained"
                color="primary"
              >
                Set
              </Button>
              <Typography
                component="p"
                textTransform="capitalize"
                color={deepOrange[500]}
                variant="h6"
              >
                {i.cprice * i.count + " $"}
              </Typography>
            </Box>
          </Box>
        );
      });
      setTNL(newhtml);
      var st = 0;
      cashoutList.forEach((i) => {
        st = st + i.count * i.cprice;
      });
      setTotal(st);
    }
  }, [cashoutList, remove]);

  const handleSearch = (e) => {
    var n = [
      ...fullItemsList.filter((i) => {
        return i.itemName.includes(e.target.value);
      }),
    ];
    setItemsList([...n]);
  };

  return (
    <>
      <Typography component="h4" variant="h5" m={1} ml={3}>
        <TextField
          sx={{ width: "40%" }}
          onChange={handleSearch}
          p={0}
          m={0}
          placeholder="Search Items"
        />
      </Typography>

      <Box
        id="pcont"
        sx={{
          maxHeight: "75vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          width: "100%",
          height: "min(fit-content,70vh)",
        }}
      >
        <Box sx={{ overflowY: "scroll", maxHeight: "70vh", width: "60%" }}>
          {merch}
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
          p={1}
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            pt={1}
            sx={{
              overflowY: "scroll",
              width: "100%",
              height: cheight * 0.85 * 0.85,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px inset grey",
            }}
          >
            {theNewList}
          </Box>
          <Box width="100%">
            <Typography
              component="h2"
              variant="h5"
              color="GrayText"
              textTransform="capitalize"
            >
              Total: {total} $
            </Typography>
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
      </Box>
    </>
  );
}
