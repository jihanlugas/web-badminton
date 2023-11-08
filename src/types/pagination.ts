export type PageInfo = {
  pageSize: number
  pageCount: number
  totalData: number
  page: number
}

export type PageRequest = {
  page: number
  limit: number
  sortField?: string
  sortOrder?: string
}