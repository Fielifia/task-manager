# Task Manager

A personal task management application developed as part of **1DV609 – Software Testing**, assignment A1.a2.

The project is developed using Test-Driven Development (TDD). The main focus is to demonstrate test design, unit testing, dependency injection, test doubles, and code coverage through a manageable application.

## Project Status

### Planned functionality

- Create, view, update, archive, and permanently delete tasks.
- Organize tasks using user-created categories with custom colors.
- Assign one of three priorities: Low, Normal. or High.
- Trask task status: To do, In progress, or Done.
- Support recurring tasks.
- Keep completed tasks available in a separate history view.
- Search, filter, and sort tasks.
- Display task statistics and summaries on a dashboard.
- Configure how completed tasks appear in the main list.

### Planned Technology

| Area         | Technology           |
| ------------ | -------------------- |
| Runtime      | Node.js              |
| Language     | JavaScript           |
| Backend      | Node.js / Express    |
| Database     | MongoDB              |
| ODM          | Mongoose             |
| Unit testing | `node:test`          |
| Assertions   | `node:assert/strict` |
| Test doubles | Sinon                |
| Coverage     | c8                   |
| UI testing   | JSDOM                |

These are planned choices and may be adjusted if the assignment requirements or implementation indicate a better fit.

## Documentation

- [Requirements](/docs/REQUIREMENTS.md)
- [Architecture](/docs/ARCHITECTURE.md)
- [Test plan](docs/TEST-PLAN.md)
- [TDD and Git workflow](/docs/TDD-PLAN.md)

## Development Principles

1. Write a failing test before implementing behavior.
2. Implement the smallest change that makes the test pass.
3. Refactor while keeping the tests green.
4. Inject dependencies so units can be tested in isolation.
5. Keep business logic separated from HTTP and database concerns.
6. Prefer a small, understandable solution over unnecessary features.

## Running the Project

Setup and run instructions will be added when the project environment has been configured.
