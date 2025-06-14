import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or fetch a user
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userData = await ctx.db.query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (userData.length === 0) {
      const data = {
        name: args.name,
        email: args.email,
        credits: 50000,
      };
      const result = await ctx.db.insert("users", { ...data });
      console.log(result);
      return data;
    }

    return userData[0];
  },
});

// Update user token (credits)
export const UpdateUserToken = mutation({
  args: {
    userId: v.id("users"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      credits: args.credits,
    });
  },
});

// Deduct credits atomically
export const deductCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (user) {
      const newCredits = Math.max(0, user.credits - args.amount);
      await ctx.db.patch(args.userId, { credits: newCredits });
    }
  },
});

// Get user by ID
export const getUser = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user;
  },
});