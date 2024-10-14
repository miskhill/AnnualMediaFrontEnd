import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const BookUploadCard = () => {
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

  const onSubmit = (book) => {
    axios
      .post("https://annualmediaserver.onrender.com/api/books", book)
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          navigate("/books");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1>Book Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle}>
        <input placeholder='Title' {...register("title", { required: true })} />
        {errors.title && <span>The title is required</span>}
        <input placeholder='Year' {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}
        <input
          placeholder='Author'
          {...register("author", { required: true })}
        />
        {errors.author && <span>The author is required</span>}
        <input placeholder='Genre' {...register("genre", { required: true })} />
        {errors.genre && <span>The genre is required</span>}
        <input placeholder='Publisher' {...register("publisher")} />
        {errors.publisher && <span>The publisher is required</span>}
        <input placeholder='Pages' {...register("pages")} />
        {errors.pages && <span>The amount of pages is required</span>}
        <input placeholder='Poster' {...register("poster")} />
        {errors.poster && <span>The poster is required</span>}
        <input placeholder='Rating' {...register("rating")} />
        {errors.rating && <span>The plot is required</span>}
        <input placeholder='Plot' {...register("plot", { required: true })} />
        {errors.rating && <span>The rating is required</span>}
        <input className='submit-button' type='submit' value='Submit' />{" "}
      </form>
    </>
  );
};

export default BookUploadCard;
