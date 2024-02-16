
Node backend application.
Link to working app on Fly: https://mkphonebook.fly.dev/


1) Installation of nodes modules (based on package.json - if doesn't exist than will create one)
```shell
npm init
```

2) Install `nodemon` module for automate fetch changes in dev code with deployed/run locally application
```shell
npm install --save-dev nodemon
```
3) Install `express` module for ease of serving REST methods
```shell
npm install express
```
4) Automatization of the module starts
package.json modification
```json
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

```


### Install to fly.io


1) authorization/login (after account creation and added credit card information)
```shell
    fly auth login
```
2) configure project for Fly:
```shell
  fly launch 
```
After that `fly.tomlz` deployment file will be created at root directory of project.
Make sure you have correct port configured inside. Fly is running app on 3000 port. 
Therefore, we should also change port on our node app inside the code and analog change it toml file:

```toml
# add this ENV section to fly.toml
[env]
  PORT = "3000"
```
```js 
/* change port in code where server starts */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {...})
```


3) Deploy project (also redeploy when it changes)
```shell
fly deploy
```


## Connecting to MongoDB
1) Create account on MongoDB platform. You should get user with password and connection URL.
2) Install dotenv to store the env parameters 
```
npm install dotenv
```
3) Storing credentials to connect to DB:
* A) Create file `.env` in root folder. You can store there MONGO_URI with password inside. This file should be ignore from sending to git and also from docker image (.gitignore, .dockerignore)
* B) You can also add a secret to Fly.io if you are using it:
```shell
fly secrets set MONGODB_URI="mongodb+srv://<your_user_name>:<set_your_password>@<cluster_id>.mongodb.net/phoneApp?retryWrites=true&w=majority"
```

