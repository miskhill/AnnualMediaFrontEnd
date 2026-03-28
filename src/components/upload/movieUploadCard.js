import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MovieSearch from "../movieSearch.js";
import { apiUrl } from "../../config/env.js";

const MovieUploadCard = () => {
  const mystyle = {
    color: "white",
    backgroundColor: "#e50914",
    padding: "10px",
    fontFamily: "Arial",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (movie) => {
    axios
      .post(`${apiUrl}/movies`, movie)
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          navigate("/movies");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectMovie = (movieDetails) => {
    if (!movieDetails) {
      return;
    }

    const fieldOptions = { shouldValidate: true, shouldDirty: true };
    const director = movieDetails.credits?.crew
      ?.filter((person) => person.job === "Director")
      .map((person) => person.name)
      .join(", ");
    const actors = movieDetails.credits?.cast
      ?.slice(0, 3)
      .map((actor) => actor.name)
      .join(", ");

    setValue("title", movieDetails.title ?? "", fieldOptions);
    setValue(
      "year",
      movieDetails.release_date?.split("-")[0] ?? "",
      fieldOptions,
    );
    setValue(
      "genre",
      movieDetails.genres?.map((genre) => genre.name).join(", ") ?? "",
      fieldOptions,
    );
    setValue(
      "director",
      director ?? "",
      fieldOptions,
    );
    setValue(
      "poster",
      movieDetails.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
        : "",
      fieldOptions,
    );
    setValue("actors", actors ?? "", fieldOptions);
    setValue("plot", movieDetails.overview ?? "", fieldOptions);
    setValue(
      "rating",
      movieDetails.vote_average
        ? Math.round(movieDetails.vote_average).toString()
        : "",
      fieldOptions,
    );
  };

  return (
    <>
      <h1>Movie Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle}>
        <MovieSearch onSelectMovie={handleSelectMovie} maxResults={5} />
        <input placeholder="Title" {...register("title", { required: true })} />
        {errors.title && <span>The title is required</span>}

        <input placeholder="Year" {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}

        <input placeholder="Genre" {...register("genre", { required: true })} />
        {errors.genre && <span>The genre is required</span>}

        <input
          placeholder="Director"
          {...register("director", { required: true })}
        />
        {errors.director && <span>The director is required</span>}

        <input
          placeholder="Poster"
          {...register("poster", { required: true, maxLength: 100 })}
        />
        {errors.poster && <span>The poster is required</span>}

        <input
          placeholder="Actors"
          {...register("actors", { required: true })}
        />
        {errors.actors && <span>The actors are required</span>}

        <input placeholder="Plot" {...register("plot", { required: true })} />
        {errors.plot && <span>The plot is required</span>}

        <input placeholder="Rating" {...register("rating")} />
        {errors.rating && <span>The rating is required</span>}

        <input className="submit-button" type="submit" value="Submit" />
      </form>
    </>
  );
};

export default MovieUploadCard;
