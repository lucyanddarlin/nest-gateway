import { getConfig } from '@/utils'

const { FEISHU_CONFIG } = getConfig()

export const APP_ID = FEISHU_CONFIG.FEISHU_APP_ID
export const APP_SECRET = FEISHU_CONFIG.FEISHU_APP_SECRET

export const MAX_PAGE_SIZE = 100

export const defaultPaginationParams: PaginationParams = {
  currentPage: 1,
  pageSize: 10,
}
