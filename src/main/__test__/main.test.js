/** @format */

import getApp from './app'

let app

jest.setTimeout(30000)

afterEach(async () => {
  if (app && app.isRunning()) {
    return await app.stop()
  }
})

beforeEach(async () => {
  app = getApp()
  await app.start()
  await app.client.waitUntilWindowLoaded()
})

test('Application Title', async () => {
  expect(await app.client.getTitle()).toBe('Virgo')
})
