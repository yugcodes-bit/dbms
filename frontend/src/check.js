import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels } from '@tensorflow-models/pose-detection';

// Utility to calculate the distance between two points
const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [poses, setPoses] = useState([]);

  const [measurements, setMeasurements] = useState({});
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadPoseDetectionModel = async () => {
      await tf.ready(); // Ensure TensorFlow.js is loaded
      const model = await createDetector(SupportedModels.MoveNet); // Create detector instance
      setDetector(model);
    };

    loadPoseDetectionModel();

    return () => {
      if (detector) {
        detector.dispose(); // Clean up the detector when the component unmounts
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const detectPose = async () => {
      if (webcamRef.current && webcamRef.current.video && detector) {
        const video = webcamRef.current.video;
        const poses = await detector.estimatePoses(video);

        if (poses.length > 0) {
          setPoses(poses);
          calculateBodyMeasurements(poses[0]);
        }
      }
      animationFrameId = requestAnimationFrame(detectPose);
    };

    if (detector) {
      detectPose();
    }

    return () => {
      cancelAnimationFrame(animationFrameId); // Cleanup animation frame
    };
  }, [detector]);

  const calculateBodyMeasurements = (pose) => {
    const keypoints = pose.keypoints.reduce((acc, kp) => {
      acc[kp.name || kp.bodyPart] = { x: kp.x, y: kp.y, score: kp.score };
      return acc;
    }, {});

    if (
      keypoints.leftShoulder &&
      keypoints.rightShoulder &&
      keypoints.leftHip &&
      keypoints.rightHip
    ) {
      const shoulderWidth = calculateDistance(
        keypoints.leftShoulder,
        keypoints.rightShoulder
      );
      const hipWidth = calculateDistance(
        keypoints.leftHip,
        keypoints.rightHip
      );
      const torsoHeight = calculateDistance(
        keypoints.leftShoulder,
        keypoints.leftHip
      );

      setMeasurements({
        shoulderWidth: shoulderWidth.toFixed(2),
        hipWidth: hipWidth.toFixed(2),
        torsoHeight: torsoHeight.toFixed(2),
      });
    }
  };

  const renderKeypoints = () => {
    if (!poses.length) return null;

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    const scaleX = window.innerWidth / videoWidth;
    const scaleY = window.innerHeight / videoHeight;

    return poses[0].keypoints.map((point, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: `${point.x * scaleX}px`,
          top: `${point.y * scaleY}px`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
      />
    ));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Webcam
        ref={webcamRef}
        style={{ width: '100%', height: '100%' }}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: 'user',
        }}
      />
      {renderKeypoints()}
      {Object.keys(measurements).length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <h3>Measurements:</h3>
          <p>Shoulder Width: {measurements.shoulderWidth} px</p>
          <p>Hip Width: {measurements.hipWidth} px</p>
          <p>Torso Height: {measurements.torsoHeight} px</p>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Full Body Measurement App</h1>
      <WebcamComponent />
    </div>
  );
}

export default App;
