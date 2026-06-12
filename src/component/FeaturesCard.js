import "../css/FeaturesCard.css";

const FEATURES = [
  {
    text: "Train model for object detection (more index)",
    completed: false,
  },
  {
    text: "Clean up code",
    completed: false,
  },
  {
    text: "Refactor",
    completed: false,
  },
  {
    text: "Make artists/tracks recommendation more specific",
    completed: false,
  },
  {
    text: "Add photo filters to gallery",
    completed: true,
  },
  {
    text: "Add current read",
    completed: true,
  },
  {
    text: "Add progress bar to gallery",
    completed: true,
  },
  {
    text: "Add show images by city options to gallery",
    completed: true,
  },
  {
    text: "Fix spotify top tracks",
    completed: true,
  },
  {
    text: "Add feed-like view to gallery",
    completed: true,
  },
  {
    text: "For gallery, switch to metadata on CDN",
    completed: true,
  },
  {
    text: "For gallery, switch to API for retrieving images",
    completed: true,
  },
  {
    text: "Add books collection",
    completed: true,
  },
  {
    text: "Migrate gallery to CDN",
    completed: true,
  },
  {
    text: "Fix spotify deprecated API",
    completed: true,
  },
  {
    text: "Favorite restaurants / cafes / bakeries",
    completed: true,
  },
  {
    text: "Move from embedded to local gallery",
    completed: true,
  },
  {
    text: "Make object detection table checkable to show specific objects",
    completed: true,
  },
  {
    text: "Add timeline",
    completed: true,
  },
  {
    text: "Add options to recommendation",
    completed: true,
  },
  {
    text: "Add spotify playlist",
    completed: true,
  },
  {
    text: "Add spotify recommendation",
    completed: true,
  },
  {
    text: "Add skills",
    completed: true,
  },
  {
    text: "Custom filter for spotify",
    completed: true,
  },
];

export default function FeaturesCard() {
  return (
    <div className="features-card">
      <div className="features-card__header">
        Future Features
      </div>

      <div className="features-card__body">
        <ul className="features-card__items">
          {FEATURES.map((feature) => (
            <li
              key={feature.text}
              className={`features-card__item ${
                feature.completed ? "is-done" : ""
              }`}
            >
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}