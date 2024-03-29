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

	function parseUrl () {
		const string = location.hash.slice(1)

		return Object.fromEntries(
			string.split(';').map((pairString) => {
				const pair = pairString.split('=')
				return [pair[0], Number(pair[1])]
			})
		)
	}

	function main () {
		const options = Object.assign({
			halfWidth: 768 / 2,
			resolution: 48,
			jointsMax: 8000,
            jointsMin: 1000,
            steps: 1,
		}, parseUrl())

		const canvas = document.getElementById('can')
		canvas.width = options.halfWidth * 2
		canvas.height = options.halfWidth * 2

		Draw.init(canvas)

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
			['circles-nested'] () {
				joints = Formations.createCirclesNested()
			},
			['circles-around'] () {
				joints = Formations.createCirclesAround()
			},
			segment () {
				joints = Formations.createSegment()
			},
			line () {
				joints = Formations.createLine()
			},
			['lines-parallel'] () {
				joints = Formations.createLinesParallel()
			},
			grid () {
				joints = Formations.createGrid()
			},
			['as-svg'] () {
				Export.download('image.svg', Export.asSvg(joints))
			},
		})

		const multiplySelector = Selectors.random
		const blipSelector = Selectors.makeMostConnectedSum(6, Selectors.makeMinAge(20))
		const extendSelector = Selectors.makeLeastConnectedSum(8, Selectors.makeMinAge(2))
		const removeSelector = Selectors.makeMostConnectedSum(10, Selectors.makeMinAge(10))

		const advance = Grow.makeGrow(options)

		function run () {
			for (let i = 0; i < options.steps; i++) {
				advance(config, joints)

				if (
					joints.length < options.jointsMax &&
					Math.random() < config.multiplyRate
				) {
					Operations.multiply(joints, multiplySelector)
				}

				if (
					joints.length < options.jointsMax &&
					Math.random() < config.blipRate
				) {
					Operations.blip(joints, blipSelector)
				}

				if (
					joints.length < options.jointsMax &&
					Math.random() < config.extendRate
				) {
					Operations.extend(joints, extendSelector)
				}

				if (
					joints.length > options.jointsMin &&
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
