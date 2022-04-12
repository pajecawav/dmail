const DOMAINS = process.env
	.DOMAINS_LIST!.split(",")
	.map(domain => domain.trim());

export function generateEmail(length: number = 10): string {
	// TODO: generate email name from a list of words
	const name = Array.from(
		{ length },
		() => Math.random().toString(36)[2]
	).join("");

	const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

	return `${name}@${domain}`;
}
