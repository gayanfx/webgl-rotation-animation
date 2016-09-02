

var el = {
    body: document.querySelector('body'),
    marioGroup: undefined,
    camX: document.getElementById('camera_x'),
    camY: document.getElementById('camera_y'),
    camZ: document.getElementById('camera_z'),
    camRotX: document.getElementById('camera-rotation_x'),
    camRotY: document.getElementById('camera-rotation_y'),
    camRotZ: document.getElementById('camera-rotation_z')
};

var m = {
    x: 0,
    y: 0
};

var scene = new THREE.Scene(),
    camera,
    texture,
    sphere;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000, 1.0));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
el.body.appendChild(renderer.domElement);

// load a texture, set wrap mode to repeat
var texture = new THREE.TextureLoader().load("https://cdn.pbrd.co/images/15NeKduEG.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(2, 2);

/* ---------------------------------------------------------
Stuff making functions
----------------------------------------------------------*/
function makeSky() {
    var geometry = new THREE.SphereGeometry(7, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0x5c94fc,
        map:texture,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 8, 0);
    scene.add(sphere);
}

function makeDirectionalLight() {
    var directionalLight = new THREE.DirectionalLight(0xff0000, 2);
    directionalLight.position.set(-30, 10, 0);
    directionalLight.castShadow = true;

    //var cameraHelper = new THREE.CameraHelper(directionalLight);
    //cameraHelper.shadow.camera = true;

    scene.add(directionalLight);

    

}

function makeLight() {
    var light = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(light);
}

function makeSpotLight() {
    /*
    var light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);
    */

    var spotLight = new THREE.SpotLight(0xff0000);
    spotLight.position.set(-30, 10, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function makeCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(scene.position);
}

function makeCube($x, $y, $z, $color) {
    var geometry = new THREE.BoxGeometry(1, 1, 4);
    var material = new THREE.MeshLambertMaterial({
        color: $color || 0x00ff00,
        map: texture
    });
    var cube = new THREE.Mesh(geometry, material);

    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set($x, $y, 0);

    return cube;

    // scene.add( cube );
}

function makePlane() {

    var geometry = new THREE.PlaneGeometry(200, 60, 1, 1);
    var material = new THREE.MeshLambertMaterial({
       // map: texture,
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);

    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.position.set(0, -20, -10);
    plane.rotation.x =  -0.5 * Math.PI;

    var axis = new THREE.AxisHelper(20);

    scene.add(plane);
    scene.add(axis);
}




/* ---------------------------------------------------------
Mario
----------------------------------------------------------*/
function makeMario() {


    // Mario 2D pixel map
    var marioString = 'wwwrrrrrwwwwwwrrrrrrrrrwwwgggyygywwwwgygyyygyyywwgyggyyygyyywggyyyyggggwwwwyyyyyyywwwwggrgggwwwwwgggrggrgggwggggrrrrggggyygryrryrgyyyyyrrrrrryyyyyrrrrrrrryywwrrrwwrrrwwwgggwwwwgggwggggwwwwgggg';

    //create an empty container for the group
    el.marioGroup = new THREE.Object3D();

    // Loop Mario string DNA
    for (var i = 0; i < marioString.length; i++) {

        if (marioString[i] !== 'w' && marioString[i] !== ' ') {

            var row = Math.floor(i / 12),
                x = (function() {
                    if (i < 12) {
                        return i;
                    } else {
                        return i - (12 * row);
                    }
                }()),
                y = Math.floor(i / 12) * -1,
                c = (function() {
                    var c;
                    switch (marioString[i]) {
                        case 'r':
                            c = 0xd70000;
                            break;
                        case 'g':
                            c = 0x706700;
                            break;
                        case 'y':
                            c = 0xf8ab00;
                            break;
                    }
                    return c;
                }());




            //add a mesh with geometry to it
            el.marioGroup.add(makeCube(x, y, 0, c));
        }

        el.marioGroup.castShadow = true;
        //el.marioGroup.receiveShadow = true;
        //when done, add the group to the scene
        scene.add(el.marioGroup);


    }
}

/* ---------------------------------------------------------
Window response
----------------------------------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


/* ---------------------------------------------------------
Init stuff
----------------------------------------------------------*/
makeSky();
// makeCube();
makePlane();
makeCamera();
makeDirectionalLight();
makeLight();
//makeSpotLight();
//makePointLight();
makeMario();
render();

/* ---------------------------------------------------------
Render Function
----------------------------------------------------------*/
function render() {
    requestAnimationFrame(render);

    camera.position.x = el.camX.value;
    camera.position.y = el.camY.value;
    camera.position.z = el.camZ.value;

    camera.rotation.x = el.camRotX.value;
    camera.rotation.y = el.camRotY.value;
    camera.rotation.z = el.camRotZ.value;

    el.marioGroup.rotation.y += .08;
    sphere.rotation.y += 0.2;

    renderer.render(scene, camera);

    window.addEventListener( 'resize', onWindowResize, false )
}



