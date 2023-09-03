# Lavocat

[![Unit tests](https://github.com/sleonardoaugusto/lavocat_frontend/actions/workflows/tests-unit.yaml/badge.svg)](https://github.com/sleonardoaugusto/lavocat_frontend/actions/workflows/tests-unit.yaml)
[![E2E tests](https://github.com/sleonardoaugusto/lavocat_frontend/actions/workflows/tests-e2e.yaml/badge.svg)](https://github.com/sleonardoaugusto/lavocat_frontend/actions/workflows/tests-e2e.yaml)

## Setup

Install dependencies

```
$ yarn
```

### Development mode

1. Run server

```
$ yarn serve
```

### Production mode

1. Compiles and minifies for production
2. Run server

```
$ yarn build
$ yarn run start
```

### Unit tests

#### Run once

```
$ yarn jest
```

#### Watch mode

```
$ yarn jest --watch
```

### E2E tests

(_The project must be running_)

#### With browser

```
$ cypress open
```

#### Run once (headless)

```
$ cypress run
```
