var fs = require('fs'),
    stripper = require('../'),
    files = fs.readdirSync(__dirname),
    test = process.argv[2],
    enc = JSON.stringify;

files.forEach(function(file)
{
    if('test' === file.substr(0,4) && (!test || test === file))
    {
        var sections = fs.readFileSync(__dirname + '/' + file, 'utf-8').split('-----'),
            options = {};
        
        // parse options
        try
        {
            options = JSON.parse(sections[0]);
        }
        catch(e)
        {
            console.log(e.message);
        }
        
        // push content to options
        options.content = sections[1].trim();
        
        // assign expected and compare to actual
        var expected = sections[2].trim(),
            actual = stripper.strip(options),
            passed = expected === actual;
        
        // log result
        console.log(file + ': ' + (passed ? 'passed' : 'failed'));
        if(!passed) console.log(['', enc(expected), enc(actual), ''].join('\n'));
    }
});
