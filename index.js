var fs = require('fs');

module.exports.strip = function strip (options)
{
    var opts = options || {},
        path = typeof opts === 'string' ? opts : opts.path,
        preprocess = opts.preprocess,
        ws = '[ \\t]*', // optional whitespace
        startToken = preprocess ? '#if(n)?def' + ws + '(\\w+)' : (opts.startToken || 'STRIP'),
        endToken = preprocess ? '#endif(n)?def' : (opts.endToken || 'END_' + startToken),
        input = path ? fs.readFileSync(path, 'utf-8') : opts.content,
        inclusive = typeof opts.inclusive !== 'undefined' ? opts.inclusive : true,
        outLines = [];
    
    if(input)
    {
        var line,
            lines = input.replace('\r', '').split('\n'),
            sc = '(?:/[/\*])', // start comment
            ec = '(\\*/)?', // end comment
            openRegex = new RegExp(ws + sc + ws + startToken + ws),
            closeRegex = new RegExp(ws + sc + '?' + ws + endToken + ws + ec +ws),
            elseRegex = preprocess ? new RegExp(ws + sc + ws + '?' + '#else' + ws + ec +ws) : null,
            inBlock = false,
            matches,
            token,
            find,
            el;
        
        lines.forEach(function(line)
        {
            find = inBlock ? closeRegex : openRegex;
            el = elseRegex ? elseRegex.exec(line) : null;
            matches = find.exec(line);
            if(matches)
            {
                if(inBlock)
                {
                    inBlock = false;
                }
                else
                {
                    inBlock = true;
                    if(preprocess)
                    {
                        negate = matches[1];
                        token = matches[2];
                        inclusive = negate ? preprocess[token] : !preprocess[token];
                    }
                }
            }
            else if(el)
            {
                inclusive = true;
            }
            else if(!inBlock || !inclusive)
            {
                outLines.push(line);
            }
        });
    }
    else
    {
        return null;
    }
    
    return outLines.join('\n');
}
