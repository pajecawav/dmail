import { Provider } from "./provider";
import { MailchimpProvider } from "./mailchimp";

export const providers: Record<string, Provider> = {
	mailchimp: new MailchimpProvider(),
};

const selectedProvider = process.env.PROVIDER?.toLowerCase();
if (!selectedProvider || !(selectedProvider in providers)) {
	throw new Error(
		`Unknown provider '${selectedProvider}'. Supported providers: ${Object.keys(
			providers
		).join(", ")}.`
	);
}

export const provider = providers[selectedProvider];
