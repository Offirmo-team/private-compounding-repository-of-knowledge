# @monorepo-private/gravatar

Isomorphic [Gravatar](https://gravatar.com) avatar URL builder.

## Usage

```ts
import { getꓽgravatar_url } from "@monorepo-private/gravatar"

const url = await getꓽgravatar_url("MyEmailAddress@example.com")
// => "https://www.gravatar.com/avatar/84059b07…?s=256"

const small = await getꓽgravatar_url("me@example.com", { size‿px: 64 })
```
