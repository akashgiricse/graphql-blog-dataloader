import Comment from "./models/Comment";
import Post from "./models/Post";

export const resolvers = {
  Query: {
    post: async (parent, args, context, info) => {
      const length = args.length;
      let posts = await Post.find().limit(length);
      return posts;
    },
  },

  Post: {
    comments: async (parent, args, context, info) => {
      const { loaders } = context;
      const { commentsLoader } = loaders;
      return commentsLoader.load(parent._id);
    },
  },

  Mutation: {
    addPost: async (parent, args, context, info) => {
      const title = args.title;
      let post = new Post({
        title,
      });

      await post.save();

      if (post) {
        return true;
      }
      return false;
    },

    addComment: async (parent, args, context, info) => {
      const postId = args.postId;
      console.log(postId);
      const text = args.text;
      let post = await Post.findOne({ _id: postId });

      if (!post) {
        throw new Error("Post does not exists");
      }

      let comment = new Comment({
        text,
        postId,
      });

      await comment.save();

      if (comment) {
        return true;
      }

      return false;
    },
  },
};
