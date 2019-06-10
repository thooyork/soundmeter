
function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};



function init(){
     
    var bufferSize = 512;

    var renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });

    var Spheres = [];
    
    var domEl = document.getElementById('threecontainer');
    renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    domEl.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera( 55, domEl.offsetWidth / domEl.offsetHeight, 1, 500 ); 
    var scene = new THREE.Scene();

    //SOUND
    var loader = document.getElementById('loader');
    var playbtn = document.getElementById('sound');
    playbtn.addEventListener('mousedown', function(e){
        if(!sound.isPlaying){
            sound.play();
            playbtn.classList.add('pause');
        }
        else{
            sound.pause();
            playbtn.classList.remove('pause');
        }
    });

    var NoiseGen = new SimplexNoise;

    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    camera.add( listener );

    // create an Audio source
    var sound = new THREE.Audio( listener );
    var analyser = new THREE.AudioAnalyser( sound, bufferSize );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sounds/beat.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(.95);
        playbtn.style.opacity = 1;
        loader.style.display = 'none';
    });
   
    //SOUND
	
    // var axesHelper = new THREE.AxesHelper( 50 );
    // scene.add( axesHelper );

    var createSphere = function(r, x, y, z){
        var sphereGeometry = new THREE.IcosahedronGeometry( r, 4 );
        // var sphereGeometry = new THREE.SphereGeometry( r, 64, 64 );
        var material = new THREE.MeshLambertMaterial({
            wireframe: true
        });

        var sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.radius = r;
        sphere.origin = {
            x:x,
            y:y,
            z:z
        };
        sphere.position.set(x, y, z);
        scene.add(sphere);
        Spheres.push(sphere);
        return sphere;
    };
    var radius = 3;



    createSphere(radius,-30,-15,0);
    createSphere(radius,-15,-15,0);
    createSphere(radius,-0,-15,0);
    createSphere(radius,15,-15,0);
    createSphere(radius,30,-15,0);

    createSphere(radius,-30,0,0);
    createSphere(radius,-15,0,0);
    createSphere(radius,-0,0,0);
    createSphere(radius,15,0,0);
    createSphere(radius,30,0,0);

    createSphere(radius,-30,15,0);
    createSphere(radius,-15,15,0);
    createSphere(radius,-0,15,0);
    createSphere(radius,15,15,0);
    createSphere(radius,30,15,0);

    
    
//console.log(Spheres[0].geometry.vertices);
    // var vertices = sphere.geometry.vertices;

    
    var adjustVertices = function(offset, data){

        // var center = new THREE.Vector3(0,0,0);
        for (var i=0; i<Spheres.length; i++){
            var radius = Spheres[i].radius;
            var scale = data[i*(i+1)]/255;
            var hue;
            var baseHue = 255;
            for (var j=0; j<Spheres[i].geometry.vertices.length; j++){
                var vertex = Spheres[i].geometry.vertices[j];
                if(data){
                    vertex.normalize().multiplyScalar(radius + (scale) * NoiseGen.noise(vertex.x + offset, vertex.y + scale));
                    hue = baseHue - parseInt(data[i*Spheres.length]);
                }
                else{
                    hue = baseHue;
                }
            }
            
            
            Spheres[i].material.color = new THREE.Color("hsl("+hue+",100%,50%)");

            // Spheres[i].geometry.computeVertexNormals();
            // Spheres[i].geometry.normalsNeedUpdate = true;
            Spheres[i].geometry.verticesNeedUpdate = true;
            Spheres[i].geometry.colorsNeedUpdate = true;
        }

    };
    
    
    var ambientlight = new THREE.AmbientLight(0xffffff, .5);
    var light = new THREE.SpotLight( 0xffffff, .85 );
    light.angle = Math.PI;
    light.castShadow = true;
    light.position.set(-(Math.PI/180)*45, 15, 50);
    
    camera.position.set(0,-40,35);
    //camera.lookAt(scene.position);

    scene.add(light);
    scene.add(ambientlight);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = .3;
    controls.maxDistance = 200;
    controls.enableZoom = false;
    controls.autoRotate = false;

    var animate = function(){
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
        var offset = Date.now() * 0.0001;
        var data = analyser.getFrequencyData(); // Array of frequencies
        adjustVertices(offset, data);
    }

    animate();





    var onWindowResize = function(){
        camera.aspect = domEl.offsetWidth / domEl.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
        //frequencies[0];
    };

    window.addEventListener( 'resize', onWindowResize, false );

};

window.onload = init;
