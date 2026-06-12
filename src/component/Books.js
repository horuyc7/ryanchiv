import { useEffect, useState } from "react";
import "../css/Books.css";
import BlurImage from "./BlurImage";

// Detect JP char
const hasJapaneseChars = (text = "") =>
  /[\u3040-\u30ff\u4e00-\u9faf]/.test(text);

// Prioritize JP title
const getDisplayTitle = (book) => {
  const editions = book.editions || [];

  const jpEdition = editions.find(
    (e) => e.language?.language === "Japanese"
  );

  if (hasJapaneseChars(book.title)) {
    return book.title;
  }

  if (jpEdition?.title) {
    return jpEdition.title;
  }

  return book.title;
};

// Shorten long descriptions
const formatDescription = (text, expanded) => {
  if (!text) return "";

  const words = text.split(" ");

  if (expanded || words.length <= 50) {
    return text;
  }

  return `${words.slice(0, 50).join(" ")}...`;
};

// Render half-star
const HalfStar = () => (
  <span style={{ position: "relative" }}>
    <span
      style={{
        position: "absolute",
        width: "50%",
        overflow: "hidden",
      }}
    >
      ★
    </span>

    <span style={{ opacity: 0.3 }}>★</span>
  </span>
);

// Convert rating to stars
const renderStars = (rating = 0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {hasHalfStar && <HalfStar />}
      {"☆".repeat(emptyStars)}
    </>
  );
};

export default function Books() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("recent");
  const [expandedDesc, setExpandedDesc] = useState(false);

  // Reload when sort changes
  useEffect(() => {
    loadBooks(0, true);
  }, [sort]);

  /* --------------------------------------------------
   * Fetch books
   * reset=true replaces list
   * reset=false appends next page
   * -------------------------------------------------- */
  const loadBooks = async (
    pageToLoad = 0,
    reset = false
  ) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/hardcover?page=${pageToLoad}&sort=${sort}`
      );

      const result = await res.json();

      const newBooks =
        result?.data?.user_books || result || [];

      setBooks((prev) =>
        reset
          ? newBooks
          : [...(Array.isArray(prev) ? prev : []), ...newBooks]
      );

      setPage(pageToLoad + 1);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };

  const openBook = (entry) => {
    setSelectedBook(entry);
    setExpandedDesc(false);
  };

  return (
  <div className="books">
    
    {/* Header Section */}
    <div className="books__header">
      <h1 className="books__title">Books</h1>

      <select
        className="books__sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="recent">Recently Read</option>
        <option value="rating">Highest Rated</option>
        <option value="current">Currently Reading</option>
      </select>
    </div>

    {/* Grid */}
    <div className="books__grid">
      {books.map((entry) => {
        const book = entry.book;
        const displayTitle = getDisplayTitle(book);

        return (
          <button
            key={book.id}
            className="book-card"
            onClick={() => openBook(entry)}
          >
            <div className="book-card__cover">
              <BlurImage
                src={book.image?.url}
                alt={book.title}
              />
            </div>

            <div className="book-card__info">
              <div className="book-card__title">
                {displayTitle}
              </div>

              <div className="book-card__rating">
                {renderStars(entry.rating)}
              </div>
            </div>
          </button>
        );
      })}
    </div>

    {/* Load more */}
    <div className="books__load-more">
      <button
        onClick={() => loadBooks(page)}
        disabled={loading}
        className="books__button"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>

    {/* Modal */}
    {selectedBook && (
      <div
        className="book-modal"
        onClick={() => setSelectedBook(null)}
      >
        <div
          className="book-modal__container"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            className="book-modal__image"
            src={
              selectedBook.book.image?.url ||
              "/placeholder-book.jpg"
            }
            alt={selectedBook.book.title}
          />

          <div className="book-modal__content">
            <h2 className="book-modal__title">
              {selectedBook.book.title}
            </h2>

            <div className="book-modal__author">
              Author:{" "}
              {
                selectedBook.book
                  .cached_contributors?.[0]
                  ?.author?.name
              }
            </div>

            <div className="book-modal__rating">
              ⭐{" "}
              {selectedBook.book.rating?.toFixed(1) || "N/A"}

              <span className="book-modal__rating-count">
                ({selectedBook.book.ratings_count || 0})
              </span>
            </div>

            <div className="book-modal__pages">
              Pages: {selectedBook.book.pages || "N/A"}
            </div>

            <p
              className="book-modal__description"
              onClick={() =>
                setExpandedDesc((prev) => !prev)
              }
            >
              {formatDescription(
                selectedBook.book.description,
                expandedDesc
              )}

              {selectedBook.book.description?.split(" ").length > 50 && (
                <span className="book-modal__read-more">
                  {expandedDesc ? " Show less" : " Read more"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);
}