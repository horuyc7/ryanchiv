// EducationTimeline.js
import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Typography } from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import SchoolIcon from '@mui/icons-material/School';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#d6550e',
      
    },

    secondary: {
      main: '#8be4a9',
      
    },


    mode: 'dark',

    
  },


});

const EducationTimeline = ({ educationData }) => {
  return (
    <Timeline position="alternate">
      {educationData.map((education, index) => (
        <TimelineItem key={index}>

          <TimelineOppositeContent sx={{ m: 'auto 0', fontSize: "12px", color: Theme.palette.secondary.main }} variant="body2">
            {education.startDate} - {education.endDate}
          </TimelineOppositeContent>

          <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot sx={{bgcolor: Theme.palette.primary.main}}>
            <SchoolIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" component="span">
              {education.degree}
            </Typography>
            <Typography>{education.institution}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default EducationTimeline;