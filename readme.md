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

Enforce password strength policy (first we need to create a password policy)

## Known bugs

After updating a users basic details, a new user (state.user) is not re-fetched.

Combobox field border not coloured for validation.

Dates are not valid in in the datepicker on initial load

Not create or update notifications yet