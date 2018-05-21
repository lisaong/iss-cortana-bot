# ISS Cortana Bot
Simple Cortana bot in Node.js for Institute of Systems Science, National University of Singapore

## Install
```
npm install
```

## Run

1. Create a file called `.env` with the following set:
```
MicrosoftAppId=ACTUAL_VALUE_HERE
MicrosoftAppPassword=ACTUAL_VALUE_HERE
```

2. Start the server 
```
npm start
```

## Deploy

Instructions below are for Azure, but this app is deployable on other systems / cloud providers (it only uses Azure for hosting purposes).

### Azure

The commands below should be run from Azure Cloud Shell.

Good references:
- https://docs.microsoft.com/en-us/azure/app-service/scripts/app-service-cli-scale-high-availability
- https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-local-git

1. Create the deployment user. Note down the username and password for deployment later.
```
az webapp deployment user set --user-name <username> --password <password>
```

2. Create an Azure App Service Plan from Azure Portal, or use `az appservice plan create` from Azure Cloud Shell. Let's call it `iss-cortana-dev` for example.

3. Create a Resource Group from Azure Portal or use `az group create`. Let's call it `iss-cortana-dev` for example.

4. Create the git-enabled app, replacing your_app_name with your own app name.
```
az webapp create --name your_app_name --resource-group iss-cortana-dev --plan iss-cortana-dev --runtime "node|8.1" --deployment-local-git
```

Save the output somewhere for future reference.

5. Copy the `deploymentLocalGitUrl` output and add an Azure remote from your *local command line* (note: *not* Azure Cloud Shell)
```
git remote add azure <deploymentLocalGitUrl>
```

6. From your *local command line", push to azure, using the username and password from step 1 when prompted.
```
git push azure master
```

The bot should now be available at https://your_app_name.azurewebsites.net/api/messages. If you access this URL from the browser, you should see something like:

```
{"code":"MethodNotAllowed","message":"GET is not allowed"}
```

7. Create a Bot Channels Registration To use the bot for chats, we'll need to add a Bot Channel for it.

Follow instructions here: https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0
