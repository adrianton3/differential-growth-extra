(() => {
	'use strict'

	function make (x, y) {
		return { x, y }
	}

	function clone (v) {
		return make(v.x, v.y)
	}

	function add (v1, v2) {
		v1.x += v2.x
		v1.y += v2.y

		return v1
	}

	function addNew (v1, v2) {
		return make(v1.x + v2.x, v1.y + v2.y)
	}

	function sub (v1, v2) {
		v1.x -= v2.x
		v1.y -= v2.y

		return v1
	}

	function subNew (v1, v2) {
		return make(v1.x - v2.x, v1.y - v2.y)
	}

	function scale (v, factor) {
		v.x *= factor
		v.y *= factor

		return v
	}

	function scaleNew (v, factor) {
		return make(v.x * factor, v.y * factor)
	}

	function mul (v1, v2) {
		v1.x *= v2.x
		v1.y *= v2.y

		return v1
	}

	function mean (v1, v2) {
		return make(
			(v1.x + v2.x) * .5,
			(v1.y + v2.y) * .5,
		)
	}

	function length (v) {
		return Math.sqrt(v.x ** 2 + v.y ** 2)
	}

	function lengthSquared (v) {
		return v.x ** 2 + v.y ** 2
	}

	function distance (v1, v2) {
		return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
	}

	function distanceSquared (v1, v2) {
		return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2
	}

	define('Vec2', {
		make,
		clone,
		add,
		addNew,
		sub,
		subNew,
		scale,
		scaleNew,
		mul,
		mean,
		length,
		lengthSquared,
		distance,
		distanceSquared,
	})
})()
