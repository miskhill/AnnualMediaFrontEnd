import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BookSearch from "../bookSearch.js";

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
    setValue,
    formState: { errors },
  } = useForm();

  const apiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/api"
      : "https://annualmediaserver.onrender.com/api";

  const onSubmit = (book) => {
    axios
      .post(`${apiUrl}/books`, book)
      .then((res) => {
        if (res.status === 201) {
          navigate("/books");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const extractYear = (publishedDate) => {
    if (typeof publishedDate !== "string") {
      return "";
    }
    const match = publishedDate.match(/(\d{4})/);
    return match ? match[1] : "";
  };

  const handleBookSelect = (bookDetails) => {
    if (!bookDetails) {
      return;
    }

    const fieldOptions = { shouldValidate: true, shouldDirty: true };

    console.log("Open Library raw selection", bookDetails);

    setValue("title", bookDetails.title ?? "", fieldOptions);
    setValue("author", bookDetails.authors?.join(", ") ?? "", fieldOptions);
    setValue("plot", bookDetails.description ?? "", fieldOptions);
    setValue("poster", bookDetails.coverUrl ?? "", fieldOptions);
    setValue("pages", bookDetails.pageCount ? String(bookDetails.pageCount) : "", fieldOptions);
    setValue("year", extractYear(bookDetails.publishedDate), fieldOptions);

    // Prefill optional fields when data is available, otherwise reset for manual entry.
    console.log("Open Library autofill", {
      plot: bookDetails.description ?? "",
      genre: bookDetails.subjects?.slice(0, 3) ?? [],
    });
    setValue(
      "genre",
      bookDetails.subjects?.slice(0, 3).join(", ") ?? "",
      fieldOptions,
    );
    setValue("publisher", "", fieldOptions);
    setValue("rating", "", fieldOptions);
  };

  return (
    <>
      <h1>Book Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle}>
        <BookSearch onSelectBook={handleBookSelect} maxResults={5} />

        <input placeholder="Title" {...register("title", { required: true })} />
        {errors.title && <span>The title is required</span>}

        <input placeholder="Year" {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}

        <input placeholder="Author" {...register("author", { required: true })} />
        {errors.author && <span>The author is required</span>}

        <input placeholder="Genre" {...register("genre", { required: true })} />
        {errors.genre && <span>The genre is required</span>}

        <input placeholder="Publisher" {...register("publisher")} />
        {errors.publisher && <span>The publisher is required</span>}

        <input placeholder="Pages" {...register("pages")} />
        {errors.pages && <span>The amount of pages is required</span>}

        <input placeholder="Poster" {...register("poster")} />
        {errors.poster && <span>The poster is required</span>}

        <input placeholder="Rating" {...register("rating")} />
        {errors.rating && <span>The rating is required</span>}

        <input placeholder="Plot" {...register("plot", { required: true })} />
        {errors.plot && <span>The plot is required</span>}

        <input className="submit-button" type="submit" value="Submit" />
      </form>
    </>
  );
};

export default BookUploadCard;
