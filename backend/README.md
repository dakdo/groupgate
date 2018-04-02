Endpoints available

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

This generates a JWT token or refreshes it. Use in the format:

JWT <token>

api/auth/token/obtain/  OR   api/auth/token/refresh/

```json
{
    "username": "dakdo",
    "password": "dakdo"
}
```

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

For ratings (currently has no ownership):

/api/ratings/

```json
{
    "user":1
    "rating":3
}
```

Filters groups with course with CMPT470
/api/groups/?course="CMPT470"

For invitations:

/api/invites/

status = 0 is no reply
status = 1 is invite accepted (to_user is now in group)
status = 2 is invite declined

NOTE: Status does not need to be supplied and is 0 by default (indicating no response)

Updates are not allowed

```json
{
    "from_user": 1,
    "to_user": 2,
    "group": 1,
    "status": 0
}
```

/api/invites/<id>/response/

This should be displayed for the user after the invite is sent out using the previous endpoint.

POST only

```json
{
	"response": true
}

How to run the backend:

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