import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProfile = mutation({
    args: {
        id: v.string(),
        email: v.string(),
        role: v.string(),
        courses: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        const { id, email, role, courses = [] } = args;
        return await ctx.db.insert("users", { id, email, role, courses });
    }
});

export const myProfile = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        return user;
    }
});