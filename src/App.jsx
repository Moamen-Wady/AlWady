import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import SignUp from "./signUp.jsx";
import Users from "./Users.jsx";
import AddUser from "./AddUser.jsx";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
import WorkStation from "./WorkStation.jsx";
import { Menu as MenuIcon } from "@mui/icons-material";
import Storage from "./Storage.jsx";
import { ipcRenderer } from "./index.jsx";
import Records from "./Records.jsx";

const notify = (e, msg) => {
  toast[e](msg, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
  });
};
const refrsh = () => {
  setTimeout(() => {
    window.location.reload();
  }, 500);
};
let defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      iw: "200px",
    },
    secondary: {
      main: purple[500],
    },
  },
  typography: {},
});
defaultTheme = responsiveFontSizes(defaultTheme);

function App() {
  var [currUser, setCU] = useState(null);
  var [nheight, setNH] = useState(0);
  var [backBtn, setBackBtn] = useState(<></>);
  var [menubtn, setMenubtn] = useState(null);
  var showMenu = Boolean(menubtn);
  const handleShow = (e) => {
    setMenubtn(e.target);
  };
  const handleClose = () => {
    setMenubtn(null);
  };
  useEffect(() => {
    ipcRenderer.on("err", (m) => {
      notify("error", m.message);
    });
    ipcRenderer.on("userSuccess", () => {
      notify("success", "Success!");
      refrsh();
    });
    ipcRenderer.on("Success", () => {
      notify("success", "Success!");
      refrsh();
    });
    ipcRenderer.on("logged", (c) => {
      if (c.ssi) {
        localStorage.setItem("user", JSON.stringify(c.cu));
      } else {
        sessionStorage.setItem("user", JSON.stringify(c.cu));
      }
      var newer = c.cu;
      setCU(newer);
    });

    if (JSON.stringify(sessionStorage) == "{}") {
      var newer;
      if (JSON.stringify(localStorage) !== "{}") {
        newer = JSON.parse(localStorage?.getItem("user"));
        setCU(newer);
      } else {
        setCU(null);
      }
    } else {
      newer = JSON.parse(sessionStorage?.getItem("user"));
      setCU(newer);
    }
  }, []);

  useEffect(() => {
    if (currUser) {
      setNH(document.getElementById("nvbr")?.clientHeight);
    } else {
      setNH(0);
    }
  }, [backBtn]);
  return (
    <ThemeProvider theme={defaultTheme}>
      <HashRouter basename="/">
        <ToastContainer />
        {currUser !== null ? (
          <Box
            component="nav"
            id="nvbr"
            sx={{
              position: "relative",
              overfolwY: "visible",
              backgroundColor: "primary.main",
              width: "100%",
              height: "3rem",
              // pt: 1,
              // pb: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            {backBtn}
            <Box
              sx={{
                position: "absolute",
                top: "0",
                right: "0",
                visibility: showMenu,
              }}
            >
              <Button
                id="menubtn"
                variant="contained"
                sx={{
                  height: nheight + "px",
                  boxShadow: "none",
                  p: "0",
                  borderLeft: "1px solid whitesmoke",
                  borderRadius: "0",
                }}
                onClick={handleShow}
              >
                <MenuIcon />
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={menubtn}
                open={showMenu}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                xs={{ transform: "translate(-50%,-20%)" }}
              >
                {/* <MenuItem onClick={ handleClose }>Profile</MenuItem>
                  <MenuItem onClick={ handleClose }>My account</MenuItem> */}
                <MenuItem>
                  <Link
                    onClick={() => {
                      handleClose();
                      localStorage.clear();
                      sessionStorage.clear();
                      setBackBtn(<></>);
                      setNH(0);
                      setCU(null);
                    }}
                    to="/"
                    style={{
                      width: "100%",
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    Logout
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <Routes>
          <Route
            path="/adduser"
            element={
              <AddUser
                notify={notify}
                ipcRenderer={ipcRenderer}
                setBackBtn={setBackBtn}
                currUser={currUser}
              />
            }
          />
          <Route
            path="/dboard"
            element={<Dashboard setBackBtn={setBackBtn} currUser={currUser} />}
          />
          <Route
            path="/"
            element={
              <Home
                notify={notify}
                ipcRenderer={ipcRenderer}
                currUser={currUser}
              />
            }
          />
          <Route
            path="/records"
            element={
              <Records
                notify={notify}
                ipcRenderer={ipcRenderer}
                setBackBtn={setBackBtn}
                currUser={currUser}
              />
            }
          />
          <Route
            path="/signup"
            element={<SignUp notify={notify} ipcRenderer={ipcRenderer} />}
          />
          <Route
            path="/storage"
            element={
              <Storage
                notify={notify}
                ipcRenderer={ipcRenderer}
                setBackBtn={setBackBtn}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users
                notify={notify}
                ipcRenderer={ipcRenderer}
                setBackBtn={setBackBtn}
                currUser={currUser}
              />
            }
          />
          <Route
            path="/wstation"
            element={
              <WorkStation
                notify={notify}
                ipcRenderer={ipcRenderer}
                setBackBtn={setBackBtn}
                currUser={currUser}
              />
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
export default App;
