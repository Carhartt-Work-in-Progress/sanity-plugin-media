import {CURRENT_SEASON_DOCUMENT_NAME} from '../constants'
import TagIcon from '../components/TagIcon'

export default {
  title: 'Current Season',
  icon: TagIcon,
  name: CURRENT_SEASON_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      name: 'currentseason',
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
    prepare() {
      return {
        media: TagIcon,
        title: 'Current Season'
      }
    }
  }
}
