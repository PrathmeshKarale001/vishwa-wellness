import { defineType, defineField } from 'sanity';
import { SubCategoryNameSelect } from '../components/SubCategoryNameSelect';

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
        defineField({
            name: 'subCategories',
            title: 'Sub-Categories',
            description: 'Define sub-items for this category (e.g. Men, Women, or Wellness Rituals)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'categorySegments',
            title: 'Sub-Category Segments mapping',
            description: 'Define segments for each sub-category here',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'subCategoryName',
                            title: 'Sub-Category Name',
                            type: 'string',
                            components: {
                                input: SubCategoryNameSelect
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'segments',
                            title: 'Segments',
                            type: 'array',
                            of: [{ type: 'string' }],
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'subCategoryName',
                            subtitle: 'segments',
                        },
                        prepare(selection: any) {
                            const { title, subtitle } = selection
                            return {
                                title,
                                subtitle: subtitle ? subtitle.join(', ') : 'No segments defined'
                            }
                        }
                    }
                },
            ],
        }),
        defineField({
            name: 'metaTitle',
            title: 'Meta Title (SEO)',
            type: 'string',
            validation: (Rule) => Rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description (SEO)',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(160),
        }),
    ],
});
