import { useMailbox } from "@/hooks/useMailbox";
import { cn, formatDate } from "@/utils";
import {
	ClipboardCopyIcon,
	RefreshIcon,
	TrashIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";

export default function HomePage() {
	const { mailbox, refresh, isRefreshing, reset } = useMailbox();

	return (
		<main className="bg-slate-50 max-w-3xl h-full flex flex-col items-stretch gap-4 py-2 mx-4 text-slate-600 font-light md:mx-auto">
			<h1 className="text-center text-3xl">Disposable Mail Address</h1>

			<div className="max-w-lg w-full h-12 self-center flex gap-2 items-stretch">
				<input
					className="border rounded-full p-3 flex-grow flex-shrink outline-none selection:bg-brand-100"
					type="text"
					value={mailbox?.email ?? "Loading..."}
					title="Your temporary email address"
					readOnly
					size={1}
					onClick={e => {
						(e.target as HTMLInputElement).select();
					}}
				/>
				<button
					className="h-12 bg-white rounded-full p-3 border hover:bg-brand-50 disabled:opacity-50 disabled:bg-white"
					title="Copy to clipboard"
					onClick={() => {
						if (mailbox?.email) {
							navigator.clipboard.writeText(mailbox.email);
						}
					}}
					disabled={!mailbox}
				>
					<ClipboardCopyIcon className="h-full" />
				</button>
				<button
					className={cn(
						"h-12 bg-white rounded-full p-3 border hover:bg-brand-50 disabled:opacity-50 disabled:bg-white",
						isRefreshing && "animate-reverse-spin"
					)}
					title="Refresh mailbox"
					onClick={() => refresh()}
					disabled={!mailbox || isRefreshing}
				>
					<RefreshIcon className="h-full" />
				</button>
				<button
					className="h-12 bg-white rounded-full p-3 border hover:bg-brand-50 disabled:opacity-50 disabled:bg-white"
					title="Delete mailbox"
					onClick={() => reset()}
					disabled={!mailbox}
				>
					<TrashIcon className="h-full" />
				</button>
			</div>

			<div className="flex rounded-3xl overflow-hidden border min-h-[20rem] bg-white">
				{!mailbox || mailbox.messages.length === 0 ? (
					<div className="m-auto text-xl">Your inbox is empty.</div>
				) : (
					<div className="w-full">
						{mailbox.messages.map(message => (
							<details
								className="w-full px-4 py-2 border-b"
								key={message.id}
							>
								<summary className="list-none hover:cursor-pointer hover:underline">
									<div className="text-slate-400 flex">
										<div>{message.fromEmail}</div>
										<div
											className="ml-auto"
											title={`Sent ${formatDate(
												message.dateSent
											)}`}
										>
											{dayjs(message.dateSent).fromNow()}
										</div>
									</div>
									{message.fromName && (
										<div className="text-slate-400">
											{message.fromName}
										</div>
									)}
									<div>{message.subject}</div>
								</summary>
								<div className="mt-4 whitespace-pre-wrap">
									{message.text}
								</div>
							</details>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
