/** @format */

import Application from './app'

let app

beforeAll(async () => {
  app = Application()
  await app.start()
  await app.client.waitUntilWindowLoaded()
})

describe('App', () => {
  test('Application Title', async () => {
    expect(await app.client.getTitle()).toBe('Virgo')
  })
})

afterAll(async () => {
  if (app && app.isRunning()) {
    await app.stop()
  }
})
