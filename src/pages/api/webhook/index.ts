import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../prisma/client";
import { provider } from "@/lib/providers";
import { badRequest, methodNotAllowed, ok } from "@/lib/response";

export const config = {
	api: {
		bodyParser: provider.useBodyParser,
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// mailchimp sends a HEAD request to check if URL is reachable so we respond
	// with 200
	if (req.method === "HEAD") {
		return ok(res);
	}

	if (req.method !== "POST") {
		return methodNotAllowed(res);
	}

	let messages;
	try {
		messages = await provider.parseRequest(req);
	} catch (e) {
		console.error(e);
		return badRequest(res);
	}

	console.log(messages);
	try {
		for (const message of messages) {
			await db.message.create({
				data: {
					...message,
					dateSent: message.dateSent.toISOString(),
				},
			});
		}
	} catch (e) {
		// foreign key constraint failed
		return ok(res);
	}

	ok(res);
}
