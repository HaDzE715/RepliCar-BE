const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Load the service account credentials
const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
};

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
  const range = "A:A"; // Correct any typos in the sheet name

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
