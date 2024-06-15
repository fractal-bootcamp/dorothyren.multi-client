
import express from "express";
import cors from "cors";

const app = express();

// cors
app.use(cors());
app.use(express.json());

const freshChat: GroupChat = {
    messages: []
}

//creating the groupchats object
let groupchats = {
    // group chat 1 (referenced by tutorial)
    tutorial: {
        messages: [],
    },
    // group chat 2 (referenced by chat2)
    chat2: {
        messages: [{ from: "user1", message: "Hello" }],
    },
};

type Message = { from: string, message: string }

type GroupChat = {
    messages: Message[];
}

// an object with { key: value } pairs where
// key is a string and value is a groupchat
// this allows us to access groupchats based on their key or "id"
type GroupChats = Record<string, GroupChat>


//checking that the GET req. works - should display Hello World
app.get("/", (req, res) => {
    res.send("Hello World");
});

// we are getting the entire groupchat object
app.get("/groupchats", (req, res) => {
    res.json(groupchats);
});

//on a specified id groupchat page, we are getting the groupchat 
app.get("/groupchat/:id", (req, res) => {
    const id = req.params.id;
    const groupchat = groupchats[id];

    res.json(groupchat);
});

//  create a new group chat
app.post("/groupchat/:id", (req, res) => {
    const id = req.params.id;
    const groupchat = groupchats[id];

    if (groupchat) {
        return res.status(400).json({ error: "Bro you can't overwrite my chat" })
    }

    groupchats[id] = { ...freshChat };

    res.json(groupchat);
});

//on a specified id groupchat page, we are posting messages
app.post("/groupchat/:id/message", (req, res) => {
    const id = req.params.id;

    const message = { from: req.body.from, message: req.body.message };

    groupchats[id].messages.push(message);

    res.json(groupchats[id]);
});


//setup PORT for server to be listening on
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
