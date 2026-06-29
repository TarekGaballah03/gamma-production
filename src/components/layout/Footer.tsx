import Link from "next/link";
import type { SiteSettings } from "@/types";

const SOCIAL_ICONS: Record<string, string> = {
  instagram: "IG",
  tiktok: "TK",
  linkedin: "LI",
  youtube: "YT",
  behance: "BE",
  vimeo: "VM",
  x: "X",
};

interface FooterProps {
  settings: SiteSettings | null;
}

/**
 * Footer — Server Component.
 * Displays contact info, social links, and the brand tagline.
 */
export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="section-light"
      role="contentinfo"
      style={{ padding: "6rem 2rem 3rem", position: "relative" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "4rem",
            paddingBottom: "4rem",
            borderBottom: "1px solid rgba(10,10,10,0.1)",
          }}
        >
          {/* Brand */}
          <div>
            <svg
              viewBox="0 0 80 90"
              width="48"
              height="58"
              aria-hidden="true"
              fill="#0a0a0a"
              style={{ marginBottom: "1rem" }}
            >
              <text
                x="0"
                y="76"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="80"
                fontWeight="400"
                fill="#0a0a0a"
              >
                g
              </text>
              <circle cx="63" cy="23" r="4" fill="#0a0a0a" />
              <circle cx="71" cy="15" r="3" fill="#0a0a0a" />
              <circle cx="69" cy="27" r="3" fill="#0a0a0a" />
            </svg>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-grey-600)",
                maxWidth: "220px",
                lineHeight: 1.8,
              }}
            >
              {settings?.footerTagline ?? "Crafting stories that move."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-grey-400)",
                marginBottom: "1.5rem",
              }}
            >
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["About", "Services", "Work", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "1.1rem",
                        color: "var(--color-black)",
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                      }}
                      className="hover:opacity-50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-grey-400)",
                marginBottom: "1.5rem",
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--color-black)",
                    textDecoration: "none",
                  }}
                  className="hover:opacity-50 transition-opacity"
                >
                  {settings.contactEmail}
                </a>
              )}
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--color-black)",
                    textDecoration: "none",
                  }}
                  className="hover:opacity-50 transition-opacity"
                >
                  {settings.contactPhone}
                </a>
              )}
              {settings?.address && (
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--color-grey-600)",
                    marginTop: "0.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {settings.address}
                </p>
              )}
            </div>
          </div>

          {/* Social */}
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-grey-400)",
                  marginBottom: "1.5rem",
                }}
              >
                Follow Us
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {settings.socialLinks.map((link) => (
                  <a
                    key={link._key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${link.platform}`}
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--color-black)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                    className="group hover:opacity-50 transition-opacity"
                  >
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}>
                      {SOCIAL_ICONS[link.platform] ?? link.platform.toUpperCase().slice(0, 2)}
                    </span>
                    <span>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              color: "var(--color-grey-400)",
            }}
          >
            © {year} Gamma Production. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              color: "var(--color-grey-400)",
            }}
          >
            Est. 2023
          </p>
        </div>
      </div>
    </footer>
  );
}
