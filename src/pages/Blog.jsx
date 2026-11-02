import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  BookOpen,
  Sparkles
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";

import "./Blog.css";

/* =========================================================
   1. SETTINGS
   Change these numbers and names in one place.
========================================================= */

const STORIES_PER_PAGE = 9;
const ALL_STORIES = "All Stories";

const categories = [
  ALL_STORIES,
  "School News",
  "Events",
  "Achievements",
  "Student Life",
  "Announcements"
];

/* =========================================================
   2. BLOG DATA

   Right now the stories are written here by hand.
   The BlogDetail page also reads this list.

   TO ADD A BACKEND LATER:
   - Ask your backend for the list, for example:
       GET /api/blogs
   - Each story must have the same fields as below
     (id, slug, category, date, readTime, featured,
      image, title, description, content).
   - Replace this list with the data you get back, using
     useState + useEffect inside Blog and BlogDetail.
   - Nothing else in this file needs to change.

   These stories are demo content. Replace them with
   verified school updates before publishing.
========================================================= */

export const blogs = [
  {
    id: 1,
    slug: "young-minds-big-dreams",
    category: "Student Life",
    date: "October 12, 2026",
    readTime: "3 min read",
    featured: true, // the one story shown in the top card
    image: "/facilities/sports-3.jpg",
    title: "Small Steps, Big Dreams: Building a Brighter Future",
    description:
      "Every great journey begins with curiosity. From discovering new ideas in the classroom to building friendships and exploring individual talents, school life creates countless opportunities to learn and grow. Discover how meaningful everyday experiences inspire confidence, creativity and a lifelong love for learning.",
    content: [
      "Every meaningful learning journey begins with curiosity. When students are encouraged to explore ideas, ask questions and share their perspectives, the classroom becomes a place of discovery.",
      "At VEDA International School, we believe that education should encourage creativity, collaboration and confidence. Through engaging learning experiences, children can develop important skills that extend beyond textbooks.",
      "Small achievements, new friendships and everyday discoveries all contribute to a brighter future. Each step forward is an opportunity to learn, grow and discover new possibilities."
    ]
  },
  {
    id: 2,
    slug: "celebration-of-talent",
    category: "Events",
    date: "October 8, 2026",
    readTime: "2 min read",
    image: "/veda_blog_7_cropped/blog-2.jpg",
    title: "A Celebration of Talent and Unity",
    description:
      "Celebrating creativity, confidence and the joy of coming together through memorable school experiences.",
    content: [
      "School celebrations provide students with opportunities to express themselves, discover their interests and appreciate the talents of others.",
      "Whether through music, dance, art or collaborative activities, these experiences encourage confidence, teamwork and a sense of belonging.",
      "Every celebration reminds us that learning also happens through shared experiences and the joy of participating together."
    ]
  },
  {
    id: 3,
    slug: "learning-beyond-classrooms",
    category: "Student Life",
    date: "October 5, 2026",
    readTime: "3 min read",
    image: "/veda_blog_7_cropped/blog-3.jpg",
    title: "Learning Beyond the Classroom",
    description:
      "How exploration, practical activities and teamwork connect everyday lessons with the wider world.",
    content: [
      "Learning becomes more meaningful when students can connect classroom knowledge with practical experiences.",
      "Creative activities, group projects and opportunities for exploration help children develop problem-solving abilities and communication skills.",
      "By encouraging students to learn through experience, schools can nurture curiosity and help them become more confident learners."
    ]
  },
  {
    id: 4,
    slug: "champions-on-the-field",
    category: "Achievements",
    date: "September 28, 2026",
    readTime: "2 min read",
    image: "/veda_blog_7_cropped/blog-4.jpg",
    title: "Champions on and Off the Field",
    description:
      "Discovering the value of determination, sportsmanship and teamwork through sporting experiences.",
    content: [
      "Sports and physical activities play an important role in developing confidence, discipline and teamwork.",
      "Participating in games teaches students to appreciate effort, support their teammates and approach challenges with determination.",
      "The true value of sports extends beyond winning. It lies in building character, resilience and a positive attitude."
    ]
  },
  {
    id: 5,
    slug: "inspiring-young-minds",
    category: "School News",
    date: "September 20, 2026",
    readTime: "3 min read",
    image: "/veda_blog_7_cropped/blog-5.jpg",
    title: "Inspiring Young Minds Through New Experiences",
    description:
      "Meaningful learning experiences help children discover their interests, abilities and confidence.",
    content: [
      "A supportive learning environment encourages students to explore their potential and develop a lifelong interest in education.",
      "New experiences can introduce children to different perspectives and help them discover skills and interests they may not have recognised before.",
      "Through encouragement and thoughtful guidance, every learner can gain the confidence to embrace new opportunities."
    ]
  },
  {
    id: 6,
    slug: "creative-learning",
    category: "Student Life",
    date: "September 15, 2026",
    readTime: "2 min read",
    image: "/veda_blog_7_cropped/blog-6.jpg",
    title: "Where Creativity Meets Learning",
    description:
      "Exploring how imagination, artistic expression and hands-on activities make education more engaging.",
    content: [
      "Creativity allows students to express ideas, experiment with possibilities and approach familiar subjects in new ways.",
      "Artistic activities, imaginative projects and collaborative exercises can make learning more engaging while supporting communication and critical thinking.",
      "When creativity becomes part of everyday education, children gain more opportunities to discover and develop their individual strengths."
    ]
  },
  {
    id: 7,
    slug: "school-announcements",
    category: "Announcements",
    date: "September 10, 2026",
    readTime: "2 min read",
    image: "/veda_blog_7_cropped/blog-7.jpg",
    title: "Important Updates from Our School",
    description:
      "A dedicated space for useful school communications, upcoming activities and community information.",
    content: [
      "Clear communication helps students, parents and educators stay connected with the school community.",
      "This section can be used to share upcoming activities, important notices and other useful information.",
      "Please refer to official school communications for confirmed dates, schedules and announcements."
    ]
  },
  {
    id: 8,
    slug: "power-of-reading",
    category: "Student Life",
    date: "September 5, 2026",
    readTime: "3 min read",
    image: "/veda_blog_7_cropped/blog-1.jpg",
    title: "The Power of Reading and Imagination",
    description:
      "How books introduce young learners to new ideas, encourage imagination and develop a lasting curiosity about the world.",
    content: [
      "Reading is an important part of a child's learning journey. Books introduce new perspectives, encourage imagination and help students discover ideas beyond their immediate surroundings.",
      "A positive reading environment gives children opportunities to expand their vocabulary, develop communication skills and explore different subjects at their own pace.",
      "By making reading an enjoyable everyday experience, we can encourage young learners to develop curiosity and a lifelong appreciation for knowledge."
    ]
  },
  {
    id: 9,
    slug: "growing-together",
    category: "School News",
    date: "September 1, 2026",
    readTime: "2 min read",
    image: "/veda_blog_7_cropped/blog-3.jpg",
    title: "Growing Together Through Shared Experiences",
    description:
      "Exploring the importance of friendship, collaboration and meaningful connections throughout the school journey.",
    content: [
      "School life provides valuable opportunities for children to learn alongside one another and develop meaningful relationships.",
      "Collaborative activities encourage communication, cooperation and respect for different ideas.",
      "Every shared experience contributes to personal growth and reminds us that education is about more than academic learning."
    ]
  }
];

