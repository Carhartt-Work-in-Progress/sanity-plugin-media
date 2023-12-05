import {SEASONS_DOCUMENT_NAME} from '../constants'
import TagIcon from '../components/TagIcon'

export default {
  title: 'Season',
  icon: TagIcon,
  name: SEASONS_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'slug'
    },
    {
      title: 'Current Season',
      type: 'boolean',
      name: 'isCurrentSeason',
      description: 'Set to true to set this as current season'
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare(selection: any) {
      const {name} = selection
      return {
        media: TagIcon,
        title: name?.current
      }
    }
  }
}
