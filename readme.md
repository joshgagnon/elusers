# Evolution Users

## Development setup

1. Copy `.env.example` to `.env` and fill in the blanks
2. `composer install`
3. `npm install`
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `php artisan db:update-functions`

__Running the server:__ `php artisan serve`

__Building frontend:__ `webpack --watch`

__Running tests:__ `phpunit`

## API

Dates are required in the format: day-month-year as the validation and date parsing using php strtotime to parse dates.

## Todo

Enforce password strength policy (first we need to create a password policy).

Create permissions system - pass rules to frontend - eg. can_edit_users, can_change_users_password, can_change_own_password, etc. Then build permissions system in frontend to interpret these rules.

Fix the metric shitload of Typescript errors :)

### Known bugs

After updating a users basic details, a new user (state.user) is not re-fetched.

Combobox field border not coloured for validation.

Dates are not valid in in the datepicker on initial load - currently using a work around in the backend, but every route has to convert dates before they are sent to the frontend. We should convert the dates to our format once we receive them from the API.

Some forms still need success/error notifications

Users sub-navigation doesn't update until page refresh - probably caused by a PureComponent. I'm assuming the react-redux connect function is what is causing the issue. **Solution:** move the connect up to the parent component and pass the userId through


USE NODE v10!!!