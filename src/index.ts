import {definePlugin, Tool as SanityTool} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import type {AssetSource} from 'sanity'
import FormBuilderTool from './components/FormBuilderTool'
import Tool from './components/Tool'
import mediaTag from './schemas/tag'
import mediaSeason from './schemas/season'
import mediaCurrentSeason from './schemas/currentSeason'
import mediaCollaboration from './schemas/collaborations'
import {deskTool, StructureBuilder} from 'sanity/desk'

const plugin = {
  icon: ImageIcon,
  name: 'media',
  title: 'Media'
}

export const mediaAssetSource: AssetSource = {
  ...plugin,
  component: FormBuilderTool
}

const tool = {
  ...plugin,
  component: Tool
} as SanityTool

const singletonTypes = new Set(['currentseason'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export const media = definePlugin({
  name: 'media',
  form: {
    file: {
      assetSources: prev => {
        return [...prev, mediaAssetSource]
      }
    },
    image: {
      assetSources: () => {
        return [mediaAssetSource]
      }
    }
  },
  schema: {
    types: [mediaTag, mediaSeason, mediaCurrentSeason, mediaCollaboration],
    templates: templates => templates.filter(({schemaType}) => !singletonTypes.has(schemaType))
  },
  tools: prev => {
    return [...prev, tool]
  },
  plugins: [
    deskTool({
      structure: S =>
        S.list()
          .title('Structure')
          .items([
            ...S.documentTypeListItems().filter(item => !singletonTypes.has(item.getId()!)),

            S.divider(),

            singletonListItem(S, 'currentseason', 'Select Current Season')
          ])
    })
  ],
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input
  }
})

const singletonListItem = (S: StructureBuilder, typeName: string, title?: string) =>
  S.listItem()
    .title(title || typeName)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))
