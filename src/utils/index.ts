import dayjs, { Dayjs } from "dayjs";

export function cn(...args: any[]): string {
	return args.filter(arg => arg && typeof arg === "string").join(" ");
}

export function formatDate(date: string | Date | Dayjs): string {
	return dayjs(date).format("hh:mm:ss on MMM DD, YYYY");
}
