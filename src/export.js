(() => {
    'use strict'

    function getEdges (joints) {
        const edges = []
        const visited = new Set

        for (let i = 0; i < joints.length; i++) {
            const joint = joints[i]
            visited.add(joint)

            for (let j = 0; j < joint.links.length; j++) {
                const link = joint.links[j]

                if (visited.has(link)) {
                    continue
                }

                edges.push({
                    from: joint.position,
                    to: link.position,
                })
            }
        }

        return edges
    }

    function getBounds (joints) {
        const bounds = {
            min: {
                x: Infinity,
                y: Infinity,
            },
            max: {
                x: -Infinity,
                y: -Infinity,
            }
        }

        for (let i = 0; i < joints.length; i++) {
            const { position } = joints[i]

            if (position.x < bounds.min.x) {
                bounds.min.x = position.x
            } else if (position.x > bounds.max.x) {
                bounds.max.x = position.x
            }

            if (position.y < bounds.min.y) {
                bounds.min.y = position.y
            } else if (position.y > bounds.max.y) {
                bounds.max.y = position.y
            }
        }

        return bounds
    }

    function asEdgeList (joints) {
        const edges = getEdges(joints)
        return edges.map(({ from, to }) => `${from.x} ${from.y} ${to.x} ${to.y}`).join('\n')
    }

    function asSvg (joints) {
        const bounds = getBounds(joints)
        const size = {
            width: bounds.max.x - bounds.min.x,
            height: bounds.max.y - bounds.min.y,
        }

        const edges = getEdges(joints)

        const path = edges.map(({ from, to }) => `M ${from.x} ${from.y} L ${to.x} ${to.y}`).join(' ')
        return [
            `<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">`,
            `<path d="${path}" fill="transparent" stroke="black" stroke-linecap="round"/>`,
            `</svg>`,
        ].join('\n')
    }

    function download (filename, textContent) {
        const element = document.createElement('a')
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`)
        element.setAttribute('download', filename)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    }

    define('Export', {
        asEdgeList,
        asSvg,
        download,
	})
})()