import { useCallback, useRef } from 'react';

const SCROLL_AMOUNT = 320;
const WHEEL_SPEED = 5;

/**
 * Provides horizontal scroll logic for the trailer thumbnail carousel,
 * including wheel-to-horizontal scroll conversion.
 *
 * Uses a callback ref to attach a non-passive wheel listener on the DOM node
 * directly, so that preventDefault() can block the container from scrolling
 * vertically when the user's intent is to scroll horizontally.
 */
export default function useCarouselScroll() {
  const nodeRef = useRef(null);

  const carouselRef = useCallback((node) => {
    // Clean up previous listener if the node changes
    if (nodeRef.current && nodeRef.current._wheelHandler) {
      nodeRef.current.removeEventListener('wheel', nodeRef.current._wheelHandler);
    }

    nodeRef.current = node;

    if (!node) return;

    const handler = (e) => {
      // Only intercept when the vertical delta is the dominant axis
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const { scrollLeft, scrollWidth, clientWidth } = node;
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

        // If there is room to scroll horizontally, consume the event
        if (!atStart || !atEnd) {
          e.preventDefault();
          node.scrollLeft += e.deltaY * WHEEL_SPEED;
        }
      }
    };

    node._wheelHandler = handler;
    node.addEventListener('wheel', handler, { passive: false });
  }, []);

  const scrollCarousel = useCallback((direction) => {
    const el = nodeRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  }, []);

  return { carouselRef, scrollCarousel };
}
