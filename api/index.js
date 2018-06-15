const axios = require('axios');

module.exports = async function(req, res) {
  let { url, post } = req.body;
  let answer = await axios.post(url, post);
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(answer.data));
};
