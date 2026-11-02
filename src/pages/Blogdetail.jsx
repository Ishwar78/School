import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  BookOpen,
  Sparkles
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";

import { blogs } from "./Blog";
import "./BlogDetail.css";

/*
  STORY IMAGE

  Shows the photo. If the file is missing, it shows a navy
  panel with an icon instead of broken alt text.
*/

function StoryImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="bd-image-fallback" role="img" aria-label={alt}>
        <BookOpen size={40} strokeWidth={1.3} />
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

function BlogDetail() {
  const { slug } = useParams();

  const blogIndex = blogs.findIndex((item) => item.slug === slug);
  const blog = blogs[blogIndex];

  /* ARTICLE NOT FOUND */

  if (!blog) {
    return (
      <>
        <Navbar />

        <main className="veda-blog-detail">
          <PageBanner
            image="/images/hero.png"
            alt="VEDA International School"
            label="VEDA JOURNAL"
            caption="Story not found"
            breadcrumb={[
              { label: "Home", to: "/" },
              { label: "Blog", to: "/blog" },
              { label: "Story not found" }
            ]}
          />

          <section className="bd-not-found bd-container">
            <BookOpen size={42} strokeWidth={1.4} />

            <h1>Story Not Found</h1>

            <p>
              This article is unavailable or may have been moved.
              Explore the journal to discover more stories.
            </p>

            <Link to="/blog" className="bd-primary-button">
              <ArrowLeft size={17} />
              Back to All Stories
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  /* RELATED STORIES (same category first) */

  const relatedBlogs = blogs
    .filter((item) => item.id !== blog.id)
    .sort((a, b) => {
      const aMatch = a.category === blog.category ? 1 : 0;
      const bMatch = b.category === blog.category ? 1 : 0;

      return bMatch - aMatch;
    })
    .slice(0, 4);

  /* PREVIOUS / NEXT STORY (list is newest first) */

  const newerBlog = blogs[blogIndex - 1];
  const olderBlog = blogs[blogIndex + 1];

  return (
    <>
      <Navbar />

      <main className="veda-blog-detail">

        {/* PAGE BANNER */}

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School"
          label="VEDA JOURNAL"
          caption={blog.title}
          breadcrumb={[
            { label: "Home", to: "/" },
            { label: "Blog", to: "/blog" },
            { label: blog.category }
          ]}
        />

        {/* ARTICLE TITLE */}

        <section className="bd-intro">
          <div className="bd-container">

            <div className="bd-intro-content">

              <span className="bd-eyebrow">
                <span className="bd-eyebrow-line" />
                THE VEDA JOURNAL
              </span>

              <h1>{blog.title}</h1>

              <div className="bd-article-meta">

                <span className="bd-category">{blog.category}</span>

                <span className="bd-date">
                  <CalendarDays size={17} />
                  {blog.date}
                </span>

                {blog.readTime && (
                  <span className="bd-date">
                    <Clock3 size={17} />
                    {blog.readTime}
                  </span>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* ARTICLE + SIDEBAR */}

        <section className="bd-main-section">
          <div className="bd-container bd-layout">

            {/* LEFT COLUMN */}

            <div className="bd-article-column">

              <article className="bd-article-card">

                {/* COVER IMAGE */}

                <div className="bd-cover-wrap">
                  <div className="bd-cover">
                    <StoryImage src={blog.image} alt={blog.title} />

                    <span className="bd-cover-label">
                      <Sparkles size={15} />
                      VEDA JOURNAL
                    </span>
                  </div>
                </div>

                {/* ARTICLE TEXT */}

                <div className="bd-article-body">

                  <div className="bd-body-heading">
                    <span className="bd-small-line" />
                    THE STORY
                  </div>

                  <p className="bd-lead">{blog.description}</p>

                  <div className="bd-article-text">
                    {blog.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {/* ARTICLE FOOTER */}

                  <div className="bd-article-bottom">

                    <div className="bd-bottom-brand">
                      <div className="bd-brand-icon">
                        <BookOpen size={22} strokeWidth={1.5} />
                      </div>

                      <div>
                        <strong>VEDA Journal</strong>
                        <span>Learn · Grow · Lead</span>
                      </div>
                    </div>

                    <Link to="/blog" className="bd-primary-button">
                      <ArrowLeft size={17} />
                      Back to All Stories
                    </Link>

                  </div>

                </div>
              </article>

              {/* PREVIOUS / NEXT */}

              {(newerBlog || olderBlog) && (
                <nav className="bd-story-nav" aria-label="More stories">

                  {newerBlog ? (
                    <Link to={`/blog/${newerBlog.slug}`} className="bd-nav-card">
                      <span className="bd-nav-label">
                        <ArrowLeft size={16} />
                        Newer story
                      </span>
                      <strong>{newerBlog.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}

                  {olderBlog ? (
                    <Link
                      to={`/blog/${olderBlog.slug}`}
                      className="bd-nav-card bd-nav-card--right"
                    >
                      <span className="bd-nav-label">
                        Older story
                        <ArrowRight size={16} />
                      </span>
                      <strong>{olderBlog.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}

                </nav>
              )}

            </div>

            {/* STICKY SIDEBAR */}

            <aside className="bd-sidebar" aria-label="Related blog articles">

              <div className="bd-related-box">

                <div className="bd-sidebar-heading">

                  <span className="bd-eyebrow">
                    <span className="bd-eyebrow-line" />
                    KEEP EXPLORING
                  </span>

                  <h2>Related Blogs<span>.</span></h2>

                  <p>More stories worth discovering from our journal.</p>

                </div>

                <div className="bd-related-list">

                  {relatedBlogs.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blog/${item.slug}`}
                      className="bd-related-card"
                    >

                      <div className="bd-related-image">
                        <StoryImage src={item.image} alt={item.title} />
                      </div>

                      <div className="bd-related-content">

                        <span className="bd-related-category">
                          {item.category}
                        </span>

                        <h3>{item.title}</h3>

                        <span className="bd-related-read">
                          Read Story
                          <ArrowUpRight size={15} />
                        </span>

                      </div>

                    </Link>
                  ))}

                </div>

                <Link to="/blog" className="bd-view-all">
                  Explore All Stories
                  <ArrowRight size={17} />
                </Link>

              </div>

              {/* ADMISSIONS CARD */}

              <div className="bd-cta-card">
                <h3>Interested in joining VEDA?</h3>
                <p>
                  Learn about admissions at VEDA International School.
                </p>
                <Link to="/admissions" className="bd-cta-link">
                  Visit Admissions
                  <ArrowUpRight size={17} />
                </Link>
              </div>

            </aside>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default BlogDetail;