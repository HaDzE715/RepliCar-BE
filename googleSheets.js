require("dotenv").config();

const { google } = require("googleapis");

// Configure the client using environment variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1HfbOhxZvaRpOWnk-nYxgm4nXpouGRmDqzL5GI1opcwg"; // Replace with your actual spreadsheet ID
const range = "A:A";

async function appendToSheet(email) {
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
