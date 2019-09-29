(() => {
	'use strict'

	const { add, sub, scale, mul, clone, mean } = Vec2
	const { removeSelf, removeLink } = Joint

	function ran (min, max) {
		return Math.random() * (max - min) + min
	}

	function ranMean (a, b) {
		const delta = sub(clone(a), b)

		return add(
			mean(a, b),
			mul(
				delta,
				Vec2.make(
					ran(-.1, .1),
					ran(-.1, .1),
				),
			),
		)
	}

	function meanJoints (joints) {
		const sum = Vec2.make(0., 0.)

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]

			add(sum, joint.position)
		}

		return scale(sum, 1. / joints.length)
	}

	function freeAround (joint) {
		const candidate = meanJoints(joint.links)
		const delta = sub(clone(candidate), joint.position)
		return sub(clone(joint.position), delta)
	}

    function multiply (joints, selector) {
		const indexCandidate = selector(joints)

		if (indexCandidate < 0) {
			return
		}

		const joint = joints[indexCandidate]

		if (joint.links.length <= 0) {
			return
		}

		const joint1 = joint
		const joint2 = joint.links[Math.floor(Math.random() * joint.links.length)]

		const position = ranMean(joint1.position, joint2.position)

		removeLink(joint1, joint2)
		removeLink(joint2, joint1)

		const newJoint = Joint.make(position.x, position.y)

		joint1.links.push(newJoint)
		joint2.links.push(newJoint)

		newJoint.links.push(joint1, joint2)
		newJoint.radius = (joint1.radius + joint2.radius) * .5

		joints.push(newJoint)
	}

	function extend (joints, selector) {
		const indexCandidate = selector(joints)

		if (indexCandidate < 0) {
			return
		}

		const joint = joints[indexCandidate]

		if (joint.links.length <= 0) {
			return
		}

		const position = freeAround(joint)

		const newJoint = Joint.make(position.x, position.y)
		newJoint.radius = joint.radius

		joint.links.push(newJoint)
		newJoint.links.push(joint)

		joints.push(newJoint)
	}

	function blip (joints, selector) {
		const indexCandidate = selector(joints)

		if (indexCandidate < 0) {
			return
		}

		const joint = joints[indexCandidate]

		if (joint.links.length <= 1) {
			return
		}

        const links = [...joint.links]

        const newJoints = links.map((link) => {
            const position = mean(joint.position, link.position)
            add(position, Vec2.make(
                ran(-.5, .5),
                ran(-.5, .5),
            ))

            const newJoint = Joint.make(position.x, position.y)
			newJoint.links.push(link)
			newJoint.radius = joint.radius

			link.links.push(newJoint)

			return newJoint
        })

        for (let i = 0; i < newJoints.length; i++) {
			const newJoint = newJoints[i]

            newJoint.links.push(
                newJoints[(i + newJoints.length - 1) % newJoints.length],
                newJoints[(i + newJoints.length + 1) % newJoints.length],
            )
		}

		joints.push(...newJoints)

		removeSelf(joint)
		joints.splice(indexCandidate, 1)
    }

    function cleanup (joints, links) {
		for (let i = 0; i < links.length; i++) {
			const link = links[i]

			if (link.alive && link.links.length <= 1) {
				removeSelf(link)
				joints.splice(joints.indexOf(link), 1)

				cleanup(joints, link.links)
			}
		}
    }

	function remove (joints, selector) {
		const indexCandidate = selector(joints)

		if (indexCandidate < 0) {
			return
		}

		const joint = joints[indexCandidate]
		removeSelf(joint)
		joints.splice(indexCandidate, 1)

		cleanup(joints, joint.links)
	}

    define('Operations', {
        multiply,
        extend,
        blip,
		remove,
	})
})()
