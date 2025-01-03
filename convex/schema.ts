import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        id: v.string(),
        email: v.string(),
        role: v.string(),
        courses: v.optional(v.array(v.string()))
    }),
    courses: defineTable({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        
    })
});