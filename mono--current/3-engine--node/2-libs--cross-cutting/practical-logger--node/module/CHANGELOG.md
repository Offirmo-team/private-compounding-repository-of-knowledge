# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- XXX DO NOT PUBLISH BEFORE RESOLVING THE PRIVATE DEP (temporary, work in progress)
- TODO fix the "maximum call stack exceeded" when printing a SXC
- TODO pretty+intelligently print the details
- [feat] improved the log line spacing (suppressed a redundant one)
- [doc] ++
- [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
- [chore] bumped dependencies (minor)
- [doc] marked as maintained in 2024! Happy new year!
- [chore][breaking] pre-builds now targeting node22/ES2024
  [details](../../0-CONTRIBUTING/06-conventions--js--modules_and_transpilation.md)
- [fix] fixed a dev dep incorrectly listed in prod
- [chore][breaking] converted to full ESM, exposed as `"type": "module"`, requires node 12+, node 18+ recommended
- ...

## v0.3.0

2020/07/01

- [chore][breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
- [chore] bumped dependencies

## v0.0.5

2019/12/12

- [feat] now enforce a lib size limit (relevant for lambda/functions)
- [chore] bumped dependencies
- [chore] reorganized source paths = links update in the doc

## v0.0.4

2019/11/08

- [feat] now export types and defaults
- [doc] README++
- [chore] bumped dependencies
- [chore] better internal typings

## v0.0.3

2019/10/28

- [feat] now implementing 2.0.0 interface
- [feat] now allows activating time display
- [fix] removed the "private" sink which was causing installation problems
- [fix] correctly allows passing no args to createLogger() (this was intended)
- [test] more unit tests
- [refactor] internal package @offirmo/practical-logger-interfaces renamed to @monorepo-private/practical-logger--types
- [chore] bumped dependencies

## v0.0.2

2019/09/17

- remove optionalDependencies to private package (it doesn't work)

## v0.0.1

2019/09/17

- initial release to npm

## template

- [doc] README++
- [chore] bumped deps
- [chore] upgraded pre-built code target to latest stable JS (ES2019)
