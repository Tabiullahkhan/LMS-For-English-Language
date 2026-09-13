import { useEffect } from "react";

// Sets the browser tab title for the current page. Small but real SEO/usability win:
// without this every page shows the same generic title, which looks unfinished in
// browser tabs, bookmarks, and search results.
const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Tabi Khan English Academy` : "Tabi Khan English Academy";
    return () => {
      document.title = previousTitle; // restore on unmount, in case of fast navigation
    };
  }, [title]);
};

export default usePageTitle;
