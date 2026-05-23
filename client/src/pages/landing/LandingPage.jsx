import { lazy, Suspense, useEffect } from 'react';
import { setMeta } from '@/shared/utils/setMeta';

const HeroSection = lazy(() => import('./sections/HeroSection'));
const FeaturesSection = lazy(() => import('./sections/FeaturesSection'));
const TrendingPreviewSection = lazy(() =>
  import('./sections/TrendingPreviewSection')
);
const AiRecommendationSection = lazy(() =>
  import('./sections/AiRecommendationSection')
);
const WatchlistShowcaseSection = lazy(() =>
  import('./sections/WatchlistShowcaseSection')
);
const SubtitleSupportSection = lazy(() =>
  import('./sections/SubtitleSupportSection')
);
const CtaSection = lazy(() => import('./sections/CtaSection'));
const FaqSection = lazy(() => import('./sections/FaqSection'));
const LandingFooter = lazy(() => import('./sections/LandingFooter'));

import { useMovies } from '@/shared/hooks/useMovies';
import randomizeArray from '@/shared/utils/randomizeArray';
const SectionFallback = () => (
  <div className="min-h-[200px] bg-primary animate-pulse" />
);

const LandingPage = () => {
  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://moviemon.netlify.app');

  useEffect(() => {
    const description =
      'Search, stream, and watch movies and TV shows with ratings, trailers, subtitles, and AI-powered recommendations. MovieMon helps you discover, stream, and save your favorite titles.';

    document.title = 'MovieMon — Discover & Stream Movies and TV Shows';
    setMeta('description', description);
    setMeta(
      'keywords',
      'movies, stream, watch, tv shows, trailers, subtitles, watchlist, recommendations, AI recommendations, streaming, movie discovery'
    );
    setMeta('og:title', 'MovieMon — Discover Movies Instantly', 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', `${siteUrl}`, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'MovieMon — Discover Movies Instantly');
    setMeta('twitter:description', description);
    setMeta('twitter:image', `${siteUrl}/og-moviemon.png`);
    setMeta('canonical', `${siteUrl}`, 'rel', 'link');

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: `${siteUrl}`,
      name: 'MovieMon',
      description,
      publisher: {
        '@type': 'Organization',
        name: 'MovieMon',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    let jsonLdTag = document.querySelector(
      'script[type="application/ld+json"][data-jsonld="landing-page"]'
    );

    if (!jsonLdTag) {
      jsonLdTag = document.createElement('script');
      jsonLdTag.type = 'application/ld+json';
      jsonLdTag.dataset.jsonld = 'landing-page';
      document.head.appendChild(jsonLdTag);
    }
    jsonLdTag.textContent = JSON.stringify(jsonLd);

    document.dispatchEvent(new Event('prerender-ready'));
  }, [siteUrl]);


  // Fetch Movies
    const queryString = `all/day`;
    const type = 'trending';

    const { data, isError, isLoading } = useMovies(queryString, type);

    const allMovies = [
      ...new Map(
        (data?.pages || [])
          .flatMap((page) => page.results)
          .filter(Boolean)
          .map((m) => [m.id, m])
      ).values(),
    ];

  return (
    <div className="landing-page bg-gray-950 text-white min-h-screen">
      <Suspense fallback={<SectionFallback />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <TrendingPreviewSection
          allMovies={randomizeArray(allMovies).slice(0, 6)}
          isError={isError}
          isLoading={isLoading}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <AiRecommendationSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WatchlistShowcaseSection
          allMovies={randomizeArray(allMovies).slice(0, 6)}
          isError={isError}
          isLoading={isLoading}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <SubtitleSupportSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CtaSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FaqSection />
      </Suspense>

      <Suspense fallback={null}>
        <LandingFooter />
      </Suspense>
    </div>
  );
};

export default LandingPage;
