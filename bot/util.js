const PARSE_CURRENT_FUNCTION_URL = 'https://lambda.trelent.net/api/v4/ParseCurrent/ParseCurrentFunction';
const PARSE_FUNCTIONS_URL        = 'https://lambda.trelent.net/api/v4/ParseAll/ParseSourceCode';
const WRITE_DOCSTRING_URL        = 'https://trelent.npkn.net/write-docstring';
module.exports.SUPPORTED_LANGUAGES        = ["csharp", "java", "javascript", "python"];

// External imports
const axios = require('axios').default;

module.exports.requestDocstrings = async(funcs, user, language)  => {

    let functionDocstrings = [];

    // Get a docstring for each function
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await Promise.all(funcs.map(async(func) => {
        // Setup our request body
        let reqBody = {
            'language': language,
            'sender': 'ext-discord',
            'snippet': func.text,
            'name': func.name,
            'params': func.params,
            'user': user,
        };

        // Send the request based on the language
        await axios({
            method: 'POST',
            url: WRITE_DOCSTRING_URL,
            data: JSON.stringify(reqBody),
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            let result = response.data;

            if(result.docstring !== null) {

                // Quickly setup our docstring editor
                let docstring = result.docstring;
                functionDocstrings.push({"docstring": docstring, "point": func.docstring_point});
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }));

    return functionDocstrings;
};

module.exports.parseCurrentFunction = (document, language, cursor) => {
    // Setup our request body
    let reqBody = {
        'cursor': cursor,
        'language': language,
        'source': document
    };

    // Send the request
    return axios({
		method: 'POST',
		url: PARSE_CURRENT_FUNCTION_URL,
		data: JSON.stringify(reqBody),
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'application/json'
		}
	});
}