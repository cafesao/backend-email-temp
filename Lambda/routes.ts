import controllerEmail from './controller'

import { Routes } from './interface/routes'

export default (path: string, method: string): Function => {
  const routes: Routes = {
    '/email/send - POST': controllerEmail.send,
    '/email/create - POST': controllerEmail.create,
    '/email/get - GET': controllerEmail.getTo,
  }
  return routes[`${path} - ${method}`]
}
