(() => {
    'use strict'

    importScripts(
        'core/define.js',
        'core/vec2.js',
        'core/space.js',
        'core/joint.js',
        'core/grow.js',
        'core/formations.js',
        'core/selectors.js',
        'core/operations.js',
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

        const advance = Grow.makeGrow({ halfWidth: 768 / 2, resolution: 48 })

        function step (config, joints) {
            advance(config, joints)

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
