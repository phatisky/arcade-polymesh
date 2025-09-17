function setupMesh() {
    cubeSize = 3
    for (let index = 0; index < 3; index++) {
        myMeshes.unshift(Polymesh.newmesh())
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 + cubeSize, 0 + cubeSize, 0 + cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 - cubeSize, 0 + cubeSize, 0 + cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 + cubeSize, 0 - cubeSize, 0 + cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 - cubeSize, 0 - cubeSize, 0 + cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 + cubeSize, 0 + cubeSize, 0 - cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 - cubeSize, 0 + cubeSize, 0 - cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 + cubeSize, 0 - cubeSize, 0 - cubeSize))
        myMeshes[0].addVertice(Polymesh.point3Shadow(0 - cubeSize, 0 - cubeSize, 0 - cubeSize))
        myMeshes[0].addFace(2, Polymesh.indiceShadow(
            0,
            1,
            2,
            3
        ))
        myMeshes[0].addFace(2, Polymesh.indiceShadow(
            4,
            5,
            6,
            7
        ))
        myMeshes[0].addFace(7, Polymesh.indiceShadow(
            0,
            2,
            4,
            6
        ))
        myMeshes[0].addFace(7, Polymesh.indiceShadow(
            1,
            3,
            5,
            7
        ))
        myMeshes[0].addFace(8, Polymesh.indiceShadow(
            0,
            1,
            4,
            5
        ))
        myMeshes[0].addFace(8, Polymesh.indiceShadow(
            2,
            3,
            6,
            7
        ))
    }
    myMeshes[0].setPos(PolyPos.x, 10)
    myMeshes[2].setPos(PolyPos.x, -10)
    myMeshes[0].setFaceColor(0, 9)
    myMeshes[0].setFaceColor(1, 9)
    myMeshes[0].setFaceColor(2, 3)
    myMeshes[0].setFaceColor(3, 3)
    myMeshes[0].setFaceColor(4, 5)
    myMeshes[0].setFaceColor(5, 5)
    myMeshes[1].setFaceColor(0, 13)
    myMeshes[1].setFaceColor(1, 13)
    myMeshes[1].setFaceColor(2, 11)
    myMeshes[1].setFaceColor(3, 11)
    myMeshes[1].setFaceColor(4, 12)
    myMeshes[1].setFaceColor(5, 12)
}
function setMesh() {
    cubeTurnspeed = 1.5
    turnSpeed = 2.5
    myMeshes[2].changeAngle(PolyAngle.vx, cubeTurnspeed)
    myMeshes[2].changeAngle(PolyAngle.vz, cubeTurnspeed / 2)
    myMeshes[0].changeAngle(PolyAngle.vz, cubeTurnspeed)
    myMeshes[0].changeAngle(PolyAngle.vy, cubeTurnspeed / 2)
    myMeshes[1].changeAngle(PolyAngle.vy, cubeTurnspeed)
    myMeshes[1].changeAngle(PolyAngle.vx, cubeTurnspeed / 2)
}
let turnSpeed = 0
let cubeTurnspeed = 0
let cubeSize = 0
let myMeshes: polymesh[] = []
Polymesh.changeCam(PolyCam.zoom, 2)
myMeshes = []

setupMesh()
setMesh()
game.onUpdate(function () {
    scene.setBackgroundImage(image.create(scene.screenWidth(), scene.screenHeight()))
    Polymesh.renderAll(myMeshes, scene.backgroundImage())
})
forever(function () {
    Polymesh.setAngle(PolyAngle.vy, controller.dx() * turnSpeed)
    Polymesh.setAngle(PolyAngle.vx, 0 - controller.dy() * turnSpeed)
    if (controller.A.isPressed()) {
        Polymesh.setAngle(PolyAngle.vz, turnSpeed)
    } else {
        Polymesh.setAngle(PolyAngle.vz, 0)
    }
    if (controller.B.isPressed()) {
        Polymesh.setAngle(PolyAngle.vz, 0 - turnSpeed)
    } else {
        Polymesh.setAngle(PolyAngle.vz, 0)
    }
    if (false) {
        Polymesh.changeCam(PolyCam.zoom, Math.sin(game.runtime() / 1000) / 100)
    }
    if (true) {

    }
})
