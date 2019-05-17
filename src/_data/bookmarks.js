var axios   = require('axios');


module.exports = async function() {
    let url = `https://master--determined-ptolemy-694e1b.netlify.com/.netlify/functions/bookmarks`;
    axios.get(url)
        .then(function (response) {
            return response.data
        })
}