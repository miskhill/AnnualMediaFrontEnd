import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { searchBooks, getBookByISBN, debounceDelay } from '../services/openLibrary.js';

const MIN_QUERY_LENGTH = 2;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '480px',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  labelText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  inputFocus: {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
  },
  status: {
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  error: {
    fontSize: '0.9rem',
    color: '#dc2626',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    backgroundColor: '#ffffff',
  },
  listItemHover: {
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
  },
  listItemActive: {
    border: '1px solid #6366f1',
    backgroundColor: '#eef2ff',
  },
  coverImage: {
    width: '40px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    backgroundColor: '#e5e7eb',
  },
  coverPlaceholder: {
    width: '40px',
    height: '60px',
    borderRadius: '4px',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: '#6b7280',
    textAlign: 'center',
    padding: '4px',
  },
  bookMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  bookTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#111827',
  },
  bookAuthors: {
    fontSize: '0.8rem',
    color: '#4b5563',
  },
};

const mergeStyles = (base, conditionals = []) => Object.assign({}, base, ...conditionals.filter(Boolean));

export const BookSearch = ({
  onSelectBook,
  placeholder = 'Search by title, author, or ISBN',
  maxResults = 10,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIsbn, setActiveIsbn] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hoveredIsbn, setHoveredIsbn] = useState(null);

  const canSearch = useMemo(() => query.trim().length >= MIN_QUERY_LENGTH, [query]);

  useEffect(() => {
    if (!canSearch) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchBooks(query);
        if (!isActive) {
          return;
        }
        const normalizedResults = Array.isArray(searchResults) ? searchResults : [];
        const limitedResults = Number.isFinite(maxResults) && maxResults > 0
          ? normalizedResults.slice(0, maxResults)
          : normalizedResults;
        setResults(limitedResults);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to search for books right now.');
        setResults([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, debounceDelay);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [query, canSearch, debounceDelay, maxResults]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleResultClick = async (book) => {
    if (!book?.isbn13) {
      setError('No ISBN details available for this title.');
      return;
    }

    setActiveIsbn(book.isbn13);
    setIsFetchingDetails(true);
    setError(null);

    try {
      const bookDetails = await getBookByISBN(book.isbn13);
      onSelectBook(bookDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load book details.');
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const showEmptyState = !isLoading && !error && canSearch && results.length === 0;

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <span style={styles.labelText}>Book Search</span>
        <input
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          style={mergeStyles(styles.input, [isInputFocused && styles.inputFocus])}
        />
      </label>

      {isLoading && <div style={styles.status}>Searching…</div>}
      {isFetchingDetails && <div style={styles.status}>Fetching book details…</div>}
      {error && <div style={styles.error}>{error}</div>}
      {showEmptyState && <div style={styles.status}>No books found. Try another search.</div>}

      <ul style={styles.list}>
        {results.map((book) => {
          const isActiveItem = activeIsbn === book.isbn13 && isFetchingDetails;
          const isHovered = hoveredIsbn === book.isbn13;
          return (
            <li
              key={`${book.isbn13 ?? book.title}`}
              style={mergeStyles(styles.listItem, [isHovered && styles.listItemHover, isActiveItem && styles.listItemActive])}
              onMouseEnter={() => setHoveredIsbn(book.isbn13)}
              onMouseLeave={() => setHoveredIsbn(null)}
              onClick={() => handleResultClick(book)}
            >
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={`Cover art for ${book.title}`}
                  style={styles.coverImage}
                  loading="lazy"
                />
              ) : (
                <div style={styles.coverPlaceholder}>No Cover</div>
              )}
              <div style={styles.bookMeta}>
                <div style={styles.bookTitle}>{book.title}</div>
                <div style={styles.bookAuthors}>
                  {book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author'}
                </div>
                {book.firstPublishedYear && (
                  <div style={styles.bookAuthors}>First published {book.firstPublishedYear}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

BookSearch.propTypes = {
  onSelectBook: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxResults: PropTypes.number,
};

export default BookSearch;
