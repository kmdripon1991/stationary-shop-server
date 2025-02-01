# Blog Project

[Blog Server Link](https://blog-server-three-sand.vercel.app) - https://blog-server-three-sand.vercel.app


## Overview

This project is a backend system for a blogging platform with two user roles: **Admin** and **User**. The system enables users to perform CRUD operations on blogs and provides admins with special permissions for managing users and their blogs. The platform features secure authentication, role-based access control, and a public API for searching, sorting, and filtering blogs.

This guide provides the steps to set up a Node.js project with TypeScript, MongoDB, ESLint, Prettier, and VSCode configurations for efficient development.

---

## Technologies Used

- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose

---

## User

In the user module, interface, model, route, controller and service files have been created. The user routes have been declared in the user route. The controller has been called from the router file. Again, the controller file calls the service file. The user registration and login work has been completed in the service file. The `zod validation` is used for user model data validation

[Register User API](https://blog-server-three-sand.vercel.app/api/auth/register) - https://blog-server-three-sand.vercel.app/api/auth/register

[Login User API](https://blog-server-three-sand.vercel.app/api/auth/login) - https://blog-server-three-sand.vercel.app/api/auth/login

---

## Blog

In the blog module, interface, model, route, controller, service, constant files have been created. The blog routes have been declared in the blog route. The controller has been called from the router file. Again, the controller file calls the service file. The user registration and login work has been completed in the service file. The `zod validation` is used for user model data validation

[Create Blog API](https://blog-server-three-sand.vercel.app/api/blogs/) - https://blog-server-three-sand.vercel.app/api/blogs/

[Update Blog API](https://blog-server-three-sand.vercel.app/api/blogs/id) - https://blog-server-three-sand.vercel.app/api/blogs/id

[Delete Blog API](https://blog-server-three-sand.vercel.app/api/blogs/id) - https://blog-server-three-sand.vercel.app/api/blogs/id

[Get All Blogs API](https://blog-server-three-sand.vercel.app/api/blogs/) - https://blog-server-three-sand.vercel.app/api/blogs/

[For Query API](https://blog-server-three-sand.vercel.app/api/blogs?search=technology&sortOrder=desc&sortBy=createdAt&filter=authorId) - https://blog-server-three-sand.vercel.app/api/blogs?search=technology&sortOrder=desc&sortBy=createdAt&filter=authorId

---

## Admin Action

In the admin module, admin route, controller and service file have been created. Admin action tasks have been completed from the service file.

Only an Admin can block a user by updating the user field `isBlocked` property `true`.

[User Block by Admin](https://blog-server-three-sand.vercel.app/api/admin/users/userId/block) - https://blog-server-three-sand.vercel.app/api/admin/users/userId/block

Only an Admin can delete any user blog.

[Any Blogs can be deleted Admin](http://localhost:5000/api/admin/blogs/blogId) - http://localhost:5000/api/admin/blogs/blogId

---

## catchAsync Function

This is an higher order function thats take an asynchronous function as an argument. It returns a new function. When a unhandled promise or errors occurred, its catches automatically and forward the next middleware as well as global error handler.

## Middlewares

### Auth middlewares

This is an custom middleware. It used for Authentication and Authorizations.Verifying the `JWT` token, Auth middleware ensure the user is valid and then give access the protected route.

- **Following functionalities in this middleware**
  - **JWT Token Verification**
  - **JDecoded JWT and Extract Data**
  - **JDecoded JWT and Extract Data**
  - **Lookup user in the Database**
  - **Checking if User is Blocked**
  - **UseR Role Authorized by**
  - **Attached User to the Request Object**
  - **And Error Handle**

### Global Error Handler

In Express Js global error handler is a middleware function. When a application throw an error , global error middleware function intercepts the error, process them and send a response to the client with appropriate response.Centralized the errors and make code cleaner.

  - **Zod Error**
  - **Validation Error**
  - **CastError**
  - **Duplicate Key Error**
  - **AppError**
  - **Generic Error**
  
  Finally, Sending error response, Export this middleware and Integrate this middleware in the `app.ts` file.


### Not Found Error middleware

The `notFound` middleware handles thats route which are not define in the application.After passing through all other routes and middleware, the `notFound` middleware intercepts the request and send response to the client `404 Not Found`.This middleware does not call `next()`.
This middleware integrate in the `app.ts`after calling all routes before calling global error middleware.

### Validation Request middleware

The ValidateRequest middleware validates the incoming request against a provided Zod schema. It validate the requested body data structure , which is pre-defined.If fails to validate , this middleware thrown an error, which handled by global error handler.

### `QueryBuilder` Class

This is a generic utility class for `mongodb` queries with `mongoose`.It simplifies the process of searching, filtering, sorting data based on query object.Constructor accepts mongoose `modelQuery` and a query object.Check if a `search` parameter exists in the query.And  logic for partial match and case-insensitive

Filters the query by specific criteria, excluding non-filter-related fields (like `search`, `sortBy`, `sortOrder`)

Sorts the query results by a specified field and order.Use `sortBy`to determine field to sort which default value is set createdAt.Also use `sortOrder` to determine the order. ascending (default) or descending


### User Model

| Field       | Type      | Description                                                 |
| ----------- | --------- | ----------------------------------------------------------- |
| `name`      | `string`  | Full name of the user.                                      |
| `email`     | `string`  | Email address for authentication.                           |
| `password`  | `string`  | Securely stored password.                                   |
| `role`      | `string`  | Role of the user: `"admin"` or `"user"`. Default: `"user"`. |
| `isBlocked` | `boolean` | Indicates whether the user is blocked. Default: `false`.    |
| `createdAt` | `Date`    | Timestamp when the user was created.                        |
| `updatedAt` | `Date`    | Timestamp of the last update.                               |

### Blog Model

| Field         | Type       | Description                                               |
| ------------- | ---------- | --------------------------------------------------------- |
| `title`       | `string`   | Title of the blog post.                                   |
| `content`     | `string`   | Main body/content of the blog post.                       |
| `author`      | `ObjectId` | Reference to the User model.                              |
| `isPublished` | `boolean`  | Indicates whether the blog is published. Default: `true`. |
| `createdAt`   | `Date`     | Timestamp when the blog was created.                      |
| `updatedAt`   | `Date`     | Timestamp of the last update.                             |

---

