
function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function init(){
     
    var bufferSize = 512;

    var renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });
    
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
        sound.setVolume(.85);
        playbtn.style.opacity = 1;
        loader.style.display = 'none';
    });
   
    //SOUND
	
    var axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );

    var frequencies = analyser.getFrequencyData();
    analyser.smoothingTimeConstant;
    var vertices = [];

    var sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
    var material = new THREE.MeshBasicMaterial({
        wireframe: true
    });

    var sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    var vertices = sphere.geometry.vertices;
    console.log(vertices);
    var center = new THREE.Vector3(0,0,0);
    for (i=0; i<vertices.length; i++){
        var x = vertices[i].x;
        var y = vertices[i].y;
        var z = vertices[i].z;
        var scale = 10;
        var dist = new THREE.Vector3(x,y,z).sub(center);
        
        var size = scale/2;
        // var magnitude = 4.0;
       
        vertices[i].x += dist.x;
        vertices[i].y += dist.y;
        vertices[i].z += dist.z;
        
    }

    var adjustVertices = function(offset, data){
      
    };
    
    
    var ambientlight = new THREE.AmbientLight(0xffffff, .5);
    // var light = new THREE.SpotLight( 0xffffff, .85 );
    // light.angle = Math.PI;
    // light.castShadow = true;
    // light.position.set(-(Math.PI/180)*45, 15, 50);
    
    camera.position.set(0,0,25);
    //camera.lookAt(scene.position);

    // scene.add(light);
    scene.add(ambientlight);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = .3;
    controls.maxDistance = 200;
    controls.enableZoom = false;
    controls.autoRotate = false;

    var animate = function(){
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
        var offset = Date.now() * 0.0004;
        //var data = analyser.getAverageFrequency();
        var data = analyser.getFrequencyData(); // Array of frequencies
        adjustVertices(offset, data);
    }

    animate();

    var onWindowResize = function(){
        camera.aspect = domEl.offsetWidth / domEl.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
        frequencies[0];
    };

    window.addEventListener( 'resize', onWindowResize, false );

};

window.onload = init;
