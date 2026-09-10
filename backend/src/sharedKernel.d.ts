type UUID = string
type Timestamp = number

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
