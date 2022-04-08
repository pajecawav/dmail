import { NextApiRequest } from "next";

export function getToken(req: NextApiRequest): string | null {
	const authorization = req.headers.authorization;

	if (!authorization) {
		return null;
	}

	const [, token] = authorization.split(" ");
	return token ?? null;
}
