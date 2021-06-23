// Uses Ashima WebGl Noise: https://github.com/ashima/webgl-noise

var TVShader = {

    uniforms: {

        'tDiffuse': { value: null },
        'opacity': { value: 1.0 },

        // RGB Shift
        'redOffset': { value: [0.01, -0.01]},
        'greenOffset': { value: [-0.01, 0.003]},
        'blueOffset': { value: [0.004, -0.002]},
        'warpOffset': { value: [0.04, 0.04]},

        // Overlay
        'overlayTexture': { type: 't', value: null },
        
        // Mirror
        'mirror': { value: 0 },

        // Noise distortions
        'noiseAmount': { value: 0.08 },
        'noiseFrequency': { value: 10 },
        'time': { value: 0.0 },

        // Other distortions
        'rotation': { value: 0.0 },

        // Color control
        'contrast': { value: 1.1 },
        'brightness': { value: 1.0 },

        'dampenThreshold': { value: 0.8 },
        'dampenAmount': { value: 1.2 },

        'colorCorrection': { value: [0.0, 0.0, 0.0] }
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
      uniform sampler2D overlayTexture;
		  varying vec2 vUv;

      uniform vec2 redOffset;
      uniform vec2 greenOffset;
      uniform vec2 blueOffset;

      uniform vec2 warpOffset;

      uniform int mirror;

      uniform float noiseAmount;
      uniform float noiseFrequency;
      uniform float time;

      uniform float rotation;

      uniform float contrast;
      uniform float brightness;

      uniform float dampenThreshold;
      uniform float dampenAmount;

      uniform vec3 colorCorrection;

      // Start Ashima 2D Simplex Noise

		vec3 mod289(vec3 x) {
		  return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec2 mod289(vec2 x) {
		  return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec3 permute(vec3 x) {
		  return mod289(((x*34.0)+1.0)*x);
		}

		float snoise(vec2 v)
		{
		  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
		                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
		                     -0.577350269189626,  // -1.0 + 2.0 * C.x
		                      0.024390243902439); // 1.0 / 41.0
		  vec2 i  = floor(v + dot(v, C.yy) );
		  vec2 x0 = v -   i + dot(i, C.xx);

		  vec2 i1;
		  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
		  vec4 x12 = x0.xyxy + C.xxzz;
		  x12.xy -= i1;

		  i = mod289(i); // Avoid truncation effects in permutation
		  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
				+ i.x + vec3(0.0, i1.x, 1.0 ));

		  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
		  m = m*m ;
		  m = m*m ;

		  vec3 x = 2.0 * fract(p * C.www) - 1.0;
		  vec3 h = abs(x) - 0.5;
		  vec3 ox = floor(x + 0.5);
		  vec3 a0 = x - ox;

		  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

		  vec3 g;
		  g.x  = a0.x  * x0.x  + h.x  * x0.y;
		  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
		  return 130.0 * dot(m, g);
		}

		// End Ashima 2D Simplex Noise

    vec4 rgbShift(sampler2D textureImage, vec2 uv, vec2 rOffset, vec2 gOffset, vec2 bOffset) {
        float a = snoise( uv * 10.0 );
        vec4 sr = texture2D(textureImage, uv + rOffset * a);
        vec4 sg = texture2D(textureImage, uv + gOffset * a);
        vec4 sb = texture2D(textureImage, uv + bOffset * a);
        return vec4( sr.r, sg.g, sb.b, sr.a );
    }

    vec2 uvWarp(vec2 uv, vec2 offset) {
        float aX = cos(uv.x * M_PI) * sin(uv.y * M_PI);
        float aY = cos(uv.y * M_PI) * sin(uv.x * M_PI);

        uv.x += aX * offset.x;
        uv.y += aY * offset.y;

        if(mirror == 1) {
          return vec2(1.0 - uv.x, uv.y);
        }

        return uv;
    }

    vec2 rotate(vec2 p, vec2 center, float angle) {
        float x = cos(angle) * (p.x - center.x) - sin(angle) * (p.y - center.y) + center.x;
        float y = sin(angle) * (p.x - center.x) + cos(angle) * (p.y - center.y) + center.y;
        return vec2(x, y);
    }

    float dampen(float value, float threshold, float compression) {
        if(value < threshold) return value;

        float extra = value - threshold;
        float reduction = pow(extra, 1.0 / compression);

        float newValue = value - reduction;

        return newValue < threshold ? threshold : newValue;
    }

		void main() {
        vec2 uv = uvWarp(vUv, 
            warpOffset
        );

        uv = rotate(uv, vec2(0.5, 0.5), rotation);

        vec4 texel = rgbShift( tDiffuse, uv, 
            redOffset,
            greenOffset,
            blueOffset
        );

        float ns = noiseAmount;
        float f = noiseFrequency;
        float r = 1.0 + ns / 2.0 - ns * snoise( f * uv * vec2(5, 20) + vec2(time * 2.8, 0.0));
        float g = 1.0 + ns / 2.0 - ns * snoise( f * uv * vec2(10, 30) + vec2(0, -time * 2.6));
        float b = 1.0 + ns / 2.0 - ns * snoise( f * uv * vec2(20, 5) + vec2(0, time * 3.5));
        texel *= vec4(r, g, b, 1.0);

        texel.r = dampen(texel.r, dampenThreshold, dampenAmount);
        texel.g = dampen(texel.g, dampenThreshold, dampenAmount);
        texel.b = dampen(texel.b, dampenThreshold, dampenAmount);

        //texel += vec4(colorCorrection[0], colorCorrection[1], colorCorrection[2], 0.0);
        texel += vec4(colorCorrection.rgb, 0.0);

        vec4 overlay = texture2D(overlayTexture, vUv);
			  gl_FragColor = pow(brightness * opacity * (texel + overlay), vec4(contrast));
        
		}`

};

export { TVShader };