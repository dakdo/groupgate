To run Group Gate

1. Have Virtual Box and Vagrant installed
2. vagrant up
3. Go to your local web browser at localhost:7000

If Vagrant doesn't work: Go to README files in backend and frontend for separate installation instructions

Accounts available (Username/Password)

1. user/pass
2. user1/pass
3. user2/pass
4. user3/pass
5. coolguy/pass

Notes on use:

1. Currently changes may only be viewed on page refresh
2. User signup is currently broken
3. Only group owners can update groups
4. The API is served on localhost:8000 - Info on it can be found in the README in the backend directory

Features available:

1. Edit your display name and about me
2. View the invites you have sent and have received
3. Accept/Decline invites from other users
3. View other currently available users and invite them to a group of yours
4. Create a group
5. Edit the group info
6. Remove a group member
7. All of the information behind the features are done through an API that I created in Django Rest Framework
