const rp = require('request-promise');
const cheerio = require('cheerio');
const sheets = require('google-spreadsheet');
var axios   = require('axios');
const creds = require('./credentials.json');
creds['private_key_id'] = process.env.private_key_id;

var doc = new sheets('1OObbPDfBJoVinO7KLMvhQtrpPT1OQuI5lNw0_Pa94DA');

function rebuildSite() {
  let url = `https://api.netlify.com/build_hooks/${process.env.build_hook_id}`;
  console.log(url);
  return axios.post(url)
        .then(function() {
          console.log("posted and rebuilding");
        })
        .catch(function(err) {
          // console.log(err);
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


function getDetails(html) {
  const details = {};
  const $ = cheerio.load(html);
  details['pagetitle'] = $('title').text();
  details['description'] = $('meta[name="description"]').attr('content');
  return details
}



exports.handler = async function(event, context) {
    try {
      const details = await rp(event.queryStringParameters.url)
      .then((html) => getDetails(html))
      .catch((err) => console.log(err));
      

      const body = await createRow({url: event.queryStringParameters.url, ...details})

      return { statusCode: 200, body };
    } catch (err) {
      return { statusCode: 500, body: err.toString() };
    }
  };
  