
function offsetPalUpdate() {
    OffsetPal = (OffsetPalInfo[0] * 2 + OffsetPalInfo[1] % 2) % image.getDimension(TmpPal, image.Dimension.Width)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    OffsetPalInfo[0] = OffsetPalInfo[0] + 1
    offsetPalUpdate()
})
function setupMesh() {
    meshVZdata = []
    for (let index = 0; index < 20; index++) {
        myMesh = Polymesh.create(PolyKind.obj)
        myMesh.setFlag(MeshFlags.noncull, true)
        myMesh.setFlag(MeshFlags.lod, true)
        myMesh.addVertice(Polymesh.point3Shadow(0, 0, 0))
        myMesh.addVertice(Polymesh.point3Shadow(0, 0, 0))
        myMesh.addFace(
            scene.backgroundColor(),
            Polymesh.indiceShadow(
                0,
                1
            ), Polymesh.offsetFaceShadow(0)
        )
        myMesh.setPos(PolyPos.x, randint(-120, 120))
        myMesh.setPos(PolyPos.y, randint(-90, 90))
        myMesh.setPos(PolyPos.z, randint(210, 280))
        myMesh.setPos(PolyPos.vz, randint(-350, -100))
        if (false) {
            myMesh.setVertice(0, Polymesh.point3Shadow(0, 0, 0 - myMesh.normalSpeed() / dotLen))
            myMesh.setVertice(1, Polymesh.point3Shadow(0, 0, 0 + myMesh.normalSpeed() / dotLen))
        }
        myMesh.data["vzdata"] = myMesh.getPos(PolyPos.vz) as number
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    OffsetPalInfo[1] = OffsetPalInfo[1] + 1
    offsetPalUpdate()
})
let myDist = 0
let sqrtDir = 0
let GetSpeedUp = 0
let myMesh: polymesh = null
let meshVZdata: number[] = []
let OffsetPal = 0
let OffsetPalInfo: number[] = []
let dotLen = 0
let BillBoardImage = false
let TmpPal: Image = null
dotLen = 64
TmpPal = img`
    f 1 f 1 8 1 e 1 c 1 
    c d c 5 6 d 2 5 a 5 
    b 3 a 3 7 5 4 3 4 3 
    3 b 3 a 5 7 3 4 3 4 
    d c 5 c d 6 5 2 5 a 
    1 f 1 f 1 8 1 e 1 c 
    `
OffsetPalInfo = [randint(1, 4), 0]
offsetPalUpdate()
let SpeedUp = 30
Polymesh.setCam(PolyCam.dist, 150)
Polymesh.setCam(PolyCam.fardist, 600)
Polymesh.sortingMethod(PolySort.quick)
setupMesh()
forever(function () {
    if (false) {
        if (controller.up.isPressed()) {
            GetSpeedUp += 0 - Math.cos(Polymesh.getAngle(PolyAngle.y)) * (SpeedUp * 0.35)
        }
        if (controller.down.isPressed()) {
            GetSpeedUp += Math.cos(Polymesh.getAngle(PolyAngle.y)) * (SpeedUp * 0.35)
        }
    } else {
        if (controller.up.isPressed()) {
            GetSpeedUp += 0 - SpeedUp * 0.7
        }
        if (controller.down.isPressed()) {
            GetSpeedUp += SpeedUp * 0.7
        }
    }
})
forever(function () {
    if (false) {
        sqrtDir = Math.sqrt(controller.dx() * controller.dx() + controller.dy() * controller.dy())
        if (controller.dx() != 0) {
            Polymesh.setAngle(PolyAngle.vy, (0 - controller.dx()) / sqrtDir * (SpeedUp / 16))
        } else {
            Polymesh.setAngle(PolyAngle.vy, 0)
        }
        if (controller.dy() != 0) {
            Polymesh.setAngle(PolyAngle.vx, (0 - controller.dy()) / sqrtDir * (SpeedUp / 16))
        } else {
            Polymesh.setAngle(PolyAngle.vx, 0)
        }
        Polymesh.setAngle(PolyAngle.x, Math.max(Math.min(Polymesh.getAngle(PolyAngle.x), 1.5), -1.5))
    }
    if (controller.dx() != 0) {
        Polymesh.setAngle(PolyAngle.vy, (0 - controller.dx()) * (SpeedUp / 24))
    } else {
        Polymesh.setAngle(PolyAngle.vy, 0)
    }
})
game.onUpdate(function () {
    scene.setBackgroundColor(TmpPal.getPixel(OffsetPal, 0))
    scene.setBackgroundImage(image.create(scene.screenWidth(), scene.screenHeight()))
    Polymesh.renderAll(PolyKind.obj, scene.backgroundImage())
})
forever(function () {
    // if (Polymesh.meshAll(PolyKind.obj).length <= 0) setupMesh();
    for (let value4 of Polymesh.meshAll(PolyKind.obj)) {
        // if (value4.getPos(PolyPos.z) < 0 - Polymesh.getCam(PolyCam.dist) * 1.9) value4.del()
        // if (value4.isDel()) continue;
        if (value4.getPos(PolyPos.z) < 0 - Polymesh.getCam(PolyCam.dist) * 1.9) {
            value4.setPos(PolyPos.vz, randint(-275, -75))
            value4.data["vzdata"] = value4.getPos(PolyPos.vz) as number
            value4.setPos(PolyPos.z, Polymesh.getCam(PolyCam.dist) * 1.9)
            value4.setPos(PolyPos.x, randint(-120, 120))
            value4.setPos(PolyPos.y, randint(-90, 90))
        }
        value4.setPos(PolyPos.az, Math.min(0, GetSpeedUp * (SpeedUp * 0.35)))
        value4.setPos(PolyPos.vz, Math.max(Math.min(value4.getPos(PolyPos.vz), (value4.data["vzdata"] as number)), 6 * (value4.data["vzdata"] as number)))
        value4.setVertice(0, Polymesh.point3Shadow(0, 0, 0 - value4.normalSpeed() / dotLen))
        value4.setVertice(1, Polymesh.point3Shadow(0, 0, 0 + value4.normalSpeed() / dotLen))
        myDist = value4.zDist()
        if (myDist < 1) {
            value4.setFaceColor(0, TmpPal.getPixel(OffsetPal, 1))
        } else if (myDist < 2) {
            value4.setFaceColor(0, TmpPal.getPixel(OffsetPal, 2))
        } else if (myDist < 3) {
            value4.setFaceColor(0, TmpPal.getPixel(OffsetPal, 3))
        } else if (myDist < 4) {
            value4.setFaceColor(0, TmpPal.getPixel(OffsetPal, 4))
        } else {
            value4.setFaceColor(0, TmpPal.getPixel(OffsetPal, 5))
        }
    }
})
