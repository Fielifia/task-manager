# Requirements

## 1. Purpose
Task Manager is a personal web application for creating organizing, and tracking tasks. It is developed for 1D609 – Software Testing, assignment A1.a2.

This document describes the intended behavior. It is the basis for implementation and test cases.

## 2. Scope

### In Scope

- Task management
- User-created categories
- Three fixed priority levels
- Task status management
- Recurring tasks
- Completed-task history
- Search, filtering, and sorting
- Dashboard and statistics
- User preferences for task presentation
- MongoDB persistence

### Out of Scope

- User registration and login
- Multiple user accounts
- Social or collaboration futures
- Native mobile application

The application is intended for one local/personal user and does not require authentication.

## 3. Functional Requirements

### Tasks

- **FR-T01**: The user shall be able to create a task.
- **FR-T02**: Every task shall have a non-empty title.
- **FR-T03**: A task may contain a description, deadline, category, recurrence rule, and tags.
- **FR-T04**: Every task shall have a priority: Low, Normal, or High.
- **FR-T05**: Every task shall have a status: To do, In progress, or Done.
- **FR-T06**: The user shall be able to view and update tasks.
- **FR-T07**: The user shall be able to archive a task.
- **FR-T08**: The user shall be able to permanently delete a task.
- **FR-T09**: The user shall be able to search tasks by title, description, and tags.
- **FR-T10**: The user shall be able to filter tasks by status, category, and priority.
- **FR-T11**: The user shall be able to sort tasks by deadline and priority.

### Categories

- **FR-C01**: The user shall be able to create categories.
- **FR-C02**: The user shall be able to rename categories and change their colors.
- **FR-C03**: The user shall be able to delete categories.
- **FR-C04**: If a category is used by tasks, the user shall be able to select a replacement category before deletion, or leave the task uncategorized.
- **FR-C05**: The replacement category shall be a different existing category.
- **FR-C06**: If the user cancels category deletion, no task or category data shall be changed.
- **FR-C07**: Category reassignment and deletion shall be handled consistently: a failed operation must not leave tasks referencing a deleted category.

### Recurring Tasks

- **FR-R01**: A task may have a recurrence rule.
- **FR-R02**: When a recurring task is completed, the application shall create its next occurrence.
- **FR-R03**: The completed task shall remain completed and retain its completion date.
- **FR-R04**: The newly created occurrence shall have a new identity and status To do.
- **FR-R05**: If the previous deadline is in the past, the user shall choose how the next deadline is determined.
- **FR-R06**: The available choices shall be:
  - Continue according to the original schedule.
  - Calculate the next deadline from the current date.
  - Choose a specific date.
- **FR-R07**: The recurrence rule shall support standard and user-defined intervals. Exact supported interval units and validation rules must be specified before implementing recurrence calculations.

### Completed Tasks and History

- **FR-H01**: Completed tasks shall remain stored and available in a history view.
- **FR-H02**: The user shall be able to choose how completed tasks appear in the main task list.
- **FR-H03**: The availability display modes shall be:
  - Hidden from the main list.
  - Displayed at the bottom of the list.
  - Displayed inline with active tasks, with a clear visual distinction.
- **FR-H04**: Changing the display mode shall not delete or modify task records.
- **FR-H05**: The history view shall allow the user to review completed tasks.

### Dashboard and Settings

- **FR-D01**: The application shall provide a dashboard with task summaries and statistics.
- **FR-D02**: The dashboard shall show useful counts, including active, completed, and overdue tasks.
- **FR-D03**: The user shall be able to configure task display preferences.
- **FR-D04**: The user shall be able to configure default values such as default priority and recurrence settings.

## 4. Data Requirements

### Task

Planned fields:

- `id`
- `title`
- `description`
- `dueDate`
- `priority`
- `status`
- `categoryId`
- `recurrence`
- `tags`
- `completedAt`
- `archivedAt` 

### Category

Planned fields:

- `id`
- `name`
- `color`
- `createdAt`

### UserSettings

Planned fields:

- `completedTaskDisplay`
- `defaultPriority`
- `defaultRecurrence`
- `updatedAt`

The application has one local user, so settings do not need to be associated with an authenticated user account.

## 5. Non-functional and Course-related Requirements

- **NFR-01:** Business logic shall be separated from database and HTTP concerns.
- **NFR-02:** Dependencies shall be injected where this enabled isolated testing.
- **NFR-03:** Unit tests shall isolate the System Under Test (SUT) from dependencies.
- **NFR-04:** The projekt shall demonstrate at least four SUR classes with dependencies.
- **NFR-05:** Dynamic object creation shall be demonstrated in at least two parts of the application and tested.
- **NFR-06:** The application shall provide a user interface.
- **NFR-07:** A code coverage tool shall be used and its result saved in the repository.
- **NFR-08:** Git history shall demonstrate TDD, with at least 20 commits following the assignment's RED, GREEN, and REFACTOR pattern.

## 6. Open Questions

The following details are not fully specified yet and should be decided before the relevant implementation:

1. Exakt recurrence interval formats and supported units.
2. Whether a task may exist without a category.
3. What happens to a task when its category is deleted if the user has no other category to choose.
4. Whether archived tasks can be restored from the UI.
5. Exact dashboard statistics and date ranges.
6. Whether a completed recurring task should promot for a late-deadline choice every time, or only when its next scheduled date is already past.

## 7. Terminology

- **Task:** A task managed by the application.
- **Completed task:** A task with status `DONE`.
- **History:** A view of completed tasks; it does not imply a separate database collection.
- **Archived task:** A task hidden from normal active views but retained in storage.
- **SUT:** System Under Test, the class or unit whose behavior a test verifies.
- **Test double:** A replacement dependency used during test, such as a stub, mock, or spy.
