import { h, createRef } from "preact";

import { useState, useEffect } from "preact/hooks";
import icon from "./copy.svg";
import trash from "./trash.svg";

function getLocalAddress() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("address");
    }
    return null;
}

function setLocalAddress(address) {
    if (typeof window !== "undefined") {
        return localStorage.setItem("address", address);
    }
    return null;
}

async function fetchMessages(address) {
    const handle = address.split("@")[0];
    const response = await fetch(`/api/mailboxes/${handle}`);
    if (response.status === 404) {
        throw 404;
    }
    const json = await response.json();
    return json.messages;
}

async function fetchRandomMailbox() {
    const response = await fetch("/api/mailboxes", { method: "POST" });
    const address = await response.text();
    return address.replace(/"/g, "");
}

function Message(props) {
    let [clicks, setClicks] = useState(0);

    let toggle = () => {
        setClicks(clicks + 1);
    };

    return (
        <div className="flex odd:bg-gray-100 gap-2">
            <div className="flex my-2">
                <div
                    className={`h-full w-0.5 ml-4 rounded-full bg-blue-300 ${
                        clicks && "invisible"
                    }`}
                />
                <div className="ml-2 mr-6">
                    <div
                        className="cursor-pointer hover:underline"
                        onClick={toggle}
                    >
                        <div className="text-gray-400">{props.from_user}</div>
                        <div className="">{props.subject}</div>
                    </div>
                    {clicks % 2 === 1 && (
                        <div className="mt-4">{props.text}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    let [address, setAddress] = useState(getLocalAddress());
    let [messages, setMessages] = useState([]);

    useEffect(() => {
        if (address) {
            let timer = setInterval(
                () =>
                    fetchMessages(address)
                        .then((messages) => {
                            setMessages(messages);
                        })
                        .catch((error) => {
                            if (error === 404) {
                                setAddress(null);
                            } else {
                                throw error;
                            }
                        }),
                5000
            );
            return () => clearInterval(timer);
        }
        const fetchAddress = async () => {
            let newAddress = await fetchRandomMailbox();
            setAddress(newAddress);
            setLocalAddress(newAddress);
        };
        return fetchAddress();
    }, [address]);

    let addressInputRef = createRef();

    return (
        <div className="flex justify-center h-full sm:items-center">
            <div className="flex flex-col px-4 my-4 sm:mt-0 w-136">
                <div className="mb-4 text-2xl text-center">
                    Disposable Mail Address
                </div>
                <div className="relative flex w-full p-4 mx-auto mb-4 bg-gray-100 border border-gray-200 rounded-full sm:w-3/4">
                    <input
                        className="flex-grow mr-16 bg-transparent"
                        value={address || "Loading..."}
                        onClick={(event) => event.target.select()}
                        title="Your mail address"
                        readonly
                        ref={addressInputRef}
                    />
                    <img
                        src={icon}
                        className="absolute cursor-pointer right-12"
                        title="Copy to clipboard"
                        onClick={() => {
                            navigator.clipboard.writeText(address);
                            addressInputRef.current.select();
                        }}
                    />
                    <img
                        src={trash}
                        className="absolute cursor-pointer right-4"
                        title="Delete mailbox"
                        onClick={() => {
                            setLocalAddress(null);
                            setAddress(null);
                        }}
                    />
                </div>
                <div className="flex flex-col h-full overflow-y-auto border border-gray-200 max-h-120 sm:h-96 shadow-sm rounded-3xl">
                    {messages.map((message) => (
                        <Message {...message} />
                    ))}
                    {!messages.length && (
                        <div className="m-auto">No messages.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
