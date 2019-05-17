var axios   = require('axios');


module.exports = async function() {
    let url = `/.netlify/functions/bookmarks`;
    axios.get(url)
        .then(function (response) {
            console.log(response);
        })
}