import { useEffect, type RefObject } from "react";

export default function useMasonryLayout(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    import("masonry-layout")
      .then(({ default: Masonry }) => {
        if (ref.current) new Masonry(ref.current); // eslint-disable-line no-new
      })
      .catch(console.error); // eslint-disable-line no-console
  }, [ref]);
}
