# Prisma Pagination
Helper library for [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/pagination) offset pagination with Typescript support.

[![Version](http://img.shields.io/npm/v/prisma-pagination.svg)](https://npmjs.org/package/prisma-pagination)
[![License](https://img.shields.io/npm/l/prisma-pagination.svg)](https://npmjs.org/package/prisma-pagination)

## Installation

```bash
npm i prisma-pagination
```

## Usage

```typescript
import { createPaginator } from 'prisma-pagination'
import { User, Prisma } from '@prisma/client'

// ...

const paginate = createPaginator({ perPage: 20 })

app.get('/', async ({ query, prisma }, res) => {
  
  // Generic types can be passed to "paginate",
  // so args and result will be typed and autocompleted :)
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
    }, 
    { page: query.page }
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

For Express-like frameworks, `page` and `perPage` can be initialized in the middleware:

```typescript
import { createPaginator } from 'prisma-pagination'

const pagination = (req, res, next) => {
  req.paginate = createPaginator({ page: req.query.page, perPage: 20 })

  next()
}

app.use(pagination)
```

so there is no need to pass `page` value in each handler:

```typescript
app.get('/', async ({ paginate, prisma }, res) => {
  return await paginate(prisma.user)
})
```

To have proper Typescript support, Request interface can be extended this way:

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