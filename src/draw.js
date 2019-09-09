(() => {
	'use strict'

	let context

	function init (element) {
		context = element.getContext('2d')

		context.translate(element.width / 2, element.height / 2)

		context.strokeStyle = 'hsl(220, 50%, 50%)'
		context.fillStyle = 'hsl(0, 0%, 0%)'
	}

	function clear () {
		context.fillStyle = 'hsl(0, 0%, 0%)'

		context.fillRect(
			-context.canvas.width / 2,
			-context.canvas.height / 2,
			context.canvas.width,
			context.canvas.height,
		)
	}

	function path (joints) {
		clear()

		context.strokeStyle = 'hsl(0, 0%, 100%)'

		context.lineWidth = 1
		context.lineCap = 'round'

		context.beginPath()

		for (let i = 0; i < joints.length; i++) {
			const joint = joints[i]

			for (let j = 0; j < joint.links.length; j++) {
				const link = joint.links[j]

				context.moveTo(joint.position.x, joint.position.y)
				context.lineTo(link.position.x, link.position.y)
			}
		}

		context.stroke()
	}

	define('Draw', {
		init,
		clear,
		path,
	})
})()
