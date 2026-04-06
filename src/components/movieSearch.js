import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { tmdbApiKey } from "../config/env.js";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "480px",
    width: "100%",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  labelText: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
  },
  status: {
    fontSize: "0.9rem",
    color: "#f3f4f6",
  },
  error: {
    fontSize: "0.9rem",
    color: "#fee2e2",
  },
  resultsHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  resultsCount: {
    fontSize: "0.8rem",
    color: "#d1d5db",
    textAlign: "center",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  paginationButton: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#f9fafb",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    fontSize: "0.95rem",
    lineHeight: 1,
    transition: "background-color 0.2s ease, opacity 0.2s ease",
  },
  paginationButtonDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  paginationLabel: {
    fontSize: "0.8rem",
    color: "#e5e7eb",
    minWidth: "72px",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    backgroundColor: "#ffffff",
  },
  listItemHover: {
    backgroundColor: "#f9fafb",
    border: "1px solid #d1d5db",
  },
  listItemActive: {
    border: "1px solid #6366f1",
    backgroundColor: "#eef2ff",
  },
  posterImage: {
    width: "48px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "4px",
    backgroundColor: "#e5e7eb",
    flexShrink: 0,
  },
  posterPlaceholder: {
    width: "48px",
    height: "72px",
    borderRadius: "4px",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    color: "#6b7280",
    textAlign: "center",
    padding: "4px",
    flexShrink: 0,
  },
  movieMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },
  movieTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#111827",
  },
  movieInfo: {
    fontSize: "0.8rem",
    color: "#4b5563",
  },
  movieOverview: {
    fontSize: "0.78rem",
    color: "#6b7280",
    lineHeight: 1.35,
  },
};

const mergeStyles = (base, conditionals = []) =>
  Object.assign({}, base, ...conditionals.filter(Boolean));

const buildPosterUrl = (posterPath) =>
  posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;

const formatReleaseYear = (releaseDate) =>
  typeof releaseDate === "string" && releaseDate.length >= 4
    ? releaseDate.slice(0, 4)
    : "Unknown year";

const trimOverview = (overview) => {
  if (!overview) {
    return "No plot summary available.";
  }

  return overview.length > 120 ? `${overview.slice(0, 117)}...` : overview;
};

export const MovieSearch = ({
  onSelectMovie,
  placeholder = "Search by movie title",
  maxResults = 10,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMovieId, setActiveMovieId] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = useMemo(
    () => (Number.isFinite(maxResults) && maxResults > 0 ? maxResults : null),
    [maxResults],
  );

  const canSearch = useMemo(
    () => query.trim().length >= MIN_QUERY_LENGTH,
    [query],
  );

  useEffect(() => {
    if (!canSearch) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      setCurrentPage(0);
      return undefined;
    }

    if (!tmdbApiKey) {
      setResults([]);
      setIsLoading(false);
      setError("TMDB search is not configured. Add VITE_TMDB_API_KEY.");
      setCurrentPage(0);
      return undefined;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          {
            params: {
              api_key: tmdbApiKey,
              query: query.trim(),
            },
          },
        );

        if (!isActive) {
          return;
        }

        const normalizedResults = Array.isArray(response.data?.results)
          ? response.data.results
          : [];
        setResults(normalizedResults);
        setCurrentPage(0);
      } catch (err) {
        if (!isActive) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to search for movies right now.",
        );
        setResults([]);
        setCurrentPage(0);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [query, canSearch]);

  const totalPages = useMemo(() => {
    if (!pageSize) {
      return results.length > 0 ? 1 : 0;
    }

    return Math.ceil(results.length / pageSize);
  }, [pageSize, results.length]);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
      return;
    }

    if (totalPages > 0 && currentPage > totalPages - 1) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const visibleResults = useMemo(() => {
    if (!pageSize) {
      return results;
    }

    const startIndex = currentPage * pageSize;
    return results.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, results]);

  const visibleRangeLabel = useMemo(() => {
    if (results.length === 0) {
      return null;
    }

    if (!pageSize) {
      return `1-${results.length} of ${results.length}`;
    }

    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, results.length);
    return `${startIndex}-${endIndex} of ${results.length}`;
  }, [currentPage, pageSize, results.length]);

  const handleResultClick = async (movie) => {
    if (!movie?.id) {
      setError("No TMDB details are available for this movie.");
      return;
    }

    setActiveMovieId(movie.id);
    setIsFetchingDetails(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}`,
        {
          params: {
            api_key: tmdbApiKey,
            append_to_response: "credits",
          },
        },
      );
      onSelectMovie(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load movie details.",
      );
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const showEmptyState = !isLoading && !error && canSearch && results.length === 0;
  const showPagination = Boolean(pageSize && results.length > pageSize);

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <span style={styles.labelText}>Movie Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          style={mergeStyles(styles.input, [isInputFocused && styles.inputFocus])}
        />
      </label>

      {isLoading && <div style={styles.status}>Searching…</div>}
      {isFetchingDetails && (
        <div style={styles.status}>Fetching movie details…</div>
      )}
      {error && <div style={styles.error}>{error}</div>}
      {showEmptyState && (
        <div style={styles.status}>No movies found. Try another search.</div>
      )}

      {results.length > 0 && (
        <div style={styles.resultsHeader}>
          <div style={styles.resultsCount}>
            {showPagination
              ? `Showing search matches in groups of ${pageSize}.`
              : `${results.length} result${results.length === 1 ? "" : "s"} found.`}
          </div>

          {showPagination && (
            <div style={styles.pagination}>
              <button
                type="button"
                style={mergeStyles(styles.paginationButton, [
                  currentPage === 0 && styles.paginationButtonDisabled,
                ])}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                disabled={currentPage === 0}
                aria-label="Show previous movie results"
              >
                ‹
              </button>
              <div style={styles.paginationLabel}>{visibleRangeLabel}</div>
              <button
                type="button"
                style={mergeStyles(styles.paginationButton, [
                  currentPage >= totalPages - 1 && styles.paginationButtonDisabled,
                ])}
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages - 1))
                }
                disabled={currentPage >= totalPages - 1}
                aria-label="Show more movie results"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      <ul style={styles.list}>
        {visibleResults.map((movie) => {
          const isActiveItem = activeMovieId === movie.id && isFetchingDetails;
          const isHovered = hoveredMovieId === movie.id;
          const year = formatReleaseYear(movie.release_date);
          const posterUrl = buildPosterUrl(movie.poster_path);

          return (
            <li
              key={movie.id}
              style={mergeStyles(styles.listItem, [
                isHovered && styles.listItemHover,
                isActiveItem && styles.listItemActive,
              ])}
              onMouseEnter={() => setHoveredMovieId(movie.id)}
              onMouseLeave={() => setHoveredMovieId(null)}
              onClick={() => handleResultClick(movie)}
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`Poster for ${movie.title}`}
                  style={styles.posterImage}
                  loading="lazy"
                />
              ) : (
                <div style={styles.posterPlaceholder}>No Poster</div>
              )}
              <div style={styles.movieMeta}>
                <div style={styles.movieTitle}>{movie.title}</div>
                <div style={styles.movieInfo}>
                  {year}
                  {movie.vote_average
                    ? ` • TMDB ${movie.vote_average.toFixed(1)}`
                    : ""}
                </div>
                <div style={styles.movieOverview}>
                  {trimOverview(movie.overview)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

MovieSearch.propTypes = {
  onSelectMovie: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxResults: PropTypes.number,
};

export default MovieSearch;
