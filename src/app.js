(() => {
	'use strict'

	function makeGui (config) {
		const gui = new dat.GUI
		const dummy = {}

		Object.keys(config).forEach((key) => {
			if (typeof config[key] === 'function') {
				gui.add(config, key)
			} else {
				const { min, max, step, initial } = config[key]

				dummy[key] = initial == null
					? (max - min) / 2
					: initial

				gui.add(dummy, key, min, max, step)
			}
		})

		return dummy
	}

	function main () {
		const canvas = document.getElementById('can')

		Draw.init(canvas)

		const maxJoints = 8000
		const minJoints = 1000

		let joints = Formations.createCircle()

		const config = makeGui({
			inertia: {
				min: 0,
				max: 0.5,
				initial: 0.3,
			},
			attraction: {
				min: .01,
				max: .99,
				initial: 0.5,
			},
			repulsion: {
				min: .01,
				max: .99,
				initial: 0.4,
			},
			multiplyRate: {
				min: 0.0,
				max: 1.0,
				initial: 0.5,
			},
			blipRate: {
				min: 0.0,
				max: 1.0,
				initial: 0.0,
			},
			extendRate: {
				min: 0.0,
				max: 1.0,
				initial: 0.0,
			},
			removeRate: {
				min: 0.0,
				max: 1.0,
				initial: 0.0,
			},
			circle () {
				joints = Formations.createCircle()
			},
			segment () {
				joints = Formations.createSegment()
			},
			grid () {
				joints = Formations.createGrid()
			},
		})

		const multiplySelector = Selectors.random
		const blipSelector = Selectors.makeMostConnectedSum(6, Selectors.makeMinAge(20))
		const extendSelector = Selectors.makeLeastConnectedSum(8, Selectors.makeMinAge(2))
		const removeSelector = Selectors.makeMostConnectedSum(10, Selectors.makeMinAge(10))

		const steps = 1

		function run () {
			for (let i = 0; i < steps; i++) {
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

			if (joints.length > 0) {
				Draw.path(joints)
			}

			requestAnimationFrame(run)
		}

		run()
	}

	main()
})()