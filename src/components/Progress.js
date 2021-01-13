import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-bootstrap/ProgressBar';
const Progress = ({ percentage }) => {
  return (
    <div>
     
      <ProgressBar animated  now={percentage} label={`${percentage}%`} />
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default Progress; 