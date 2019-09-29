(() => {
    'use strict'

    function randomRange (min, max) {
        return Math.random() * (max - min) + min
    }

    function randomElement (elements) {
        return elements[Math.floor(Math.random() * elements.length)]
    }

    function makeRandom (definition) {
        const config = {}

        for (const key of Object.keys(definition)) {
            const entry = definition[key]

            config[key] = entry instanceof Array
                ? randomElement(entry)
                : randomRange(entry.min, entry.max)
        }

        return config
    }

    function mutate (definition, config) {
        const mutated = { ...config }

        const key = randomElement(Object.keys(definition))

        const entry = definition[key]
        mutated[key] = entry instanceof Array
            ? randomElement(entry)
            : randomRange(entry.min, entry.max)

        return mutated
    }

    define('Config', {
        makeRandom,
        mutate,
    })
})()