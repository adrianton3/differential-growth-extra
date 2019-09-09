(() => {
    'use strict'

    function random (joints) {
        return Math.floor(Math.random() * joints.length)
    }

	function mostStressed (joints) {
		let index = -1
		let stressMax = 0.

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]
			const { links } = joint

			let sum = 0.

			for (let j = 0; j < links.length; j++) {
				const link = links[j]

				sum += Vec2.distanceSquared(joint.position, link.position)
			}

			const stress = sum / links.length

			if (stress > stressMax) {
				index = i
				stressMax = stress
			}
		}

		return index
	}

	function leastStressed (joints) {
		let index = -1
		let stressMin = Infinity

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]
			const { links } = joint

			let sum = 0.

			for (let j = 0; j < links.length; j++) {
				const link = links[j]

				sum += Vec2.distanceSquared(joint.position, link.position)
			}

			const stress = sum / links.length

			if (stress < stressMin) {
				index = i
				stressMin = stress
			}
		}

		return index
	}

    function sampleIndex (indices) {
        return indices.length <= 0
            ? -1
            : indices[Math.floor(Math.random() * indices.length)]
	}

	function makeMinAge (min) {
		return (joint) => {
			if (joint.age < min) {
				return false
			}

			const { links } = joint

			for (let i = 0; i < links.length; i++) {
				if (links[i].age < min) {
					return false
				}
			}

			return true
		}
	}

	function makeMostConnectedSum (min, filter, backupRatioThreshold = .25) {
        return (joints) => {
			let connectedMax = 0
			let connectedMaxBackup = 0

			let pool = []
			let poolBackup = []

            for (let i = 0; i < joints.length; i++) {
				const joint = joints[i]

				if (!filter(joint)) {
					continue
				}

                let sum = joint.links.length
                for (let j = 0; j < joint.links.length; j++) {
                    sum += joint.links[j].links.length
                }

                if (sum > connectedMax) {
					connectedMaxBackup = connectedMax
					connectedMax = sum

                    poolBackup = pool
                    pool = []
                }

                if (sum >= connectedMax) {
                    pool.push(i)
                } else if (sum >= connectedMaxBackup) {
					poolBackup.push(i)
				}
            }

            if (connectedMax < min) {
                return -1
            }

			return pool.length / (pool.length + poolBackup.length) > backupRatioThreshold
				? sampleIndex(pool)
				: sampleIndex([...pool, ...poolBackup])
        }
	}

	function makeLeastConnectedSum (max, filter, backupRatioThreshold = .25) {
        return (joints) => {
			let connectedMin = 1024
			let connectedMinBackup = 1024

			let pool = []
			let poolBackup = []

            for (let i = 0; i < joints.length; i++) {
				const joint = joints[i]

				if (!filter(joint)) {
					continue
				}

                let sum = joint.links.length
                for (let j = 0; j < joint.links.length; j++) {
                    sum += joint.links[j].links.length
                }

                if (sum < connectedMin) {
					connectedMinBackup = connectedMin
					connectedMin = sum

                    poolBackup = pool
                    pool = []
                }

				if (sum <= connectedMin) {
					pool.push(i)
				} else if (sum <= connectedMinBackup) {
					poolBackup.push(i)
				}
            }

            if (connectedMin > max) {
                return -1
			}

            return pool.length / (pool.length + poolBackup.length) > backupRatioThreshold
				? sampleIndex(pool)
				: sampleIndex([...pool, ...poolBackup])
        }
    }

    define('Selectors', {
        random,
		mostStressed,
		leastStressed,
		makeMinAge,
        makeMostConnectedSum,
        makeLeastConnectedSum,
	})
})()