/* =========================================================
   3. SMALL PIECES OF THE PAGE
   Each piece does one job. The main Blog page at the
   bottom puts them together.
========================================================= */

/* Shows a photo. If the photo is missing, shows a navy box
   with a book icon instead of broken text. */
function StoryImage({ src, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div className="vb-image-fallback" role="img" aria-label={alt}>
        <BookOpen size={44} strokeWidth={1.3} />
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setImageFailed(true)} />;
}

/* The top card: page introduction + the featured story */
function IntroCard({ story }) {
  return (
    <section className="vb-hero">
      <div className="vb-container vb-hero-layout">

        {/* Left: featured photo */}
        <div className="vb-hero-visual">
          <Link
            to={`/blog/${story.slug}`}
            className="vb-hero-photo"
            aria-label={`Read ${story.title}`}
          >
            <StoryImage src={story.image} alt={story.title} />
          </Link>

          <div className="vb-image-label">
            <Sparkles size={15} />
            <span>
              <small>FEATURED</small>
              VEDA STORY
            </span>
          </div>
        </div>

        {/* Right: introduction text + featured story details */}
        <div className="vb-hero-content">
          <span className="vb-kicker">
            <span className="vb-kicker-line" />
            THE VEDA JOURNAL
          </span>

          <h1>
            Stories Beyond,
            
            <em> the Classroom.</em>
          </h1>

          <p className="vb-hero-description">
            Explore meaningful experiences, inspiring ideas and memorable
            moments from our school community. Every story offers a glimpse
            into the curiosity and creativity that make learning special.
            {/* From classroom discoveries and student achievements to
            celebrations, sports and school news, the Veda Journal brings
            together the moments that shape our children. */}
          </p>

          <div className="vb-featured-info">
            <div className="vb-featured-meta">
              <span className="vb-category">{story.category}</span>

              <span className="vb-date">
                <CalendarDays size={15} />
                {story.date}
              </span>
            </div>

            <h2>{story.title}</h2>

            <div className="vb-featured-actions">
              <Link to={`/blog/${story.slug}`} className="vb-primary-link">
                Explore Featured Story
                <ArrowUpRight size={18} />
              </Link>

              <span className="vb-read-time">
                <Clock3 size={15} />
                {story.readTime}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* One story card in the grid */
function StoryCard({ story, number }) {
  const storyLink = `/blog/${story.slug}`;

  return (
    <article className="vb-card">

      <Link
        to={storyLink}
        className="vb-card-photo"
        aria-label={`Read ${story.title}`}
      >
        <StoryImage src={story.image} alt={story.title} />

        <span className="vb-card-number">
          {String(number).padStart(2, "0")}
        </span>
      </Link>

      <div className="vb-card-body">

        <div className="vb-card-topline">
          <span className="vb-category">{story.category}</span>
          <span className="vb-date">{story.date}</span>
        </div>

        <h3>
          <Link to={storyLink}>{story.title}</Link>
        </h3>

        <p>{story.description}</p>

        <div className="vb-card-bottom">
          <span className="vb-read-time">
            <Clock3 size={14} />
            {story.readTime}
          </span>

          <Link
            to={storyLink}
            className="vb-card-arrow"
            aria-label={`Read ${story.title}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>

      </div>
    </article>
  );
}

/* Shown when a category has no stories */
function EmptyMessage({ onShowAll }) {
  return (
    <div className="vb-empty">
      <BookOpen size={34} strokeWidth={1.4} />

      <h3>No stories in this category yet.</h3>

      <p>Explore another category to discover more articles.</p>

      <button type="button" onClick={onShowAll}>
        View All Stories
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

/* Previous / 01 02 03 / Next buttons */
function Pagination({ currentPage, totalPages, onChangePage }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="vb-pagination" aria-label="Blog pagination">

      <button
        type="button"
        className="vb-page-nav"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft size={17} />
        Previous
      </button>

      <div className="vb-page-numbers">
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`vb-page-number ${currentPage === page ? "active" : ""}`}
            onClick={() => onChangePage(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {String(page).padStart(2, "0")}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="vb-page-nav"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRight size={17} />
      </button>

    </nav>
  );
}

/* =========================================================
   4. THE BLOG PAGE
========================================================= */

function Blog() {
  // Which category button is selected, and which page we are on
  const [activeCategory, setActiveCategory] = useState(ALL_STORIES);
  const [currentPage, setCurrentPage] = useState(1);

  // The featured story goes in the top card.
  // Every other story goes in the grid below.
  const featuredStory = blogs.find((story) => story.featured);
  const otherStories = blogs.filter((story) => !story.featured);

  // Keep only the stories from the selected category
  const storiesInCategory =
    activeCategory === ALL_STORIES
      ? otherStories
      : otherStories.filter((story) => story.category === activeCategory);

  // Work out which stories belong on the current page
  const totalPages = Math.ceil(storiesInCategory.length / STORIES_PER_PAGE);
  const firstStoryIndex = (currentPage - 1) * STORIES_PER_PAGE;
  const storiesOnThisPage = storiesInCategory.slice(
    firstStoryIndex,
    firstStoryIndex + STORIES_PER_PAGE
  );

  // When a category is clicked, go back to page 1
  function selectCategory(category) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  // When a page is clicked, show it and scroll to the stories
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    document
      .getElementById("veda-journal")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar />

      <PageBanner
        image="/images/hero.png"
        alt="VEDA International School"
        label="VEDA JOURNAL"
        caption="Stories from our school community"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Blog" }
        ]}
      />

      <main className="veda-blog">

        {/* Introduction + featured story */}
        {featuredStory && <IntroCard story={featuredStory} />}

        {/* Category buttons + story grid */}
        <section className="vb-journal-section" id="veda-journal">
          <div className="vb-container">

            <div className="vb-journal-bar">

              <div className="vb-filters" aria-label="Blog categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`vb-filter ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => selectCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="vb-journal-count">
                <strong>
                  {String(storiesInCategory.length).padStart(2, "0")}
                </strong>
                <span>STORIES</span>
              </div>

            </div>

            {storiesOnThisPage.length > 0 ? (
              <div className="vb-grid">
                {storiesOnThisPage.map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    number={firstStoryIndex + index + 1}
                  />
                ))}
              </div>
            ) : (
              <EmptyMessage onShowAll={() => selectCategory(ALL_STORIES)} />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChangePage={goToPage}
              />
            )}

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Blog;