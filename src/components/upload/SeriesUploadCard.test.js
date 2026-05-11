import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import SeriesUploadCard from "./seriesUploadCard.js";
import { apiUrl } from "../../config/env.js";
import {
  getSeriesById,
  searchSeries,
} from "../../services/tvMaze.js";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../../services/tvMaze.js", () => ({
  searchSeries: vi.fn(),
  getSeriesById: vi.fn(),
  debounceDelay: 0,
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderSeriesUploadCard = () =>
  render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <SeriesUploadCard />
    </MemoryRouter>,
  );

describe("SeriesUploadCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.post.mockResolvedValue({ status: 201, data: { id: "series-123" } });
  });

  it("does not search before the minimum query length", () => {
    renderSeriesUploadCard();

    fireEvent.change(screen.getByPlaceholderText(/search by series title/i), {
      target: { value: "L" },
    });

    expect(searchSeries).not.toHaveBeenCalled();
  });

  it("autofills series fields and submits without a director field", async () => {
    searchSeries.mockResolvedValue([
      {
        id: 123,
        title: "Lost",
        premiered: "2004-09-22",
        summary: "Plane crash mystery",
        ratingAverage: 8.2,
        thumbnailUrl: "https://static.tvmaze.com/lost-medium.jpg",
      },
    ]);

    getSeriesById.mockResolvedValue({
      id: 123,
      title: "Lost",
      year: "2004",
      genres: ["Drama", "Adventure", "Supernatural"],
      actors: ["Matthew Fox", "Evangeline Lilly", "Josh Holloway", "Terry O'Quinn"],
      posterUrl: "https://static.tvmaze.com/lost-original.jpg",
      summary: "Plane crash mystery with survivors on an island.",
      ratingAverage: 8.2,
    });

    renderSeriesUploadCard();

    fireEvent.change(screen.getByPlaceholderText(/search by series title/i), {
      target: { value: "Lo" },
    });

    expect(await screen.findByText("Lost")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Lost"));

    await waitFor(() => {
      expect(getSeriesById).toHaveBeenCalledWith(123);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Title")).toHaveValue("Lost");
      expect(screen.getByPlaceholderText("Year")).toHaveValue("2004");
      expect(screen.getByPlaceholderText("Genre")).toHaveValue(
        "Drama, Adventure, Supernatural",
      );
      expect(screen.getByPlaceholderText("Actors")).toHaveValue(
        "Matthew Fox, Evangeline Lilly, Josh Holloway",
      );
      expect(screen.getByPlaceholderText("Poster")).toHaveValue(
        "https://static.tvmaze.com/lost-original.jpg",
      );
      expect(screen.getByPlaceholderText("Plot")).toHaveValue(
        "Plane crash mystery with survivors on an island.",
      );
      expect(screen.getByPlaceholderText("Rating")).toHaveValue("8");
    });

    expect(screen.queryByPlaceholderText("Director")).not.toBeInTheDocument();

    fireEvent.click(screen.getByDisplayValue("Submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/series`, {
        title: "Lost",
        year: "2004",
        genre: "Drama, Adventure, Supernatural",
        actors: "Matthew Fox, Evangeline Lilly, Josh Holloway",
        poster: "https://static.tvmaze.com/lost-original.jpg",
        plot: "Plane crash mystery with survivors on an island.",
        rating: "8",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/series");
  });
});
