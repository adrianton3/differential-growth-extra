(() => {
    'use strict'

    const configDefinition = {
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
    }

    const candidates = []

    const steps = 250

    function branch (config, joints, steps) {
        for (let i = 0; i < 4; i++) {
            const configMutated = Config.mutate(configDefinition, config)
            generate(configMutated, joints, steps)
        }
    }

    function remove (entry) {
        const index = candidates.indexOf(entry)
        if (index > -1) {
            candidates.splice(index, 1)
        }

        const { canvas } = entry
        canvas.parentNode.removeChild(canvas)
    }

    function push (config, joints) {
        const canvas = document.createElement('canvas')
        canvas.width = 768
        canvas.height = 768

        const container = document.getElementById('container')
        container.appendChild(canvas)

        const entry = {
            config,
            joints,
            canvas,
        }

        candidates.push(entry)

        canvas.addEventListener('click', (event) => {
            event.preventDefault()

            if (event.button === 0) {
                if (event.ctrlKey) {
                    remove(entry)
                } else {
                    branch(config, joints, steps)
                }
            }
        })

        Draw.init(canvas)
        Draw.path(joints)
    }

    function generate (config, joints, steps) {
        const worker = new Worker('src/worker.js')

        worker.addEventListener('message', (event) => {
            const message = event.data

            if (message.type === 'result') {
                push(config, Transfer.deserialize(message.joints))
            }
        })

        worker.postMessage({
            type: 'run',
            config,
            joints: Transfer.serialize(joints),
            steps,
        })
    }

    function init () {
        const config = Config.makeRandom(configDefinition)
        const joints = Formations[config.formation]()
        generate(config, joints, steps)
    }

    init()
})()