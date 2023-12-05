import {CURRENT_SEASON_DOCUMENT_NAME} from '../constants'
import TagIcon from '../components/TagIcon'

export default {
  title: 'Current Season',
  icon: TagIcon,
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
    select: {
      name: 'currentSeasonSelector'
    },

    prepare(selection: any) {
      // const {name} = selection
      console.warn('THE SELECTION', selection)

      return {
        media: TagIcon,
        title: 'Current Season'
        // subtitle: name
      }
    }
  }
}
