# Todo

## Bugs
- Crashes when you create the first file in a new maven project
- Deleted files remain in compiler, even when you restart (via classpath?)
- Always shows last javadoc
- Make new file, rename, edit crashes compiler

## Autocomplete
- Annotation fields
- cc should match CamelCase
- Autocomplete POJO constructor This(T f, U g) { this.f = f; ... }

## Navigation
- Go-to-subclasses
- Test coverage codelens
- Go-to-definition for overriding methods
- Go-to-implementation for overridden methods

## Polish
- Hover constructor should show constructor, not class
- Show warning for unused local var, unused private method
- Use cached codelens during parse errors to prevent things from jumping around, or codelens-on-save
- Suppress references codelens for inherited methods
- Don't remove imports when there's an unresolved reference to that name

## Simplicity
- Use module-info.java instead of build files to figure out classpath

## JShell
- Support .jshell extension as "scratch pad"

# Coloring
- new Foo< shouldn't make everything green
- void f() shouldn't mess up next line as you type it
- { on next line breaks coloring

# Formatter
- Automatically add @Override annotations