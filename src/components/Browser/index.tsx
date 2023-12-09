import type {MutationEvent} from '@sanity/client'
import {Card, Flex, PortalProvider, studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {Asset, Tag} from '@types'
import groq from 'groq'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
  useColorScheme,
  type AssetSourceComponentProps,
  type SanityDocument,
  useClient
} from 'sanity'
import {TAG_DOCUMENT_NAME} from '../../constants'
import {AssetBrowserDispatchProvider} from '../../contexts/AssetSourceDispatchContext'
import useVersionedClient from '../../hooks/useVersionedClient'
import {assetsActions} from '../../modules/assets'
import {tagsActions} from '../../modules/tags'
import GlobalStyle from '../../styled/GlobalStyles'
import Controls from '../Controls'
import DebugControls from '../DebugControls'
import Dialogs from '../Dialogs'
import Header from '../Header'
import Items from '../Items'
import Notifications from '../Notifications'
import PickedBar from '../PickedBar'
import ReduxProvider from '../ReduxProvider'
import UploadDropzone from '../UploadDropzone'
import {seasonActions} from '../../modules/seasons'
import {collaborationActions} from '../../modules/collaborations'
import SeasonsPanel from '../SeasonsPanel'
import CollaborationsPanel from '../CollaborationPanel'
import {useSaveSecrets} from '../../modules/mux/useSaveSecrets'

type Props = {
  assetType?: AssetSourceComponentProps['assetType']
  document?: SanityDocument
  onClose?: AssetSourceComponentProps['onClose']
  onSelect?: AssetSourceComponentProps['onSelect']
  selectedAssets?: AssetSourceComponentProps['selectedAssets']
}

const BrowserContent = ({onClose}: {onClose?: AssetSourceComponentProps['onClose']}) => {
  const client = useVersionedClient()

  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null)

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleAssetUpdate = (update: MutationEvent) => {
    const {documentId, result, transition} = update

    if (transition === 'appear') {
      dispatch(assetsActions.listenerCreateQueue({asset: result as Asset}))
    }

    if (transition === 'disappear') {
      dispatch(assetsActions.listenerDeleteQueue({assetId: documentId}))
    }

    if (transition === 'update') {
      dispatch(assetsActions.listenerUpdateQueue({asset: result as Asset}))
    }
  }

  const handleTagUpdate = (update: MutationEvent) => {
    const {documentId, result, transition} = update

    if (transition === 'appear') {
      dispatch(tagsActions.listenerCreateQueue({tag: result as Tag}))
    }

    if (transition === 'disappear') {
      dispatch(tagsActions.listenerDeleteQueue({tagId: documentId}))
    }

    if (transition === 'update') {
      dispatch(tagsActions.listenerUpdateQueue({tag: result as Tag}))
    }
  }

  // Effects
  useEffect(() => {
    // Fetch assets: first page
    dispatch(assetsActions.loadPageIndex({pageIndex: 0}))

    // Fetch all tags
    dispatch(tagsActions.fetchRequest())
    dispatch(seasonActions.fetchRequest())
    dispatch(collaborationActions.fetchRequest())

    // Listen for asset and tag changes in published documents.
    // Remember that Sanity listeners ignore joins, order clauses and projections!
    // Also note that changes to the selected document (if present) will automatically re-load the media plugin
    // due to the desk pane re-rendering.
    const subscriptionAsset = client
      .listen(
        groq`*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))]`
      )
      .subscribe(handleAssetUpdate)

    const subscriptionTag = client
      .listen(groq`*[_type == "${TAG_DOCUMENT_NAME}" && !(_id in path("drafts.**"))]`)
      .subscribe(handleTagUpdate)

    return () => {
      subscriptionAsset?.unsubscribe()
      subscriptionTag?.unsubscribe()
    }
  }, [])

  return (
    <PortalProvider element={portalElement}>
      <UploadDropzone>
        <Dialogs />
        <Notifications />

        <Card display="flex" height="fill" ref={setPortalElement}>
          <Flex direction="column" flex={1}>
            {/* Header */}
            <Header onClose={onClose} />

            {/* Browser Controls */}
            <Controls />

            <Flex flex={1}>
              <Flex align="flex-end" direction="column" flex={1} style={{position: 'relative'}}>
                <PickedBar />
                <Items />
              </Flex>
              <SeasonsPanel />
              <CollaborationsPanel />
            </Flex>

            {/* Debug */}
            <DebugControls />
          </Flex>
        </Card>
      </UploadDropzone>
    </PortalProvider>
  )
}

