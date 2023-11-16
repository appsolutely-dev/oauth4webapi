import type QUnit from 'qunit'
import * as lib from '../src/index.js'

const client = <lib.Client>{
  client_id: 'urn:example:client_id',
}
const identifier = 'https://op.example.com'
const issuer = <lib.AuthorizationServer>{
  issuer: identifier,
}

export default async (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('modulus_length.ts')

  for (const [alg, { privateKey, publicKey }] of Object.entries({
    RS256: await lib.generateKeyPair('RS256', { modulusLength: 1024 }),
    PS256: await lib.generateKeyPair('PS256', { modulusLength: 1024 }),
  })) {
    // MODIFIED HERE - 2048->1024
    test(`(DPoP) ${alg} private key modulus length must be at least 1024 bits long`, async (t) => {
      await t.rejects(
        lib.protectedResourceRequest(
          'accessToken',
          'GET',
          new URL('https://rs.example.com/api'),
          new Headers(),
          null,
          { DPoP: { privateKey, publicKey } },
        ),
        (err: Error) => {
          t.propContains(err, {
            // MODIFIED HERE - 2048->1024
            message: `${privateKey.algorithm.name} modulusLength must be at least 1024 bits`,
          })
          return true
        },
      )
    })

    // MODIFIED HERE - 2048->1024
    test(`(private_key_jwt) ${alg} private key modulus length must be at least 1024 bits long`, async (t) => {
      await t.rejects(
        lib.pushedAuthorizationRequest(
          {
            ...issuer,
            pushed_authorization_request_endpoint: `${issuer.issuer}/par`,
          },
          {
            ...client,
            token_endpoint_auth_method: 'private_key_jwt',
          },
          new URLSearchParams(),
          { clientPrivateKey: privateKey },
        ),
        (err: Error) => {
          t.propContains(err, {
            // MODIFED HERE - 2048->1024
            message: `${privateKey.algorithm.name} modulusLength must be at least 1024 bits`,
          })
          return true
        },
      )
    })
  }
}
