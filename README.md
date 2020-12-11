# Self-monitoring Web Application

## Prerequisites
### Install

This project uses [Deno](https://deno.land/manual/getting_started/installation). Go check it out if you don't have them locally installed.

Using Shell (macOS and Linux):

```shell
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Using PowerShell (Windows):

```shell
iwr https://deno.land/x/install/install.ps1 -useb | iex
```
### browser
recommand to use Chrome (version 87.0.4280.88) .

## Table of Contents

- [Self-monitoring Web Application](#self-monitoring-web-application)
  - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [browser](#browser)
  - [Table of Contents](#table-of-contents)
  - [Function Summary](#function-summary)
    - [Summarization](#summarization)
  - [Database](#database)
  - [Lauching the application](#lauching-the-application)
  - [Testing](#testing)

## Function Summary 



> Remember: the documentation, not the code, defines what a module does.

The goals for this repository are:

### Summarization
The application provides functionality for summarization of responses. Each user can view statistics of their reports on a weekly and monthly level. These statistics are as follows.
*	Average sleep duration
*	Average time spent on sports and exercise
*	Average time spent studying
*	Average sleep quality
*	Average generic mood

High-level summaries generated from all the users of the application are shown both on the landing page of the application and provided through an API.




## Database

In total, we created three tables for storing the users information and data submitted from users.

1. First of all, creates the users table, the sql command is as follow:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));
```

2. Then create a table named morning to store the relative information.
   
```sql
CREATE TABLE morning (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  duration numeric NOT NULL,
  quality numeric NOT NULL,
  mood numeric NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
```
3. Finally create a table named evening to store the relative information.
```sql
CREATE TABLE evening (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  sports numeric NOT NULL,
  study numeric NOT NULL,
  eating numeric NOT NULL,
  mood numeric NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
```



## Lauching the application

```shell
deno run --allow-net --allow-read --allow-env --unstable app.js
```

## Testing

To see how the specification has been applied, see the [example-readmes](example-readmes/).


```shell
deno test --allow-net --allow-env --allow-read
```
