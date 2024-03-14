const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    
    const response = await fetch(`https://api.discogs.com/users/${process.env.DISCOGS_USERNAME}/collection/folders/0/releases`, {
      headers: {
        'Authorization': `Discogs token=${process.env.DISCOGS_TOKEN}`,
      }
    });
    
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};