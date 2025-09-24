import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import './measure.css'

const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};
const PIXEL_TO_CM = 0.084; // The calibrated value we discussed

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [poses, setPoses] = useState([]);
  const [measurements, setMeasurements] = useState({});
  const [detector, setDetector] = useState(null);
  const [userName, setUserName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // This loads the model
    const loadPoseDetectionModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
        const loadedDetector = await poseDetection.createDetector(model, detectorConfig);
        setDetector(loadedDetector);
      } catch (error) { console.error("Error loading model:", error); }
    };
    loadPoseDetectionModel();
  }, []);

  useEffect(() => {
    // This runs the detection
    let animationFrameId;
    const detectPose = async () => {
      if (webcamRef.current && webcamRef.current.video && detector && webcamRef.current.video.readyState === 4) {
        try {
          const video = webcamRef.current.video;
          const estimatedPoses = await detector.estimatePoses(video);
          if (estimatedPoses.length > 0) {
            setPoses(estimatedPoses);
            calculateBodyMeasurements(estimatedPoses[0]);
          }
        } catch (error) { console.error("Error in detectPose:", error); }
      }
      animationFrameId = requestAnimationFrame(detectPose);
    };
    if (detector) { detectPose(); }
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [detector]);

  const calculateBodyMeasurements = (pose) => {
    const confidenceThreshold = 0.4;
    const keypoints = pose.keypoints.reduce((acc, kp) => {
      if (kp.score > confidenceThreshold) { acc[kp.name] = { x: kp.x, y: kp.y }; }
      return acc;
    }, {});
    
    if (keypoints.left_shoulder && keypoints.right_shoulder && keypoints.left_hip && keypoints.right_hip) {
      const shoulderWidth = calculateDistance(keypoints.left_shoulder, keypoints.right_shoulder) * PIXEL_TO_CM;
      const hipWidth = calculateDistance(keypoints.left_hip, keypoints.right_hip) * PIXEL_TO_CM;
      const leftTorsoHeight = calculateDistance(keypoints.left_shoulder, keypoints.left_hip);
      const rightTorsoHeight = calculateDistance(keypoints.right_shoulder, keypoints.right_hip);
      const torsoHeight = ((leftTorsoHeight + rightTorsoHeight) / 2) * PIXEL_TO_CM;
      setMeasurements({
        shoulderWidth: shoulderWidth.toFixed(2),
        hipWidth: hipWidth.toFixed(2),
        torsoHeight: torsoHeight.toFixed(2),
      });
    }
  };

  const handleSaveMeasurements = async () => {
    if (!userName || Object.keys(measurements).length === 0) {
      alert('Please enter a name and wait for measurements.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3002/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName, measurements: measurements }),
      }); 
      if (!response.ok) { throw new Error('Network response was not ok'); }
      await response.json();
      setStatusMessage(`Saved successfully for ${userName}!`);
      setUserName('');
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Failed to save measurements.');
    }
  };

  // --- THIS FUNCTION IS NOW FILLED IN ---
  const renderKeypoints = () => {
    if (!poses.length || !webcamRef.current || !webcamRef.current.video) return null;
  
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
  
    const { width: displayWidth, height: displayHeight } = video.getBoundingClientRect();
  
    const scaleX = displayWidth / videoWidth;
    const scaleY = displayHeight / videoHeight;
  
    return poses[0].keypoints.map((point, index) => {
      if (point.score < 0.4) return null;

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${point.x * scaleX}px`,
            top: `${point.y * scaleY}px`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'aqua',
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Webcam
        ref={webcamRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
      />
      {renderKeypoints()}
      {Object.keys(measurements).length > 0 && (
        <div style={{
          position: 'absolute', top: '20px', left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white',
          padding: '15px', borderRadius: '10px', fontFamily: 'sans-serif'
        }}>
          <h3>Measurements (cm)</h3>
          <p>Shoulder Width: {measurements.shoulderWidth}</p>
          <p>Hip Width: {measurements.hipWidth}</p>
          <p>Torso Height: {measurements.torsoHeight}</p>
          
          <div style={{ marginTop: '20px', borderTop: '1px solid #555', paddingTop: '15px' }}>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: 'none', marginRight: '10px' }}
            />
            <button
              onClick={handleSaveMeasurements}
              style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#61dafb', color: 'black' }}
            >
              Save Measurements
            </button>
            {statusMessage && <p style={{ marginTop: '10px', color: '#61dafb' }}>{statusMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

function MeasureMe() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#282c34', color: 'white' }}>
      <h1 style={{ textAlign: 'center', padding: '20px 0' }}>Body Measurement App</h1>
      <h4 style={{ textAlign: 'center', marginTop: '-15px', paddingBottom: '10px', fontWeight: 'normal' }}>
        Please stand fully visible in front of your webcam.
      </h4>
      <WebcamComponent />
    </div>
  );
}

export default MeasureMe;

