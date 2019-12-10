(() => {
    'use strict'

    const config = {
        inertia: .5,
        attraction: .5,
        repulsion: .4,
    }

    function run (steps) {
        const joints = Formations.createCircle()
        const advance = Grow.makeGrow({ halfWidth: 768 / 2, resolution: 48 })

        const start = performance.now()

        for (let i = 0; i < steps; i++) {
            advance(config, joints)
            Operations.multiply(joints, Selectors.random)
        }

        const time = performance.now() - start

        console.log(joints[0].position)

        return time
    }

    {
        const preRuns = 3
        for (let i = 0; i < preRuns; i++) {
            run(100)
        }
    }

    {
        const runs = 5
        const times = []
        for (let i = 0; i < runs; i++) {
            times.push(run(1000))
        }

        const average = times.reduce((sum, time) => sum + time) / times.length
        const deviation = times.reduce((sum, time) => sum + (average - time) ** 2) / times.length

        console.log(average, deviation)
    }
})()
