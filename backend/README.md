# Group Gate API using Django REST Framework

## Users

/api/users/

```json
{
    "username": "",
    "password": "",
    "first_name": "",
    "last_name": "",
    "display_name": "",
    "groups": []
}
```

### User authentication

This generates a JWT token or refreshes it. Use in the format:

JWT <token>

api/auth/token/obtain/  OR   api/auth/token/refresh/

```json
{
    "username": "dakdo",
    "password": "dakdo"
}
```

### User ratings

Rate a user with an integer value (will update to 5-star rating).

/api/ratings/

```json
{
    "user":1
    "rating":3
}
```

## Groups

Create a group with existing users with an assigned role.

/api/groups/

```json
{
    "name": "x",
    "description": "x",
    "course":"CMPT470",
    "members": [{"user":1, "role":"dev"},{"user":2, "role":"dev"}],
    "owner": "3"
}
```

### Filter groups by course

Filters groups with course with CMPT470

GET
/api/groups/?course=CMPT470


### Filter groups by owner

Filter groups with owner id of 4

GET
/api/groups/?owner=4


## Invites

Allow a user to invite another to a group. The invite response is handled on another endpoint below.

/api/invites/

```json
{
    "from_user": 1,
    "to_user": 2,
    "group": 1,
    "status": 0
}
```

* status = 0 is no reply
* status = 1 is invite accepted (to_user will be automatically added to group)
* status = 2 is invite declined

NOTE: Status does not need to be supplied and is 0 by default (indicating no response)

Updates are not allowed

### Invite response

Accept or decline an invite.

/api/invites/<id>/response/

```json
{
	"response": true
}
```

POST only

This should be displayed for the user after the invite is sent out using the previous endpoint.


## How to use

Requirements:
1. Python 3.6
2. pipenv

To run the server (in command-line):
1. pipenv install
2. pipenv shell
3. python manage.py makemigrations
4. python manage.py migrate
5. python manage.py createsuperuser (Only have to do this once and follow the prompts)
6. python manage.py runserver

From here you can go to:
1. localhost:8000/admin (Logging in with superuser account) to view everything available
2. Django REST API UI using an endpoint mentioned above (e.g. localhost:8000/api/users)