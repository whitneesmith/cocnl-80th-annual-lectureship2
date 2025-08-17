import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body; // match your form fields

    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:B", // adjust columns
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, new Date().toISOString()]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error writing to Google Sheet", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
