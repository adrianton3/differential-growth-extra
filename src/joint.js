(() => {
	'use strict'

	const { add, sub, subNew, scale, distance } = Vec2

	const baseRadius = 6

	const baseAttraction = 0.4
	const baseRepulsion = 0.5

	function make (x, y) {
		return {
			position: Vec2.make(x, y),
			velocity: Vec2.make(0., 0.),
			radius: baseRadius,
			attraction: baseAttraction,
			repulsion: baseRepulsion,
			links: [],
			mobility: 1.,
			alive: true,
			age: 0,
		}
	}

	function applyAttraction (config, { position, velocity, attraction, links }) {
		for (let i = 0; i < links.length; i++) {
			const link = links[i]

			const delta = subNew(position, link.position)
			sub(velocity, scale(delta, config.attraction * attraction))
		}
	}

	function computeExit (fixed, mobile) {
		const dist = distance(fixed.position, mobile.position)
		const optimalDist = fixed.radius + mobile.radius
		const ratio = (optimalDist - dist) / optimalDist

		return scale(
			subNew(fixed.position, mobile.position),
			ratio,
		)
	}

	function applyRepulsion (config, mobile, overlapping) {
		for (let i = 0; i < overlapping.length; i++) {
			const fixed = overlapping[i]

			const exit = computeExit(fixed, mobile)

			sub(mobile.velocity, scale(exit, mobile.repulsion * config.repulsion))
		}
	}

	function applyInertia (config, { velocity }) {
		scale(velocity, config.inertia)
	}

	function applyVelocity (config, { position, velocity, mobility }) {
		scale(velocity, mobility)
		add(position, velocity)
	}

	function applyLimits (config, { position }, halfWidth) {
		position.x = Math.min(Math.max(-halfWidth + 32, position.x), halfWidth - 32)
		position.y = Math.min(Math.max(-halfWidth + 32, position.y), halfWidth - 32)
	}

	function applyAge (joint) {
		joint.age++
	}

	function removeLink (joint, link) {
		const { links } = joint

		const index = links.indexOf(link)
		if (index > -1) {
			links.splice(index, 1)
		}
	}

	function removeSelf (joint) {
		const { links } = joint

		joint.alive = false

		for (let i = 0; i < links.length; i++) {
			const link = links[i]

			removeLink(link, joint)
		}
	}

	define('Joint', {
		baseRadius,
		make,
		applyAttraction,
		applyRepulsion,
		applyInertia,
		applyVelocity,
		applyLimits,
		applyAge,
		computeExit,
		removeSelf,
		removeLink,
	})
})()