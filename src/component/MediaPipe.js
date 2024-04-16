import React, { useState, useEffect, useRef } from 'react';
import {
    ObjectDetector,
    FilesetResolver,
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
  

  
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
        <p>Loading...</p>
      ) : (
        <div className="image-container">
          <div style={{ marginBottom: '40px'}}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <button onClick={triggerImageUpload}>Upload Image</button>
          </div>

          <div className="image-wrapper">
            {image && <img src={image.src} alt="Uploaded" />}
          </div>

          {objects.length === 0 && <p>No object detected</p>}
          


          {objects.slice(0, 3).map((detection, index) => (
                <React.Fragment key={index}>
                    <div
                        className="highlighter"
                        style={{
                            left: `${(detection.boundingBox.originX / image.width) * 100}%`,
                            top: `${(detection.boundingBox.originY / image.height) * 100}%`,
                            width: `${(detection.boundingBox.width / image.width) * 100}%`,
                            height: `${(detection.boundingBox.height / image.height) * 100}%`
                        }}
                        >
                        <p className="info" style={{ position: "absolute", top: "-20px" }}>
                            {detection.categories[0].categoryName} - {" "}
                            {Math.round(parseFloat(detection.categories[0].score) * 100)}% confidence.
                        </p>
                    </div>
                </React.Fragment>
            ))}

            </div>
        )}
    </div>
  );
};

export default MediaPipe;
