import { NextApiResponse } from "next";

export function ok<T>(res: NextApiResponse<T>, json?: T) {
	res.status(200);
	return json ? res.json(json) : res.end();
}

export function notFound(res: NextApiResponse, message: string = "Not Found") {
	return res.status(404).end(message);
}

export function methodNotAllowed(
	res: NextApiResponse,
	message: string = "Method Not Allowed"
) {
	res.status(405).end(message);
}
