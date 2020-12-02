function postToSlack(text, webhookUrl) {
  let payload = {
    "text" : text
  };
  let params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(webhookUrl, params);
}

function sanitizeSlackMessage(msg) {
  msg = msg.replace(/&/g,'&amp;');
  msg = msg.replace(/</g,'&lt;');
  msg = msg.replace(/>/g,'&gt;');
  return msg;
}

function getSlackId(qiitaId) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('メンバー管理');
  let values = sheet.getRange('C4:D').getValues();

  let slackId = "notMatched";
  for (let i = 0; i < values.length; i++) {
    Logger.log(values[i][1], values[i][0]);
    if (values[i][1] === qiitaId.trim()) {
      slackId = values[i][0].trim();
      break;
    }
  }
  return slackId;
}