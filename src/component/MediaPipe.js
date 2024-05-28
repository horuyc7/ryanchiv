import React, { useState, useEffect, useRef } from 'react';
import {
    ObjectDetector,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
import Loading from './Loading';
import '../css/MediaPipe.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#d6550e',
      
    },

    secondary: {
      main: '#8be4a9',
      
    },


    mode: 'dark',

    
  },


});

const MediaPipe = ({ imageUrl }) => {
    const [objectDetector, setObjectDetector] = useState(null);
    const [loading, setLoading] = useState(true);
    const [objects, setObjects] = useState([]);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [selectedObjects, setSelectedObjects] = useState([]);

    useEffect(() => {
        let runningMode = "IMAGE";
        setLoading(true);

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
                setSelectedObjects([]);
            };
        };
        reader.readAsDataURL(file);
    };

    const triggerImageUpload = () => {
        fileInputRef.current.click();
    };

    const handleObjectSelect = (object) => {
        const index = selectedObjects.findIndex(obj => obj === object);
        if (index !== -1) {
            setSelectedObjects(selectedObjects.filter(obj => obj !== object));
        } else {
            setSelectedObjects([...selectedObjects, object]);
        }
    };

    const handleCheckboxChange = (object) => {
        const index = selectedObjects.findIndex(obj => obj === object);
        if (index !== -1) {
            setSelectedObjects(selectedObjects.filter(obj => obj !== object));
        } else {
            setSelectedObjects([...selectedObjects, object]);
        }
    };

    return (
        <div className="object-detection-container">
            {loading ? (
                <div className='loading'>
                    <Loading />
                </div>
            ) : (
                <div className="image-container">
                    <h2 className='title'>Object Detection</h2>
                    <div className='input'>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none', marginBottom: '20px' }} />
                        <button className='upload-button' onClick={triggerImageUpload}>Upload Image</button>
                    </div>
                    <div className="image-wrapper">
                        {image && <img src={image.src} alt="Uploaded" />}
                        {selectedObjects.map((object, index) => (
                            <div
                                key={index}
                                className="highlighter"
                                style={{
                                    left: `${(object.boundingBox.originX / image.width) * 100}%`,
                                    top: `${(object.boundingBox.originY / image.height) * 100}%`,
                                    width: `${(object.boundingBox.width / image.width) * 100}%`,
                                    height: `${(object.boundingBox.height / image.height) * 99.6}%`
                                }}>
                            </div>
                        ))}
                    </div>

                    {objects && objects.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table sx={{backgroundColor: Theme.palette.primary.main, color: Theme.palette.secondary.main}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#8be4a9' }}></TableCell>
                                    <TableCell sx={{ color: '#8be4a9' }}>Object Name</TableCell>
                                    <TableCell sx={{ color: '#8be4a9' }}>Confidence</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {objects.slice(0,10).map((object, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox sx={{ color: 'white' }}
                                                checked={selectedObjects.includes(object)}
                                                onChange={() => handleCheckboxChange(object)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }} onClick={() => handleObjectSelect(object)}>
                                            {object.categories[0].categoryName}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }} onClick={() => handleObjectSelect(object)}>
                                            {Math.round(parseFloat(object.categories[0].score) * 100)}%
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

