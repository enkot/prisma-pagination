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

export type PaginateFunction = <T, K extends { where: unknown }>(model: any, args: K) => Promise<PaginatedResult<T>>

export const createPaginator = ({ page = 1, perPage = 10 }: { page?: number, perPage?: number }): PaginateFunction => {
  const skip = page > 0 ? perPage * (page - 1) : 0

  return async (model, args) => {
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