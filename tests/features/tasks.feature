Feature: Task management
  In order to manage my work
  As a user
  I want to create, edit, delete and toggle tasks

  Background:
    Given I am logged in
    And the task list is cleared via API

  @smoke
  Scenario: Create a task with valid data
    When I create a task with title "Write docs" and description "For release"
    Then I should see a task titled "Write docs" with description "For release" and completed "No"

  Scenario: Validation error when creating with missing title
    When I create a task with title "" and description "No title"
    Then no new task should be created

  Scenario: Edit an existing task
    Given a task exists with title "Old title" and description "Old desc"
    When I edit that task to title "New title" description "New desc" completed "Yes"
    Then I should see a task titled "New title" with description "New desc" and completed "Yes"

  Scenario: Delete a task
    Given a task exists with title "Temp" and description "To delete"
    When I delete the task titled "Temp"
    Then I should not see a task titled "Temp"

  Scenario: Toggle completed status from the table
    Given a task exists with title "Toggle me" and description "x"
    When I mark the task "Toggle me" as completed
    Then I should see a task titled "Toggle me" with description "x" and completed "Yes"

  Scenario: Canceling a delete keeps the task
    Given a task exists with title "Keep" and description "Do not delete"
    When I attempt to delete the task titled "Keep" but cancel
    Then I should still see a task titled "Keep"

  Scenario: Toggle a task from completed back to not completed
    Given a task exists with title "Toggler" and description "back and forth"
    When I mark the task "Toggler" as completed
    Then I should see a task titled "Toggler" with description "back and forth" and completed "Yes"
    When I mark the task "Toggler" as not completed
    Then I should see a task titled "Toggler" with description "back and forth" and completed "No"
