# Project Setup


## Project Overview
Super Fastify Rest API Project is aimed to provide all API endpoints for Super Fastify algo trading application. including all the endpoints for user registration, users authentication, user management, trade signals, trading, reporting and other features.
Its webframework is based on fastify and uses mongodb as database. It also uses redis for caching and message queueing and more.
It aims to be fully stateless. It uses Paseto for authentication & authorization (paseto V4 public).
It equipped with Bull for queueing and scheduling jobs.
Code is written in Javascript and uses ES7 features.


## Packages
- [fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js
- [fastify-plugin]() it is mandatory part of Fastify
- [fatify-static]() - Static file serving for Fastify - Just for tests and development phase. It will be removed in production.
- [ioredis]() - Redis client for Node.js
- [mongodb]() - The official MongoDB driver for Node.js
- [paseto]() - PASETO implementation for Node.js
- [nanoid]() - A tiny, secure, URL-friendly, unique string ID generator for JavaScript
- [bull]() - Premium Queue package for handling distributed jobs
- [eta]() - A tiny, fast, and secure template engine for JavaScript
- [svg-capcha]() - A simple SVG captcha generator for Node.js


## Project Structure
---
- **config** - config.mjs reside in root directory and contains all the configuration files for the project
it is a native js object and it is exported as a module. It is used in the project by importing it. It is used to store all the configuration variables for the project. some keys may override using environment variables.

- **plugins** - reside in plugin directory and are loaded by fastify-plugin. plugins are used to prepare connection to database, redis, and other services. It also contains some core features.

- **endpoints** - reside in endpoints directory and are loaded by fastify-plugin. endpoints are used to define all the routes for the project.

- **entrypoint** - index.mjs reside in root directory and executed by node. It just loads the server and starts it and reserved for some initializations.

- **server** - server.mjs reside in root directory and is the main file for the project. It is used to load all the plugins and endpoints and start the server.

- **utils** - utils directory contains all the utility functions for the project.

- **tests** - tests directory contains all the tests for the project.

- **docs** - docs directory contains all the documentation for the project.

- **libs** - libs directory contains all the libraries for the project.

- **views** - views directory contains all the views for eta. altough it is rarely used.

