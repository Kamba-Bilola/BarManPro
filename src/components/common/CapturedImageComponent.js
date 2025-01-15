import React from 'react';

const CapturedImageComponent = ({ image, onValidate, onCancel }) => {
  const validateImage = () => {
    const blob = dataURLToBlob(image);
    const file = new File([blob], 'captured_image.png', { type: 'image/png' });
    onValidate(file);
  };

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <div>
      <img src={image} alt="Captured" style={{ maxWidth: '100%' }} />
      <div>
        <button onClick={validateImage}>Validate</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CapturedImageComponent;
