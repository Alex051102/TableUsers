import React from 'react';
import './ErrorMess.css';

export default function ErrorMess({ message }) {
  return (
    <div className="error">
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3 className="error-title">Ошибка</h3>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
}
