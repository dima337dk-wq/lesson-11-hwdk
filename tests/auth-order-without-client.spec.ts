import { expect, test } from '@playwright/test'
import { LoginDTO } from './dto/LoginDTO'
import { StatusCodes } from 'http-status-codes'
import { OrderDTO } from './dto/OrderDTO'

const serviceURL = 'https://backend.tallinn-learning.ee';
const loginPath = '/login/student';
const orderPath = '/orders';


async function authFun(request: any): Promise<string> {
  const authResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })

  if (authResponse.status() !== StatusCodes.OK) {
    throw new Error(`Request failed with status ${authResponse.status()}`)
  }

  return await authResponse.text()
}


async function createFun(request: any, jwt: string): Promise<any> {
  const createResponse = await request.post(`${serviceURL}${orderPath}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDTO.createOrderWithRandomData(),
  })

  expect(createResponse.status()).toBe(StatusCodes.OK)

  return createResponse
}



test('create order without api client', async ({ request }) => {
  const jwt: string = await authFun(request)
  const createResponse = await createFun(request, jwt);
  expect(createResponse.status()).toBe(StatusCodes.OK)
})



test('Authorization without api client and search by id', async ({ request }) => {
  const jwt: string = await authFun(request)

  const createResponse = await createFun(request, jwt);
  expect(createResponse.status()).toBe(StatusCodes.OK);

  const json: OrderDTO = await createResponse.json()
  const jsonId: number = json.id

  const findResponse = await request.get(`${serviceURL}${orderPath}/${jsonId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  expect(findResponse.status()).toBe(StatusCodes.OK);

  const jsonFind: OrderDTO = await findResponse.json()
  const jsonFindId: number = jsonFind.id

  console.log("Getting create order by id: ", jsonFindId)
})



test('Authorization without api client and delete by id and check id after delete', async ({ request }) => {
  const jwt: string = await authFun(request)

  const createResponse = await createFun(request, jwt);
  expect(createResponse.status()).toBe(StatusCodes.OK);

  const json: OrderDTO = await createResponse.json()
  const jsonId: number = json.id

  const deleteResponse = await request.delete(`${serviceURL}${orderPath}/${jsonId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  expect(deleteResponse.status()).toBe(StatusCodes.OK);

  const delJson: OrderDTO = await deleteResponse.json()
  const delJsonId: number = delJson.id

  const findResponse = await request.get(`${serviceURL}${orderPath}/${delJsonId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  expect(findResponse.status()).toBe(StatusCodes.BAD_REQUEST);

  const jsonDelete: OrderDTO = await findResponse.json()
  const jsonDeleteId: number = jsonDelete.id

  console.log("Deleting order by id: ", jsonDeleteId)
})