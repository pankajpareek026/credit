import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function customSkeleton() {
  return (
    <Box sx={{ width: 300 }}>
      <Skeleton />
      <Skeleton sx={{ backgroundColor: "red" }} animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
}
