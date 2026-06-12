import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { load } from "@tensorflow-models/mobilenet";
import Loading from "./LoadingCircle";

import "../css/ImageClassifier.css";

const ImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  // Load model on mount
  useEffect(() => {
    const loadModel = async () => {
      const mobilenetModel = await load({
        version: 1,
        alpha: 0.75,
      });

      setModel(mobilenetModel);
      setLoading(false);
    };

    loadModel();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

  // Run model
  const classifyImage = async (img) => {
    if (!model) return;

    const predictions = await model.classify(img);
    setClassificationResult(predictions);
  };

  // Trigger file input
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {loading ? (
        <div className="image-classifier__loading">
          <Loading />
        </div>
      ) : (
        <div className="image-classifier">
          {/* Header */}
          <h2 className="image-classifier__title">
            Image Classifier
          </h2>

          {/* Upload section */}
          <div className="image-classifier__input-container">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-classifier__input"
            />

            <button
              className="image-classifier__upload-button"
              onClick={triggerImageUpload}
            >
              Upload Image
            </button>
          </div>

          {/* Preview image */}
          {image && (
            <img
              className="image-classifier__image"
              src={image.src}
              alt="Uploaded"
            />
          )}

          {/* Predictions */}
          <div className="image-classifier__results">
            {classificationResult.map((prediction, index) => (
              <p
                key={index}
                className="image-classifier__result-item"
              >
                <span className="image-classifier__label">
                  {prediction.className.split(",")[0]}
                </span>

                <span className="image-classifier__confidence">
                  {(prediction.probability * 100).toFixed(2)}%
                </span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;