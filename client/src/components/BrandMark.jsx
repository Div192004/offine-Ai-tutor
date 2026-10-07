import { Link } from "react-router-dom";

function BrandMark() {
  return (
    <Link className="brand" to="/" aria-label="Offline Tutor AI home">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path
            d="M7.5 11.5c4.7-.9 8.9.1 12.5 3v17c-3.6-2.9-7.8-3.9-12.5-3V11.5Z"
            fill="currentColor"
            opacity=".72"
          />
          <path
            d="M32.5 11.5c-4.7-.9-8.9.1-12.5 3v17c3.6-2.9 7.8-3.9 12.5-3V11.5Z"
            fill="currentColor"
          />
          <path
            d="M20 14.5v17"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="1.5"
            opacity=".85"
          />
        </svg>
      </span>
      <span className="brand-name">
        Offline Tutor<span>AI</span>
      </span>
    </Link>
  );
}

export default BrandMark;
