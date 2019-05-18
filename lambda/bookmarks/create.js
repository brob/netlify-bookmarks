const http = require("https");
const cheerio = require('cheerio');
const sheets = require('google-spreadsheet');
const creds = require('./credentials.json');
creds['private_key_id'] = process.env.private_key_id;

var doc = new sheets('1OObbPDfBJoVinO7KLMvhQtrpPT1OQuI5lNw0_Pa94DA');

async function createRow(value) {
  return new Promise((resolve, reject) => {
    let values = {
      url: value.url,
      pagetitle: value.pagetitle
    }
    let rows = doc.useServiceAccountAuth(creds,  function (err) {
      console.log(values);
      let row = doc.addRow(1, values, function(err, row) {
        if (err) console.log(err);
        return row;
      });
      resolve(`Added to ${row.id}`);

    });
  });
    

}



async function getDetails(parameters) {
  const data = {
    "url": parameters.url
  };
  return new Promise((resolve, reject) => {
    http.get(parameters.url, function(res) {
      res.on("data", function(html) {
        const $ = cheerio.load(html);
        const title = $('title').text();
        data['pagetitle'] = title;
        resolve(data);
      });
    });
  })
}


exports.handler = async function(event, context) {
    try {
      var body = await getDetails(event.queryStringParameters)
        .then((value) => {
          // console.log(value);
          return createRow(value);
          // console.log(data);
        });
      return { statusCode: 200, body };
    } catch (err) {
      return { statusCode: 500, body: err.toString() };
    }
  };
  