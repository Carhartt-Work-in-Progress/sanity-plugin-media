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

const singletonTypes = new Set(['currentSeasonSelector'])

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
    types: [mediaTag, mediaSeason, mediaCurrentSeason, mediaCollaboration]
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
            ...S.documentTypeListItems().filter(item => {
              console.warn('THDE ITEMIDS', item.getId())
              return !singletonTypes.has(item.getId()!)
            }),

            S.divider(),

            singletonListItem(S, 'currentSeasonSelector', 'Select Current Season')
          ])
    })
  ]
})

const singletonListItem = (S: StructureBuilder, typeName: string, title?: string) =>
  S.listItem()
    .title(title || typeName)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))
