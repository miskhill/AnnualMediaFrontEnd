import React from "react";
import axios from "axios";
import { Toaster, toast } from 'sonner'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
    formState: { errors },
  } = useForm();
  console.log(errors)
  const onSubmit = (series) => {
    axios
      .post("https://annualmediaserver.onrender.com/api/series", series)
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

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <h1>Series Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle} >
        <input placeholder='Title' {...register("title", { required: true })} />
        {errors.title && <span>The title is required</span>}

        <input placeholder='Year' {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}

        <input
          placeholder='Director'
          {...register("director", { required: true })}
        />
        {errors.director && <span>The director is required</span>}

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

        <input className='submit-button' type='submit' value='Submit' onClick={()=> toast.error('error') } />
      </form>
    </>
  );
};

export default SeriesUploadCard;
