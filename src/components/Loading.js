import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loading = ({ visible, size = 18, Icon }) =>
  visible ? (
    <CircularProgress size={size} style={{ marginRight: 12, marginLeft: 2 }} color='inherit' />
  ) : Icon ? (
    <Icon style={{ marginRight: 8 }} />
  ) : (
    ''
  );

export default Loading;
