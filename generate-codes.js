const fs = require("fs");
const path = require("path");

const CODES_FILE = path.join(__dirname, "codes.json");

// how many codes to generate in one run
const NUM_CODES = 50;

// length of each code
const CODE_LENGTH = 10;

// characters allowed in codes
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function loadCodes() {
  if (!fs.existsSync(CODES_FILE)) {
    return { codes: [] };
  }
  return JSON.parse(fs.readFileSync(CODES_FILE, "utf8"));
}

function saveCodes(data) {
  fs.writeFileSync(CODES_FILE, JSON.stringify(data, null, 2));
}

function generateCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function main() {
  const data = loadCodes();
  const existing = new Set(data.codes.map(c => c.code));

  const newCodes = [];

  while (newCodes.length < NUM_CODES) {
    const code = generateCode();
    if (!existing.has(code)) {
      existing.add(code);
      newCodes.push({ code, used: false });
    }
  }

  data.codes.push(...newCodes);
  saveCodes(data);

  console.log("Generated codes:");
  newCodes.forEach(c => console.log(c.code));
}

main();
