
let blinked = true
let spined = false

const myMesh = Polymesh.create(PolyKind.obj)
const size = 37

myMesh.setFlag(MeshFlags.noncull, true)
myMesh.points = [
    //body
    { x: -size / 3, y: 0, z: 0 },//0
    { x: size / 3, y: 0, z: 0 },
    { x: 0, y: -size / 6, z: 0 },
    { x: 0, y: 0, z: size * 1.5 },//3
    { x: 0, y: -size / 3, z: -size / 4 },
    //right blue thing
    { x: size / 2, y: 0, z: size / 4 },//5
    { x: size / 3, y: 0, z: -size / 8 },
    { x: (size / 5) + size / 5, y: size / 8, z: -size / 8 },
    { x: size, y: -size / 2, z: -size },
    //extra body
    { x: 0, y: 0, z: 0 },//9'
    { x: -size / 5.5, y: 0, z: size * 0.75 },
    //left blue thing
    { x: -size / 2, y: 0, z: size / 4 },//11
    { x: -size / 3, y: 0, z: -size / 8 },
    { x: -(size / 5) - size / 5, y: size / 8, z: -size / 8 },
    { x: -size, y: -size / 2, z: -size },
    //right wing
    { x: size / 1.6, y: 0, z: 0 },//15
    { x: size * 1.6, y: size / 3.2, z: -size / 2 },
    { x: size / 1.6, y: size / 5, z: 0 },
    //left wing
    { x: -size / 1.6, y: 0, z: 0 },//18
    { x: -size * 1.6, y: size / 3.2, z: -size / 2 },
    { x: -size / 1.6, y: size / 5, z: 0 },
    //wing extras
    { x: -size / 1.8, y: size / 10, z: -size / 10 },//21
    { x: size / 1.8, y: size / 10, z: -size / 10 },//21
]
myMesh.faces = [
    //body
    { indices: [0, 1, 2], color: 2 },
    { indices: [0, 3, 2], color: 11 },
    { indices: [3, 1, 2], color: 12 },
    { indices: [2, 1, 4], color: 12 },
    { indices: [2, 0, 4], color: 11 },
    { indices: [9, 0, 3], color: 13 },
    { indices: [9, 1, 3], color: 13 },
    //right blue thing
    { indices: [1, 5, 7], color: 9 },
    { indices: [1, 5, 6], color: 10 },
    { indices: [5, 6, 7], color: 8 },
    { indices: [6, 7, 8], color: 9 },
    { indices: [5, 8, 6], color: 10 },
    { indices: [5, 8, 7], color: 9 },
    //left blue thing
    { indices: [0, 11, 13], color: 9 },
    { indices: [0, 11, 12], color: 10 },
    { indices: [11, 12, 12], color: 8 },
    { indices: [12, 13, 14], color: 9 },
    { indices: [11, 14, 12], color: 9 },
    { indices: [11, 14, 13], color: 10 },
    //right wing
    { indices: [22, 15, 16], color: 12 },
    { indices: [22, 17, 16], color: 13 },
    { indices: [17, 15, 16], color: 11 },
    { indices: [1, 15, 17], color: 12 },
    { indices: [22, 15, 1], color: 11 },
    { indices: [22, 17, 1], color: 12 },
    //left wing
    { indices: [21, 18, 19], color: 12 },
    { indices: [21, 20, 19], color: 13 },
    { indices: [20, 18, 19], color: 11 },
    { indices: [0, 18, 20], color: 12 },
    { indices: [21, 18, 0], color: 13 },
    { indices: [21, 20, 0], color: 13 },
]

Polymesh.setCam(PolyCam.zoom, 1)
// Polymesh.setAngle(PolyAngle.y, (randint(-3, 4) * 45) * (Math.PI / 180))
Polymesh.sortingMethod(PolySort.normal)
scene.setBackgroundColor(4)
forever(() => {

    spined = !controller.anyButton.isPressed()

    if (spined) myMesh.setAngle(PolyAngle.vz, 2), myMesh.setAngle(PolyAngle.vx, 2), myMesh.setAngle(PolyAngle.vy, -2)
    else myMesh.setAngle(PolyAngle.vz, 0), myMesh.setAngle(PolyAngle.vx, 0), myMesh.setAngle(PolyAngle.vy, 0), Polymesh.setAngle(PolyAngle.vy, controller.dx() * 2.5), Polymesh.setAngle(PolyAngle.vx, controller.dy() * 2.5)

    if (blinked && (game.runtime() / 75) % 2 < 1) myMesh.setFaceColor(0, 5);
    else myMesh.setFaceColor(0, 2);
})
game.onUpdate(function () {
    scene.setBackgroundImage(image.create(scene.screenWidth(), scene.screenHeight()))
    if (false) scene.backgroundImage().drawTransparentImage(assets.image`SNES-starfox-background`, 0, 0)
    Polymesh.render(myMesh, scene.backgroundImage())
})