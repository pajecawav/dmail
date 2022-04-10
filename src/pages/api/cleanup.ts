import { MAILBOX_EXPIRE_TIME_SECONDS } from "@/lib/constants";
import { methodNotAllowed, ok } from "@/lib/response";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return methodNotAllowed(res);
	}

	const result = await db.mailbox.deleteMany({
		where: {
			dateCreated: {
				lt: new Date(Date.now() - MAILBOX_EXPIRE_TIME_SECONDS * 1000),
			},
		},
	});

	console.log(`Deleted ${result.count} mailboxes`);

	ok(res);
}
