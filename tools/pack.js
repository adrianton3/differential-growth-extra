'use strict'

const files = [

]


const readSource = (file) =>
	fs.readFileSync(file, { format: 'utf8' })


const unwrap = (source) =>
	source.replace(/^\(\(\) => \{\s+'use strict'/, '')
		.replace(/\}\)\(\)$/, '')


const undefine = (source) =>
	source.replace(
		/define\('(\w+)', \{\s+([^}]+)/,
		(match, name, definitions) => `global.${name} = {${definitions}}`
	)

// sources.map(unwrap)
//
// sources.map(undefine)