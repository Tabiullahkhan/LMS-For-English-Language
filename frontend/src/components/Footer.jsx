import { Link } from "react-router-dom";

// Simple inline SVG icons - no extra icon library dependency needed for just 4 logos.
// Replace the href values below with the instructor's real profile/channel/group links.
const socialLinks = [
  {
    name: "WhatsApp",
    href: "https://wa.me/92XXXXXXXXXX", // replace with real WhatsApp number
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.98.579 3.822 1.578 5.373L2 22l4.769-1.548A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.06a8.02 8.02 0 01-4.31-1.243l-.31-.184-3.202 1.04.99-3.222-.201-.31A8.02 8.02 0 013.94 12c0-4.446 3.615-8.06 8.06-8.06 4.446 0 8.06 3.614 8.06 8.06 0 4.445-3.614 8.06-8.06 8.06z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/yourpage", // replace with real Facebook page
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@yourhandle", // replace with real TikTok handle
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M16.5 2h-3v13.5a2.5 2.5 0 11-2.5-2.5c.17 0 .34.02.5.05V9.98a5.5 5.5 0 105.5 5.5V8.28a7.44 7.44 0 004.5 1.52V6.8a4.5 4.5 0 01-4.5-4.5 4.6 4.6 0 010-.3z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@yourchannel", // replace with real YouTube channel
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M23.498 6.186a2.994 2.994 0 00-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 00-2.107 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 002.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 002.107-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-ink/10 dark:border-cream/10 bg-cream dark:bg-ink text-ink dark:text-cream mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <p className="text-sm text-warm-grey text-center sm:text-left">
          &copy; {new Date().getFullYear()} Tabi Khan English Academy
        </p>

        <div className="flex items-center gap-5 text-warm-grey">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="hover:text-correction transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="flex gap-5 text-sm text-warm-grey">
          <Link to="/terms" className="hover:text-correction transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-correction transition-colors">Refunds</Link>
          <Link to="/privacy-policy" className="hover:text-correction transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
