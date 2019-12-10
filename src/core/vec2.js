(() => {
	'use strict'

	function make (x, y) {
		return { x, y }
	}

	function clone ({ x, y }) {
		return make(x, y)
	}

	function add (v, { x, y }) {
		v.x += x
		v.y += y

		return v
	}

	function addNew (v, { x, y }) {
		return make(v.x + x, v.y + y)
	}

	function sub (v, { x, y }) {
		v.x -= x
		v.y -= y

		return v
	}

	function subNew (v, { x, y }) {
		return make(v.x - x, v.y - y)
	}

	function scale (v, factor) {
		v.x *= factor
		v.y *= factor

		return v
	}

	function scaleNew (v, factor) {
		return make(v.x * factor, v.y * factor)
	}

	function mul (v, { x, y }) {
		v.x *= x
		v.y *= y

		return v
	}

	function mean (v1, v2) {
		return make(
			(v1.x + v2.x) * .5,
			(v1.y + v2.y) * .5,
		)
	}

	function length ({ x, y }) {
		return Math.sqrt(x ** 2 + y ** 2)
	}

	function lengthSquared ({ x, y }) {
		return x ** 2 + y ** 2
	}

	function distance (v1, v2) {
		return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
	}

	function distanceSquared (v1, v2) {
		return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2
	}

	const THRESHOLD = .1

	function isNull({ x, y }) {
		return -THRESHOLD < x && x < THRESHOLD &&
			-THRESHOLD < y && y < THRESHOLD
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
		isNull,
	})
})()