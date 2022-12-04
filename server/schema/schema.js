const graphql = require("graphql");
const User = require("../model/user.model");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } =
  graphql;

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString },
    image: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    facebookId: { type: GraphQLString },
    name: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return parent.tasks;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { facebookId: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ facebookId: args.facebookId });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        facebookId: { type: GraphQLString },
        name: { type: GraphQLString },
        dateOfBirth: { type: GraphQLString },
        imageURL: { type: GraphQLString },
        // tasks: { type: new GraphQLList(TaskType) },
      },
      resolve(parent, args) {
        let user = new User({
          facebookId: args.facebookId,
          name: args.name,
          dateOfBirth: args.dateOfBirth,
          imageURL: args.imageURL,
          tasks: args.tasks,
        });
        return user.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
