import { getToken } from "@/lib/auth";
import { generateEmail } from "@/lib/mailbox";
import { methodNotAllowed, ok } from "@/lib/response";
import { Mailbox, Message } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/client";

export type MailboxResponse = Mailbox & {
	messages: Message[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<MailboxResponse>
) {
	if (req.method !== "GET") {
		return methodNotAllowed(res);
	}

	let token = getToken(req);
	let mailbox = token
		? await db.mailbox.findFirst({
				where: { token },
				include: { messages: { orderBy: { dateSent: "desc" } } },
		  })
		: null;

	if (!mailbox) {
		const email = generateEmail();
		mailbox = await db.mailbox.create({
			data: { email },
			include: { messages: true },
		});
	}

	ok(res, mailbox);
}
