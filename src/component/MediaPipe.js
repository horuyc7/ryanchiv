import React, { useState, useEffect, useRef } from 'react';

import {
    ObjectDetector,
    FilesetResolver,
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

import Loading from './Loading';
  

  
import '../css/MediaPipe.css';



const MediaPipe = ({ imageUrl }) => {
  const [objectDetector, setObjectDetector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState([]);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    let runningMode = "IMAGE";

    const initializeObjectDetector = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        const objectDetector = await ObjectDetector.createFromModelPath(vision,
            "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite"
        );
          setObjectDetector(objectDetector);
          setLoading(false);
    };
    
    initializeObjectDetector();
  }, []);

  const classifyImage = async (img) => {
    if (objectDetector) {
      const result = objectDetector.detect(img);
      setObjects(result.detections);

      console.log(result);
      setLoading(false);
    }
  };

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

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="object-detection-container">
      {loading ? (
        <div className='loading'>
          <Loading/>
        </div>
      ) : (
        <div className="image-container">

            <h2 className='title'>Object Detection</h2>

            <div className='confidence'>
                {objects.filter(detection => parseFloat(detection.categories[0].score) > 0.2).slice(0, 10).map((detection, index) => (
                      <div>
                          <p>
                              {detection.categories[0].categoryName} {index}: {Math.round(parseFloat(detection.categories[0].score) * 100)}% confidence.
                          </p>
                      </div>  
                  ))}
            </div>

            <div className="image-wrapper">
              

              {image && <img src={image.src} alt="Uploaded" />}


              {objects.filter(detection => parseFloat(detection.categories[0].score) > 0.2).length === 0 &&image && <p>No object detected</p>}
            
            
              {objects.filter(detection => parseFloat(detection.categories[0].score) > 0.2).slice(0,10).map((detection, index) => (
                    <React.Fragment key={index}>
                        <div
                            className="highlighter"
                            style={{
                                left: `${(detection.boundingBox.originX / image.width) * 100}%`,
                                top: `${(detection.boundingBox.originY / image.height) * 100}%`,
                                width: `${(detection.boundingBox.width / image.width) * 100}%`,
                                height: `${(detection.boundingBox.height / image.height) * 99.6}%`
                            }}>

                            <p className="info">
                                {detection.categories[0].categoryName}{" "}{index}
                            </p>
                        </div>  
                    </React.Fragment>

                    
                ))}
            </div>

            <div className='input'>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none', marginBottom: '20xp'}} />
              <button className='upload-button' onClick={triggerImageUpload}>Upload Image</button>
            </div>

          

          </div>
        )}
    </div>
  );
};

export default MediaPipe;
