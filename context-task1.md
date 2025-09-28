# Goal: Add a placeholder test script to the root `package.json`.

The CI workflow requires a `test` script to exist. Please add the following script to the `"scripts"` object in the root `package.json` file.

If a `"scripts"` object does not exist, create one.

```json
"scripts": {
  "test": "echo \"Tests are not yet configured. Passing CI step.\" && exit 0"
}
