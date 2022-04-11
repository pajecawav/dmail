import { Provider } from "./provider";
import { MailchimpProvider } from "./mailchimp";
import { SendgridProvider } from "./sendgrid";

export const PROVIDERS: Record<string, { new (): Provider }> = {
	mailchimp: MailchimpProvider,
	sendgrid: SendgridProvider,
} as const;

const selectedProvider = process.env.PROVIDER?.toLowerCase();
if (!selectedProvider || !(selectedProvider in PROVIDERS)) {
	throw new Error(
		`Unknown provider '${selectedProvider}'. Supported providers: ${Object.keys(
			PROVIDERS
		).join(", ")}.`
	);
}

export const provider = new PROVIDERS[selectedProvider]();
