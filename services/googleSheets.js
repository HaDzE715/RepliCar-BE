const { google } = require("googleapis");
const { promisify } = require("util");
require("dotenv").config(); 

// Decode the base64 encoded service account JSON
const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf-8");
const credentials = JSON.parse(decodedServiceAccount);

// Configure the client
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes,
});

const sheets = google.sheets({ version: "v4", auth });

// Function to append data to the Google Sheet
async function appendToSheet(email) {
  const spreadsheetId = "1HfbOhxZvaRpOWnk-nYxgm4nXpouGRmDqzL5GI1opcwg";
  const range = "A:A";

  const request = {
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [[email]],
    },
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log("Success:", response.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = { appendToSheet };
