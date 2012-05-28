# Stripper

Strips formatted comments to enable and disable blocks of code.

## Installing

    $ npm i stripper

## Usage

This software is meant primarily as a build tool. A basic syntax and simple preprocessor are supported.

### Basic Usage

    var stripper = require('stripper');
    var stripped = stripper.strip('lib.js');

#### Input

    start
    // STRIP
    strip it
    // END_STRIP
    end

#### Output

    start
    end

### Typical Options

    var stripper = require('stripper');
    var stripped = stripper.strip({path: 'lib.js', inclusive: false, startToken: 'DEBUG', endToken: 'END'});

#### Input

    start
    /* DEBUG
    debug
    END */
    end

#### Output

    start
    debug
    end

### Preprocessor

    var stripper = require('stripper');
    var stripped = stripper.strip({path: 'lib.js', preprocess: {FOO: true, BAR: true});

#### Input

    start
    // #ifdef FOO
    foo
    // #endifdef
    // #ifndef BAR
    bar
    // #else
    nobar
    // #endifndef
    end

#### Output

    start
    foo
    nobar
    end

### More

See the test folder and code for more usage information.

## License

MIT
