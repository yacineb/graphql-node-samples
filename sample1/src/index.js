import ExpressGraphQL from 'express-graphql';
import {buildSchema as BuildSchema} from 'graphql';
import Express from 'express';
import UUID from 'uuid';

const data = {
    posts: [
        { id: "959a4d0a-1ca8-11e9-ab14-d663bd873d93", title: "Lorem Ipsum", views: 254, user_id: 123 },
        { id: "959a525a-1ca8-11e9-ab14-d663bd873d93", title: "Sic Dolor amet", views: 65, user_id: 456 },
        { id: "959a53ae-1ca8-11e9-ab14-d663bd873d93", title: "Hola amigos", views: 20, user_id: 456 },
    ],
    users: [
        { id: 123, name: "John Doe" },
        { id: 456, name: "Jane Doe" }
    ]
};


const schema =  BuildSchema(`
type Query {
    users: [User]
    userPosts(user_id: ID!): [Post]
}
type Mutation {
    createPost(title: String!, user_id: ID!): Post
    removePost(id: ID!): Boolean
}
type Post {
    id: ID!
    title: String!
    views: Int!
    user_id: ID!
    User: User
}
type User {
    id: ID!
    name: String!
}
`);

const resolvers = { 
    users: (_)=> Promise.resolve(data.users),
    userPosts: ({user_id})=> {
        const userId = Number.parseInt(user_id);
        return data.posts.filter(x=> x.user_id === userId);
    },
    createPost: (d) => {
        d.type="Post";
        const post = {
            id: UUID.v4(),
            title: d.title,
            user_id:Number.parseInt(d.user_id),
            views:0
        };
        data.posts.push(post);
        return post;
    },
    removePost: (d) => {
        d.type="Post";
        const id = String(d.id);
        const idx = data.posts.findIndex(x=> x.id === id);

        const found = (idx >= 0);
        if (found){
            data.posts.splice(idx,1);
        }
        return found;
    },
};
 
const app = Express();
 
app.use("/graphql", new ExpressGraphQL({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));
 
app.listen(3000, () => {
    console.log("Listening at :3000");
});