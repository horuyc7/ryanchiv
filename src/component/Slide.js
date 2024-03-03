import React, { useEffect } from 'react';

function Slide() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="pa-gallery-player-widget" style={{ width: '100%', height: '600px', display: 'none' }}
    data-link="https://photos.app.goo.gl/DwyAvJS3BcweBifL8"
    data-title="Travel"
    data-description="5 new items · Album by Diluc d"
    data-delay="3"
    data-autoplay="true">
    <object data="https://lh3.googleusercontent.com/pw/AP1GczP-4q6iWgvRLDG6syXQWw0uFuF0wK_16Dk0etEiHlDeLEs_7zx2xCSharNWp0znxnPdCUe9yfzX1GcL1DSqI964gRFy5238CmCltOcdEPNnMyrDhXM=w1920-h1080"></object>
    <object data="https://lh3.googleusercontent.com/pw/AP1GczMHFtJ957hGVb2spRrnwQNUZXBHPOI0niqImU8ej4V5xraacLUa-5GEFOlXZM0UVNRZgLFqp7uXF9JL_0Z_8ljU1iKXXzf0YCbnJw7_13tmJSXzO6o=w1920-h1080"></object>
    <object data="https://lh3.googleusercontent.com/pw/AP1GczMAic9RW5SOhgCPqatdgiXOyZslp_lvbfWzc8IPSKulNL3VkKR-kwxl6yIeYa7dEe3iyu3wnB-IF4ZdSJG1l8skVzheJh-5Awq7SDdS11zZB4EtEOE=w1920-h1080"></object>
    <object data="https://lh3.googleusercontent.com/pw/AP1GczOkXdbJkZYbbUl87h5A-GorfK_73GR90rM89m6mPF39HR_VqeLxJK7SnLAI0eRaz-D3lwhX-s-w4DwLAqK9ZMcFE0zbXrZnAGppw10IlLDYgyNWwnE=w1920-h1080"></object>
    <object data="https://lh3.googleusercontent.com/pw/AP1GczPtId6akJtCQadnGMNbDkQy1XU5PzojSIfmS7Mdp8ihNkyC4llqkpvTIic3BnS9pn7Sl4uJCe8wu9fPI2mgZYK44J7yG9AbnvR8ddGVdg_4faGRzhA=w1920-h1080"></object>
    </div>

  );
}

export default Slide;