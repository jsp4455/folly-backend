const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const CODES_FILE = "./codes.json";

// Load codes
function loadCodes() {
  return JSON.parse(fs.readFileSync(CODES_FILE, "utf8"));
}

// Save codes
function saveCodes(data) {
  fs.writeFileSync(CODES_FILE, JSON.stringify(data, null, 2));
}

// Redeem endpoint
app.post("/redeem", (req, res) => {
  const { code } = req.body;

  if (!code) return res.json({ success: false, message: "No code provided" });

  const data = loadCodes();
  const entry = data.codes.find(c => c.code === code);

  if (!entry) {
    return res.json({ success: false, message: "Invalid code" });
  }

  if (entry.used) {
    return res.json({ success: false, message: "Code already used" });
  }

  // Mark as used
  entry.used = true;
  saveCodes(data);

  return res.json({ success: true, message: "Code accepted" });
});

app.listen(3001, () => console.log("Backend running on port 3001"));
