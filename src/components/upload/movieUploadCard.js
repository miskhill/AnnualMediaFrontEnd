import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`LOL Variable: ${process.env.REACT_APP_LOL}`);
    console.log(process.env, "process.env")
    console.log(
      `TMDB API Key FRONTEND (first 5 characters): ${process.env.REACT_APP_TMDB_API_KEY?.substring(
        0,
        5
      )}`
    );

    if (searchTerm.length > 2) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${searchTerm}`
      );
      setSearchResults(response.data.results);
    }
  };

  const handleSelectMovie = async (movieId) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
    );
    const movie = response.data;
    console.log(movie);
    //const director = movie.credits.crew.find((person) => person.job === "Director").name;
    const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    // const actors = movie.credits.cast.slice(0, 3).map((actor) => actor.name).join(", ");
    const plot = movie.overview;
    const rating = movie.vote_average.toString();

    //console.log('Director:', director);
    console.log("Poster:", poster);
    //console.log('Actors:', actors);
    console.log("Plot:", plot);
    console.log("Rating:", rating);

    // Autofill the form fields
    setValue("title", movie.title);
    setValue("year", movie.release_date.split("-")[0]);
    setValue("genre", movie.genres.map((genre) => genre.name).join(", "));
    setValue("poster", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    setValue("plot", movie.overview);
    setValue("rating", movie.vote_average.toString());
  };

  return (
    <>
      <h1>Movie Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={mystyle}>
        {/* register your input into the hook by invoking the "register" function */}
        {/* include validation with required or other standard HTML validation rules */}
        <input placeholder='Search Movie' onChange={handleSearch} />
        {searchResults.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleSelectMovie(movie.id)}
            style={{
              cursor: "pointer",
              backgroundColor: "#f8f9fa",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "5px",
              fontSize: "0.8rem",
              color: "#333",
            }}
          >
            {movie.title}
          </div>
        ))}
        <input placeholder='Title' {...register("title", { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.title && <span>The title is required</span>}

        <input placeholder='Year' {...register("year", { required: true })} />
        {errors.year && <span>The year is required</span>}

        <input placeholder='Genre' {...register("genre", { required: true })} />
        {errors.genre && <span>The genre is required</span>}

        <input
          placeholder='Director'
          {...register("director", { required: true })}
        />
        {errors.director && <span>The director is required</span>}

        <input
          placeholder='Poster'
          {...register("poster", { required: true, maxLength: 100 })}
        />
        {errors.poster && <span>The poster is required</span>}

        <input
          placeholder='Actors'
          {...register("actors", { required: true })}
        />
        {errors.actors && <span>The actors are required</span>}

        <input placeholder='Plot' {...register("plot", { required: true })} />
        {errors.plot && <span>The plot is required</span>}

        <input placeholder='Rating' {...register("rating")} />
        {errors.rating && <span>The rating is required</span>}

        <input className='submit-button' type='submit' value='Submit' />
      </form>
    </>
  );
};

export default MovieUploadCard;