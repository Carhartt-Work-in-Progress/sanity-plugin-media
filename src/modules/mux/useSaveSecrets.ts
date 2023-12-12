/* eslint-disable consistent-return */
import {useEffect} from 'react'
import type {SanityClient} from 'sanity'

import {createSigningKeys, haveValidSigningKeys, saveSecrets, testSecrets} from './secrets'
import type {Secrets} from './util/types'
import {useSecretsDocumentValues} from './useSecretsDocumentValue'

export const useSaveSecrets = (client: SanityClient, secrets: Secrets) => {
  const {isLoading, value} = useSecretsDocumentValues()
  const saveTokens = async ({
    token,
    secretKey,
    enableSignedUrls
  }: Pick<Secrets, 'token' | 'secretKey' | 'enableSignedUrls'>): Promise<Secrets | undefined> => {
    if (!secrets) return
    let {signingKeyId, signingKeyPrivate} = secrets

    try {
      await saveSecrets(
        client,
        token!,
        secretKey!,
        enableSignedUrls,
        signingKeyId!,
        signingKeyPrivate!
      )

      const valid = await testSecrets(client)
      if (!valid?.status && token && secretKey) {
        throw new Error('Invalid secrets')
      }
    } catch (err) {
      console.error('Error while trying to save secrets:', err)
      throw err
    }

    if (enableSignedUrls) {
      const hasValidSigningKeys = await haveValidSigningKeys(
        client,
        signingKeyId!,
        signingKeyPrivate!
      )

      if (!hasValidSigningKeys) {
        try {
          const {data} = await createSigningKeys(client)
          signingKeyId = data.id
          signingKeyPrivate = data.private_key
          await saveSecrets(
            client,
            token!,
            secretKey!,
            enableSignedUrls,
            signingKeyId,
            signingKeyPrivate
          )
        } catch (err: any) {
          // eslint-disable-next-line no-console
          console.log('Error while creating and saving signing key:', err?.message)
          throw err
        }
      }
    }
    return {
      token,
      secretKey,
      enableSignedUrls,
      signingKeyId,
      signingKeyPrivate
    }
  }
  // saveTokens(secrets)
  useEffect(() => {
    if (!value?.needsSetup || isLoading) {
      return
    }
    saveTokens(secrets)
  }, [
    saveTokens,
    value?.needsSetup,
    value.secrets.enableSignedUrls,
    value.secrets.secretKey,
    value.secrets.token,
    isLoading
  ])
}
