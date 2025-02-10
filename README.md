# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Creating an Amplify Project
Right now the application runs on mock data. For the actual data implementation we will create an Amplify project in our root folder. For this, make sure you are in the root folder of your project and run the following:

```bash
npm create amplify@latest -y
```

This will create an Amplify project with the latest version of the dependencies and the necessary libraries. This call will create files under the following structure

```
amplify/               # AWS Amplify configuration
├── auth/              # Authentication settings
   └── resource.ts     # Authentication resources definition
├── data/              # Data models and schema
   └── resource.ts     # Data resources definition
├── backend.ts         # Keeps the backend resource to be deployed
├── package.json       # Keeps the library references (if needed)
└── tsconfig.json      # TypeScript configuratio file
```

`resource.ts` files represent the resources and what should be used by the `backend.ts` file to do a deployment. Initial project only has auth and data but if we want to have 

## First Deployment

For deploying the app for the first time, you can call the `sandbox` functionality. That will create a per-deleveoper deployment with actual resources, independent from your production environment. To run it, you have to run `npx ampx sandbox` command. 

## Deleting resources

To delete the resources from your sandbox, you have to run `npx ampx sandbox delete` command. This will delete all the created resources for your application.

## License
MIT-0
