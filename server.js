const express = require("express");
const auth = require("basic-auth");
const path = require("path");

const app = express();

// Credentials from environment variables
const USERNAME = process.env.BASIC_AUTH_USER;
const PASSWORD = process.env.BASIC_AUTH_PASS;

// Basic Auth middleware
app.use((req, res, next) => {
  const user = auth(req);
  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted"');
    return res.status(401).send("Authentication required.");
  }
  next();
});

// Serve static files
const staticPath = path.join(__dirname, "public_html");
app.use(express.static(staticPath));

// Fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

