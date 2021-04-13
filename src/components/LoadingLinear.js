import React from 'react';
import { LinearProgress } from '@material-ui/core';

const LoadingLinear = ({ visible, position }) => (
  <LinearProgress
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [position]: 0,
      display: visible ? 'inherit' : 'none',
    }}
  />
);

export default LoadingLinear;
