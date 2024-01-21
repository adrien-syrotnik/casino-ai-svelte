interface MessageFeedServer {
    name: string;
    timestamp: number;
    message: string;
}

let messageFeed: MessageFeedServer[] = [];

export const addMessage = (message: MessageFeedServer) => {
    messageFeed.push(message);

    //Remove old messages (more than 10 seconds)
    messageFeed = messageFeed.filter(message => {
        const now = new Date();
        const diff = now.getTime() - message.timestamp;
        const seconds = diff / 1000;
        return seconds < 10;
    });

    console.log(messageFeed);



}

export const getMessages = (lastTimestamp: number) => {
    return messageFeed.filter(message => {
        return message.timestamp > lastTimestamp;
    });
}