import React, { useState } from "react";
import { styled } from "@mui/system";
import { Card, CardContent, CardMedia, Typography, Rating, CardActions, IconButton, Collapse} from "@mui/material";
//import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../App.css";

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0px 2px 5px rgba(0,0,0,0.25)",
  "--card-background": "#F7F7F7",
  "--card-text-color": "#333",
});

const StyledCardContent = styled(CardContent)({
  flex: 1,
  backgroundColor: "var(--card-background)",
});

const StyledTitle = styled(Typography)({
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: "0.5em",
  color: "var(--card-text-color)",
});

const StyledSubtitle = styled(Typography)({
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: "0.5em",
  color: "#555",
});

const StyledText = styled(Typography)({
  fontSize: 16,
  marginBottom: "0.5em",
  color: "#777",
});

const StyledImage = styled(CardMedia)({
  paddingTop: "5.25%",
});

const MediaCard = ({ title, year, genre, rating, image, plot }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard sx={{ maxWidth: 345, margin: "10px", padding: "25px" }}>
      {imageError ? (
        <div
          className='shimmer-wrapper'
          style={{ width: "100%", height: "500px" }}
        ></div>
      ) : (
        <StyledImage
          component='img'
          height='500'
          image={image}
          alt={title}
          onError={handleImageError}
        />
      )}
      <StyledCardContent>
        <StyledTitle gutterBottom variant='h5' component='div'>
          {title}
        </StyledTitle>
        <StyledText variant='body2' color='text.secondary'>
          Year: {year}
        </StyledText>
        <StyledSubtitle variant='body2' color='text.secondary'>
          Genre: {genre}
        </StyledSubtitle>
        <Rating name='read-only' value={rating} readOnly />
      </StyledCardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label='show more'
          onClick={handleExpandClick}
          aria-expanded={expanded}
          sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
        >
          {/* <ExpandMoreIcon /> */}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph>Plot:</Typography>
          <Typography paragraph>{plot}</Typography>
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

export default MediaCard;
