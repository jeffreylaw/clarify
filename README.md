# clarify

Clarify is a MEAN stack app that serves as a platform for students ask and answer questions. 

## Run the following command in MongoDB to give an user full admin permissions

db.users.update(
	{ username: 'USERNAME_HERE' },
	{ $set: { roles: ['admin'] } }
)