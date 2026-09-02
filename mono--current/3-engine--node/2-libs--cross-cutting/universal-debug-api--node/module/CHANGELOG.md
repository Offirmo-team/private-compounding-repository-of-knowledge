# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

NOTE: Reminder to increase REVISION when releasing!

- TODO fix underlying practical-logger-node!!
- TODO node & browser should share some logic
- TODO unit tests!
- [chore][breaking] pre-builds now targeting node22/ES2024
  [details](../../0-CONTRIBUTING/06-conventions--js--modules_and_transpilation.md)
- [feat] fixed compatibility with the latest Typescript version (4.9)
- [chore][breaking] converted to full ESM, exposed as `"type": "module"`, requires node 12+, node 18+ recommended
- [doc] marked as maintained in 2024! Happy new year!
- [chore] removed usage of a globalThis ponyfill, this feature is now widely supported
- ...

## v0.2.0

2021/01/03

- [feat][breaking] added ENV key normalization of a few unicode separator chars to "\_"
- [doc] marked as maintained in 2021! Happy new year!
- [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
- [chore] tweaked some logs
- [chore] bumped dependencies (minor)

## v0.1.0

- [chore][breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
- [chore] improved "attaching" logic with hints on setup error and improves some bad cases
- [chore] node & browser now have the exact same "attaching" logic (as it should be)
- [feat] better internal logging
- [chore] bumped dependencies (incl. most recent interface)
- [chore][breaking] correctly document the tslib peer dep

## v0.0.2

2019/12/12

- [chore] reorganized source paths = links updated in the doc
- [chore] linted automatically (no logic change)
- [chore] bumped dependencies
- [feat] now split an extra separator

## v0.0.1

2019/11/11

- initial release to npm

## TEMPLATE

- [doc] README++
- [chore][breaking] no longer exporting ES5, reverted to
  [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
- [chore] bumped dependencies
- ...
