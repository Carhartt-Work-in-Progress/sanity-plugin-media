import {definePlugin, Tool as SanityTool} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import type {AssetSource} from 'sanity'
import FormBuilderTool from './components/FormBuilderTool'
import Tool from './components/Tool'
import mediaTag from './schemas/tag'
import mediaSeason from './schemas/season'
import mediaCurrentSeason from './schemas/currentSeason'
import mediaCollaboration from './schemas/collaborations'

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
  }
})
