import React, { useEffect } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  AccountCircle,
  PersonPinCircle,
  PointOfSale,
  Schedule,
  Storage,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./index.css";
export default function Dashboard({ setBackBtn, currUser }) {
  useEffect(() => {
    setBackBtn(
      <>
        <Typography
          ml={1}
          component="h1"
          variant="h5"
          color="white"
          textTransform="capitalize"
          sx={{ mt: "0.5rem", mb: "0.3rem", height: "2.4rem", padding: 0 }}
        >
          Welcome {currUser.userName}
        </Typography>
      </>
    );
  }, [currUser]);
  var iconst = {
    className: "dbicon",
    sx: () => {
      return { width: "7vw", height: "7vw", m: 1.5 };
    },
  };
  var optionsComponent = [
    {
      url: "/users",
      head: "Manage Users",
      info: "",
      Icon: () => {
        return <AccountCircle className={iconst.className} sx={iconst.sx()} />;
      },
    },
    {
      url: "/dboard",
      head: "Manage Clients",
      info: "",
      Icon: () => {
        return (
          <PersonPinCircle className={iconst.className} sx={iconst.sx()} />
        );
      },
    },
    {
      url: "/storage",
      head: "Manage Storage",
      info: "",
      Icon: () => {
        return <Storage className={iconst.className} sx={iconst.sx()} />;
      },
    },
    {
      url: "/wstation",
      head: "Workstation",
      info: "",
      Icon: () => {
        return <PointOfSale className={iconst.className} sx={iconst.sx()} />;
      },
    },
    {
      url: "/records",
      head: "Records & Logs",
      info: "",
      Icon: () => {
        return <Schedule className={iconst.className} sx={iconst.sx()} />;
      },
    },
  ];
  return (
    <>
      <Box
        component="div"
        sx={{ width: "100%", backgroundColor: "whitesmoke", pt: 2 }}
      >
        <Box
          component="div"
          sx={{
            backgroundColor: "whitesmoke",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Box component="main" sx={{ display: "inline-block", width: "75vw" }}>
            <Grid
              container
              spacing={3}
              width="100%"
              justifyContent="space-evenly"
            >
              {optionsComponent.map((i) => {
                return (
                  <Grid item xs={4.5} key={i.head}>
                    <Link to={i.url} style={{ textDecoration: "none" }}>
                      <Paper
                        elevation={5}
                        sx={{ border: "1px solid rgb(95, 158, 160)" }}
                      >
                        <Box
                          component="div"
                          sx={{ m: "auto", width: "fit-content" }}
                        >
                          {i.Icon()}
                        </Box>
                        <Typography
                          component="h1"
                          align="center"
                          m={1}
                          fontSize={25}
                        >
                          {i.head}
                        </Typography>
                      </Paper>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
