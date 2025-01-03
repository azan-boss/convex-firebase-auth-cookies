import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createCourse = mutation({
    args: {
        id: v.string(),
        title: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("courses", args);
    },
});


export const getCourses = query({ 
    handler:async(ctx)=>{
        return await ctx.db.query("courses").collect();
    }
})


export const getCourse = query({
    args: {
        id: v.string()
    },
    handler: async ({ db }, args) => {
        return await db.query("courses")
            .filter(q => q.eq(q.field("id"), args.id))
            .unique();
    }
})


export const enrollToCourse = mutation({
    args: {
        id: v.string(),
        userId:v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const course = await ctx.db.query("courses")
            .filter(q => q.eq(q.field("id"), args.id))
            .unique();
        
        if (!course) {
            throw new Error("Course not found");
        }

       
        
        // Update the user's courses array
        const user = await ctx.db.query("users")
            .filter(q => q.eq(q.field("id"), args.userId))
            .unique();
        
        if (!user) {
            throw new Error("User not found");
        }

        const courses = user.courses || [];
        if (!courses.includes(args.id)) {
            await ctx.db.patch(user._id, {
                courses: [...courses, args.id]
            });
        }

        return course;
    }
})