import React, { useState, useEffect } from "react";
import Loading from "./Loading";

import '../css/Restaurants.css';

export default function Restaurants(){

    const [loading, setLoading] = useState(true);
    const [showIframe, setShowIframe] = useState(false);


    return(
        <div className="restaurants">

        
                <div className="restaurants-container">
                    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1D3eu-3oCDeBTG-DDEE-2YqJwQp__2RY&ehbc=2E312F&noprof=1" 
                        width="100%" height="600px"></iframe>
                </div>
            
        </div>
    );
}