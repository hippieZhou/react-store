const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

const getUsersDb = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "users.json"), "utf-8")
  );
};

const isAuthenticated = ({ email, password }) => {
  return (
    getUsersDb().users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
};
const isExist = (email) => {
  return getUsersDb().users.findIndex((user) => user.email === email) !== -1;
};

const SECRET = "123123asdasdwe12313";
const expiresIn = "1h";

const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET, (err, decode) => {
    decode !== undefined ? decode : err;
  });
};

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (isAuthenticated({ email, password })) {
    const user = getUsersDb().users.find(
      (u) => u.email === email && u.password === password
    );
    const { nickName, type } = user;
    const jwtToken = createToken({ nickName, type, email });
    return res.status(200).json(jwtToken);
  } else {
    const status = 401;
    const message = "Incorrect email or pasword";
    return res.status(status).json({ status, message });
  }
});

server.post("/auth/register", (req, res) => {
  const { nickName, email, password, type } = req.body;

  if (isExist(email)) {
    const status = 401;
    const message = "Email already exist";
    return res.status(status).json({ status, message });
  }

  fs.readFile(path.join(__dirname, "users.json"), (err, _data) => {
    if (err) {
      const status = 401;
      const message = err;
      return res.status(status).json({ status, message });
    }
    const data = JSON.parse(_data.toString());
    const last_item_id = data.users[data.users.length - 1].id;
    data.users.push({ id: last_item_id + 1, email, password, nickName, type });
    fs.writeFile(
      path.join(__dirname, "users.json"),
      JSON.stringify(data),
      (err, result) => {
        if (err) {
          const status = 401;
          const message = err;
          res.status(status).json({ status, message });
          return;
        }
      }
    );
  });

  const jwtToken = createToken({ nickName, type, email });
  res.status(200).json(jwtToken);
});

server.use("/carts", (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Error in authorization format";
    res.status(status).json({ status, message });
    return;
  }

  try {
    const verifyTokenResult = verifyToken(
      req.headers.authorization.split(" ")[1]
    );

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = "Access token not provieded";
      res.status(status).json({ status, message });
    }
    next();
  } catch (error) {
    const status = 401;
    const message = "Error token is revoked";
    res.status(status).json({ status, message });
    return;
  }
});

server.use(router);
server.listen(3003, () => {
  console.log("Json Server is running");
});
