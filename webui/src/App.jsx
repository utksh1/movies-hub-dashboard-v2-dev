import React, { useState, useEffect, useRef, useMemo } from "react";
import * as api from "./data-adapter";

// --- Components ---

const PosterCardSkeleton = () => (
  <div className="poster-card-skeleton">
    <div className="skeleton-media shimmer"></div>
    <div className="skeleton-line shimmer" style={{ width: '80%', height: '14px', marginTop: '12px' }}></div>
    <div className="skeleton-line shimmer" style={{ width: '60%', height: '10px', marginTop: '8px' }}></div>
  </div>
);

const PosterCard = ({ item, saved, onOpen, onSave }) => {
  const isSeries = !!item.release_date;
  return (
    <div className="poster-card reveal" onClick={onOpen}>
      <div className="poster-card-media">
        <img src={item.poster || item.banner || "/assets/catalyst.png"} alt={item.name} loading="lazy" />
      </div>
      <div className="poster-card-copy">
        <div className="eyebrow">{isSeries ? "Web Series" : "Movie"}</div>
        <h3>{item.name}</h3>
        <p>{item.description || item.genres}</p>
        <button className="secondary-button" onClick={(e) => { e.stopPropagation(); onSave(); }} style={{ width: "fit-content", padding: "8px 16px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{saved ? "done" : "bookmark"}</span>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, eyebrow, action, onLeft, onRight }) => (
  <header className="section-heading">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {action && <span className="section-action">{action}</span>}
      {(onLeft || onRight) && (
        <div className="scroll-controls">
          <button onClick={onLeft} aria-label="Scroll left"><span className="material-symbols-outlined">chevron_left</span></button>
          <button onClick={onRight} aria-label="Scroll right"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      )}
    </div>
  </header>
);

const CategoryRow = ({ title, items, onOpen, onSave, isSaved, filterType, loading }) => {
  const scrollRef = useRef(null);
  
  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!filterType || filterType === "all") return items;
    if (filterType === "movies") return items.filter(i => !i.release_date);
    if (filterType === "series") return items.filter(i => !!i.release_date);
    return items;
  }, [items, filterType]);

  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (!loading && filteredItems.length === 0) return null;
  
  return (
    <div className="category-row-wrapper">
      <SectionHeader title={title} onLeft={() => scroll(-400)} onRight={() => scroll(400)} />
      <div className="category-row-scroll" ref={scrollRef}>
        {loading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="row-item"><PosterCardSkeleton /></div>)
        ) : (
          filteredItems.map((item) => (
            <div key={`${title}-${item.id}`} className="row-item">
              <PosterCard item={item} saved={isSaved(item)} onOpen={() => onOpen(item)} onSave={() => onSave(item)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const HeroCarousel = ({ slides, onPlay, onSave, isSaved, loading }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
     if (timerRef.current) clearInterval(timerRef.current);
     timerRef.current = setInterval(() => { setActiveSlide(prev => (prev + 1) % slides.length); }, 8000);
  };

  useEffect(() => {
    if (slides.length > 0) resetTimer();
    return () => clearInterval(timerRef.current);
  }, [slides]);

  const nav = (dir) => {
    setActiveSlide(prev => (prev + dir + slides.length) % slides.length);
    resetTimer();
  };

  if (loading) return <section className="hero-cinema skeleton shimmer" style={{ height: '70vh' }}></section>;
  if (slides.length === 0) return null;
  const current = slides[activeSlide];

  return (
    <section className="hero-cinema">
      <div className="hero-slide">
        <img src={current.banner || current.poster} alt={current.name} className="hero-image-cinema" loading="eager" />
        <div className="hero-overlay-cinema"></div>
        <button className="hero-nav-btn left" onClick={() => nav(-1)}><span className="material-symbols-outlined">chevron_left</span></button>
        <button className="hero-nav-btn right" onClick={() => nav(1)}><span className="material-symbols-outlined">chevron_right</span></button>
        <div className="hero-copy-cinema">
          <h1 className="hero-title-cinema">{current.name}</h1>
          <p className="hero-meta-cinema">{current.genres}</p>
          <p className="hero-desc-cinema">{current.description}</p>
          <div className="hero-actions-cinema">
             <button className="primary-button cinema-btn" onClick={() => onPlay(current)}><span className="material-symbols-outlined">play_arrow</span>Watch Now</button>
             <button className="secondary-button cinema-round-btn" onClick={() => onSave(current)}><span className="material-symbols-outlined">{isSaved(current) ? "done" : "add"}</span></button>
          </div>
        </div>
        <div className="hero-badge-cinema">A 18+</div>
        <div className="hero-pagination-cinema">
          {slides.slice(0, 10).map((_, i) => (
            <button key={i} className={`hero-dot-cinema ${i === activeSlide ? "is-active" : ""}`} onClick={() => { setActiveSlide(i); resetTimer(); }} />
          ))}
        </div>
      </div>
    </section>
  );
};

const EpisodeHorizontalCard = ({ episode, isActive, onPlay }) => {
  const isPremium = episode.Is_Premium === "1";
  return (
    <button className={`episode-item ${isActive ? "is-active" : ""}`} onClick={() => onPlay(episode)} type="button">
      <div className="episode-media-box">
        <img src={episode.Thumbnail || "/assets/placeholder.png"} alt={episode.Episoade_Name} />
        {isPremium && <div className="premium-tag"><span className="material-symbols-outlined">workspace_premium</span></div>}
      </div>
      <div className="episode-content-box"><div className="episode-title-row"><span className="ep-num">EP {episode.episoade_order}</span><h4>{episode.Episoade_Name}</h4></div><p className="episode-desc">{episode.Episoade_Description}</p></div>
      <div className="episode-action-box"><span className="material-symbols-outlined download-icon">download</span></div>
    </button>
  );
};

const FilterPills = ({ options, value, onChange }) => (
  <div className="filter-bar">
    {options.map((option) => (
      <button key={option.id} type="button" className={`filter-pill ${value === option.id ? "is-active" : ""}`} onClick={() => onChange(option.id)}>{option.label}</button>
    ))}
  </div>
);

// --- Constants ---

const HOME_FILTERS = [
  { id: "all", label: "Dashboard" },
  { id: "trending", label: "Trending" },
  { id: "watchlist", label: "My Watchlist" },
];

const GENRES = ["Action", "Comedy", "Horror", "Drama", "Romance", "Thriller"];

// --- Application ---

export default function App() {
  const [page, setPage] = useState("home");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sliderData, setSliderData] = useState([]);
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [genreData, setGenreData] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("frameflow_watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeItem, setActiveItem] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [servers, setServers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [activeSeasonId, setActiveSeasonId] = useState(null);

  useEffect(() => {
    const loadEssential = async () => {
      setLoadingTop(true);
      try {
        const sliderType = page === "webseries" ? "WebSeries" : "Movies";
        const [slides, t] = await Promise.all([
          api.fetchSliderData(sliderType),
          api.fetchTrending()
        ]);
        setSliderData(slides);
        setTrending(t);
      } catch (e) {} finally { setLoadingTop(false); }
    };
    loadEssential();
  }, [page]);

  useEffect(() => {
     const loadCatalog = async () => {
       try {
         const [m, s] = await Promise.all([api.fetchRecentMovies(), api.fetchRecentSeries()]);
         setMovies(m); setSeries(s);
       } catch (e) {}
     };
     loadCatalog();
  }, []);

  useEffect(() => {
     const handleGenres = async () => {
        if (!loadingTop) {
           setLoadingGenres(true);
           try {
             const genrePromises = GENRES.map(g => api.fetchGenreContent(g));
             const res = await Promise.all(genrePromises);
             const newGenreData = {};
             GENRES.forEach((g, i) => { newGenreData[g] = res[i]; });
             setGenreData(newGenreData);
           } catch (e) {} finally { setLoadingGenres(false); }
        }
     };
     handleGenres();
  }, [loadingTop]);

  useEffect(() => {
    localStorage.setItem("frameflow_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
      try { const results = await api.searchContent(searchQuery); setSearchResults(results); } catch (e) {}
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleWatchlist = (item) => {
    setWatchlist((prev) => prev.find((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item] );
  };

  const isSaved = (item) => !!watchlist.find((i) => i.id === item?.id);

  function resultsForPage(p, f) {
    if (f === "watchlist") return watchlist;
    if (f === "trending") return trending;
    if (p === "movies") return movies;
    if (p === "webseries") return series;
    return [...trending, ...movies, ...series].slice(0, 40);
  }

  const handleContentClick = async (item) => {
    setActiveItem(item); setPlayerOpen(true); setPlayerLoading(true);
    setCurrentStreamUrl(""); setServers([]); setSeasons([]); setEpisodes([]);
    try {
      const isSeries = !!item.release_date;
      if (isSeries) {
        const seasonData = await api.fetchSeriesSeasons(item.id); setSeasons(seasonData);
        if (seasonData.length > 0) {
          const episodesData = await api.fetchSeasonEpisodes(seasonData[0].id);
          setEpisodes(episodesData);
          setActiveSeasonId(String(seasonData[0].id));
          if (episodesData.length > 0) setCurrentStreamUrl(episodesData[0].url);
        }
      } else {
        const linkData = await api.fetchMovieLinks(item.id); setServers(linkData);
        if (linkData.length > 0) setCurrentStreamUrl(linkData[0].url);
      }
    } catch (e) {} finally { setPlayerLoading(false); }
  };

  const loadSeason = async (seasonId) => {
    setActiveSeasonId(String(seasonId)); setEpisodes([]);
    try {
      const episodesData = await api.fetchSeasonEpisodes(seasonId); setEpisodes(episodesData);
      if (episodesData.length > 0 && !currentStreamUrl) { setCurrentStreamUrl(episodesData[0].url); }
    } catch (e) {}
  };

  return (
    <>
      <nav className="main-nav">
        <button className="logo-btn" type="button" onClick={() => setPage("home")}>
          <img src="/logo.png" alt="Logo" style={{ width: "32px", height: "32px" }} />
        </button>
        <button type="button" className={page === "home" ? "is-active" : ""} onClick={() => setPage("home")}><span className="material-symbols-outlined">home</span></button>
        <button type="button" className={page === "movies" ? "is-active" : ""} onClick={() => { setPage("movies"); setActiveFilter("all"); }}><span className="material-symbols-outlined">movie</span></button>
        <button type="button" className={page === "webseries" ? "is-active" : ""} onClick={() => { setPage("webseries"); setActiveFilter("all"); }}><span className="material-symbols-outlined">live_tv</span></button>
        <button type="button" onClick={() => setSearchOpen(true)}><span className="material-symbols-outlined">search</span></button>
      </nav>

      {activeFilter === "all" && <HeroCarousel slides={sliderData} onPlay={handleContentClick} onSave={toggleWatchlist} isSaved={isSaved} loading={loadingTop} />}

      <main className="content-section">
        <header className="section-heading">
          <div><p className="eyebrow">{page === "home" ? "Dashboard" : page}</p><h2>{page === "home" ? "Latest Highlights" : "Catalogue"}</h2></div>
          {page === "home" && <FilterPills options={HOME_FILTERS} value={activeFilter} onChange={setActiveFilter} />}
        </header>

        {(activeFilter === "all" || page !== "home") && (
          <div className="genre-sections">
            <CategoryRow title="Funny & Comedy" items={genreData["Comedy"]} onOpen={handleContentClick} onSave={toggleWatchlist} isSaved={isSaved} filterType={page === "home" ? "all" : (page === "movies" ? "movies" : "series")} loading={loadingGenres} />
            <CategoryRow title="Horror Night" items={genreData["Horror"]} onOpen={handleContentClick} onSave={toggleWatchlist} isSaved={isSaved} filterType={page === "home" ? "all" : (page === "movies" ? "movies" : "series")} loading={loadingGenres} />
            <CategoryRow title="Action Content" items={genreData["Action"]} onOpen={handleContentClick} onSave={toggleWatchlist} isSaved={isSaved} filterType={page === "home" ? "all" : (page === "movies" ? "movies" : "series")} loading={loadingGenres} />
          </div>
        )}

        <div className="section-header-simple"><SectionHeader title="Catalogue Discovery" action={`${resultsForPage(page, activeFilter).length} titles`} /></div>
        <div className="catalog-grid">
           {loadingTop ? (
              [1,2,3,4,5,6,7,8].map(i => <PosterCardSkeleton key={i} />)
           ) : (
              resultsForPage(page, activeFilter).map((item) => (
                <PosterCard key={item.id} item={item} saved={isSaved(item)} onOpen={() => handleContentClick(item)} onSave={() => toggleWatchlist(item)} />
              ))
           )}
        </div>
      </main>

      <div className={`overlay-modal ${playerOpen ? "is-open" : ""}`}>
        <div className="overlay-backdrop" onClick={() => setPlayerOpen(false)}></div>
        <div className="overlay-panel player-panel">
          <button className="overlay-close" type="button" onClick={() => setPlayerOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}><span className="material-symbols-outlined">close</span></button>
          <div className="player-layout">
            <section className="player-main">
              <div className="player-frame-wrap" ref={playerStageRef}>
                 {currentStreamUrl ? <iframe className="player-frame" src={currentStreamUrl} allowFullScreen title="Player"></iframe> : <div className="player-empty-state"><h3>Source offline</h3></div>}
                 {playerLoading && <div className="spinner-overlay"><div className="spinner"></div></div>}
              </div>
              {servers.length > 0 && (
                <div className="player-section"><div className="section-heading"><h3>Sources</h3></div><div className="server-list">{servers.map((s, i) => (<button key={i} className={`season-tab ${currentStreamUrl === s.url ? "is-active" : ""}`} onClick={() => setCurrentStreamUrl(s.url)}>S-{i + 1}</button>))}</div></div>
              )}
            </section>
            <aside className="player-sidebar"><img src={activeItem?.poster || activeItem?.banner} style={{ width: '100%', borderRadius: '12px', marginBottom: '24px' }} /><h2>{activeItem?.name}</h2><p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>{activeItem?.description}</p></aside>
          </div>
        </div>
      </div>
    </>
  );
}
