import { NextApiRequest } from "next";
import { IncomingMessage, Provider } from "./provider";

// https://developers.sendinblue.com/docs/inbound-parsing-api-1#parsed-email-payload
interface SendinblueWebhookData {
	items: SendinblueInboundEvent[];
}

interface SendinblueInboundEvent {
	Uuid: string[];
	MessageId: string;
	InReplyTo?: string;
	From: Mailbox;
	To: Mailbox[];
	Cc: Mailbox[];
	ReplyTo?: Mailbox;
	SentAtDate: string;
	Subject: string;
	RawHtmlBody?: string;
	RawTextBody?: string;
	ExtractedMarkdownMessage: string;
	ExtractedMarkdownSignature?: string;
	"Spam.Score": number;
	// Attachments: Attachment[];
	Headers: string[];
}

interface Mailbox {
	Address: string;
	Name?: string;
}

export class SendinblueProvider implements Provider {
	useBodyParser: boolean = true;

	private webhookSecret: string;

	constructor() {
		this.webhookSecret = process.env.WEBHOOK_SECRET as string;
		if (!this.webhookSecret) {
			throw new Error(`WEBHOOK_SECRET wasn't provided`);
		}
	}

	parseRequest(req: NextApiRequest): IncomingMessage[] {
		if (!this.validateRequest(req)) {
			throw new Error("Unauthorized request");
		}

		const { items } = req.body as SendinblueWebhookData;
		const messages: IncomingMessage[] = items.map(item => ({
			mailboxEmail: item.To[0].Address,
			subject: item.Subject,
			text: item.RawTextBody ?? "Failed to parse body.",
			fromName: item.From.Name,
			fromEmail: item.From.Address,
			dateSent: new Date(item.SentAtDate),
		}));

		return messages;
	}

	validateRequest(req: NextApiRequest): boolean {
		const secret = req.query.secret as string;
		return !!secret && this.webhookSecret === secret;
	}
}
