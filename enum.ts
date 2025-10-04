
enum PolyAngle {
    //% block="Angle x"
    x  = 0x0,
    //% block="Angle y"
    y  = 0x1,
    //% block="Angle z"
    z  = 0x2,
    //% block="Angle vx"
    vx = 0x3,
    //% block="Angle vy"
    vy = 0x4,
    //% block="Angle vz"
    vz = 0x5,
    //% block="Angle ax"
    ax = 0x6,
    //% block="Angle ay"
    ay = 0x7,
    //% block="Angle az"
    az = 0x8,
    //% block="Angle fx"
    fx = 0x9,
    //% block="Angle fy"
    fy = 0xA,
    //% block="Angle fz"
    fz = 0xB,
}
enum PolyCam {
    //% block="Camera zoom"
    zoom    = 0x0,
    //% block="Camera distance"
    dist    = 0x1,
    //% block="Camera far distance"
    fardist = 0x2,
    //% block="Camera x"
    x  = 0x3,
    //% block="Camera y"
    y  = 0x4,
    //% block="Camera z"
    z  = 0x5,
    //% block="Camera vx"
    vx = 0x6,
    //% block="Camera vy"
    vy = 0x7,
    //% block="Camera vz"
    vz = 0x8,
    //% block="Camera ax"
    ax = 0x9,
    //% block="Camera ay"
    ay = 0xA,
    //% block="Camera az"
    az = 0xB,
    //% block="Camera fx"
    fx = 0xC,
    //% block="Camera fy"
    fy = 0xD,
    //% block="Camera fz"
    fz = 0xE,
}
enum PolyPos {
    //% block="x"
    x  = 0x0,
    //% block="y"
    y  = 0x1,
    //% block="z"
    z  = 0x2,
    //% block="vx"
    vx = 0x3,
    //% block="vy"
    vy = 0x4,
    //% block="vz"
    vz = 0x5,
    //% block="ax"
    ax = 0x6,
    //% block="ay"
    ay = 0x7,
    //% block="az"
    az = 0x8,
    //% block="fx"
    fx = 0x9,
    //% block="fy"
    fy = 0xA,
    //% block="fz"
    fz = 0xB,
}
enum PolyPivot {
    //% block="Pivot x"
    x = 0x0,
    //% block="Pivot y"
    y = 0x1,
    //% block="Pivot z"
    z = 0x2,
}
enum PolySort {
    //% block="accurate"
    accurate = 0x0,
    //% block="normal"
    normal   = 0x1,
    //% block="quick"
    quick    = 0x2,
}
enum MeshFlags {
    //% block="Invisible"
    invisible = 0x0,
    //% block="Culling"
    noncull   = 0x1,
    //% block="Level of detail"
    lod       = 0x2,
}
