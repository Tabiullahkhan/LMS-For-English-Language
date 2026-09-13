import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-correction transition-colors">
        Courses
      </Link>
      {user ? (
        <>
          {user.role === "admin" ? (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-correction transition-colors">
              Admin
            </Link>
          ) : (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-correction transition-colors">
              My Courses
            </Link>
          )}
          <button onClick={handleLogout} className="text-left hover:text-correction transition-colors">
            Log out
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-correction transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="bg-correction text-cream px-4 py-2 rounded-sm hover:bg-correction-dark transition-colors w-fit"
          >
            Sign up
          </Link>
        </>
      )}
    </>
  );

  // Simple inline sun/moon icon - avoids pulling in an icon library for just one toggle
  const ThemeIcon = () =>
    isDark ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );

  return (
    <nav className="border-b border-ink/10 dark:border-cream/10 bg-cream dark:bg-ink text-ink dark:text-cream px-6 py-4 relative transition-colors">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="font-display text-lg sm:text-xl font-medium truncate max-w-[55%]">
          Tabi Khan <span className="text-correction">English</span>
        </Link>

        <div className="hidden sm:flex items-center gap-7 text-sm">
          {navLinks}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="hover:text-correction transition-colors"
          >
            <ThemeIcon />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="hover:text-correction transition-colors">
            <ThemeIcon />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl leading-none px-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-4 mt-4 pb-2 text-sm max-w-6xl mx-auto">{navLinks}</div>
      )}
    </nav>
  );
};

export default Navbar;
