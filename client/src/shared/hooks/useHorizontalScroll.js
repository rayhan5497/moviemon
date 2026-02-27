import { useState, useEffect, useRef, useLayoutEffect } from 'react';

export function useHorizontalScroll({
  defaultMin = 170,
  mdMin = 140,
  smMin = 110,
  isMd,
  isLg,
}) {
  const containerRef = useRef(null);

  const [itemWidth, setItemWidth] = useState(0);
  const [cardMinWidth, setCardMinWidth] = useState(defaultMin);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update CARD_MIN_WIDTH based on breakpoints
  useEffect(() => {
    if (isMd) setCardMinWidth(mdMin);
    else if (isLg) setCardMinWidth(defaultMin);
    else setCardMinWidth(smMin);
  }, [isMd, isLg]);

  // Calculate item width
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculate = () => {
      const width = container.clientWidth;
      const items = Math.max(1, Math.floor(width / cardMinWidth));
      setItemWidth(width / items);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    observer.observe(container);

    return () => observer.disconnect();
  }, [cardMinWidth]);

  // Update scroll buttons
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const { scrollLeft, scrollWidth, offsetWidth } = container;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft + offsetWidth < scrollWidth - 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);

    container.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [itemWidth]);

  const scrollNext = () => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.firstElementChild;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const containerWidth = container.offsetWidth;
    const visible = Math.floor(containerWidth / cardWidth);

    container.scrollBy({
      left: cardWidth * visible,
      behavior: 'smooth',
    });
  };

  const scrollPrev = () => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.firstElementChild;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const containerWidth = container.offsetWidth;
    const visible = Math.floor(containerWidth / cardWidth);

    container.scrollBy({
      left: -cardWidth * visible,
      behavior: 'smooth',
    });
  };

  return {
    containerRef,
    itemWidth,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  };
}
