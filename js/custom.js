
function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function init(){
     
    var width = 2;
    var depth = 20;
    var gap = 5;
    var bufferSize = 2048;

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
	
    // var axesHelper = new THREE.AxesHelper( 50 );
    // scene.add( axesHelper );

    var frequencies = analyser.getFrequencyData();
    analyser.smoothingTimeConstant;
    var columns = [];

    var group = new THREE.Group();
    group.position.y = 5;
    var geometry = new THREE.BoxGeometry(width,0,depth);
    var radius = 40;
   
    
    for (i=0; i<frequencies.length; i++){
        var theta = (i)/(frequencies.length) * Math.PI * 8; //buffersize = number of segments
        var x = Math.cos(theta) * radius;
        var y = Math.sin(theta) * radius;
        var z = 0;

        var material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent:true
        });
       
        var column = new THREE.Mesh(geometry, material);
        column.position.set(x,y,z);
        column.rotation.z = theta;
        columns.push(column);
        group.add(columns[i]);
    }

    group.rotation.z = Math.PI/180 * -170;
    scene.add(group);

    var adjustCols = function(offset, data){
    var baseHue = 280;
            for (j=0; j<columns.length; j++){
                var value = data[j];
                if(value){
                    var hue = baseHue - parseInt(value)/2;
                    columns[j].material.color = new THREE.Color("hsl("+hue+",50%,50%)");
                    columns[j].scale.x = value/22;
                    columns[j].material.opacity = .75;
                }
                else{
                    columns[j].material.color = new THREE.Color("hsl("+baseHue+",50%,50%)");
                    columns[j].material.opacity = .5;
                    columns[j].scale.y = .2;
                    columns[j].scale.x = .3;
                }
            }
      
    };
    
    
    var ambientlight = new THREE.AmbientLight(0xffffff, .5);
    var light = new THREE.SpotLight( 0xffffff, .85 );
    light.angle = Math.PI;
    light.castShadow = true;
    light.position.set(-(Math.PI/180)*45, 15, 50);
    
    camera.position.set(-20,-75,50);
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
        var offset = Date.now() * 0.0004;
        //var data = analyser.getAverageFrequency();
        var data = analyser.getFrequencyData(); // Array of frequencies
        adjustCols(offset, data);
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
