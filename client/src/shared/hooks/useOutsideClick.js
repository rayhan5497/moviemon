import { useEffect } from 'react';

const toRefList = (refs) => {
  if (!refs) return [];
  return Array.isArray(refs) ? refs.filter(Boolean) : [refs];
};

const isInsideAnyRef = (refs, target) =>
  refs.some((ref) => {
    const node = ref?.current;
    return node && target && (node === target || node.contains(target));
  });

export const useOutsideClick = (refs, callback, options = {}) => {
  const {
    enabled = true,
    ignoreRefs = [],
    detectIframe = false,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const allRefs = [...toRefList(refs), ...toRefList(ignoreRefs)];

    const handlePointerDown = (event) => {
      if (isInsideAnyRef(allRefs, event.target)) return;
      callback(event);
    };

    const handleWindowBlur = () => {
      if (!detectIframe) return;

      const activeElement = document.activeElement;
      if (activeElement?.tagName !== 'IFRAME') return;
      if (isInsideAnyRef(allRefs, activeElement)) return;

      callback();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    if (detectIframe) {
      window.addEventListener('blur', handleWindowBlur);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);

      if (detectIframe) {
        window.removeEventListener('blur', handleWindowBlur);
      }
    };
  }, [refs, callback, enabled, ignoreRefs, detectIframe]);
};
