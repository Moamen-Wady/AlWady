import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Radio,
  Avatar,
  RadioGroup,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ArrowLeft } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function AddUser({ ipcRenderer, notify, setBackBtn }) {
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
          p: 0,
          mt: "0.3rem",
          mb: "0.3rem",
          height: "2.4rem",
        }}
      >
        <ArrowLeft sx={{ verticalAlign: "bottom", width: "fit-content" }} />
        <Link
          to="/users"
          style={{
            all: "unset",
            textDecoration: "none",
            cursor: "pointer",
            padding: "1rem",
          }}
        >
          Back to Users
        </Link>
      </Button>
    );
  }, []);
  const [roleValue, setRoleValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Choose Wisely");

  const handleRadioChange = (event) => {
    setRoleValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };
  function handleSubmit(e) {
    e.preventDefault();
    if (roleValue !== "") {
      let userPassword = document.querySelector("#password").value;
      let userName = document.querySelector("#username").value;
      let newUser;
      if (userPassword !== "" && userName !== "") {
        newUser = {
          userName: userName,
          password: userPassword,
          role: roleValue,
        };
        ipcRenderer.send("createUser", newUser);
      } else {
        notify("error", "please fill all the fields");
      }
    } else {
      setHelperText("Please select an option.");
      setError(true);
    }
  }
  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add User
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <FormControl sx={{ m: 2 }} error={error} variant="standard">
              <Box component="div">
                <FormLabel id="role" sx={{ display: "inline-block", m: 1 }}>
                  Choose Role:
                </FormLabel>
                <FormHelperText sx={{ display: "inline-block", m: 1 }}>
                  {helperText}
                </FormHelperText>
              </Box>
              <RadioGroup
                aria-labelledby="role"
                name="Role"
                value={roleValue}
                onChange={handleRadioChange}
                row
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value="cashier"
                  control={<Radio />}
                  label="Cashier"
                />
              </RadioGroup>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 0.5 }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
