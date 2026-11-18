## Test Plan

## 1. Purpose

This document describes the planned test approach and initial behavioral test cases for Task Manager. It will evolve alongside the implementation.

The project uses TDD: tests are written before the implementation they specify.

## 2. Test Levels

### Unit Tests

Test one SUT at a time. Replace dependencies with test doubles to failures identify problems in the class under the test rather than in another class or the database.

Planned tools:

- `node:test`
- `node:assert/strict`
- Sinon

### Integration Tests

Verify collaboration with real persistence components, especially repository behavior against a test database.

### UI Tests

Use JSDOM where appropriate to verify important DOM behavior and user interactions without requiring a full browser.

## 3. Test Doubles

- **Stub:** Supplies controlled responses from a dependency.
- **Mock:** Verifies that a dependency was called with expected arguments or the expected number of times.
- **Spy:** Observes calls to a function or object without necessarily replacing its behavior.

## 4. Initial Unit Test Classes

### TaskValidationService

| ID    | Scenario                                 | Expected behavior   |
| ----- | ---------------------------------------- | ------------------- |
| TV-01 | Title is missing                         | Validation fails    |
| TV-02 | Title contains only whitespace           | Validation fails    |
| TV-03 | Valid task data                          | Validation succeeds |
| TV-04 | Priority is not LOW, NORMAL, or HIGH     | Validation fails    |
| TV-05 | Status is not TODO, IN_PROGRESS, or DONE | Validation fails    |
| TV-06 | Invalid deadline                         | Validation fails    |

### TaskService

| ID    | Scenario                                | Expected behavior                              |
| ----- | --------------------------------------- | ---------------------------------------------- |
| TS-01 | Create a valid task                     | Repository receives a new task                 |
| TS-02 | Create task with invalid data           | No task is persisted                           |
| TS-03 | Valid task data                         | Repository receives the update                 |
| TS-04 | Complete an existing task               | Status becomes DONE and completion time is set |
| TS-05 | Complete a recurring task               | Recurrence workflow is invoked                 |
| TS-06 | Archive a task                          | Archive operation is requested                 |
| TS-07 | Permanently delete a task               | Repository deletion is requested               |
| TS-08 | Search by title, description, or tag    | Matching tasks are returned                    |
| TS-09 | Filter by status, category, or priority | Only matching tasks are returned               |
| TS-10 | Sort by deadline or priority            | Results follow the requested order             |

### TaskCategoryService

| ID    | Scenario                                    | Expected behavior                             |
| ----- | ------------------------------------------- | --------------------------------------------- |
| TC-01 | Create valid category                       | Category is persisted                         |
| TC-02 | Create invalid category                     | Validation fails                              |
| TC-03 | Update category                             | Correct category is updated                   |
| TC-04 | Delete unused category                      | Category is deleted                           |
| TC-05 | Delete unused category without replacement  | Operation is rejected or requests replacement |
| TC-06 | Delete used category with valid replacement | Tasks are reassigned before deletion          |
| TC-07 | Replacement category does not exist         | Operation fails and original data remains     |
| TC-08 | User cancels deletion                       | No repository changes occur                   |
| TC-09 | Reassignment fails                          | Original category is not deleted              |

### RecurringTaskService

| ID    | Scenario                          | Expected behavior                           |
| ----- | --------------------------------- | ------------------------------------------- |
| RT-01 | Calculate next daily occurrence   | Next date follows daily interval            |
| RT-02 | Calculate next weekly occurrence  | Next date follows weekly interval           |
| RT-03 | Calculate next monthly occurrence | Next date follows defined monthly rule      |
| RT-04 | Continue original schedule        | Next date is based on the previous schedule |
| RT-05 | Restart from current date         | Next date is based in injected current date |
| RT-06 | User supplies a custom date       | Supplied date is used after validation      |
| RT-07 | Create next occurrence            | A new task is created with a new identity   |
| RT-08 | Create next occurrence            | New task status is TODO                     |
| RT-09 | Complete non-recurring task       | No next occurrence is created               |

Monthly date edge cases, such as recurrence starting on the 31st, need an explicit rule before their expected results can be fixed.

### TaskHistoryService

| ID    | Scenario                      | Expected behavior                     |
| ----- | ----------------------------- | ------------------------------------- |
| TH-01 | Retrieve completed tasks      | Only completed tasks are returned     |
| TH-02 | Retrieve history with filters | Matching completed tasks are returned |
| TH-03 | Restore an archived task      | Restore operation is requested        |

### DashboardService

| ID    | Scenario                | Expected behavior                                    |
| ----- | ----------------------- | ---------------------------------------------------- |
| DS-01 | Retrieve overview       | Active, completed, and overdue counts are calculated |
| DS-02 | Group tasks by category | Category statistics are returned                     |
| DS-03 | Group tasks by priority | Priority statistics are returned                     |
| DS-04 | No tasks exist          | Empty-state statistics are returned                  |


## 5. Integration Tests

Initial integration test targets:

- `TaskRepository` creates and retrieves tasks.
- `TaskRepository` updates task status and timestamps.
- `TaskRepository` filters and sorts stored tasks.
- `CategoryRepository` persists ans updated categories.
- `SettingsRepository` stores and retrieves preferences.
- Category reassignment and deletion behave consistently with the configured database.

Use an isolated test database. Tests must not modify personal or development data.

## 6. UI Test Targets

- A user can submit a valid task form
- Validation feedback is shown for an invalid task.
- Completed tasks follow the selected display mode.
- Search and filters update the visible task list.
- A category deletion flow asks for a replacement when needed.
- A late recurring task flow presents the available deadline choices.

## 7. Test Quality Rules

- Tests should describe observable behavior.
- Each test should have a clear arrange, act, and assert structure.
- Avoid depending on execution order.
- Control time in date-dependent tests using an injected clock.
- Avoid real database access in unit tests.
- Verify important interactions with dependencies without testing implementation details unnecessarily.
- Keep test data explicit and deterministic.

## 8. Coverage

Use c8 to measure code coverage. Save a coverage report or screenshot in the repository and make a separate Git commit for the measurement, as required by the assignment.

Coverage is a measurement, not proof that the tests are good. Tests must still verify meaningful behavior and edge cases.
