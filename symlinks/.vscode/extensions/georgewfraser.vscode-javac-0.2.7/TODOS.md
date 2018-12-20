# Todo

## Bugs
- Workspace root as source path crashes compiler
- Nested source roots don't make sense
- testMethod/testClass doesn't work for bazel
- Find-all-references doesn't work on constructors
- Files created in session don't autocomplete
- EnumMap default methods don't autocomplete

## Autocomplete
- Annotation fields
- cc should match CamelCase

## Navigation
- Go-to-subclasses

## Polish
- Convert {@tag ...} to `<tag>...</tag>` (see vscode-java)
- Auto-collapse imports
- Tooltip highlighting
- Highlight // TODO yellow and italic

## Simplicity
- Use module-info.java instead of build files to figure out classpath
- Link a standalone executable with jlink (scripts/link.sh)

## JShell
- Support .jshell extension as "scratch pad"
