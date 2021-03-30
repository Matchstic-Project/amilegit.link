<p align="center">
  <img src="https://github.com/Matchstic-Project/amilegit.link/blob/main/client/logo-small.png" alt="logo" />
</p>

# amilegit.link
_Hide an innocent link behind a malicious looking URL_

## How it works

amilegit is the antithesis of a URL shortnener. Instead of making links short, it transforms them into a form that appears malicious.

**See this YouTube video for a brief(-ish) overview:** 

[![YouTube: that link is totally legit right?](https://img.youtube.com/vi/RO86MfjkVDg/maxresdefault.jpg)](https://www.youtube.com/watch?v=RO86MfjkVDg)

The project is comprised of two halves: a [Vue.js](https://vuejs.org/) frontend, and [`serverless`](https://www.serverless.com/) backend. Everything is written in [TypeScript](https://www.typescriptlang.org/), and has relevant unit tests implemented.

In production, the backend is running on [AWS Lambda](https://aws.amazon.com/lambda/), and the frontend is served from an [S3](https://aws.amazon.com/s3/) bucket. [DynamoDB](https://aws.amazon.com/dynamodb/) is used as the backing database for the server-side. Since this is a major dependency, some additional work would be required to run the project anywhere other than AWS. That's not to say its impossible, though!

## Getting it running locally

### Pre-requisites

You will need the following installed:

- [node.js 12.x (or newer)](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)
- Java Runtime Engine (JRE) version 6.x or newer (for local database)

If you don't have a good text editor, [Visual Studio Code](https://code.visualstudio.com/) is excellent (and is free!).

### Getting setup

To download a copy of this repository, in your favourite command-line interface:

```
$ git clone https://github.com/Matchstic-Project/amilegit.link.git
$ cd amilegit.link
```

### Running the server

First, we'll get the server running. 

```
$ cd server
$ yarn install
$ sls dynamodb install
$ yarn local
```

This will start the server-side on port `8081`, ready to accept connections from the frontend.

### Running the frontend

It's recommended to open a new command-line window to keep the server running!

Assuming you open the window inside the main `amilegit.link` folder:

```
$ cd client
$ yarn install
$ yarn serve
```

The client will now be running on port `8080`. You can now head over to `http://localhost:8080` in your browser to see it running.

## [optional] Deploying to AWS

The project is setup so you can deploy it to your own AWS account. There are a few tweaks you need to make, though.

You will also need the following:

- [AWS CLI](https://aws.amazon.com/cli/)
- IAM user for deployment

For the latter, you should follow [this guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/). It'll be assumed you have a profile created named `serverless-admin` as recommended there.

The deployment process is two parts for now. I think there's a couple of steps missing however, so you may need to get creative to hook everything up right.

### Server deployment

To deploy the server, first, you need to update `server/components/domains.json` to only include the domain you want to point at your server. e.g., if you own `blahblah.com`, the JSON file will look like this:

```
{
    "items": [
        "blahblah.com"
    ]
}
```

Now, you can deploy the code:

```
$ cd server
$ yarn deploy
```

That will create the relevant lambda functions, API gateway and DynamoDB tables the codebase requires at AWS for you.

### Client deployment

This part is 💩. Deploying the client is a little bit (!!) more involved than it should really be.

First, you should update `client/src/lib/network.ts` on line 10. Replace `https://api.amilegit.link` to point at your deployed server.

Now, head over to AWS. You need to create a bucket for the frontend to be deployed into, and to be configured for web hosting. [See here for Amazon's documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html).

Next, you need to set environment variables to point at an S3 bucket used for deployment. 

```
$ cp env.sample .env
$ nano .env
```

You need to fill in the name of your S3 bucket here, as well as setting the right IAM user profile, if it is different to `serverless-admin` as above.

Now, you should be able to run:

```
$ yarn deploy:s3
```

## Licensing

amilegit.link is licensed under the [GPLv3](https://github.com/Matchstic-Project/amilegit.link/blob/main/LICENSE). I also ask that you also don't make commerical derivatives of it.
