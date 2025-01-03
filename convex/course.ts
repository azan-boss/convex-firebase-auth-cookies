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


export const getCourse=query({
    args:{
        id:v.string()
    },
    handler:async (ctx,args) => {

        return ctx.db.query("courses")
        .filter((q) => q.eq(q.field("id"), args.id))
        .collect();
    
    }
})