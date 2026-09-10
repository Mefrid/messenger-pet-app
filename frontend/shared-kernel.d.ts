type SearchSettings = PaginationSettings & {
  query: string
}

type PaginationSettings = {
  page: number
  perPage: number
}

type Paginated<Data extends object> = {
  data: Data[]
  total?: number
}
