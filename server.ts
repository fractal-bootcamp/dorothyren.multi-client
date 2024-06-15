import express from "express";
import cors from "cors";

const app = express();
const PORT = 3005

//cors 
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});

const freshChat: GroupChat = {
    messages: []
}

//creat the groupchats object
let groupchats = {
    //group chat 1 (referenced by aol)
    aol: {
        messages: [],
    },
    chatroulette: {
        messages: [{ from: 'dave', message: 'wanna see something cool?' }],
    },
};

type Message = { from: string, message: string }

type GroupChat = {
    messages: Message[];
}

//GET the groupchat object
app.get("/groupchats", (req, res) => {
    res.json(groupchats);
})

//on a specific groupchat id page, we are getting the group chat
app.get("/groupchats/:id", (req, res) => {
    const id = req.params.id;
    const groupchat = groupchats.[id];

    res.json(groupchat);
})

//create a new group chat
app.post("groupchats/:id", (req, res) => {
    const id = req.params.id;
    const groupchat = groupchats.[id];

    if (groupchat) {
        return res.status(400).json({ error: 'go away' })
    }

    groupschats[id] = { ...freshChat };

    res.json(groupchats);
})

//on a specific groupchat page, we are posting messages
app.post("/groupchats/:id/messages", (req, res) => {
    const id = req.params.id;
    const message = {
        from: req.body.from,
        message: req.body.message
    };

    groupchats[id].messages.push(message);

    res.json(groupchats[id]);
});



app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
