(() => {
    'use strict'

    importScripts(
        'define.js',
        'vec2.js',
        'space.js',
        'joint.js',
        'grow.js',
        'formations.js',
        'selectors.js',
        'operations.js',
        'transfer.js',
    )

    self.addEventListener('message', (event) => {
        const message = event.data

        if (message.type === 'run') {
            const joints = run(
                message.config,
                Transfer.deserialize(message.joints),
                message.steps,
            )

            self.postMessage({
                type: 'result',
                joints: Transfer.serialize(joints),
            })

            self.close()
        }
    })

    function run (config, joints, steps) {
        const maxJoints = 8000
        const minJoints = 1000

        const multiplySelector = Selectors.random
        const blipSelector = Selectors.makeMostConnectedSum(6, Selectors.makeMinAge(20))
        const extendSelector = Selectors.makeLeastConnectedSum(8, Selectors.makeMinAge(2))
        const removeSelector = Selectors.makeMostConnectedSum(10, Selectors.makeMinAge(10))

        function step (config, joints) {
            Grow.advance(config, joints)

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

        for (let i = 0; i < steps; i++) {
            step(config, joints)
        }

        return joints
    }
})()