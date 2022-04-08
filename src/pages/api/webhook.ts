import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/client";
import { provider } from "@/lib/providers";
import { methodNotAllowed, ok } from "@/lib/response";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return methodNotAllowed(res);
	}

	const messages = await provider.parseRequest(req);
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
