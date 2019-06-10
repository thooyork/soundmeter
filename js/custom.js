
function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};



function init(){
     
    var bufferSize = 1024;

    var renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });

    var Spheres = [];
    
    var domEl = document.getElementById('threecontainer');
    renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    domEl.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera( 55, domEl.offsetWidth / domEl.offsetHeight, 1, 500 ); 
    var scene = new THREE.Scene();
    var group = new THREE.Group();

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
    audioLoader.load( 'sounds/ambient.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(.95);
        playbtn.style.opacity = 1;
        loader.style.display = 'none';
    });
   
    //SOUND
	
    // var axesHelper = new THREE.AxesHelper( 50 );
    // scene.add( axesHelper );

    var createSphere = function(r, x, y, z, hue){
        var sphereGeometry = new THREE.IcosahedronGeometry( r, 3 );
        // var sphereGeometry = new THREE.SphereGeometry( r, 64, 64 );
        var material = new THREE.MeshLambertMaterial({
            wireframe: true
        });

        var sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.radius = r;
        sphere.baseHue = hue;
        sphere.position.set(x, y, z);
        group.add(sphere);
        Spheres.push(sphere);
        return sphere;
    };

    var resolution = 10;
    var amplitude = 45;
    var size = 360 / resolution;

    createSphere(120,0,0,0,90);

    for(var i = 0; i < resolution; i++) {
        var segment = ( i * size ) * Math.PI / 180;
        var x = Math.cos( segment ) * amplitude;
        var z = 0;
        var y = Math.sin( segment ) * amplitude; 
        createSphere(6,x,y,z,320);     
    }

    for(var i = 0; i < resolution; i++) {
        var segment = ( i * size ) * Math.PI / 180;
        var x = Math.cos( segment ) * amplitude;
        var z = 0;
        var y = Math.sin( segment ) * amplitude; 
        createSphere(12,x,y,z,200);     
    }

    // group.position.z = 10;
    scene.add(group);
    
    var updateSpheres = function(offset, data){
       
        for (var i=0; i<Spheres.length; i++){
            var radius = Spheres[i].radius;
            var scale = data[i]/200;
            var hue;
            var baseHue = Spheres[i].baseHue;
    
            for (var j=0; j<Spheres[i].geometry.vertices.length; j++){
                var vertex = Spheres[i].geometry.vertices[j];
                if(scale){
                    vertex.normalize().multiplyScalar(radius + (scale) * NoiseGen.noise(vertex.x + offset * (i+1), vertex.y + scale ));
                    hue = baseHue - (parseInt(data[i])) + (255-baseHue);
                }
                else{
                    hue = baseHue;
                }
                
            }
            
            Spheres[i].material.color = new THREE.Color("hsl("+hue+",100%,50%)");
            Spheres[i].geometry.verticesNeedUpdate = true;
           
        }

        
        //Spheres[i].geometry.colorsNeedUpdate = true;

    };
    
    
    var ambientlight = new THREE.AmbientLight(0xffffff, .5);
    var light = new THREE.SpotLight( 0xffffff, .85 );
    light.angle = Math.PI;
    //light.castShadow = true;
    light.position.set(-(Math.PI/180)*45, 15, 50);
    
    camera.position.set(0,-90,45);
    //camera.lookAt(scene.position);

    scene.add(light);
    scene.add(ambientlight);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = .3;
    controls.maxDistance = 200;
    controls.enableZoom = true;
    controls.autoRotate = false;

    var animate = function(){
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
        var offset = Date.now() * 0.0002;
        var data = analyser.getFrequencyData(); // Array of frequencies
        updateSpheres(offset, data);
        if(sound.isPlaying){
            group.rotation.y += 0.001;
            group.rotation.x += 0.001;
            group.rotation.z += 0.002;
        }
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
