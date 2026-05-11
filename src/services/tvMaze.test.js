import { afterEach, describe, expect, it, vi } from "vitest";
import { getSeriesById, searchSeries } from "./tvMaze.js";

describe("tvMaze service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes search results and strips HTML summaries", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          show: {
            id: 123,
            name: "Lost",
            premiered: "2004-09-22",
            genres: ["Drama", "Adventure"],
            summary: "<p>Plane <strong>crash</strong> mystery</p>",
            rating: { average: 8.2 },
            image: {
              medium: "https://static.tvmaze.com/lost-medium.jpg",
            },
          },
        },
      ],
    });

    await expect(searchSeries("lost")).resolves.toEqual([
      {
        id: 123,
        title: "Lost",
        premiered: "2004-09-22",
        year: "2004",
        genres: ["Drama", "Adventure"],
        summary: "Plane crash mystery",
        ratingAverage: 8.2,
        posterUrl: "https://static.tvmaze.com/lost-medium.jpg",
        thumbnailUrl: "https://static.tvmaze.com/lost-medium.jpg",
      },
    ]);
  });

  it("loads series details and returns normalized cast members", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
        name: "Lost",
        premiered: "2004-09-22",
        genres: ["Drama", "Adventure", "Supernatural"],
        summary:
          "<p>Plane <strong>crash</strong> mystery with survivors on an island.</p>",
        rating: { average: 8.2 },
        image: {
          medium: "https://static.tvmaze.com/lost-medium.jpg",
          original: "https://static.tvmaze.com/lost-original.jpg",
        },
        _embedded: {
          cast: [
            { person: { name: "Matthew Fox" } },
            { person: { name: "Evangeline Lilly" } },
            { person: { name: "Josh Holloway" } },
          ],
        },
      }),
    });

    await expect(getSeriesById(123)).resolves.toEqual({
      id: 123,
      title: "Lost",
      premiered: "2004-09-22",
      year: "2004",
      genres: ["Drama", "Adventure", "Supernatural"],
      summary: "Plane crash mystery with survivors on an island.",
      ratingAverage: 8.2,
      posterUrl: "https://static.tvmaze.com/lost-original.jpg",
      thumbnailUrl: "https://static.tvmaze.com/lost-medium.jpg",
      actors: ["Matthew Fox", "Evangeline Lilly", "Josh Holloway"],
    });
  });
});
