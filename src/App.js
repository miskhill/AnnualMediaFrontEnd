import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home.js";
import Movies from "./components/movies.js";
import Books from "./components/books.js";
import Series from "./components/series.js";
import PageNotFound from "./components/pageNotFound.js";
import NavBar from "./components/navbar.js";
import Login from "./components/auth/Login.js";
import ProtectedRoute from "./components/auth/ProtectedRoute.js";
import { useAuth } from "./context/AuthContext.js";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/books' element={<Books />} />
          <Route path='/series' element={<Series />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
