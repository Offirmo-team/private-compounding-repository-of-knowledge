# Offirmo Team's private, compounding repository of code and knowledge

## Description

Offirmo's Team repository of code and knowledge,
hopefully compounding over time.

## License

Due to genAI environment changes,
all code and content is now CLOSED source until further notice. (with some exceptions: check closest license file)

## Goals

- public repo (for ease of access) with no private info

## Usage

Commands to transfer contributions when no access:

```bash

## exporting staged uncommited changes
git diff --staged --patch --binary > ~/work/tmp/otpcrk.patch
## git apply is intentionally strict: it expects the patch to match the target files closely.
## --3way lets it fall back to a merge if the target tree has drifted slightly.
git apply --3way ~/work/tmp/otpcrk.patch
git apply --3way ./otpcrk.patch


## exporting last commits
## am = archive mail, designed for the "mail patches around" 
## --binary is needed if any commit touches images, PDFs, etc. Without it those changes silently become "Binary files differ" placeholders that won't apply.
git format-patch -3 --stdout --binary > otpcrk.patch
## --3way lets it fall back to a merge if the target tree has drifted slightly. This recreates all three commits with original messages, authors, and author dates
git am --3way < last3.patch
```
