import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEffectAfterMount(fn: () => void, deps: any[] = []) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; // Skip effect on the initial mount
    }
    fn();
  }, deps);

  return isMounted;
}
