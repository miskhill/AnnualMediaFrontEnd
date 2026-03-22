import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  CardActions,
  IconButton,
  Collapse,
  SvgIcon,
} from "@mui/material";
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

const PlotIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d='M12 5C6.5 5 2.03 8.11 1 12c1.03 3.89 5.5 7 11 7s9.97-3.11 11-7c-1.03-3.89-5.5-7-11-7Zm0 11.25A4.25 4.25 0 1 1 12 7.75a4.25 4.25 0 0 1 0 8.5Zm0-6.8a2.55 2.55 0 1 0 0 5.1 2.55 2.55 0 0 0 0-5.1Z'
      fill='currentColor'
    />
  </SvgIcon>
);

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
          className="shimmer-wrapper"
          style={{ width: "100%", height: "500px" }}
        ></div>
      ) : (
        <StyledImage
          component="img"
          height="500"
          image={image}
          alt={title}
          onError={handleImageError}
        />
      )}
      <StyledCardContent>
        <StyledTitle gutterBottom variant="h5" component="div">
          {title}
        </StyledTitle>
        <StyledText variant="body2" color="text.secondary">
          Year: {year}
        </StyledText>
        <StyledSubtitle variant="body2" color="text.secondary">
          Genre: {genre}
        </StyledSubtitle>
        <Rating name="read-only" value={rating} readOnly />
      </StyledCardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label={expanded ? "hide plot" : "show plot"}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          sx={{
            marginLeft: "auto",
            color: "#e50914",
            transform: expanded ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
        >
          <PlotIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Plot:</Typography>
          <Typography paragraph>{plot}</Typography>
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

export default MediaCard;
