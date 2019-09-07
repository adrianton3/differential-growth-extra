(() => {
    'use strict'

    function ran (min, max) {
		return Math.random() * (max - min) + min
	}

	function createSegment () {
		const ranStart = () => ran(-16, 16)

		const joint1 = Joint.make(ranStart(), ranStart())
		const joint2 = Joint.make(ranStart(), ranStart())

		joint1.links = [joint2]
		joint2.links = [joint1]

		return [joint1, joint2]
	}

	function connectCircle (joints) {
		joints.forEach((joint, index) => {
			if (index <= 0) {
				joint.links.push(joints[joints.length - 1], joints[1])
			} else if (index >= joints.length - 1) {
				joint.links.push(joints[joints.length - 2], joints[0])
			} else {
				joint.links.push(joints[index - 1], joints[index + 1])
			}
		})
	}

	function createCircle () {
		const radius = 100
		const count = Math.floor((Math.PI * 2. * radius) / (Joint.baseRadius * 1.))

		const joints = []

		for (let i = 0; i < count; i++) {
			const joint = Joint.make(
				Math.cos(i * (Math.PI * 2 / count)) * radius,
				Math.sin(i * (Math.PI * 2 / count)) * radius,
			)

			joints.push(joint)
		}

		connectCircle(joints)

		return joints
	}

	function createGrid () {
		const count = 60
		const space = Joint.baseRadius * 2

		const lines = []

		for (let i = 0; i < count; i++) {
			const line = []

			for (let j = 0; j < count; j++) {
				const x = (j - (count - 1) / 2) * space
				const y = (i - (count - 1) / 2) * space

				const joint = Joint.make(x, y)

				line.push(joint)
			}

			lines.push(line)
		}

		const edgeMobility = .1

		for (let i = 0; i < count; i++) {
			for (let j = 0; j < count; j++) {
				const joint = lines[i][j]

				if (i > 0) {
					joint.links.push(lines[i - 1][j])
				} else {
					joint.mobility = edgeMobility
					joint.permanent = true
				}

				if (j > 0) {
					joint.links.push(lines[i][j - 1])
				} else {
					joint.mobility = edgeMobility
					joint.permanent = true
				}

				if (i < count - 1) {
					joint.links.push(lines[i + 1][j])
				} else {
					joint.mobility = edgeMobility
					joint.permanent = true
				}

				if (j < count - 1) {
					joint.links.push(lines[i][j + 1])
				} else {
					joint.mobility = edgeMobility
					joint.permanent = true
				}
			}
		}

		return lines.flat()
	}

    define('Formations', {
        createSegment,
        createCircle,
        createGrid,
	})
})()