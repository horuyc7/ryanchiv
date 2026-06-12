import React, { useState, useEffect, useRef } from "react";
import {
  ObjectDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

import Loading from "./Loading";
import "../css/MediaPipe.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";

import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: { main: "#d6550e" },
    secondary: { main: "#8be4a9" },
    mode: "dark",
  },
});

const MediaPipe = () => {
  const [objectDetector, setObjectDetector] = useState(null);
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const fileInputRef = useRef(null);

  // Load MediaPipe object detection model once
  useEffect(() => {
    const initDetector = async () => {
      setLoading(true);

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const detector = await ObjectDetector.createFromModelPath(
        vision,
        "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite"
      );

      setObjectDetector(detector);
      setLoading(false);
    };

    initDetector();
  }, []);

  const detectObjects = (img) => {
    if (!objectDetector) return;

    const result = objectDetector.detect(img);
    setObjects(result.detections || []);
    setLoading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        setImage(img);
        setSelectedObjects([]); // reset selections
        detectObjects(img);
      };
    };

    reader.readAsDataURL(file);
  };

  // Trigger file input
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const toggleObjectSelection = (object) => {
    setSelectedObjects((prev) =>
      prev.includes(object)
        ? prev.filter((o) => o !== object)
        : [...prev, object]
    );
  };

  return (
    <div className="mediapipe">
      {loading ? (
        <div className="mediapipe__loading">
          <Loading />
        </div>
      ) : (
        <div className="mediapipe__container">

          {/* Header */}
          <h2 className="mediapipe__title">Object Detection</h2>

          {/* Upload section */}
          <div className="mediapipe__upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mediapipe__input"
            />

            <button
              className="mediapipe__button"
              onClick={openFilePicker}
            >
              Upload Image
            </button>
          </div>

          {/* Image preview */}
          <div className="mediapipe__image-wrapper">
            {image && (
              <img
                className="mediapipe__image"
                src={image.src}
                alt="Uploaded"
              />
            )}

            {/* Highlight selected objects */}
            {selectedObjects.map((object, index) => (
              <div
                key={index}
                className="mediapipe__highlight"
                style={{
                  left: `${(object.boundingBox.originX / image.width) * 100}%`,
                  top: `${(object.boundingBox.originY / image.height) * 100}%`,
                  width: `${(object.boundingBox.width / image.width) * 100}%`,
                  height: `${(object.boundingBox.height / image.height) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Results table */}
          {objects.length > 0 && (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  backgroundColor: Theme.palette.primary.main, color: "#491e07"
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell/>
                    <TableCell sx={{ fontSize: "15px" }}>
                      Object Name
                    </TableCell>
                    <TableCell sx={{ fontSize: "15px" }}>
                      Confidence
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {objects.slice(0, 10).map((object, index) => (
                    <TableRow
                      key={index}
                      className="mediapipe__table"
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                            sx={{
                                color: "white",
                                "&.Mui-checked": {
                                color: "#491e07",
                                },
                            }}
                            checked={selectedObjects.includes(object)}
                            onChange={() =>
                            toggleObjectSelection(object)
                          }
                        />
                      </TableCell>

                      {/* Object */}
                      <TableCell
                        className="mediapipe__object"
                        onClick={() =>
                          toggleObjectSelection(object)
                        }
                      >
                        {object.categories[0].categoryName}
                      </TableCell>

                      {/* Confidence */}
                      <TableCell
                        className="mediapipe__confidence"
                        onClick={() =>
                          toggleObjectSelection(object)
                        }
                      >
                        {Math.round(
                          object.categories[0].score * 100
                        )}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaPipe;