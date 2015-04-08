#Closure-NPM

This project is to facilitate building and packaging Google Closure Tools via NPM.

## Requirements
This package assumes that build tools (such as Maven and Ant) are installed and available on the path.

While the project uses NPM, Node and Grunt to automate the build steps, it mainly uses shell tasks and as such doesn't download the dependencies for building each project.

## Usage

### Compiler

    npm install
    grunt compiler --ver 20150315
    
If the build succeeds, the `packages/google-closure-compiler` folder will be populated and ready to publish to NPM.

    cd packages/google-closure-compiler
    npm publish
    
### Templates

Template releases are not currently tagged in GitHub. You must first make sure the HEAD of the `closure-templates` submodule points at the desired commit.

    npm install
    grunt templates --ver 20150403 

If the build succeeds, the `packages/google-closure-templates` folder will be populated and ready to publish to NPM.

    cd packages/google-closure-templates
    npm publish
