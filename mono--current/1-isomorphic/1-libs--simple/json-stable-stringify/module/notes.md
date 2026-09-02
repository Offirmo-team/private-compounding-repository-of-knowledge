private fork of https://github.com/substack/json-stable-stringify

turned to typescript + no incompatible cjs export + modernized

TODO add a feature to validate JSON

```
import stringifyⵧstable from '@monorepo-private/json-stable-stringify'
```

See also

- https://typia.io/docs/json/stringify/
- https://www.npmjs.com/package/fast-json-stringify
- "concern is with 512MB string literal size limitation"
- "At the least the code was not crashing (OOM) node services while attempting to stringfy on a larger object"
  - "we are using safe-stable-stringify. We wanted something that would clear out circular refs and be able to redact
    sensitive fields for logging and it has done a great job for us, depending on your use case it might be a good fit

/\*\*

- Any value in this array will be compiled into a Regex and keys that contain these values will be
- sanitized. The regex is case-insensitive and matches substrings of keys.
-
- NOTE: If the _value_ of the matched key is not a string, it will not be sanitized and you will need to
-       use the COMMON_EXCLUDE_KEYS set to explicitly sanitize the value.
-
- Ex: If you were to add `team` then keys named `teamName`, `xyzTeam`, and `theTeamName`
-     would all be sanitized.
-
- If you need to exclude only a specific value use EXCLUDE_KEYS below as those exclude based on exact
- matches with a key. \*/ const COMMON_REGEX_EXCLUDE_KEYWORDS = [ "_header", "authorization", "body", "email", "phone",
  "name", "password", "secret", "title", "token", ];

const EXCLUDE_REGEX = RegExp( COMMON_REGEX_EXCLUDE_KEYWORDS.reduce((regexStr, keyword) => regexStr + `|${keyword}`,
"").slice(1), "gi" );

/\*\*

- Strings in this Set will cause keys that match exactly to have their values sanitized. \*/ const COMMON_EXCLUDE_KEYS =
  new Set([ "attachments", "blocks", "Body", // SQS message Body "config", // mostly useful for suppressing axios
  error.config which can leak PII/UGC "description", "domain", "displayName", "rawData", "serviceAccountKey",
  "stripped-html", "stripped-signature", "stripped-text", "text", "username", "avatar", "User-Context", // All of these
  are team/enterprise prefs "agentThreadMessage", "requesterThreadMessage", "privateRequesterThreadMessage",
  "botWelcomeText", "botUsername", "botResponseText", "appHomeText", "replyText", ]);

function shouldSanitizeKey(key: string, value: any): boolean { if (!Boolean(value)) { return false; }

if (COMMON_ALLOWED_KEYS.has(key)) { return false; }

if (COMMON_EXCLUDE_KEYS.has(key)) { return true; }

// Need to use match (vs test) here since there's _still_ a bug with the regex engine //
https://stackoverflow.com/questions/3891641/regex-test-only-works-every-other-time // Also the syntax looks funky, but
this is the proper way to call regex.prototype.match //
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/@@match return typeof value ===
"string" && Boolean(EXCLUDE_REGEX[Symbol.match](key)); }

function stringifySanitizer(key: string, value: any) { const shouldSanitize = shouldSanitizeKey(key, value);

if (shouldSanitize) { return "[Sanitized]"; }

return value; }

type StringifySafeOptions = { shouldSanitize?: boolean; space?: number | string; };

export function stringifySafe(obj: object, { shouldSanitize = true, space = 0 }: StringifySafeOptions = {}): string {
const replacer = (key: string, value: any) => { if (shouldSanitize) { return stringifySanitizer(key, value); } return
value; };

return stringify(obj, replacer, space); }
