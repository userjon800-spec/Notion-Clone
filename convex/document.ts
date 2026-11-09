import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const createDocument = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      isFavorite: false,
    });
    return document;
  },
});

export const getDocuments = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const exisitngDocument = await ctx.db.get(args.id);
    if (!exisitngDocument) {
      throw new Error("Not found");
    }
    if (exisitngDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const archivedChildren = async (documentId: Id<"documents">) => {
      const childrens = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();
      for (const child of childrens) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await archivedChildren(child._id);
      }
    };
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    await archivedChildren(args.id);
    return document;
  },
});

export const getTrashDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const exisitngDocument = await ctx.db.get(args.id);
    if (!exisitngDocument) {
      throw new Error("Not found");
    }
    if (exisitngDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const documents = await ctx.db.delete(args.id);
    return documents;
  },
});

export const getDocumentById = query({
  args: {
    id: v.id("documents"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Not found");
    }
    if (document.isPublished && !document.isArchived) {
      return document;
    }
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }
    return document;
  },
});

export const updateFields = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const { id, ...rest } = args;
    const exisitngDocument = await ctx.db.get(args.id);
    if (!exisitngDocument) {
      throw new Error("Not found");
    }
    if (exisitngDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const document = await ctx.db.patch(id, rest);
    return document;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const exisitngDocument = await ctx.db.get(args.id);
    if (!exisitngDocument) {
      throw new Error("Not found");
    }
    if (exisitngDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const unarchivedChildren = async (documentId: Id<"documents">) => {
      const childrens = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();
      for (const child of childrens) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await unarchivedChildren(child._id);
      }
    };
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (exisitngDocument.parentDocument) {
      options.parentDocument = undefined;
    }
    const document = await ctx.db.patch(args.id, options);
    await unarchivedChildren(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return documents;
  },
});

export const getAllDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", undefined),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const toggleFavorite = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Not found");
    }
    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const isFavorite = !document.isFavorite;
    await ctx.db.patch(args.id, { isFavorite });
    return isFavorite;
  },
});

export const getFavorites = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("isFavorite"), true),
        ),
      )
      .order("desc")
      .collect();
    return documents;
  },
});

export const duplicate = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Not found");
    }
    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const newDocument = await ctx.db.insert("documents", {
      title: `${document.title || "Untitled"} (Copy)`,
      userId,
      isArchived: false,
      isPublished: false,
      isFavorite: false,
      parentDocument: document.parentDocument,
      content: document.content,
      coverImage: document.coverImage,
      icon: document.icon,
    });
    return newDocument;
  },
});

export const getBreadcrumbs = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const breadcrumbs: Array<{
      id: Id<"documents">;
      title: string;
      icon?: string;
    }> = [];
    let currentId: Id<"documents"> | undefined = args.id;

    while (currentId) {
      const doc = await ctx.db.get(currentId);
      if (!doc || doc.userId !== userId) break;
      breadcrumbs.unshift({
        id: doc._id,
        title: doc.title || "Untitled",
        icon: doc.icon,
      });
      currentId = doc.parentDocument;
    }

    return breadcrumbs;
  },
});

export const emptyTrash = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    for (const doc of documents) {
      await ctx.db.delete(doc._id);
    }
    return documents.length;
  },
});
