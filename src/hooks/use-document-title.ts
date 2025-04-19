import { useRef, useEffect } from 'react';

/**
 * A custom React hook to dynamically set the document title.
 * It optionally reverts the title back to its original value when the component unmounts.
 *
 * @param {string} title - The title to set for the document.
 * @param {boolean} [retainOnUnmount=false] - If true, the title set by this hook
 * will remain even after the component unmounts. If false (default), the title
 * will be reverted to its value before the hook was first called in the component.
 */
export function useDocumentTitle(title?: string, retainOnUnmount: boolean = false) {
  const initialTitleRef = useRef<string>(document.title);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    const originalTitle = initialTitleRef.current;

    return () => {
      if (!retainOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [retainOnUnmount]);
}
