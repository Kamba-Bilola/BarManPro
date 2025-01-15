import React, { useRef, useState } from 'react';

const CameraComponent = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    onCapture(imageData);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay muted></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div>
        <button onClick={capturePhoto}>Capture</button>
        <button onClick={stopCamera}>Close</button>
      </div>
    </div>
  );
};

export default CameraComponent;
