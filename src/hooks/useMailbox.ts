import { useCallback, useEffect, useRef, useState } from "react";
import { MailboxResponse } from "@/pages/api/mailbox";
import { useInterval } from "./useIntervalFn";
import { isExtension } from "@/lib/extension";

const TOKEN_KEY = "dmail.token";
const REFRESH_INTERVAL_SECONDS = 10;

async function fetchMailbox(token?: string | null): Promise<MailboxResponse> {
	const headers = new Headers();
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	const url = isExtension
		? "https://mail.elif.pw/api/mailbox"
		: "/api/mailbox";
	const res = await fetch(url, { headers });
	const json = (await res.json()) as MailboxResponse;
	return json;
}

export function useMailbox() {
	const [mailbox, setMailbox] = useState<MailboxResponse | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const load = useCallback(async () => {
		const token = localStorage.getItem(TOKEN_KEY);
		const response = await fetchMailbox(token);
		if (response.token !== token) {
			localStorage.setItem(TOKEN_KEY, response.token);
		}
		setMailbox(response);
	}, [setMailbox]);

	const refresh = useCallback(async () => {
		setIsRefreshing(true);
		await load();
		setIsRefreshing(false);
	}, [load, setIsRefreshing]);

	const reset = useCallback(() => {
		setMailbox(null);
		localStorage.removeItem(TOKEN_KEY);
		load();
	}, [load]);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(load, isRefreshing ? null : REFRESH_INTERVAL_SECONDS * 1000);

	return { mailbox, refresh, isRefreshing, reset };
}
