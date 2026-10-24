import ThemeToggle from "@/components/ThemeToggle";
import { REPO_URL } from "@/lib/site";

const links = [
  { href: "#what-is-it", label: "About" },
  { href: "#performance", label: "Performance" },
  { href: "#history", label: "History" },
  { href: "#composition", label: "Composition" },
  { href: "#method", label: "Method" },
  { href: "#source", label: "Source" },
];

export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav-inner" aria-label="Main">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◢
          </span>
          Portfolio Experiment
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="nav-gh">
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
