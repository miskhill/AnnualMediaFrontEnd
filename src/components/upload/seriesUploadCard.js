import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SeriesSearch from "../seriesSearch.js";
import { apiUrl } from "../../config/env.js";

const SeriesUploadCard = () => {
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

  const onSubmit = (series) => {
    axios
      .post(`${apiUrl}/series`, series)
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          navigate("/series");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectSeries = (seriesDetails) => {
    if (!seriesDetails) {
      return;
    }

    const fieldOptions = { shouldValidate: true, shouldDirty: true };

    setValue("title", seriesDetails.title ?? "", fieldOptions);
    setValue("year", seriesDetails.year ?? "", fieldOptions);
    setValue("genre", seriesDetails.genres?.join(", ") ?? "", fieldOptions);
    setValue(
      "actors",
      seriesDetails.actors?.slice(0, 3).join(", ") ?? "",
      fieldOptions,
    );
    setValue("poster", seriesDetails.posterUrl ?? "", fieldOptions);
    setValue("plot", seriesDetails.summary ?? "", fieldOptions);
    setValue(
      "rating",
      seriesDetails.ratingAverage
        ? Math.round(seriesDetails.ratingAverage).toString()
        : "",
      fieldOptions,
    );
  };

  return (
    <>
      <h1>Series Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle}>
        <SeriesSearch onSelectSeries={handleSelectSeries} maxResults={5} />

        <input placeholder='Title' {...register("title", { required: true })} />
        {errors.title && <span>The title is required</span>}

        <input placeholder='Year' {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}

        <input placeholder='Genre' {...register("genre", { required: true })} />
        {errors.genre && <span>The genre is required</span>}

        <input
          placeholder='Actors'
          {...register("actors", { required: true })}
        />
        {errors.actors && <span>The actors are required</span>}

        <input
          placeholder='Poster'
          {...register("poster", { required: true, maxLength: 100 })}
        />
        {errors.poster && <span>{`Poster is ${errors.poster.type}`}</span>}

        <input placeholder='Plot' {...register("plot", { required: true })} />
        {errors.plot && <span>The plot is required</span>}

        <input placeholder='Rating' {...register('rating')} />
        {errors.rating && <span>The rating is required</span>}

        <input className='submit-button' type='submit' value='Submit' />
      </form>
    </>
  );
};

export default SeriesUploadCard;
