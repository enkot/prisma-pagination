# Prisma Pagination
Helper library for [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/pagination) offset pagination with Typescript support.

[![Version](http://img.shields.io/npm/v/prisma-pagination.svg)](https://npmjs.org/package/prisma-pagination)
[![License](https://img.shields.io/npm/l/prisma-pagination.svg)](https://npmjs.org/package/prisma-offset-pagination)

## Installation

```bash
npm i prisma-pagination
```

## Usage

```typescript
import { createPaginator } from 'prisma-pagination'
import { User, Prisma } from '@prisma/client'

// ...

app.get('/', async ({ prisma }, res) => {
  const paginate = createPaginator({ page: 2 })
  
  // You can pass generic types: <Model> and <Model>FindManyArgs
  // to have args and result typed
  
  const result = await paginate<User, Prisma.UserFindManyArgs>(
    prisma.user,
    {
      where: {
        name: {
          contains: 'Alice'
        }
      }
      orderBy: {
        id: 'desc',
      }
    }
  })

  /* Result structure:
  {
    data: User[]
    meta: {
      total: number
      lastPage: number
      currentPage: number
      perPage: number
      prev: number | null
      next: number | null
    }
  }
  */
})
```

If you use Express-like framework, initializing `createPaginator` could be moved to the middleware:

```typescript
import { createPaginator } from 'prisma-pagination'

export const pagination = (req, res, next) => {
  const page = Number(req.query.page) || 1

  req.paginate = createPaginator({ page })
}
```

so then it can be used in any route handler:

```typescript
app.get('/', async ({ paginate, prisma }, res) => {
  return await paginate(prisma.user)
})
```

To have proper Typescript support you can extend Request interface like so:

```typescript
import { PaginateFunction } from 'prisma-pagination'

declare global {
  namespace Express {
    export interface Request {
      paginate: PaginateFunction
    }
  }
}
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)