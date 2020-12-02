function getPostedSheet(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('連携済み');
}

function getPostedUrls() {
  let sheet = getPostedSheet();
  return sheet.getRange('A1:B').getValues().flat();
}

function getLastRowOfPosted() {
  let sheet = getPostedSheet();
  return sheet.getLastRow();
}

function generateAdventMessage(slackId, articleUrl, articleTitle) {
  articleTitle = sanitizeSlackMessage(articleTitle);
  return "<@" + slackId + "> さんのアドカレ記事が投稿されました！:santa: \n<" + articleUrl + "|" + articleTitle + ">";
}

function main() {
  let feed = PropertiesService.getScriptProperties().getProperty('ADVENT_RSS_URL');
  let response = UrlFetchApp.fetch(feed);
  let xml = XmlService.parse(response.getContentText());
  let atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');

  let entries = xml.getRootElement().getChildren("entry", atom);
  let postedUrls = getPostedUrls();
  
  for (let i = entries.length - 1; i >= 0; i--) {
    let url     = entries[i].getChild("url"      , atom).getText();
    let title   = entries[i].getChild("title"    , atom).getText();
    let author  = entries[i].getChild("author"   , atom).getChild("name", atom).getText();
    
    if(!postedUrls.includes(url)){
      let sheet = getPostedSheet(); 
      sheet.getRange(getLastRowOfPosted() + 1, 1).setValue(url);
      
      let slackId = getSlackId(author);
      let text = generateAdventMessage(slackId, url, title);
      let webhookUrl = PropertiesService.getScriptProperties().getProperty('ADVENT_WEBHOOK_URL');
      postToSlack(text, webhookUrl);  
    }
  }
}