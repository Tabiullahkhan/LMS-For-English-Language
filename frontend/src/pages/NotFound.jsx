import { Link } from "react-router-dom";
import usePageTitle from "../utils/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="text-sage text-sm mb-4">Error 404</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4">
        This page{" "}
        <span className="relative inline-block">
          <span className="line-through decoration-correction decoration-2">exists</span>
        </span>{" "}
        doesn't exist.
      </h1>
      <p className="text-warm-grey leading-relaxed mb-8">
        The page you're looking for may have been moved or the link might be incorrect.
      </p>
      <Link
        to="/"
        className="inline-block bg-correction text-cream px-6 py-3 rounded-sm hover:bg-correction-dark transition-colors font-medium"
      >
        Back to courses
      </Link>
    </div>
  );
};

export default NotFound;
