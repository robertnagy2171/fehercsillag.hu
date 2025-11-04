import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const USER = process.env.BASIC_AUTH_USER;
const PASS = process.env.BASIC_AUTH_PASS;

app.use((req, res, next) => {
  const auth = { login: USER, password: PASS };
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64").toString().split(":");

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Protected"');
  res.status(401).send("Authentication required.");
});

app.use(express.static(path.join(__dirname, "public_html"))); // your static files

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Running on port ${port}`));

