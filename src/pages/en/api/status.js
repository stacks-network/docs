export default async (req, res) => {
  const response = await fetch('http://status.test-blockstack.com/json');
  const json = await response.json();
  if (json) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json.blockRateStatus));
  }
};
