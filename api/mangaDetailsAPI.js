const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const {status} = req.query;

    const response = await fetch(`https://api.myanimelist.net/v2/manga/${status}?fields=id,title,main_picture,synopsis,mean,rank,popularity,genres,status,num_volumes,recommendations,authors`, {
      headers: {
        'X-MAL-Client-ID': process.env.MAL_CLIENT_ID,
      },
    });

    const data = await response.json();


    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching manga details:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};