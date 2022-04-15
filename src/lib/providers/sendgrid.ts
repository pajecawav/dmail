import formidable from "formidable";
import { NextApiRequest } from "next";
import { parseEmailString } from "../parse";
import { IncomingMessage, Provider } from "./provider";

// https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook#example-default-payload
interface SendgridWebhookData {
	subject: string;
	to: string;
	from: string; // NOTE: this field contains both sender's name and email
	text: string;
	envelope: string | Envelope;
}

interface Envelope {
	to: string[];
	from: string;
}

// filter function is called to check whether a file should be saved to the disk
// so we override it to always return false and ignore all files
const form = formidable({ filter: () => false });

export class SendgridProvider implements Provider {
	useBodyParser: boolean = false;

	private webhookSecret: string;

	constructor() {
		this.webhookSecret = process.env.WEBHOOK_SECRET as string;
		if (!this.webhookSecret) {
			throw new Error(`WEBHOOK_SECRET wasn't provided`);
		}
	}

	parseRequest(
		req: NextApiRequest
	): IncomingMessage[] | Promise<IncomingMessage[]> {
		if (!this.validateRequest(req)) {
			throw new Error("Unauthorized request");
		}

		return new Promise((resolve, reject) => {
			form.parse(req, (err, fields) => {
				if (err) {
					return reject(err);
				}

				const data = fields as any as SendgridWebhookData;
				const envelope: Envelope =
					typeof data.envelope === "string"
						? JSON.parse(data.envelope)
						: data.envelope;

				const from = parseEmailString(envelope.from);
				const message: IncomingMessage = {
					mailboxEmail: parseEmailString(data.to).email,
					subject: data.subject,
					text: data.text.trim(),
					fromName: from.name ?? undefined,
					fromEmail: from.email,
					dateSent: new Date(),
				};

				resolve([message]);
			});
		});
	}

	validateRequest(req: NextApiRequest): boolean {
		const secret = req.query.secret as string;
		return !!secret && this.webhookSecret === secret;
	}
}
