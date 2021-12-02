export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export type PaginateOptions = { page?: number | string, perPage?: number | string }
export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedResult<T>>

export const createPaginator = (options: PaginateOptions): PaginateFunction => {
  let page: number = Number(options.page) || 1
  let perPage: number = Number(options.perPage) || 10
  const skip = page > 0 ? perPage * (page - 1) : 0

  return async (model, args: any = { where: undefined }, options) => {
    page = Number(options?.page) || page
    perPage = Number(options?.perPage) || perPage

    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ])
    const lastPage = Math.ceil(total / perPage)

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    }
  }
}