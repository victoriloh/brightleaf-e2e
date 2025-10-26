Feature: User authentication
  In order to use LeafTasks
  As a user
  I want to log in and log out

  Background:
    Given the test API is reachable

  @smoke
  Scenario: Login with valid credentials
    When I log in with username "admin" and password "123456"
    Then I should be redirected to the dashboard
    And I should see the task list

  Scenario Outline: Login with invalid credentials shows error
    When I attempt login with username "<username>" and password "<password>"
    Then I should see a login error message
    Examples:
      | username | password |
      | admin    | wrong    |
      | bad      | 123456   |

  Scenario: Logout returns to login page
    Given I am logged in
    When I log out
    Then I should be on the login page
