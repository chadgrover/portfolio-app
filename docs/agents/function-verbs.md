# Function Verbs

Every function this repo defines has a verb-noun name: a verb from the list below, then what it acts on, such as `getPortfolioContent` or `createHomePage`. A `to` function names its result instead: `toKilobytes`.

A name a framework requires, such as Astro's `getStaticPaths` or a loader's `load`, keeps that name.

## When you change a function

Rename it to verb-noun if it isn't already, and rename its call sites in the same change. A function whose code you leave unchanged keeps its name.

## When no verb fits

Add the verb to the table with its one-line meaning, in the same change. Name the new verb in your reply to the user and in the PR description, so the user can reject it.

## Verbs

| Verb | Meaning |
|---|---|
| `get` | Return a value that already exists, such as a content entry or a collection |
| `create` | Build a new value from its inputs, such as page metadata |
| `update` | Change a value that already exists |
| `delete` | Remove a value |
| `read` | Load bytes or text from a file |
| `parse` | Turn text into checked, typed data |
| `select` | Choose one item from a set of options, such as a language for a browser tag |
| `is` | Answer yes or no |
| `to` | Convert a value into another form, naming the result |
