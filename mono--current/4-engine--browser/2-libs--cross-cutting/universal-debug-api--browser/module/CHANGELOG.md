# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

NOTE: Reminder to increase REVISION when releasing!

- TODO unit tests!
- TODO extract core implementation common bw node & browser?
- TODO better handle no local storage
- TODO handle iframes?
- [chore][breaking] pre-builds now targeting node22/ES2024
  [details](../../0-CONTRIBUTING/06-conventions--js--modules_and_transpilation.md)
- [chore][breaking] no longer shipping a pre-bundled lib. Current tooling makes it complicated + there are other
  solutions.
- [feat] fixed compatibility with the latest Typescript version (4.9)
- [chore][breaking] converted to full ESM, exposed as `"type": "module"`, requires node 12+, node 18+ recommended
- [doc] marked as maintained in 2024! Happy new year!
- [chore] removed usage of a globalThis ponyfill, this feature is now widely supported
- ...

## v1.0.1

2021/01/03

- [doc] marked as maintained in 2021! Happy new year!
- [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
- [chore] tweaked some logs
- [chore] bumped dependencies (minor)

## v1.0.0

2020/07/02

- [chore][breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
- [feat] better internal logging
- [doc] README++
- [chore] improved "attaching" logic with hints on setup error and improves some bad cases
- [chore] bumped dependencies (incl. most recent interface)
- [chore] tweak the tsconfig to not use nor import tslib, to avoid bloating the bundle size.

## v0.1.1

2019/12/12

- [chore] reorganized source paths = links updated in the doc

## v0.1.0

2019/11/22

- [fix] silence the internal logger
- [chore] linted automatically (no logic change)
- [chore] bumped dependencies

## v0.0.1

2019/11/11

- initial release to npm

## TEMPLATE

- [doc] README++
- [chore][breaking] no longer exporting ES5, reverted to
  [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
- [chore] bumped dependencies
- ...
