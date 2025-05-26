import React from 'react';
import './ResetButton.css';

const ResetButton = ({ onReset }) => (
  <button className="reset-button" onClick={onReset}>
    Reiniciar
  </button>
);

export default ResetButton;
