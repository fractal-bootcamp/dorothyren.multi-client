import { useEffect, useState } from "react";
import "./App.css";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3005";

// function that takes 3 arguments - a grouchatId, a name, and a message
// it returns a promise of a response (because it returns called fetch, which returns a promise of a response)
const sendMessage = (groupChatId: string, name: string, message: string) => {
    // call fetch and return the response
    // fetch takes 2 arguments - a url and an init (configuration object)
    // how do I configure my request? 
    // url = if no serverUrl and groupChatId = 10, http://localhost:3005/groupchat/10/message
    return fetch(`${serverUrl}/groupchat/${groupChatId}/message`, {
        // I want my request to be a POST request
        method: "POST",
        // I want my request to have the following headers
        headers: {
            // Tell the server that I'm sending some JSON
            "Content-Type": "application/json",
            // Tell the server that it's okay if I'm hitting ngrok
            "ngrok-skip-browser-warning": "69420",
        },
        // send the name and message from the arguments as a server 
        // message format (name, message) -> ({ from, message })
        // on the request body
        body: JSON.stringify({ from: name, message: message }),
    });
};

// Getting the group chat
const getGroupChat = async (groupChatId: string) => {
    // passing in 1 argument, groupChatId
    // sending a GET request (all fetches default to GET)
    const response = await fetch(`${serverUrl}/groupchat/${groupChatId}`, {
        // this is redundant
        method: "GET",
        // I want my request to have these headers
        headers: {
            "ngrok-skip-browser-warning": "69420",
        },
    });
    // receive a response
    // parse the response payload from a string into a json object
    // return it
    return response.json();
};

// hardcode the group chat

function App() {
    const [groupChatId, setGroupChatId] = useState("tutorial")
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [tic, setTic] = useState(0);

    // we're passing this to a button (Send)
    // when you click this button, it sendsMessage with latest changes
    const onSend = () => {
        sendMessage(groupChatId, name, message);
    };

    // a useEffect takes 2 arguments
    // the first argument is a function - it's called when an item in the second argument updates
    // the second argument is an array of values that could possibly change
    // when any of these values change, the function runs
    // the function also runs once when the component first starts (mounts) (renders for the first time)
    useEffect(() => {
        // we are defining the function that fetches and set all of the messages
        const fetchMessages = async () => {
            // calling fetch function, receiving the group chat object
            const groupChat = await getGroupChat(groupChatId);
            // sets the messages state to the groupchat messages returned from the server
            setMessages(groupChat.messages);
        };

        // call this function
        fetchMessages();

        // update the messages every second
        // takes 2 arguments
        // handler = function, in this case - sets the tic to tic + 1 (changes)
        // number = number of milliseconds that it waits before it calls this function
        // in 1 second, when tic updates, the dependency array will notice the change and rerun this 
        // first useEffect argument / function
        setTimeout(() => setTic(tic + 1), 1000);

    }, [tic]);

    return (
        <div>
            <div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                />
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder="Message"
                />
                <input
                    value={groupChatId}
                    onChange={(e) => setGroupChatId(e.target.value)}
                    type="text"
                    placeholder="groupChatId"
                />
                <button onClick={onSend}>Send</button>
            </div>
            <h1>Groupchat</h1>
            {messages.map((message, index) => (
                <div key={index}>
                    <strong>{message.from}</strong>: {message.message}
                </div>
            ))}
        </div>
    );
}

export default App;
