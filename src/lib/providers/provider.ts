import { NextApiRequest } from "next";

export interface IncomingMessage {
	mailboxEmail: string;
	subject: string;
	text: string;
	fromName?: string;
	fromEmail: string;
	dateSent: Date;
}

export interface Provider {
	useBodyParser: boolean;

	parseRequest(
		req: NextApiRequest
	): IncomingMessage[] | Promise<IncomingMessage[]>;
}
