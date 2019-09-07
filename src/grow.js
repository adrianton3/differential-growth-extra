(() => {
	'use strict'

	const {
		applyAttraction,
		applyRepulsion,
		applyInertia,
		applyVelocity,
		applyLimits,
		applyAge,
	} = Joint

	const halfWidth = 768 / 2

	function advance (config, joints) {
		const space = Space.make(joints, { resolution: 48, halfWidth })

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]

			const overlapping = Space.getOverlapping(space, joint)

			applyInertia(config, joint)
			applyRepulsion(config, joint, overlapping)
			applyAttraction(config, joint)
		}

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]

			applyVelocity(config, joint)
			applyLimits(config, joint, halfWidth)

			applyAge(joint)
		}
	}

	define('Grow', {
		advance,
	})
})()