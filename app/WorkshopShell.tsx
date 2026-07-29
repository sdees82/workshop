"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NavItem, navGroups, workshopTitle } from "./workshop-data";

type AdjacentPage = {
  path: string;
  title: string;
} | null;

type WorkshopShellProps = {
  title: string;
  path: string;
  html: string;
  breadcrumbs: NavItem[];
  previous: AdjacentPage;
  next: AdjacentPage;
};

// Icon paths lifted from the hosted site's Cloudscape icon set (16x16 grid).
const ICON_PATHS = {
  caretDown: "m8 11 4-6H4l4 6Z",
  angleRight: "m5 2 6 6-6 6",
  angleLeft: "M11 2 5 8l6 6",
  externalLink: "M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01",
} as const;

function Icon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`nav-chevron ${open ? "is-open" : ""}`} aria-hidden="true">
      <Icon name="caretDown" />
    </span>
  );
}

export default function WorkshopShell({
  title,
  path,
  html,
  breadcrumbs,
  previous,
  next,
}: WorkshopShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [dark, setDark] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navGroups
        .filter(
          (group) =>
            group.children &&
            (path === group.path || group.children.some((item) => item.path === path)),
        )
        .map((group) => [group.path, true]),
    ),
  );

  useEffect(() => {
    setCookieVisible(window.localStorage.getItem("workshop-cookie-choice") === null);
    setDark(window.localStorage.getItem("workshop-theme") === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const activeGroup = useMemo(
    () =>
      navGroups.find(
        (group) =>
          group.path === path || group.children?.some((item) => item.path === path),
      ),
    [path],
  );

  function chooseCookies(choice: string) {
    window.localStorage.setItem("workshop-cookie-choice", choice);
    setCookieVisible(false);
  }

  function toggleTheme() {
    const nextTheme = !dark;
    window.localStorage.setItem("workshop-theme", nextTheme ? "dark" : "light");
    setDark(nextTheme);
  }

  async function handleContentClick(event: React.MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const copyButton = target.closest<HTMLButtonElement>('button[aria-label="Copy content"]');
    if (!copyButton) return;

    const block = copyButton.closest('[class*="CodeBlock-module_codeBlock"]');
    const code = block?.querySelector("pre code");
    if (!code) return;

    const value = code.textContent ?? "";
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    copyButton.classList.add("copied");
    copyButton.setAttribute("aria-label", "Copied");
    window.setTimeout(() => {
      copyButton.classList.remove("copied");
      copyButton.setAttribute("aria-label", "Copy content");
    }, 1400);
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <button
          className="mobile-menu"
          aria-label="Open navigation drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="brand" aria-label="Workshop Studio home">
          <img src="/assets/workshop-studio.png" alt="Workshop Studio" />
        </Link>
        <button className="settings-button" aria-label="Settings" onClick={toggleTheme}>
          ⚙
        </button>
      </header>

      <div className={`workspace ${navOpen ? "" : "is-collapsed"}`}>
        {drawerOpen && (
          <button
            className="drawer-backdrop"
            aria-label="Close navigation drawer"
            onClick={() => setDrawerOpen(false)}
          />
        )}
        <aside className={`sidebar ${drawerOpen ? "is-open" : ""}`}>
          <div className="sidebar-title">
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              {workshopTitle}
            </Link>
            <button
              aria-label="Close navigation drawer"
              onClick={() => {
                setDrawerOpen(false);
                setNavOpen(false);
              }}
            >
              <Icon name="angleLeft" />
            </button>
          </div>
          <nav className="side-nav" aria-label="Workshop lessons">
            {navGroups.map((group) => {
              const hasChildren = Boolean(group.children?.length);
              const isExpanded = expanded[group.path] ?? false;
              const isGroupActive = activeGroup?.path === group.path;
              return (
                <div className="nav-group" key={group.path}>
                  <div className="nav-row">
                    {hasChildren ? (
                      <button
                        className="nav-toggle"
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.title}`}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [group.path]: !isExpanded,
                          }))
                        }
                      >
                        <Chevron open={isExpanded} />
                      </button>
                    ) : (
                      <span className="nav-spacer" />
                    )}
                    <Link
                      href={group.path}
                      className={path === group.path ? "active" : ""}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {group.title}
                    </Link>
                  </div>
                  {hasChildren && isExpanded && (
                    <div className={`nav-children ${isGroupActive ? "active-group" : ""}`}>
                      {group.children?.map((child) => (
                        <Link
                          href={child.path}
                          className={path === child.path ? "active" : ""}
                          onClick={() => setDrawerOpen(false)}
                          key={child.path}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <a
            className="catalog-link"
            href="https://builder.aws.com/build/workshops"
            target="_blank"
            rel="noreferrer"
          >
            Workshop catalog in AWS Builder Center <Icon name="externalLink" />
          </a>
        </aside>

        <main className="main-panel">
          {!navOpen && (
            <button
              className="nav-open-button"
              aria-label="Open navigation drawer"
              onClick={() => setNavOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          )}
          <div className="content-frame">
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <Link href="/">{workshopTitle}</Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.path}-${index}`}>
                  <span className="crumb-separator" aria-hidden="true">
                    <Icon name="angleRight" />
                  </span>
                  {index === breadcrumbs.length - 1 ? (
                    <strong>{crumb.title}</strong>
                  ) : (
                    <Link href={crumb.path}>{crumb.title}</Link>
                  )}
                </span>
              ))}
            </nav>

            <article className="workshop-article">
              <header className="article-header">
                <h1>{title}</h1>
              </header>
              <section
                className="markdown-content"
                onClick={handleContentClick}
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <nav className="page-navigation" aria-label="Lesson navigation">
                {previous ? (
                  <Link href={previous.path} className="secondary-button">
                    Previous
                  </Link>
                ) : (
                  <span className="secondary-button disabled">Previous</span>
                )}
                {next ? (
                  <Link href={next.path} className="primary-button">
                    Next
                  </Link>
                ) : (
                  <span className="primary-button disabled">Next</span>
                )}
              </nav>
            </article>
          </div>
        </main>
      </div>

      <footer className="site-footer">
        <span>© 2008 - 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.</span>
        <span className="footer-links">
          <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noreferrer">
            Privacy policy
          </a>
          <a href="https://aws.amazon.com/terms/" target="_blank" rel="noreferrer">
            Terms of use
          </a>
          <button onClick={() => setCookieVisible(true)}>Cookie preferences</button>
        </span>
      </footer>

      {cookieVisible && (
        <section className="cookie-banner" aria-label="Cookie preferences">
          <div>
            <h2>Select your cookie preferences</h2>
            <p>
              We use essential cookies and similar tools that are necessary to provide our site
              and services. We use performance cookies to collect anonymous statistics, so we can
              understand how customers use our site and make improvements. Essential cookies
              cannot be deactivated, but you can choose “Customize” or “Decline” to decline
              performance cookies.
            </p>
            <p>
              If you agree, AWS and approved third parties will also use cookies to provide useful
              site features, remember your preferences, and display relevant content.
            </p>
          </div>
          <div className="cookie-actions">
            <button className="accept" onClick={() => chooseCookies("accepted")}>
              Accept
            </button>
            <button onClick={() => chooseCookies("declined")}>Decline</button>
            <button onClick={() => chooseCookies("customized")}>Customize</button>
          </div>
        </section>
      )}
    </div>
  );
}
