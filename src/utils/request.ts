import axios, { Method } from 'axios'
import { getConfig } from '@/utils'

const {
  FEISHU_CONFIG: { FEISHU_URL },
} = getConfig()

const request = async (url: string, options: any) => {
  try {
    return axios.request({ url, ...options })
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description: 任意请求
 */
interface IMethodV {
  url: string
  method?: Method
  headers?: { [key: string]: string }
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface IRequest {
  data: any
  code: number
}

/**
 * @description: 带 version 的通用 api 请求
 */
const methodV = <T = IRequest>({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV) => {
  let sendUrl = ''
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url
  } else {
    sendUrl = `${FEISHU_URL}${url}`
  }
  try {
    return new Promise<T>((resolve, reject) => {
      axios({
        url: sendUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...headers,
        },
        method,
        params: query,
        data: { ...params },
      })
        .then((res) => {
          resolve(res as T)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  } catch (error) {
    throw error
  }
}

export { request, methodV }
