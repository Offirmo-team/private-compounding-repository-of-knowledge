# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- [feat][breaking] `normalizeError(errLike)` will now return the passed object if it has a proper error shape. It no
  longer always creates a copy, unless `{ alwaysRecreate: true }` is passed as a second argument
- [feat][breaking] `normalizeError(errLike)` now normalize well-known props (only framesToPop for now)
- [feat] `normalizeError(errLike)` now accept the "unknown" type as an input, to help handling Typescript 4.4 changes
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
- [feat] new `hasErrorShape(errLike)` exposed (should hardly be useful)
- [feat] now supports the ES2022 "cause" attribute
- [feat] now supports Firefox's "errors" attribute
- [chore][breaking] pre-builds now targeting node22/ES2024
  [details](../../0-CONTRIBUTING/06-conventions--js--modules_and_transpilation.md)
- [chore] supports typescript 4.8
- [chore] bumped deps
- [chore][breaking] converted to full ESM, exposed as `"type": "module"`, requires node 12+, node 18+ recommended
- [doc] marked as maintained in 2024! Happy new year!
- ...

## v0.0.1

2021/01/03

- initial release to npm

## template

- [doc] README++
- [chore] bumped deps
