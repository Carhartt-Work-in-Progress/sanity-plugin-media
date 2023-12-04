import {SchemaIcon} from '@sanity/icons'
import {CURRENT_SEASON_DOCUMENT_NAME} from '../constants'

export default {
  title: 'Current Season',
  icon: SchemaIcon,
  name: CURRENT_SEASON_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      name: 'currentSeasonSelector',
      type: 'object',
      title: 'Select Current Season',
      fields: [
        {
          title: 'Season',
          name: 'seasons',
          type: 'reference',
          to: [{type: 'seasons'}]
        }
      ]
    }
  ],
  preview: {
    // select: {
    //   name: 'name'
    // },
    // prepare(selection: any) {
    //   const {name} = selection
    //   return {
    //     media: TagIcon,
    //     title: name?.current
    //   }
    // }
  }
}
