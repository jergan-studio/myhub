// app.js (simplified)
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

let currentDeployment = "";

app.patch("/update-deployment", (req, res) => {
  const { url, token } = req.body;
  if (token !== process.env.MYHUB_TOKEN) {
    return res.status(401).json({ error: "Invalid token" });
  }
  currentDeployment = url;
  res.json({ success: true, deployment: currentDeployment });
});

app.get("/deployment", (req, res) => {
  res.json({ deployment: currentDeployment });
});

app.listen(3000, () => console.log("MyHUB API running on port 3000"));
