// 1. Connect to your MongoDB database
// replace 'yourDatabaseName' with the name of your database

// 2. Insert User Accounts
const users = [
    { name: "Alice", email: "alice@example.com", password: "password123" },
    { name: "Bob", email: "bob@example.com", password: "password123" },
    { name: "Charlie", email: "charlie@example.com", password: "password123" },
    { name: "Dave", email: "dave@example.com", password: "password123" },
    { name: "Eve", email: "eve@example.com", password: "password123" },
];

users.forEach((user) => {
    db.users.insertOne(user);
});

// 3. Get User IDs
const userIds = db.users.find().map((user) => user._id);

// 4. Insert Posts with Reactions
const reactionTypes = ["like", "laugh", "angry", "dislike"];
const getRandomReaction = () => {
    return {
        type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
        user: userIds[Math.floor(Math.random() * userIds.length)],
        createdAt: new Date(),
    };
};

const posts = [
    {
        text: "This is a controversial opinion about politics!",
        user: userIds[0],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "I think pineapple belongs on pizza!",
        user: userIds[1],
        reactions: [
            getRandomReaction(),
            getRandomReaction(),
            getRandomReaction(),
        ],
    },
    {
        text: "We should all switch to electric cars.",
        user: userIds[2],
        reactions: [getRandomReaction()],
    },
    {
        text: "Climate change is the biggest threat we face.",
        user: userIds[3],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "Social media is making people more isolated.",
        user: userIds[4],
        reactions: [getRandomReaction()],
    },
    {
        text: "I believe everyone should learn coding!",
        user: userIds[0],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "Education system is broken!",
        user: userIds[1],
        reactions: [getRandomReaction()],
    },
    {
        text: "Artificial Intelligence is the future.",
        user: userIds[2],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "We need more regulation on big tech companies.",
        user: userIds[3],
        reactions: [getRandomReaction()],
    },
    {
        text: "The world needs more open-source projects.",
        user: userIds[4],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "We should abolish the death penalty.",
        user: userIds[0],
        reactions: [getRandomReaction()],
    },
    {
        text: "Mental health is just as important as physical health.",
        user: userIds[1],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "We need universal healthcare.",
        user: userIds[2],
        reactions: [getRandomReaction()],
    },
    {
        text: "Animal rights should be prioritized more.",
        user: userIds[3],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "The government should fund free college education.",
        user: userIds[4],
        reactions: [getRandomReaction()],
    },
    {
        text: "Capitalism has too many flaws.",
        user: userIds[0],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "Every country should have the right to self-determination.",
        user: userIds[1],
        reactions: [getRandomReaction()],
    },
    {
        text: "It's time to end racism and discrimination everywhere.",
        user: userIds[2],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "People need to stop being so sensitive.",
        user: userIds[3],
        reactions: [getRandomReaction()],
    },
    {
        text: "Let's all take a step back and reconsider the way we eat.",
        user: userIds[4],
        reactions: [getRandomReaction()],
    },
    {
        text: "Space exploration is essential for humanity.",
        user: userIds[0],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "The media is too biased.",
        user: userIds[1],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "I think cryptocurrency will revolutionize finance.",
        user: userIds[2],
        reactions: [getRandomReaction()],
    },
    {
        text: "The tech industry needs more diversity.",
        user: userIds[3],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "We should legalize marijuana everywhere.",
        user: userIds[4],
        reactions: [getRandomReaction()],
    },
    {
        text: "Education shouldn't be for profit.",
        user: userIds[0],
        reactions: [getRandomReaction(), getRandomReaction()],
    },
    {
        text: "Animal testing is wrong, we need alternatives.",
        user: userIds[1],
        reactions: [getRandomReaction()],
    },
];

posts.forEach((post) => {
    db.posts.insertOne(post);
});

// 5. Verify the posts are inserted
db.posts.find().pretty();
