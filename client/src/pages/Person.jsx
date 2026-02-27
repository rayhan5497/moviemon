import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';

import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import { useMovies } from '../hooks/useMovies';
import { useIsMd } from '../hooks/useIsMd';
import { useIsLg } from '../hooks/useIsLg';

import HeadingSection from '../features/person/HeadingSection';
import DetailsSection from '../features/person/DetailsSection';
import MovieCard from '../composed/SaveableMovieCard';
import ShowError from '../components/ui/ShowError';
import MainScrollContext from '../context/MainScrollContext';
import Message from '../components/ui/Message';

export default function Person() {
  const { id } = useParams();
  const queryString = `${id}&append_to_response=combined_credits,images,external_ids,tagged_images`;
  const type = 'person';
  const { mainRef } = useContext(MainScrollContext);

  const { data, isError, error, isLoading } = useMovies(queryString, type);

  const person = data?.pages[0];

  const isMd = useIsMd();
  const isLg = useIsLg();

  const [mediaType, setMediaType] = useState('movie');

  const [imgLoaded, setImgLoaded] = useState(false);

  const hasScrolledRef = useRef(false);

  //Change document title
  useEffect(() => {
    document.title = `Cast: ${person?.name || 'Unknow Person'} - Moviemon`;
  }, [person]);

  useEffect(() => {
    const hasData = !!person;

    if (!isLoading && hasData && !hasScrolledRef.current && mainRef.current) {
      requestAnimationFrame(() => {
        mainRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      hasScrolledRef.current = true;
    }
  }, [isLoading, person]);

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      <div
        className={`movies md:flex md:flex-col ${!isLg ? 'w-full' : 'm-10'}`}
      >
        <div className="movie-wrapper md:flex md:flex-col md:w-full text-primary max-w-screen-2xl self-center">
          {person ? (
            <>
              {isMd ? (
                <>
                  <div className="details-container relative gap-4 flex m-2 my-5">
                    <div className="wrapper max-w-[250px] w-full">
                      <img
                        className={`w-fit max-w-[250px] h-fit opacity-100 rounded-lg ${
                          !imgLoaded ? 'invisible' : 'visible'
                        }`}
                        src={`https://image.tmdb.org/t/p/w780${person.profile_path}`}
                        alt=""
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgLoaded(true)}
                      />
                      {!imgLoaded && (
                        <>
                          <div className="absolute inset-0 bg-secondary max-w-[250px] rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(
                                  135deg,
                                  rgba(255,255,255,0) 0%,
                                  rgba(126,126,126,0.20) 50%,
                                  rgba(255,255,255,0) 100%
                                  )`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '300% 300%', // big enough to move smoothly
                                animation: `shimmer 1s infinite linear`,
                                animationDelay: `${Math.random() * 0.5}s`,
                              }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="heading-details flex flex-col gap-5">
                      <h2 className="text-2xl md:text-3xl font-bold md:p-0 text-shadow-2xs">
                        {person.name ? person.name : 'Unknown!'}
                      </h2>
                      <HeadingSection person={person} />
                      <DetailsSection person={person} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="details-container relative gap-4 flex flex-col mx-2">
                    <div className="profile relative justify-center items-center flex flex-col w-[70%] m-auto">
                      <img
                        className={`w-full max-w-[250px] opacity-100 rounded-md ${
                          !imgLoaded ? 'invisible' : 'visible'
                        }`}
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        alt=""
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgLoaded(true)}
                      />
                      {!imgLoaded && (
                        <>
                          <div className="relative inset-0 bg-secondary max-w-[250px] w-full h-[250px] rounded-md overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(
                                  135deg,
                                  rgba(255,255,255,0) 0%,
                                  rgba(126,126,126,0.20) 50%,
                                  rgba(255,255,255,0) 100%
                                  )`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '300% 300%', // big enough to move smoothly
                                animation: `shimmer 1s infinite linear`,
                                animationDelay: `${Math.random() * 0.5}s`,
                              }}
                            ></div>
                          </div>
                        </>
                      )}
                      <div className="w-dvh h-40 absolute bottom-0 bg-primary-gradient-to-top"></div>
                      <div className="w-dvh h-30 blur-xl absolute -bottom-5 bg-primary"></div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold absolute bottom-0 text-center md:text-start md:p-0 px-3 text-shadow-2xs md:relative">
                        {person.name ? person.name : 'Unknown!'}
                      </h2>
                    </div>
                    <HeadingSection person={person} />

                    <DetailsSection person={person} />
                  </div>
                </>
              )}
              <div className="associated-media">
                <h1 className="heading inset-0 mb-0 m-2 text-2xl md:text-3xl font-bold text-accent">
                  Known for 🌟
                </h1>
                <div className="buttons m-2 text-primary">
                  <button
                    className={`movie hover:bg-accent-hover py-1 px-2 mx-0 my-2 rounded cursor-pointer ${
                      mediaType === 'movie' ? 'bg-accent' : ''
                    }`}
                    onClick={() => setMediaType('movie')}
                  >
                    Movie
                  </button>
                  <button
                    onClick={() => setMediaType('tv')}
                    className={`movie hover:bg-accent-hover py-1 px-2 m-2 rounded cursor-pointer ${
                      mediaType === 'tv' ? 'bg-accent' : ''
                    }`}
                  >
                    TV show
                  </button>
                </div>
                <div
                  className="movie-wrapper movies-grid grid gap-3 lg:gap-4 m-2 xl:m-4
          grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
          xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:mt-0"
                >
                  {mediaType === 'movie'
                    ? person?.combined_credits?.cast?.map(
                        (media, index) =>
                          media.media_type === 'movie' && (
                            <MovieCard key={media.id * index} media={media} />
                          )
                      )
                    : person?.combined_credits?.cast?.map(
                        (media, index) =>
                          media.media_type === 'tv' && (
                            <MovieCard key={media.id * index} media={media} />
                          )
                      )}
                </div>
              </div>
            </>
          ) : (
            !isLoading && (
              <Message
                icon="🎬"
                message=" No details available associated with this person ⓘ"
              />
            )
          )}
        </div>

        {isLoading && (
          <Message
            lottie={loadingSpinner}
            message="Loading... please wait !"
            className="w-[1.4em]"
          />
        )}
      </div>
    </>
  );
}
