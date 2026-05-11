const TV_MAZE_API_BASE_URL = "https://api.tvmaze.com";
const DEFAULT_DEBOUNCE = 300;

const getPremieredYear = (premiered) =>
  typeof premiered === "string" && premiered.length >= 4
    ? premiered.slice(0, 4)
    : null;

const stripHtmlTags = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "";
  }

  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(value, "text/html");
    return parsed.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
  }

  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const normalizeShow = (show) => ({
  id: typeof show?.id === "number" ? show.id : null,
  title: typeof show?.name === "string" ? show.name : "Untitled",
  premiered: typeof show?.premiered === "string" ? show.premiered : null,
  year: getPremieredYear(show?.premiered),
  genres: Array.isArray(show?.genres)
    ? show.genres.filter(
        (genre) => typeof genre === "string" && genre.trim().length > 0,
      )
    : [],
  summary: stripHtmlTags(show?.summary),
  ratingAverage:
    typeof show?.rating?.average === "number" ? show.rating.average : null,
  posterUrl: show?.image?.original ?? show?.image?.medium ?? null,
  thumbnailUrl: show?.image?.medium ?? show?.image?.original ?? null,
});

const normalizeCast = (cast) => {
  if (!Array.isArray(cast)) {
    return [];
  }

  return cast
    .map((entry) => entry?.person?.name)
    .filter((name) => typeof name === "string" && name.trim().length > 0);
};

export const searchSeries = async (query) => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({ q: trimmedQuery });
  const response = await fetch(
    `${TV_MAZE_API_BASE_URL}/search/shows?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to search for series right now.");
  }

  const data = await response.json();
  const results = Array.isArray(data) ? data : [];

  return results
    .map((result) => normalizeShow(result?.show))
    .filter((show) => Number.isFinite(show.id));
};

export const getSeriesById = async (showId) => {
  if (!Number.isFinite(showId)) {
    throw new Error("A TVMaze show id is required.");
  }

  const params = new URLSearchParams({ embed: "cast" });
  const response = await fetch(
    `${TV_MAZE_API_BASE_URL}/shows/${showId}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load series details.");
  }

  const data = await response.json();

  return {
    ...normalizeShow(data),
    actors: normalizeCast(data?._embedded?.cast),
  };
};

export const debounceDelay = DEFAULT_DEBOUNCE;
