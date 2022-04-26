import { wordlist } from "@/data/wordlist";

const DOMAINS = process.env
	.DOMAINS_LIST!.split(",")
	.map(domain => domain.trim());

export function generateEmail(length: number = 10): string {
	const getRandomWord = (list: string[]) =>
		list[Math.floor(Math.random() * list.length)];

	const adjective = getRandomWord(wordlist.adjectives);
	const noun = getRandomWord(wordlist.nouns);

	const name = `${adjective}-${noun}`;

	const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

	return `${name}@${domain}`;
}
