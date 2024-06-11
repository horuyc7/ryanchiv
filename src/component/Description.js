import React from "react";
import "../css/Description.css"

import { Container, Typography, Box } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import SchoolIcon from '@mui/icons-material/School';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import WorkIcon from '@mui/icons-material/Work';
import { Class } from "@mui/icons-material";

const Theme = createTheme({
  palette: {
    primary: {
      main: '#EC8231',
      
    },

    secondary: {
      main: '#8be4a9',
      
    },


    mode: 'dark',

    
  },


});


const Description = ({}) => {

  return (

    <div className="description">

      <p className="description__header">Timeline</p>
    

      <Timeline position="alternate">

          <TimelineItem>
            <TimelineOppositeContent sx={{ m: 'auto 0', fontSize: "14px", color: "white" }} variant="body2">
              '15 - '19
            </TimelineOppositeContent>


            <TimelineSeparator>
              <TimelineConnector />
                <TimelineDot variant="outlined" sx={{color: Theme.palette.primary.main}}>
                  <SchoolIcon />
                </TimelineDot>
              <TimelineConnector />

            </TimelineSeparator>

            <TimelineContent fontSize={"20px"} sx={{m: 'auto 0', fontWeight: 500, color:Theme.palette.primary.main}} >
                Belton High School
            </TimelineContent>

          </TimelineItem>


          <TimelineItem>
            <TimelineOppositeContent sx={{ m: 'auto 0', fontSize: "14px", color: Theme.palette.secondary.main }} variant="body2">
              '19 - '23
            </TimelineOppositeContent>


            <TimelineSeparator>
              <TimelineConnector />
                <TimelineDot sx={{bgcolor: Theme.palette.primary.main}}>
                  <SchoolIcon />
                </TimelineDot>
              <TimelineConnector />

            </TimelineSeparator>


            <TimelineContent>

              <Typography fontSize={"20px"} sx={{fontWeight: 500, color:Theme.palette.secondary.main}}>
                University of Texas at Dallas
              </Typography>

              <Typography fontSize={"14px"} sx={{color: "white"}} >Bachelor in Software Engineering</Typography>

            </TimelineContent>

          </TimelineItem>



          <TimelineItem>
            <TimelineOppositeContent sx={{ m: 'auto 0', fontSize: "14px", color: "white" }} variant="body2">
              '23 - '24
            </TimelineOppositeContent>


            <TimelineSeparator>
              <TimelineConnector />
                <TimelineDot variant='outlined' sx={{ color: Theme.palette.primary.main}}>
                  <ConnectingAirportsIcon/>
                </TimelineDot>
                
              <TimelineConnector />

            </TimelineSeparator>

            <TimelineContent fontSize={"20px"} sx={{m: 'auto 0', fontWeight: 500, color:Theme.palette.primary.main}} >
                Rest
            </TimelineContent>

          </TimelineItem>



          <TimelineItem>
            <TimelineOppositeContent sx={{ mt: 1.6, mb: 'auto', fontSize: "14px", color: Theme.palette.secondary.main}}>
              '24 - Present
            </TimelineOppositeContent>


            <TimelineSeparator>
              
                <TimelineDot sx={{bgcolor: Theme.palette.primary.main}}>
                  <WorkIcon />
                </TimelineDot>


            </TimelineSeparator>


            <TimelineContent>

              <Typography fontSize={"20px"} sx={{fontWeight: 500, color:Theme.palette.secondary.main}}>
                CGS
              </Typography>

              <Typography fontSize={"14px"} sx={{color:'white'}} >Software Engineer</Typography>

            </TimelineContent>

          </TimelineItem>



      </Timeline>
    </div>
  );
};


export default Description;