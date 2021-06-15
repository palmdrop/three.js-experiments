var RGBSplitShader = {

    uniforms: {

        'tDiffuse': { value: null },
        'opacity': { value: 1.0 },

        'redOffset': { value: [0.01, -0.01]},
        'greenOffset': { value: [-0.01, 0.003]},
        'blueOffset': { value: [0.004, -0.002]},

        'warpOffset': { value: [0.04, 0.04]}

    },

    vertexShader: /* glsl */`

		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */`
        #define M_PI 3.1415926535897932384626433832795

		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

        uniform vec2 redOffset;
        uniform vec2 greenOffset;
        uniform vec2 blueOffset;

        uniform vec2 warpOffset;

        vec4 rgbShift(sampler2D textureImage, vec2 uv, vec2 rOffset, vec2 gOffset, vec2 bOffset) {
            vec4 sr = texture2D(textureImage, uv + rOffset);
            vec4 sg = texture2D(textureImage, uv + gOffset);
            vec4 sb = texture2D(textureImage, uv + bOffset);
            return vec4( sr.r, sg.g, sb.b, sr.a );
        }

        vec2 uvWarp(vec2 uv, vec2 offset) {
            float aX = cos(uv.x * M_PI) * sin(uv.y * M_PI);
            float aY = cos(uv.y * M_PI) * sin(uv.x * M_PI);

            uv.x += aX * offset.x;
            uv.y += aY * offset.y;
            return uv;
        }


		void main() {
            vec2 uv = uvWarp(vUv, 
                warpOffset
            );

            vec4 texel = rgbShift( tDiffuse, uv, 
                redOffset,
                greenOffset,
                blueOffset
            );
			gl_FragColor = opacity * texel;
		}`

};

export { RGBSplitShader };