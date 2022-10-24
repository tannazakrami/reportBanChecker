const {google} = require("googleapis");
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
})

module.exports = async function setData(arr, i){
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client})
    const spreadsheetId = "1hM4SepEvLh_TIkyZ0gYNYMSRKEndy_WwIJCsDZSX3UU";
    const request = {
        auth, 
        spreadsheetId,
        range: "БД Отчет по асинам!A2:D",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "OVERWRITE",
        resource: {
            "majorDimension": "ROWS",
            "values": arr
        }
    }
    try{
        const response = (await googleSheets.spreadsheets.values.append(request)).data;
    }
    catch(e){
        console.error(e);
    }
}