const Browser = (props: Props) => {
  // const client = useVersionedClient()
  const {scheme} = useColorScheme()
  //MUX SECRETS SETUP
  const client = useClient()

  useSaveSecrets(client, {
    // eslint-disable-next-line no-undef
    token: `5b7c606a-84f2-4a99-87e9-8c09071a9888`,
    // eslint-disable-next-line no-undef
    // secretKey: `KhQ00zsaQSgrlle02iYV2JvH02ZDNI00HOtYmml301fg8Xro`,
    enableSignedUrls: false,
    // signingKeyId: 'KhQ00zsaQSgrlle02iYV2JvH02ZDNI00HOtYmml301fg8Xro',
    // eslint-disable-next-line no-undef
    secretKey:
      'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdEw0bHM1VzdIZk03bk5FUnYzM2tES2gwQ3Q4Z2hCNXBHRzBmK3pHTlNTQW1GMGVvCjhkZGN3eWljaWNCdGRDb085c2ZLU3RDZklvc04yTUtTblYrbTNOZVQ2eG55SFdTNTJocXNiZkRqM3NhRlFxTkMKN0VNMXhjVVQ4enZ3Z1pMZlJkOWlxaWpNN3I4S2RGV29kVE1ta09mMHFOYU9wc2p0RVRQZzZVYzJ6czhPSFE0VApKZG1sbHdHc1RXSC90ZXNxVlE2emVhRW9qRWF1Mms2MjdrV3g0TUVhTStVN2E5ZHUya05TTm8ycWVDY0NlVGkzCjNISDF4NzR0OXlsdEZCUG9uRXIvL1dEU200T3V5RytrTCsrNmxNMHJOTGV2NlFGcFU4dzY0enRjdlh1cGg0R1IKUC9aK0RYT0swZU41WkE3UTByNW5CU3dWLzVHdUlFbU1VdVMvMXdJREFRQUJBb0lCQVFDeDdKbHFueFJUbUhUdgptN1JRQU5yMVJ3THRETmVTbCtrM1hYMWxKMU9CVC8rUFhVREh5ZzBNSlRkc041eklCUHMwSGx0YXFPSnUrOXBHCnJzdnIxaFNLUkVIZDUyMjdWOFBKSEFid04zbnFmUjBFQzNtKzRTN1hJSG5TTVFoQ1ZkWXJqNHN1SFBvWWNNSVcKNFpmeXY4YlFVVGM4MmZJVjU2ZlFEblR5eitMNVU1MVlxaG4vVjdZZDYzUmEvbDA3QmZkZWd4TDRXSEY3eUxORQpBRHVNQVNTY3RmeVhWV01jeC9oRVN4ZUdhNHZDYk9zNU41dzljcHJUNnQ3SSsyVFhrZ0ZDd0V4SkdOb0pTMm85CkcvQU1YVWFlWmJqY0dEQWRMZUJhTjgrS0xNMWR5dEtQVWpYcHh4ZWd3OXRWT09WZHdwOGViSVF2NE5DbDV0dEMKdWdvTGVzMlpBb0dCQU5HcXlnZ1RDc0hGQ3RqNnU5OWExL2l5L1UrMzJXbzZSc1c0TWNqMzBYWnA1VlF4L0NpQgo0bExGb3pQOUtQN1RyV0kvSkRuVVVtdzlteEowL2haclNNRjVpVEZad0ZaTjg3dkFYSWp3QTIrM0ppR2hsUldMCjRnTmI2T0szcXF5SmViNWtQbys1WWtYbzZndEtMMUNaeS9tU2dpMVRHaExoMUtQejV2cHFZUFlWQW9HQkFOeXYKRHc0VVdsZUkxWmVBbnNDNVI3YTBVTGpjeVFpakszVEJReW5uUndPQTBPTktZUjlCQVRJOHVyUncvVlZUUHZ1eAp2ZWM3b3lVblB3RVEyenhjODlTSmsxRXY1TVdEWmpjTTArTDBHSXhqVExnYVl2bmt3VmxYYno5aXUxM2dFUEs2Clkvck14Q1BieDljUndZVitWUWJuUGFmSndYbGhzcE5HbXRlUXp5VTdBb0dBRklENE91dnB6R05CbVZDRDJPYmcKWWdEWEJ0bTYyRW1VckRkRUh4d2xEc2h5VmRhQmkxQ1FXbm5iYVBVajhpK3ZNQUZ1d0gwRUJuUEwyM1UzZCtmTAorS2V6QS9GNy9yU20xa0NNakJPMHNsTWQxb0lmdXppdnhKWlRZd0NGSDFSZVpJRVhJU1VHK0VFN3loamFJYTY0CnBOSndDcENxNXhmUW5LdjRkWnE3bXJVQ2dZQnNRbHlxVllXMEoyWlF1a0ltM1QyMi9XSVVMZ3RZOTJMY0ZlcnkKNVloS3lhaXZ0ODlKVzhSUWRzWkl1cDBzZkhnTFZUaUo5UkdscWtrWUpzTEdLL3RacWx2Z21oUXFhTGwrREFidAo4VDBSc2F6eks4NmVOSUE5YWMwalZUWUJhV2duQ3hUODlmTEtmSWpla3RGU3daVEluQ3Y4NGRiTnl3V2xoaDl6CjNKQWgvUUtCZ0Rub3pucWNHRVBzekF1ZW8xK2krQVc2UWxLOW42WkcyMUlJM2IzMDVaVnhxR2ZodUtpdkdFR3gKSzFlOElUWFcvUG9NSFdRMFVIbnhmY2lEWENRVFZJL05LMXhNVVV6VCt4akMwd1UrQVFzWXlHWDc1eTV1MDhCcAovRk0rdnZ3N1ZtdlhuemFLa3JTWkdvVUt3NTFTVEVPT3ZNaUJDYlNldXlGOTkrdWVLMjVGCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg=='
  })
  return (
    <ReduxProvider
      assetType={props?.assetType}
      client={client}
      document={props?.document}
      selectedAssets={props?.selectedAssets}
    >
      <ThemeProvider scheme={scheme} theme={studioTheme}>
        <ToastProvider>
          <AssetBrowserDispatchProvider onSelect={props?.onSelect}>
            <GlobalStyle />

            <BrowserContent onClose={props?.onClose} />
          </AssetBrowserDispatchProvider>
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default Browser
