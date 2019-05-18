var axios   = require('axios');

async function getBookmarks() {
    let url = `https://brobmarks.netlify.com/.netlify/functions/bookmarks`;
    let data = axios.get(url)
    .then(function (response) {
        console.log(`Returned: ${response.data.length} bookmark(s)`);
        return response.data
    })
    .catch(function(err) {
        console.log(err);
    });

    return data;
}

module.exports = async function() {
    let data = await getBookmarks();
    return data;
}