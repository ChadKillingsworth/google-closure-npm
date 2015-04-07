#Closure-NPM

This project is to facilitate building and packaging Google Closure Tools via NPM.

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

If the build succeeds, the `packages/google-closure-compiler` folder will be populated and ready to publish to NPM.

    cd packages/google-closure-templates
    npm publish