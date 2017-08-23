# Todo

## Bugs
* import static org.| doesn't auto-complete
* array.length doesn't auto-complete
* Hover doesn't show 'throws ...'
* Enum const javadocs are not showing
* Missing ; lint has no width
* Autocomplete new MethodScopeClass| adds 'import .MethodScopeClass'
* implements | doesn't autocomplete
* super.[protected member] doesn't autocomplete
* When there is an annotation processor in the *client* dependencies, linting fails

## Default configuration
* Alert if we can't find a dependency
* Support module-info.java as a way to limit autocomplete and provide compile-time 'symbol not found'

## Polish
* Status bar info during indexing
* Convert {@tag ...} to `<tag>...</tag>` (see vscode-java)

## Autocomplete
* Annotation fields
* Enum options in switch statement
* Other methods of class when we have already statically imported 1 method
* Interface name for anonymous class new Runnable() { }
* Order members stream inherited-last

## Features 
* Go-to-subclasses
* Reformat selection, file

## Code actions
* Explode import *
* Auto-add 'throws ?'
* Unused return foo() => String ? = foo()

### Refactoring
* Inline method, variable
* Extract method, variable
* Replace for comprehension with loop

### Code generation
* New .java file class boilerplate
* Missing method definition
* Override method
* Add variable
* Enum options
* Cast to type
* Import missing file
* Unused return value auto-add

### Code lens
* "N references" on method, class
* "N inherited" on class, with generate-override actions

## Lint
* Add 3rd-party linter (findbugs?)