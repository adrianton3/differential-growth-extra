(() => {
    'use strict'

    function serialize (jointsWet) {
        const indexForJoint = new Map

        jointsWet.forEach((jointWet, index) => {
            indexForJoint.set(jointWet, index)
        })

        return jointsWet.map((jointWet) => {
            const links = jointWet.links.map((link) => indexForJoint.get(link))

            return {
                 ...jointWet,
                 links,
            }
        })
    }

    function deserialize (jointsDry) {
        const jointsWet = jointsDry.map((jointDry) => ({ ...jointDry }))

        jointsWet.forEach((jointWet) => {
            jointWet.links = jointWet.links.map((index) => jointsWet[index])
        })

        return jointsWet
    }

    define('Transfer', {
        serialize,
        deserialize,
    })
})()