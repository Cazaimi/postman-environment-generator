# postman-environment-generator

An NodeJS app that creates a Postman environment for all the variable names in your Postman collection.

## Introduction

> For more information on Postman, Postman-collections and Postman-environments, check out [Postman](https://www.getpostman.com)

This app was born to serve the following, specific use case:

Say that you import a _huge_ collection in a workspace that has tonnes of [environment variables](https://learning.getpostman.com/docs/postman/environments_and_globals/variables/) embedded inside out it (In the form of `{{variable}}`). Now you need an environment that contains all those variables but, manually creating them would be cumbersome. Hence, you use this app, which takes a `JSON` file as input and using the [Postman API](https://docs.api.getpostman.com/?version=latest), creates an environment for you in the given workspace, **containing all those variables**.

## Requirements

1. [NodeJS](https://nodejs.org/dist/v10.16.0/node-v10.16.0.pkg) version `10.15.0+` 
2. npm version `6.4.1+`
3. [Postman Desktop App](https://www.getpostman.com/downloads/) version `7.0.0+`
4. Postman API Key (Steps to get that are [here](https://learning.getpostman.com/docs/postman/postman_api/intro_api/))

## Usage 

1. Clone this into your local folder and navigate to it.
2. Run `npm install`
### Using exported collection's file
1. Export the collection JSON from the Postman app (Steps to do that are [here](https://learning.getpostman.com/docs/postman/collections/data_formats/#exporting-postman-data)). The file encoding must be `utf-8`. 
2. Run `node index.js <absolute-path-to-collection-file> <name-that-environment-should-get> <postman-api-key> <workspace-id>`
### Using uuid
2. Run `node index.js <collection-id> <name-that-environment-should-get> <postman-api-key> <workspace-id>`

> The `collection-id` is a parameter to get collection using the API. To get the collection-id, follow these steps:
> 1. Log into the postman app
> 2. Select any collection
> 3. Click on the right arrow beside the collection name
> 4. Click on 'View in Web'
> 5. The opened browser window contains url of the form: [https://postman.co/collections/**xyz-uuid**?version=latest&workspace=uuid](https://postman.co/collections/xyz-uuid?version=latest&workspace=uuid)
> 6. Copy the xyz-uuid before the question mark.


> The `workspace-id` is an optional parameter. Not giving the workspace Id will add the environment to your default workspace. To get the workspace-id, follow these steps:
> 1. Log into the postman app
> 2. Select any collection
> 3. Click on the right arrow beside the collection name
> 4. Click on 'View in Web'
> 5. The opened browser window contains url of the form: [https://postman.co/collections/xyz-uuid?version=latest&workspace=**uuid**](https://postman.co/collections/xyz-uuid?version=latest&workspace=uuid)
> 6. Copy the workspace Id.

### Example

Running:
```
node index.js ~/Downloads/collections/my-collection.json ImportedCollection 74a2bdd31eeb457a88c9a3342c7c8f81 404891cb-a247-4508-81dc-38f745118221
```

Will create an environment called 'ImportedCollection' with all environment variables present in the collection file located at `~/Downloads/collections/my-collection.json`, in the workspace with the id `404891cb-a247-4508-81dc-38f745118221`.
