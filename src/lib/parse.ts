export function parseEmailString(sender: string): {
	name: string | null;
	email: string;
} {
	const res = /(?<name>.+) <(?<email>.+@.+\..+)>/.exec(sender);
	return res?.groups
		? { name: res.groups.name, email: res.groups.email }
		: { name: null, email: sender };
}
