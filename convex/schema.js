import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";
export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),//convex khud hi id bnadega user ki ho no column for that 
        credits: v.number(),
        subscriptionId: v.optional(v.string()),
        role: v.optional(v.string())
    }),
    DiscussionRoom: defineTable({
        coachingOption: v.optional(v.string()),
        expertName: v.optional(v.string()),
        topic: v.optional(v.string()),
        userName: v.optional(v.string()), 
        language: v.optional(v.string()),
        conversation:v.optional(v.any())
    }),
    Room: defineTable({
        coachingOption: v.string(),
        expertName: v.string(),
        conversation:v.optional(v.any())
    }),
    Conversation: defineTable({
        AgentOption: v.string(),
        Language: v.string(),
        transcription:v.optional(v.any())
    })
})  
