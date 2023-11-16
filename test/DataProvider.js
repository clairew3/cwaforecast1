
let fs = require('fs');

function getRawJsonStrFromFile(filename) {
	return fs.readFileSync(filename,'utf-8');
}

function getJsonFromFile(filename) {
	// console.log(`filename: ${filename}`);
	return JSON.parse(getRawJsonStrFromFile(filename));
}



export { getRawJsonStrFromFile, getJsonFromFile };

