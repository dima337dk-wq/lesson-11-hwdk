import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDTO } from './dto/LoginDTO'

const BASE_URL = 'https://backend.tallinn-learning.ee'

test('TL-11-1 Login/student returns 200 and JWT', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(response.status()).toBe(StatusCodes.OK)
  expect((await response.text()).length).toBeGreaterThan(0)
})

test('TL-11-2 Login/student returns 401 if password is incorrect', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithBrokenData(),
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-3 Login/student returns 401 if password is missing', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: 'test',
    },
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-4 Login/student returns 401 if data is empty', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {},
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-5 Login/student returns 401 if data is missing', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`)
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

// homework 11 ##################################

test('TL-11-6 Login/student check JWT', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  const jwtValue = await response.text()
  const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

  expect(jwtValue).toMatch(jwtRegex)
})

test('TL-11-7 Login/student return 405 with different methods', async ({ request }) => {
  const response1 = await request.put(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  const response2 = await request.get(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  const response3 = await request.delete(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })

  expect(response1.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  expect(response2.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  expect(response3.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('TL-11-8 Login/student return 401 if add field', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: 'asd',
      password: 'asd',
      asd: 'asd',
    },
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-9 Login/student return 401 if only password', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      password: 'asd',
    },
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-10 Login/student return 401 if different types', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: 123,
      password: 123,
    },
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
