import { NextApiRequest } from "next";
import { IncomingMessage, Provider } from "./provider";
import crypto from "crypto";

// https://mailchimp.com/developer/transactional/docs/webhooks/#inbound-messages
interface MailchimpInboundEvent {
	event: "inbound";
	ts: number;
	msg: {
		email: string;
		from_name: string;
		from_email: string;
		to: string[][];
		subject: string;
		text: string;
		html: string;
		sender: unknown;
		text_flowed: boolean;
	};
}

interface MailchimpWebhookData {
	mandrill_events: MailchimpInboundEvent[];
}

export class MailchimpProvider implements Provider {
	useBodyParser: boolean = true;

	private webhookKey: string;
	private baseUrl: string;

	constructor() {
		this.webhookKey = process.env.MAILCHIMP_WEBHOOK_KEY as string;
		this.baseUrl = process.env.BASE_URL as string;

		if (!this.webhookKey) {
			throw new Error(`MAILCHIMP_WEBHOOK_KEY wasn't provided`);
		}

		if (!this.baseUrl) {
			throw new Error(`BASE_URL wasn't provided`);
		}
	}

	parseRequest(
		req: NextApiRequest
	): IncomingMessage[] | Promise<IncomingMessage[]> {
		if (!this.validateRequest(req)) {
			throw new Error("Invalid signature");
		}

		const events = this.getEvents(req);

		const messages: IncomingMessage[] = [];
		for (const { msg, ts } of events) {
			messages.push({
				mailboxEmail: msg.to[0][0],
				subject: msg.subject.trim(),
				text: msg.text.trim(),
				fromName: msg.from_name,
				fromEmail: msg.from_email,
				dateSent: new Date(ts * 1000),
			});
		}

		return messages;
	}

	getEvents(req: NextApiRequest): MailchimpInboundEvent[] {
		let { mandrill_events: events } = req.body as MailchimpWebhookData;
		if (typeof events === "string") {
			events = JSON.parse(events);
		}
		events = events.filter(event => event.event === "inbound");
		return events;
	}

	// https://mailchimp.com/developer/transactional/guides/track-respond-activity-webhooks/#authenticating-webhook-requests
	validateRequest(req: NextApiRequest): boolean {
		const url = new URL(req.url!, this.baseUrl);
		const webhookUrl = url.href;

		const params = req.body;
		const paramKeys = Object.keys(params);
		paramKeys.sort();

		let signedData = webhookUrl;
		for (const key of paramKeys) {
			signedData += key + params[key as any];
		}

		const hmac = crypto.createHmac("sha1", this.webhookKey);
		hmac.update(signedData);

		const signature = req.headers["x-mandrill-signature"];
		const generatedSignature = hmac.digest("base64");

		return !!signature && signature === generatedSignature;
	}
}
