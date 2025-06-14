import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(),
    expertName: v.string(),  // ✅ New required field
  },
  handler: async (ctx, args) => {
    try {
      // Insert the new room into the 'DiscussionRoom' table
      const result = await ctx.db.insert("DiscussionRoom", {
        coachingOption: args.coachingOption, 
        expertName: args.expertName,  // ✅ Include in insert
      });

      console.log("Insert Result:", result);
      return result;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create the discussion room.");
    }
  }
});

export const GetDiscussionRoom = query({
  args: {
    id: v.id("DiscussionRoom")
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  }
});
