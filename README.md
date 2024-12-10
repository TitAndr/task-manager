<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# Task Manager API

A RESTful API built with NestJS for managing tasks and their additional details, using PostgreSQL as the database. It includes JWT authentication for secure operations.

---

## 📦 Features

- Manage tasks and additional task details.
- PostgreSQL integration without TypeORM.
- Secure endpoints with JWT authentication.
- Input validation and error handling.

---

## ⚙ Prerequisites

1. **Node.js**: Install Node.js (v16 or higher).
2. **PostgreSQL**: Ensure PostgreSQL is installed and running.
3. **npm**: Node Package Manager comes with Node.js.

---

## 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <repository_url>
cd task-manager
```

## 2️⃣ Install Dependencies
```bash
npm install
```

## 3️⃣ Set Up the Database
Log in to your PostgreSQL instance.
Create a database named task_manager:
All SQL tables defined in `init.sql` file.
```
## 4️⃣ Configure Environment Variables
Create a ` .env ` file in the root directory and fill in the following:
```bash
PORT=****
DB_HOST=****
DB_PORT=****
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=task_manager
SALT_ROUNDS=10
JWT_SECRET=secret
JWT_EXPIRE_IN=3h
JWT_REFRESH_EXPIRE_IN=7d
```
## 🏃 Running the Project
Development Mode
```bash
npm run start:dev
```
Server will run at http://localhost:3000.

## 📂 API Endpoints
### **Auth**

* **POST /auth/login** - Log in with username and password for **created user**. Public API (without JWT).
     
    - Body:
```bash
{
  "username": "Username",
  "password": "Password"
}
```
* **POST /auth/refresh** - Refresh token for user.
    - Body:
```bash
{
  "refresh_token": "Refresh token"
}
```

* **POST /auth/logout** - Log out from user. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

### **Users**

* **GET /users** - Get all users. Public API (without JWT).

* **POST /users** - Create a new user with username and password. Public API (without JWT).
     - Body:
```bash
{
  "username": "Username",
  "password": "Password"
}
```
* **PATCH /users/`:id`** - Update user. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```
- Body:
```bash
{
  "username": "New username",
  "password": "New Password"
}
```
* **DELETE /users/`:id`** - Delete user. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

### **Tasks**

* **GET /tasks** - Get all user's tasks. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

* **GET /tasks/`:title`** - Get task by title. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

* **POST /tasks** - Create a new task with title, description, startDate, and endDate.
    - Body:
```bash
{
  "title": "Task Title",
  "description": "Task Description",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-02T00:00:00Z"
}
```
* **PATCH /tasks/`:id`** - Update task. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```
- Body:
```bash
{
  "title": "New task Title",
  "description": "New task description",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-02T00:00:00Z"
}
```
* **DELETE /tasks/`:id`** - Delete task. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

### **Tasks Details**

* **GET /tasks-details/`:taskId`** - Get task details for current task. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

* **POST /tasks-details/`:taskId`** - Create a new task details with additional info for current task.
    - Body:
```bash
{
  "additional_info": "Additional info"
}
```
* **PATCH /tasks-details/`:taskId`** - Update task details for current task. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```
- Body:
```bash
{
 "additional_info": "New additional info"
}
```
* **DELETE /tasks-details/`:taskId`** - Delete task details for current task. Requires a valid JWT in the Authorization header.
```bash
Authorization: Bearer <JWT_TOKEN>
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
