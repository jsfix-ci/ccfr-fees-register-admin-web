import * as express from 'express'
import * as mock from 'mock-require'
import Category from 'app/fees/category'
import Range from 'app/fees/range'
import Fee from 'app/fees/fee'

function someCategory () {
  return new Category(
    1,
    'online-fees',
    'Online Fees',
    [new Range(1, 100, new Fee(1, 'X001', 'fixed', 'Some description', 100, null))],
    [new Fee(2, 'X002', 'fixed', 'Other description', 200, null)]
  )
}

function mockUser () {
  return { id: 123, roles: ['admin', 'admin'] }
}

mock('app/fees/feesClient', {
  'default': {
    retrieveCategory: (categoryId) => Promise.resolve(someCategory()),
    retrieveCategories: () => Promise.resolve([someCategory(), someCategory(), someCategory()])
  }
})

mock('idam/authorizationMiddleware', {
  AuthorizationMiddleware: {
    requestHandler: () => {
      return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.locals.user = mockUser()
        next()
      }
    }
  }
})

mock('idam/idamClient', {
  'default': {
    retrieveUserFor: (jwtToken) => mockUser()
  }
})
