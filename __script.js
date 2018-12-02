const fs = require('fs');

// Read the index.html from build folder
const data = fs.readFileSync('./www/index.html', 'utf8');

function insertContent(fullContent, beforeWhat, newContent) {
	// Get the position before which newContent has to be added
	const position = fullContent.indexOf(beforeWhat);

	// Since splice can be used on arrays only
	const fullContentCopy = fullContent.split('');
	fullContentCopy.splice(position, 0, newContent);

	return fullContentCopy.join('');
}

// Will add the <meta> tags needed for cordova app
const afterAddingMeta = insertContent(data, '<link',
	'<meta name="format-detection" content="telephone=no">' +
'<meta name="msapplication-tap-highlight" content="no">');

// Will add <script> pointing to cordova.js
const afterAddingScript = insertContent(afterAddingMeta, '<script', '<script type="text/javascript" src="cordova.js"></script>');

// Updates the index.html file
fs.writeFile('./www/index.html', afterAddingScript, 'utf8', err => {
	if (err) {
		throw err;
	}
});
