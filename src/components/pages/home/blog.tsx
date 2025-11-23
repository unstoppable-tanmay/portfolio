/* eslint-disable @next/next/no-img-element */
"use client";

import { TANMAY_TYPE } from "@/app/page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  categories: string[];
}

const Blog = ({ data }: { data: TANMAY_TYPE }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `/api/medium?username=${data.blog.username}`
        );
        const res = await response.json();

        if (res.status === "ok" && res.items.length > 0) {
          setArticles(res.items.slice(0, data.blog.articlesToShow)); // Get latest articles
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch Medium articles:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!loading && cardRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: "linear",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      ref={sectionRef}
      id="blog"
      className="min-h-screen w-full bg-black flex items-center justify-center my-[10vh]"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-Poppins font-medium">
            Thoughts & Code
          </h2>
        </div>

        {/* Main Card */}
        <div
          ref={cardRef}
          className="w-[90vw] md:w-[75vw] lg:w-[70vw] mx-auto overflow-hidden"
        >
          {loading ? (
            <div className="w-full min-h-[55vh] flex items-center justify-center">
              <div className="text-black/40 text-sm font-light">
                Loading articles...
              </div>
            </div>
          ) : error || articles.length === 0 ? (
            <div className="w-full min-h-[55vh] flex flex-col items-center justify-center gap-4 p-8">
              <div className="text-black/40 text-sm font-light text-center">
                Articles coming soon
              </div>
              <a
                href={`https://medium.com/@${data.blog.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 text-xs font-light hover:text-black transition-colors flex items-center gap-2 border border-black/10 px-4 py-2"
              >
                <span>Visit Medium Profile</span>
                <FiExternalLink className="text-xs" />
              </a>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-1">
              {/* Featured Article */}
              <div className="bg-white border-b border-black">
                <a
                  href={articles[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group no-underline"
                >
                  <div className="flex max-md:flex-col">
                    {/* Image */}
                    <div className="aspect-[4/3] md:aspect-auto bg-black/5 overflow-hidden">
                      {articles[0].thumbnail ? (
                        <img
                          src={articles[0].thumbnail}
                          alt={articles[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/20 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="text-[10px] text-black/40 font-light mb-2 uppercase tracking-wider">
                        Featured Article
                      </div>
                      <h3 className="text-black text-xl md:text-2xl lg:text-3xl font-normal mb-3">
                        {articles[0].title}
                      </h3>
                      <p className="text-black/60 text-sm font-light mb-4 line-clamp-3">
                        {articles[0].description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-black/40 font-light mb-4">
                        <span>{formatDate(articles[0].pubDate)}</span>
                        <span>•</span>
                        <span>5 min read</span>
                      </div>
                      {articles[0].categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {articles[0].categories
                            .slice(0, 3)
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 border border-black/10 text-black/50 text-[10px] font-light uppercase tracking-wide"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </div>

              {/* Other Articles */}
              {articles.length > 1 && (
                <div className="flex max-md:flex-col gap-1">
                  {articles.slice(1).map((article, index) => (
                    <a
                      key={index}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block bg-white group p-6 border-black/10 hover:bg-white/95 transition-colors no-underline ${
                        index === 0 ? "border-r-0 md:border-r" : ""
                      }`}
                    >
                      <div className="text-[10px] text-black/30 font-light mb-2">
                        {formatDate(article.pubDate)}
                      </div>
                      <h4 className="text-black text-base md:text-lg font-normal mb-2 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-black/50 text-xs font-light mb-3 line-clamp-2">
                        {article.description}
                      </p>
                      {article.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {article.categories.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 border border-black/10 text-black/40 text-[9px] font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="bg-white border-t border-black/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/5 border border-black/10 overflow-hidden">
                    <img
                      src={data.blog.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-black text-sm font-normal">
                      {data.personal.name}
                    </div>
                    <div className="text-black/40 text-xs font-light">
                      {articles.length}+ articles on Medium
                    </div>
                  </div>
                </div>
                <a
                  href={`https://medium.com/@${data.blog.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-black/20 text-black/70 hover:bg-black hover:text-white transition-all duration-300 px-4 py-2 text-xs font-light flex items-center gap-2"
                >
                  <span>View All</span>
                  <FiExternalLink className="text-xs" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
