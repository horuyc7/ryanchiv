import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { load } from '@tensorflow-models/mobilenet';

import "../css/ImageClassifier.css"

const ImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadModel = async () => {
      const mobilenetV2Model = await load({ version: 1, alpha: .75 }); // Load MobileNetV2 model with alpha 1.0
    
      setModel(mobilenetV2Model);

      setLoading(false);
    };
    loadModel();
  }, []);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(img);
        classifyImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    console.log("Classification result updated:", classificationResult);
  }, [classificationResult]);

  const classifyImage = async (img) => {
    if (model) {
        
        const predictions = await model.classify(img);
            
        setClassificationResult(predictions);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div>

    {loading ? (
          <p className='loading'>Loading model...</p>
        ) : (
            <div className='imageclassifier'>

                <div className='imageclassifier__input-container'> 
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <button className='upload-button' onClick={triggerImageUpload}>Upload Image</button>
                </div>
            
                {image && <img className='' src={image.src} alt="Uploaded"/>}

                {classificationResult && classificationResult.map((prediction, index) => (
                    <p className='classification-container'>
                        <span>{prediction.className.split(',')[0]}</span> {/* Class name */}
                        <span>{(prediction.probability * 100).toFixed(2)}%</span> {/* Probability */}
                    </p>
                ))}
            </div>
    )}

    </div>
  );
};

export default ImageClassifier;