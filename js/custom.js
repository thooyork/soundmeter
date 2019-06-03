
function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function init(){
     
    var width = .2;
    var depth = 20;
    var gap = 0.2;
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
    audioLoader.load( 'sounds/razor.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(.85);
        playbtn.style.opacity = 1;
        loader.style.display = 'none';
    });
   
    //SOUND
	
    // var axesHelper = new THREE.AxesHelper( 50 );
    // scene.add( axesHelper );

    var NoiseGen = new SimplexNoise;

    var frequencies = analyser.getFrequencyData();
    var columns = [];

    var group = new THREE.Group();
    var geometry = new THREE.BoxGeometry(width,0,depth);
    
    for (i=0; i<frequencies.length; i++){
        var x = (i*(width+gap));
        var y = 1;
        var z = 0;
        var material = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });
       
        var column = new THREE.Mesh(geometry, material);
        column.position.set(x,y,z);
        columns.push(column);
        group.add(columns[i]);
    }

    group.position.x = -(frequencies.length * (width+gap))/2;
    group.position.y = -10;
    scene.add(group);

    var adjustCols = function(offset, data){
        
            for (j=0; j<columns.length; j++){
                var value = data[j];
                if(value){
                    var hue = 310 - parseInt(value)/2;
                  // columns[j].position.x = j*4 - (data.length*2 - j);
                   // columns[j].material.color = new THREE.Color("rgb("+red+","+green+",0)");
                   columns[j].material.color = new THREE.Color("hsl("+hue+",50%,50%)");
                    
                    columns[j].scale.y = value/10;
                   // columns[j].scale.z = value/2;
                    
                    //columns[j].rotation.x = (j+1) * Math.PI/180 * 4;
                }
                else{
                    
                    columns[j].material.color = new THREE.Color("hsl(310,50%,50%)");
                    columns[j].scale.y = 1;
                  //  columns[j].scale.z = 1;
                //    columns[j].rotation.x = 0;
               //     columns[j].position.x = 0;
                }
            }
      
    };
    
    

    var ambientlight = new THREE.AmbientLight(0xffffff, .5);
    var light = new THREE.SpotLight( 0xffffff, .85 );
    light.angle = Math.PI;
    light.castShadow = true;
    light.position.set(-(Math.PI/180)*45, 15, 50);
    
    camera.position.set(0,25,70);
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
