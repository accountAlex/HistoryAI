import React from 'react';
import '../../styles/GalleryModal.css';

const GalleryModal = ({ isOpen, onClose, images }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>Закрыть</button>
        <div className="gallery">
          {images.map((img, index) => (
            <img key={index} src={img} alt={`img-${index}`} className="gallery-image" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
