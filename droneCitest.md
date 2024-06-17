

```yml
kind: pipeline
type: docker
name: default

steps:
- name: install_dependencies_and_build_app
  image: node:latest
  commands:
    - cd app
    - npm install
    - npm run build

- name: install_dependencies_and_run_tests
  image: node:latest
  commands:
    - cd test
    - npm install
    - npx playwright test

services:
- name: db
  image: mysql:latest
  environment:
    MYSQL_ROOT_PASSWORD: SprintRunners
    MYSQL_DATABASE: mydb

```