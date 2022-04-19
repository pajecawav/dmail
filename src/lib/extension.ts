export const isExtension =
	typeof window !== "undefined" &&
	!!((window as any).chrome?.runtime?.id || (window as any).browser);
