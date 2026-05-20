import { useEffect, useState } from "react";
import "../css/Books.css";
import BlurImage from "./BlurImage";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [expandedDesc, setExpandedDesc] = useState(false);

  const formatDescription = (text, expanded) => {
    if (!text) return "";

    const words = text.split(" ");

    if (expanded || words.length <= 50) {
        return text;
    }

    return words.slice(0, 50).join(" ") + "...";
  };

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

  const HalfStar = () => (
    <span style={{ position: "relative" }}>
      <span style={{ position: "absolute", width: "50%", overflow: "hidden" }}>
        ★
      </span>
      <span style={{ opacity: 0.3 }}>★</span>
    </span>
  );
    

  useEffect(() => {
    loadBooks(0, true);
  }, [sort]);

  const loadBooks = async (pageToLoad = 0, reset = false) => {
  if (loading) return;

  setLoading(true);

  try {
    const res = await fetch(
      `/api/hardcover?page=${pageToLoad}&sort=${sort}`
    );

    const result = await res.json();

    const newBooks =
      result?.data?.user_books || result || [];

    setBooks((prev) => {
      const prevArr = Array.isArray(prev) ? prev : [];

      return reset ? newBooks : [...prevArr, ...newBooks];
    });

    setPage(pageToLoad + 1);
  } catch (e) {
    console.error(e);
  }

  setLoading(false);
};

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Books</h1>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Recently Read</option>
          <option value="rating">Highest Rated</option>
        </select>
        
      </div>

      <div className="books-grid">
        {books.map((entry) => {
          const book = entry.book;

          const getDisplayTitle = (book) => {
            const editions = book.editions || [];

            const jpEdition = editions.find(
                (e) => e.language?.language === "Japanese"
            );

            const hasJapaneseChars = (text = "") =>
                /[\u3040-\u30ff\u4e00-\u9faf]/.test(text);

            // already JP title
            if (hasJapaneseChars(book.title)) {
                return book.title;
            }

            // if JP edition exists, use JP title
            if (jpEdition?.title) {
                return jpEdition.title;
            }

            // otherwise English/default
            return book.title;
            };

          const displayTitle = getDisplayTitle(book);

          return (
            <button
              key={book.id}
              className="book-card"
              onClick={() => setSelectedBook(entry)}
            >
                
    
                <div className="cover">
                    <BlurImage
                        src={book.image?.url}
                        alt={book.title}
                    />
                </div>

              <div className="book-info">
                <div className="jp-title">
                {displayTitle}
                </div>

                <div className="rating">
                    {renderStars(entry.rating)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="load-more-wrapper">
        <button
          onClick={() => loadBooks(page)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>

      {selectedBook && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="book-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedBook.book.image?.url ||
                "/placeholder-book.jpg"
              }
              alt={selectedBook.book.title}
            />

            <div className="modal-content">
              <h2>{selectedBook.book.title}</h2>

              <div>
                Author:{" "}
                {
                  selectedBook.book
                    .cached_contributors?.[0]
                    ?.author?.name
                }
              </div>

              <div className="rating">
                ⭐ {selectedBook.book.rating?.toFixed(1) || "N/A"}
                <span className="rating-count">
                 ({selectedBook.book.ratings_count || 0})
                </span>
              </div>

              <div>
                Pages: {selectedBook.book.pages || "N/A"}
              </div>

              <p
                className="description"
                onClick={() => setExpandedDesc((prev) => !prev)}
                style={{ cursor: "pointer" }}
                >
                {formatDescription(selectedBook.book.description, expandedDesc)}

                {selectedBook.book.description?.split(" ").length > 50 && (
                    <span className="read-more">
                    {" "}
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