import { useRef, useEffect } from "react";

export function useInterval(cb: () => void, delay: number | null) {
	const savedCallback = useRef<() => void>();

	useEffect(() => {
		savedCallback.current = cb;
	}, [cb]);

	useEffect(() => {
		function tick() {
			savedCallback.current?.();
		}

		if (delay) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
