(() => {
    'use strict'

    function makeRandom (definition) {
        const config = {}

        for (const key of Object.keys(definition)) {
            const entry = definition[key]

            config[key] = entry instanceof Array
                ? entry[Math.floor(Math.random() * entry.length)]
                : Math.random() * (entry.max - entry.min) + entry.min
        }

        return config
    }

    const config = makeRandom({
        inertia: {
            min: 0,
            max: 0.5,
        },
        attraction: {
            min: .01,
            max: .99,
        },
        repulsion: {
            min: .01,
            max: .99,
        },
        multiplyRate: {
            min: 0.0,
            max: 1.0,
        },
        blipRate: {
            min: 0.0,
            max: 1.0,
        },
        extendRate: {
            min: 0.0,
            max: 1.0,
        },
        removeRate: {
            min: 0.0,
            max: 1.0,
        },
        formation: [
            'createSegment',
            'createLine',
            'createLinesParallel',
            'createCircle',
            'createCirclesNested',
            'createCirclesAround',
            'createGrid',
        ],
    })

    const maxJoints = 8000
    const minJoints = 1000

    let joints = Formations[config.formation]()

    const multiplySelector = Selectors.random
    const blipSelector = Selectors.makeMostConnectedSum(6, Selectors.makeMinAge(20))
    const extendSelector = Selectors.makeLeastConnectedSum(8, Selectors.makeMinAge(2))
    const removeSelector = Selectors.makeMostConnectedSum(10, Selectors.makeMinAge(10))

    function step () {
        Grow.advance(config, joints, null)

        if (
            joints.length < maxJoints &&
            Math.random() < config.multiplyRate
        ) {
            Operations.multiply(joints, multiplySelector)
        }

        if (
            joints.length < maxJoints &&
            Math.random() < config.blipRate
        ) {
            Operations.blip(joints, blipSelector)
        }

        if (
            joints.length < maxJoints &&
            Math.random() < config.extendRate
        ) {
            Operations.extend(joints, extendSelector)
        }

        if (
            joints.length > minJoints &&
            Math.random() < config.removeRate
        ) {
            Operations.remove(joints, removeSelector)
        }
    }

    function run (steps) {
        for (let i = 0; i < steps; i++) {
            step()
        }
    }

    run(1000)
    Export.download('image-1000.svg', Export.asSvg(joints))

    run(1000)
    Export.download('image-2000.svg', Export.asSvg(joints))
})()