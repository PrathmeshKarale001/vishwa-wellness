import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
    name: 'default',
    title: 'Vishwa Wellness',

    projectId: 'dsifqj4y',
    dataset: 'production',

    basePath: '/studio',

    plugins: [
        structureTool({
            structure: (S: any) =>
                S.list()
                    .title('Content')
                    .items([
                        // Singleton documents
                        S.listItem()
                            .title('Homepage')
                            .child(
                                S.document()
                                    .schemaType('homePage')
                                    .documentId('homePage')
                            ),
                        S.listItem()
                            .title('Global Settings')
                            .child(
                                S.document()
                                    .schemaType('siteSettings')
                                    .documentId('siteSettings')
                            ),
                        S.divider(),
                        // Regular document types
                        ...S.documentTypeListItems().filter(
                            (item: any) => !['homePage', 'siteSettings'].includes(item.getId() as string)
                        ),
                    ]),
        }),
        visionTool()
    ],

    schema: {
        types: schemaTypes,
    },
})
