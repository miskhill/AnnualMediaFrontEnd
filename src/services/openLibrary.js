const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_ISBN_URL = 'https://openlibrary.org/isbn/';
const OPEN_LIBRARY_AUTHOR_URL = 'https://openlibrary.org';
const OPEN_LIBRARY_COVER_URL = 'https://covers.openlibrary.org/b/isbn/';
const OPEN_LIBRARY_WORK_URL = 'https://openlibrary.org';
const DEFAULT_LIMIT = 10;
const DEFAULT_DEBOUNCE = 300;

/**
 * @typedef {Object} SearchBook
 * @property {string} title
 * @property {string[]} authors
 * @property {number|null} firstPublishedYear
 * @property {string|null} isbn13
 * @property {string|null} coverUrl
 */

/**
 * @typedef {Object} BookDetails
 * @property {string} title
 * @property {string[]} authors
 * @property {string|null} description
 * @property {string[]|null} subjects
 * @property {string|null} publishedDate
 * @property {number|null} pageCount
 * @property {string|null} isbn13
 * @property {string|null} coverUrl
 */

const buildCoverUrl = (isbn) => (isbn ? `${OPEN_LIBRARY_COVER_URL}${encodeURIComponent(isbn)}-L.jpg` : null);

const extractIsbn13 = (doc) => {
  if (!Array.isArray(doc?.isbn) || doc.isbn.length === 0) {
    return null;
  }

  const isbn13 = doc.isbn.find((code) => typeof code === 'string' && code.length === 13);
  if (isbn13) {
    return isbn13;
  }

  const fallback = doc.isbn.find((code) => typeof code === 'string' && code.trim().length > 0);
  return fallback ?? null;
};

const parseDescription = (rawDescription) => {
  if (!rawDescription) {
    return null;
  }

  if (typeof rawDescription === 'string') {
    return rawDescription;
  }

  if (typeof rawDescription === 'object' && typeof rawDescription.value === 'string') {
    return rawDescription.value;
  }

  return null;
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
};

const mergeUnique = (primary, secondary) => {
  const seen = new Set();
  const merged = [];

  [...primary, ...secondary].forEach((item) => {
    if (!seen.has(item)) {
      seen.add(item);
      merged.push(item);
    }
  });

  return merged;
};

const fetchWorkDetails = async (worksRef) => {
  if (!Array.isArray(worksRef) || worksRef.length === 0) {
    return { description: null, subjects: [] };
  }

  const workKey = worksRef
    .map((work) => (typeof work === 'string' ? work : work?.key))
    .find((key) => typeof key === 'string' && key.trim().length > 0);

  if (!workKey) {
    return { description: null, subjects: [] };
  }

  try {
    const response = await fetch(`${OPEN_LIBRARY_WORK_URL}${workKey}.json`);
    if (!response.ok) {
      return { description: null, subjects: [] };
    }

    const workData = await response.json();
    const workSubjects = normalizeStringArray(workData?.subjects);
    const workGenres = normalizeStringArray(workData?.genres);
    const subjectPeople = normalizeStringArray(workData?.subject_people);
    const subjectPlaces = normalizeStringArray(workData?.subject_places);
    const subjectTimes = normalizeStringArray(workData?.subject_times);

    return {
      description: parseDescription(workData?.description),
      subjects: mergeUnique(workSubjects, [...workGenres, ...subjectPeople, ...subjectPlaces, ...subjectTimes]),
    };
  } catch (error) {
    return { description: null, subjects: [] };
  }
};

const fetchAuthorNames = async (authorRefs) => {
  if (!Array.isArray(authorRefs) || authorRefs.length === 0) {
    return [];
  }

  const authorPromises = authorRefs.map(async (author) => {
    const key = typeof author === 'string' ? author : author?.key;
    if (!key) {
      return null;
    }

    try {
      const response = await fetch(`${OPEN_LIBRARY_AUTHOR_URL}${key}.json`);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return typeof data?.name === 'string' ? data.name : null;
    } catch (error) {
      return null;
    }
  });

  const results = await Promise.all(authorPromises);
  return results.filter((name) => typeof name === 'string' && name.trim().length > 0);
};

/**
 * Searches Open Library titles by query.
 * @param {string} query
 * @returns {Promise<SearchBook[]>}
 */
export const searchBooks = async (query) => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    limit: String(DEFAULT_LIMIT),
    fields: ['title', 'author_name', 'first_publish_year', 'isbn'].join(','),
  });

  const requestUrl = `${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`;

  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error('Unable to fetch search results from Open Library.');
  }

  const data = await response.json();
  const docs = Array.isArray(data?.docs) ? data.docs : [];

  return docs.map((doc) => {
    const isbn13 = extractIsbn13(doc);
    return {
      title: typeof doc?.title === 'string' ? doc.title : 'Untitled',
      authors: Array.isArray(doc?.author_name) ? doc.author_name : [],
      firstPublishedYear: typeof doc?.first_publish_year === 'number' ? doc.first_publish_year : null,
      isbn13,
      coverUrl: buildCoverUrl(isbn13),
    };
  });
};

/**
 * Retrieves detailed book information by ISBN.
 * @param {string} isbn
 * @returns {Promise<BookDetails>}
 */
export const getBookByISBN = async (isbn) => {
  const trimmedIsbn = isbn?.trim();
  if (!trimmedIsbn) {
    throw new Error('An ISBN is required to fetch book details.');
  }

  const response = await fetch(`${OPEN_LIBRARY_ISBN_URL}${encodeURIComponent(trimmedIsbn)}.json`);
  if (!response.ok) {
    throw new Error('Unable to fetch book details from Open Library.');
  }

  const data = await response.json();

  const authors = await fetchAuthorNames(data?.authors);
  const isbn13 = Array.isArray(data?.isbn_13) && data.isbn_13.length > 0
    ? data.isbn_13[0]
    : Array.isArray(data?.isbn_10) && data.isbn_10.length > 0
      ? data.isbn_10[0]
      : trimmedIsbn;

  const editionSubjects = normalizeStringArray(data?.subjects);
  const workDetails = await fetchWorkDetails(data?.works);
  const description = parseDescription(data?.description)
    ?? parseDescription(data?.notes)
    ?? workDetails.description;
  const subjects = editionSubjects.length > 0
    ? editionSubjects
    : workDetails.subjects;

  return {
    title: typeof data?.title === 'string' ? data.title : 'Untitled',
    authors,
    description,
    publishedDate: typeof data?.publish_date === 'string' ? data.publish_date : null,
    pageCount: typeof data?.number_of_pages === 'number' ? data.number_of_pages : null,
    isbn13,
    coverUrl: buildCoverUrl(isbn13),
    subjects: subjects.length > 0 ? subjects : null,
  };
};

export const debounceDelay = DEFAULT_DEBOUNCE;
