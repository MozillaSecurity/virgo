/** @format */

import http from 'http'
import https from 'https'
import { promises as DNS } from 'dns'

/**
 *
 * @param host
 * @returns {Promise<LookupAddress>}
 */
export const isOnline = (host = 'mozilla.org') => {
  return DNS.lookup(host)
}

/**
 *
 * @param url
 * @param allowStatus
 * @returns {Promise<any>}
 */
export const isReachable = (url, allowStatus = [302]) => {
  return new Promise((resolve, reject) => {
    return https.get(url, response => {
      if (response.statusCode >= 200 && response.statusCode <= 300) {
        resolve({ code: response.statusCode })
      }
      if (allowStatus.includes(parseInt(response.statusCode, 10))) {
        resolve({ code: response.statusCode })
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ code: response.statusCode, message: http.STATUS_CODES[response.statusCode] })
    })
  })
}
