# Architecture

## 1. Architecture goals

The architecture should:

- Keep business rules separated from HTTP and persistence.
- Make services testable in isolation through dependency injection.
- Keep repository classes responsible for database access.
- Avoid unnecessary abstractions and classes.
- Evolve incrementally through TDD rather than implementing the whole design upfront.

## 2. Planner layers

```markdown
HTTP request
    |
Routes
    |
Controllers
    |
Services (business logic)
    |
Repositories
    |
Mongoose models
    |
MongoDB
```

The frontend communicates with the backend through HTTP requests. Controllers translate requests into service calls and responses. Service contain application and business rules. Repositories encapsulate persistence operations.

## 3. Planned project structure

```markdown
src/
├── models/
│   ├── Task.js
│   ├── Category.js
│   └── UserSettings.js
├── repositories/
│   ├── TaskRepository.js
│   ├── CategoryRepository.js
│   └── SettingsRepository.js
├── services/
│   ├── TaskService.js
│   ├── TaskValidationService.js
│   ├── TaskCategoryService.js
│   ├── CategoryValidationService.js
│   ├── RecurringTaskService.js
│   ├── DashboardService.js
│   └── TaskHistoryService.js
├── controllers/
│   ├── TaskController.js
│   ├── CategoryController.js
│   ├── DashboardController.js
│   └── SettingsController.js
├── routes/
│   ├── taskRoutes.js
│   ├── categoryRoutes.js
│   ├── dashboardRoutes.js
│   └── settingsRoutes.js
├── config/
│   └── database.js
├── app.js
└── server.js

public/
├── index.html
├── css/
└── js/

tests/
├── unit/
├── integration/
└── ui/
```

This is a target structure, not a requirement to create every file at project start. Files and abstractions should be introduces when a test or feature requires them.

## 4. Main Service Responsibilities

### TaskService

Coordinated task use cases:

- Create and update tasks.
- Retrieve tasks
- Complete tasks.
- Archive and permanently delete tasks.
- Apply search, filtering, and sorting.
- Coordinate recurring-tas creation and history-related behavior.

Planned dependencies:

- `TaskRepository`
- `TaskValidationService`
- `RecurringTaskService`
- `TaskHistoryService`

### TaskValidationService

Validates task data, including title, date, priority, status, and recurrence configuration.

Planned dependency:

- `SettingsRepository`, only for validations rules that genuinely depend on settings.
  
### TaskCategoryService

Coordinated category operations and category reassignment when a category is deleted.

Planned dependencies:

- `CategoryRepository`
- `TaskRepository`
- `CategoryValidationService`

### CategoryValidationService

Validates category data, such as name and color.

### RecurringTaskService

Calculated and created the next occurrence of a recurring task.

Planned dependencies:

- `TaskRepository`
- An injected clock/date provider, so date-dependent behavior can be tested deterministically.

The service should not decide the user's late-deadline preference itself. That choice should be supplied as input after the UI has collected it.

### TaskHistoryService

Retrieves completed tasks and handles history-specific operations.

Planned dependency:

- `TaskRepository`

### DashboardService

Combines task data into dashboard summaries and statistics.

Planned dependency:

- `TaskRepository`
- `SettingsRepository`, if display preferences  affect the requested summary.
  
## 5. Important Workflows

### Completing a Recurring Task
1. The user requests completion.
2. `TaskService` validates and completes the existing task.
3. The completion timestamp is stored.
4. If the task is recurring, the next occurrence is prepared.
5. If the next scheduled deadline is in the past, the user must provide a deadline strategy.
6. `RecurringTaskService` calculated the next deadline and creates a new task.
7. The new task receives a new identity and status `TODO`.

The operation should avoid duplicate next occurrences if the same completion request is repeated. The exact idempotency strategy must be designed before implementation.

### Deleting a Category in Use
1. The user requests category deletion.
2. The application checks whether tasks reference the category.
3. If tasks reference it, the user must choose another existing category.
4. The replacement category is validated.
5. A reassignment is performed.
6. The original category is deleted.

If the user cancels, no data is changed. Reassignment and deletion should be atomic where the database deployment supports transactions. If transactions are unavailable, the implementation must still defines and test safe failure strategy.

### Completed Task Display

Completed tasks remain stored with status `DONE` and a completion timestamp. A setting controls whether they are hidden, shown at the bottom, or shown inline the main list. The setting changes presentation, not persistence.

## 6. Dependency Injection and Testability

Services should receive dependencies through their constructors instead of creating concrete repositories internally.

Example shape:

```js
class TaskService {
  constructor({
    taskRepository,
    taskValidationService,
    recurringTaskService,
    taskHistoryService
  }) {
    this.taskRepository = taskRepository;
    this.taskValidationService = taskValidationService;
    this.recurringTaskService = recurringTaskService;
    this.taskHistoryService = taskHistoryService;
  }
}
```

This allows unit tests to pass stubs, mocks, and spies instead of real database repositories.

## 7. Dynamic Object Creation

The assignment requires dynamic object creation in at least two parts of the applications, and those behaviors must also be tested.

Planned examples:
1. `TaskService` creates a new task object when a task is created.
2. `RecurringTaskService` creates a new task objekt for the next occurrence.

The final implementation should make these creation points explicit and test their observable behavior.

## Data Model Outline

### Task

- `title`
- `description`
- `dueDate`
- `priority` : `LOW`, `NORMAL`, `HIGH`
- `status` : `TODO`, `IN_PROGRESS`, `DONE`
- `categoryId`
- `recurrence`
- `tags`
- `completedAt`
- `archivedAt` 

### Category

- `name`
- `color`
- `createdAt`

### UserSettings

- `completedTaskDisplay` : `HIDDEN`, `BOTTOM`, `INLINE`
- `defaultPriority`
- `defaultRecurrence`
- `updatedAt`

A separate history collection is not currently planned. History is a query/view over stored tasks.

## 9. Design Decisions to Revisit

- Whether tasks can have no category.
- How to handle category deletion when no replacement category exists.
- Exact recurrence rule representation.
- How repeated completion requests avoid duplicate occurrences.
- Which operations need MongoDB transactions in he chosen deployment.
- Whether repository methods return domain objects, plain object, or Mongoose documents.

These decisions should be resolved when they become necessary, not prematurely abstracted.
