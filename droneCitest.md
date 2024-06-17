

```yml
kind: pipeline
type: docker
name: default

steps:
- name: build_and_run_compose
  image: tonglil/drone-docker-compose
  settings:
    compose_file: dev.yml
    services: [app, playwright-tests]

- name: run_tests
  image: playwright-tests:latest
  commands:
    - npx playwright test

services:
- name: db
  image: mysql:latest
  environment:
    MYSQL_ROOT_PASSWORD: SprintRunners
    MYSQL_DATABASE: mydb
```