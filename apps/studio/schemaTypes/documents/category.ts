import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

import { GROUP, GROUPS } from "../../utils/constant";
import { createSlug, isUnique } from "../../utils/slug";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  groups: GROUPS,
  description: "A category for organizing blog posts by topic or theme.",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Category Name",
      description: "The name of the category (e.g., 'Sanity', 'Next.js', 'Web Development')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category name is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief description of what this category is about",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL Slug",
      description: "The URL-friendly version of the category name (e.g., 'sanity', 'nextjs')",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "name",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => Rule.required().error("A URL slug is required"),
    }),
    defineField({
      name: "color",
      type: "string",
      title: "Category Color",
      description: "A color to represent this category in the UI",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" },
          { title: "Red", value: "red" },
          { title: "Yellow", value: "yellow" },
          { title: "Pink", value: "pink" },
          { title: "Indigo", value: "indigo" },
        ],
        layout: "dropdown",
      },
      initialValue: "blue",
    }),
  ],
  preview: {
    select: {
      title: "name",
      description: "description",
      color: "color",
      slug: "slug.current",
    },
    prepare: ({ title, description, color, slug }) => ({
      title: title || "Untitled Category",
      subtitle: description || slug || "No description",
      media: TagIcon,
    }),
  },
});
