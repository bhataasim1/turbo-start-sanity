import { defineField, defineType } from "sanity";

export const pokemon = defineType({
  name: "pokemon",
  title: "Pokemon",
  type: "object",
  description: "A Pokemon with its basic information",
  fields: [
    defineField({
      name: "id",
      title: "Pokemon ID",
      type: "number",
      description: "The unique identifier for this Pokemon",
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: "name",
      title: "Pokemon Name",
      type: "string",
      description: "The name of the Pokemon",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "types",
      title: "Pokemon Types",
      type: "array",
      description: "The types of this Pokemon",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Normal", value: "normal" },
              { title: "Fire", value: "fire" },
              { title: "Water", value: "water" },
              { title: "Electric", value: "electric" },
              { title: "Grass", value: "grass" },
              { title: "Ice", value: "ice" },
              { title: "Fighting", value: "fighting" },
              { title: "Poison", value: "poison" },
              { title: "Ground", value: "ground" },
              { title: "Flying", value: "flying" },
              { title: "Psychic", value: "psychic" },
              { title: "Bug", value: "bug" },
              { title: "Rock", value: "rock" },
              { title: "Ghost", value: "ghost" },
              { title: "Dragon", value: "dragon" },
              { title: "Dark", value: "dark" },
              { title: "Steel", value: "steel" },
              { title: "Fairy", value: "fairy" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
    defineField({
      name: "spriteUrl",
      title: "Sprite URL",
      type: "url",
      description: "The URL to the Pokemon's sprite image",
      validation: (Rule) => Rule.required().uri(),
    }),
    defineField({
      name: "height",
      title: "Height (dm)",
      type: "number",
      description: "The height of the Pokemon in decimeters",
    }),
    defineField({
      name: "weight",
      title: "Weight (hg)",
      type: "number",
      description: "The weight of the Pokemon in hectograms",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "types",
      media: "spriteUrl",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Unknown Pokemon",
      subtitle: subtitle ? subtitle.join(", ") : "No types",
      media: media ? { url: media } : undefined,
    }),
  },
});
