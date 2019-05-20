const http = require("https");
const cheerio = require('cheerio');
const sheets = require('google-spreadsheet');
var axios   = require('axios');
const creds = require('./credentials.json');
creds['private_key_id'] = process.env.private_key_id;

var doc = new sheets('1OObbPDfBJoVinO7KLMvhQtrpPT1OQuI5lNw0_Pa94DA');

function rebuildSite() {
  let url = `https://api.netlify.com/build_hooks/${process.env.build_hook_id}`;

  return axios.post(url)
        .then(function() {
          console.log("posted and rebuilding");
        })
        .catch(function(err) {
          console.log(err);
        });
}

async function createRow(value) {
  return new Promise((resolve, reject) => {
    let values = {
      url: value.url,
      pagetitle: value.pagetitle,
      description: value.description
    }
    doc.useServiceAccountAuth(creds,  function (err) {
      console.log(values);
      doc.addRow(1, values, function(err, row) {
        if (err) console.log(err);
        if (!err) rebuildSite();

        resolve(`Added to Bookmarks ${row.id}`);
      });

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
        const description = $('meta[name="description"]').attr('content');
        data['pagetitle'] = title;
        data['description'] = description;
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
  