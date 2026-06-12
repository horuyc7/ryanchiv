import "../css/Description.css";

import { Typography } from "@mui/material";
import {
  Timeline, TimelineItem, TimelineSeparator,
  TimelineConnector, TimelineContent, TimelineDot, 
  TimelineOppositeContent,
} from "@mui/lab";

import { createTheme } from "@mui/material/styles";

import SchoolIcon from "@mui/icons-material/School";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import WorkIcon from "@mui/icons-material/Work";
import BatteryCharging80Icon from "@mui/icons-material/BatteryCharging80";

const theme = createTheme({
  palette: {
    primary: {
      main: "#EC8231",
    },
    secondary: {
      main: "#8be4a9",
    },
    mode: "dark",
  },
});

const PRIMARY = theme.palette.primary.main;
const SECONDARY = theme.palette.secondary.main;

const TIMELINE_ITEMS = [
  {
    year: "'15 - '19",
    title: "Belton High School",
    icon: SchoolIcon,
    outlined: true,
  },
  {
    year: "'19 - '23",
    title: "University of Texas at Dallas",
    subtitle: "Bachelor in Software Engineering",
    icon: SchoolIcon,
  },
  {
    year: "'23 - '24",
    title: "Rest",
    icon: ConnectingAirportsIcon,
    outlined: true,
  },
  {
    year: "'24 - '26",
    title: "CGS",
    subtitle: "Software Engineer",
    icon: WorkIcon,
  },
  {
    year: "'26 -",
    title: "Rest 2",
    icon: BatteryCharging80Icon,
    outlined: true,
  },
];

export default function Description() {
  return (
    <div className="description">
      <Timeline position="alternate">
        {TIMELINE_ITEMS.map((item, index) => {
          const Icon = item.icon;

          return (
            <TimelineItem sx={{ marginLeft: "20px" }} key={`${item.year}-${item.title}`}>
              <TimelineOppositeContent sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 56,
                }}
                className="description__timeline-date"
              >
                {item.year}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineConnector />

                <TimelineDot
                  variant={item.outlined ? "outlined" : "filled"}
                  sx={
                    item.outlined
                      ? { color: PRIMARY }
                      : { bgcolor: PRIMARY }
                  }
                >
                  <Icon />
                </TimelineDot>

                <TimelineConnector />
              </TimelineSeparator>

             <TimelineContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 56,
                }}
              >
                <Typography
                  className="description__timeline-title"
                  sx={{
                    color: item.subtitle ? SECONDARY : PRIMARY,
                  }}
                >
                  {item.title}
                </Typography>

                {item.subtitle && (
                  <Typography className="description__timeline-subtitle">
                    {item.subtitle}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}