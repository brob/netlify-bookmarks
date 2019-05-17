const sheets = require('google-spreadsheet');
const creds = require('./credentials.json');

var doc = new sheets('1OObbPDfBJoVinO7KLMvhQtrpPT1OQuI5lNw0_Pa94DA');


async function getDetails() {
    return new Promise((resolve, reject) => {
        doc.useServiceAccountAuth(creds,  function (err) {
            console.log(err);
            doc.getRows(1, function (err, info) {
                console.log(info);
                resolve(JSON.stringify(info));
            });
          });
    })    

}

exports.handler = async function(event, context) {
    try {
      const body = await getDetails();
      return { statusCode: 200, body };
    } catch (err) {
      return { statusCode: 500, body: err.toString() };
    }
  };
  