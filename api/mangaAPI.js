const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const {status} = req.query;

    const response = await fetch(`https://api.myanimelist.net/v2/users/hunchojhuncho99/mangalist?fields=list_status&status=${status}&limit=50`, {
      headers: {
        'X-MAL-Client-ID': process.env.MAL_CLIENT_ID,
      },
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching manga data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};