const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const axios = require("axios");
const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:1412",
});
const ex = express();

//ELECTRON APP
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadURL(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();
  mainWindow.maximize();
  mainWindow.show();
  const mainMenuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          click() {
            app.quit();
          },
        },
        {
          label: "Dev",
          click() {
            mainWindow.openDevTools();
          },
        },
      ],
    },
  ];
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//EXPRESS SERVER
const corsOptions = {
  origin: ["http://localhost:1412"],
  credentials: true,
  optionSuccessStatus: 200,
};
ex.use(cors(corsOptions));
ex.use(express.json());
ex.use(helmet());
ex.use(compression());
ex.use(express.urlencoded({ extended: true }));
ex.use("/users", require("./routes/userRoute.cjs"));
ex.use("/storage", require("./routes/storageRoute.cjs"));
ex.use("/records", require("./routes/recordRoute.cjs"));

mongoose
  .connect(
    `mongodb+srv://moamenwady:121212m@cluster0.iumas.mongodb.net/alwady_ashraf`
  )
  .catch((err) => {
    console.log(err.message);
  })
  .then(() => {
    ex.listen(1412, console.log("ok"));
  });

//IPC MAIN
ipcMain.on("createUser", async (e, newUser) => {
  await api
    .post("/users/signup", {
      userName: newUser.userName,
      password: newUser.password,
      role: newUser.role,
    })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("userSuccess");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("user:login", async (e, login) => {
  await api
    .post("/users/login", login)
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("logged", {
          cu: {
            userName: data.user.userName,
            role: data.user.role,
          },
          ssi: login.ssi,
        });
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("getUsers", async (e) => {
  await api
    .get("/users")
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Users", { result: data.result });
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("makeAdmin", async (e, selections) => {
  await api
    .put("/users/admin", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("makeCashier", async (e, selections) => {
  await api
    .put("/users/revoke", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("delUser", async (e, selections) => {
  await api
    .put("/users/del", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("getItems", async (e) => {
  await api
    .get("/storage")
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("itemsSent", { result: data.result });
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("addItem", async (e, selections) => {
  await api
    .post("/storage/add", {
      list: selections,
    })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("cashout", async (e, selections) => {
  await api
    .put("/storage/buy", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("deleteItem", async (e, selections) => {
  await api
    .put("/storage/del", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("getRecords", async (e) => {
  await api
    .get("/records")
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("recordsSent", { result: data.result });
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
ipcMain.on("delRecord", async (e, selections) => {
  await api
    .put("/records/del", { list: selections })
    .then((res) => {
      const data = res.data;
      if (data.status == "ok") {
        mainWindow.webContents.send("Success");
      } else {
        mainWindow.webContents.send("err", {
          message: data.message,
        });
      }
    })
    .catch((err) => {
      mainWindow.webContents.send("err", {
        message: "Network Error",
      });
    });
});
