class polymesh {
    public faces: { indices: number[], color: number, offset: number, scale: number, img?: Image }[]
    public points: { x: number, y: number, z: number }[]
    public pivot: { x: number, y: number, z: number }
    public rot: { x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number, fx: number, fy: number, fz: number }
    public pos: { x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number, fx: number, fy: number, fz: number }
    flag: { invisible: boolean, noncull: boolean, lod: boolean }
    __home__() {
        forever(() => {
            const delta = control.eventContext().deltaTime

            // Acceleration angle of this mesh
            if (this.rot.ax !== 0) this.rot.vx += this.rot.ax * delta
            if (this.rot.ay !== 0) this.rot.vy += this.rot.ay * delta
            if (this.rot.az !== 0) this.rot.vz += this.rot.az * delta

            // Friction angle of this mesh
            if (this.rot.fx !== 0) this.rot.vx = this.rot.vx < 0 ? Math.min(this.rot.vx + Math.abs(this.rot.fx) * delta, 0) : Math.max(this.rot.vx - Math.abs(this.rot.fx) * delta, 0)
            if (this.rot.fy !== 0) this.rot.vy = this.rot.vy < 0 ? Math.min(this.rot.vy + Math.abs(this.rot.fy) * delta, 0) : Math.max(this.rot.vy - Math.abs(this.rot.fy) * delta, 0)
            if (this.rot.fz !== 0) this.rot.vz = this.rot.vz < 0 ? Math.min(this.rot.vz + Math.abs(this.rot.fz) * delta, 0) : Math.max(this.rot.vz - Math.abs(this.rot.fz) * delta, 0)

            // Velocity angle of this mesh
            if (this.rot.vx !== 0) this.rot.x += this.rot.vx * delta;
            if (this.rot.vy !== 0) this.rot.y += this.rot.vy * delta;
            if (this.rot.vz !== 0) this.rot.z += this.rot.vz * delta;

            // Acceleration position of this mesh
            if (this.pos.ax !== 0) this.pos.vx += this.pos.ax * delta
            if (this.pos.ay !== 0) this.pos.vy += this.pos.ay * delta
            if (this.pos.az !== 0) this.pos.vz += this.pos.az * delta

            // Friction position of this mesh
            if (this.pos.fx !== 0) this.pos.vx = this.pos.vx < 0 ? Math.min(this.pos.vx + Math.abs(this.pos.fx) * delta, 0) : Math.max(this.pos.vx - Math.abs(this.pos.fx) * delta, 0)
            if (this.pos.fy !== 0) this.pos.vy = this.pos.vy < 0 ? Math.min(this.pos.vy + Math.abs(this.pos.fy) * delta, 0) : Math.max(this.pos.vy - Math.abs(this.pos.fy) * delta, 0)
            if (this.pos.fz !== 0) this.pos.vz = this.pos.vz < 0 ? Math.min(this.pos.vz + Math.abs(this.pos.fz) * delta, 0) : Math.max(this.pos.vz - Math.abs(this.pos.fz) * delta, 0)

            // Velocity position of this mesh
            if (this.pos.vx !== 0) this.pos.x += this.pos.vx * delta;
            if (this.pos.vy !== 0) this.pos.y += this.pos.vy * delta;
            if (this.pos.vz !== 0) this.pos.z += this.pos.vz * delta;
        })
    }

    constructor() {
        this.faces = []
        this.points = []
        this.pivot = { x: 0, y: 0, z: 0 }
        this.rot = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 }
        this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 }
        this.flag = { invisible: false, noncull: false, lod: false }

        this.__home__()
    }

    //% blockId=poly_dist_z
    //% blockNamespace=Polymesh
    //% block="get $this depth of z"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=7
    public zDepth() {
        return Polymesh.meshDepthZ(this)
    }

    //% blockId=poly_dist_camera
    //% blockNamespace=Polymesh
    //% block="get $this distance from camera"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=8
    public distFromCamera() {
        const distPos = { x: Polymesh.camx - this.pos.x, y: Polymesh.camy - this.pos.y, z: Polymesh.camz - this.pos.z }
        return 1 / Polymesh.fisqrt((distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z))
    }

    //% blockId=poly_dist_othermesh
    //% blockNamespace=Polymesh
    //% block="get $this distance from $otherMesh"
    //% this.shadow=variables_get this.defl=myMesh
    //% otherMesh.shadow=variables_get otherMesh.defl=otherMesh
    //% group="Mesh util"
    //% weight=9
    public distBetween(otherMesh: polymesh) {
        const distPos = { x: otherMesh.pos.x - this.pos.x, y: otherMesh.pos.y - this.pos.y, z: otherMesh.pos.z - this.pos.z }
        return 1 / Polymesh.fisqrt((distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z))
    }

    //% blockId=poly_normal_speed
    //% blockNamespace=Polymesh
    //% block="get $this normal speed"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=10
    public normalSpeed() {
        const distPosV = { vx: this.pos.vx, vy: this.pos.vy, vz: this.pos.vz }
        return 1 / Polymesh.fisqrt((distPosV.vx * distPosV.vx) + (distPosV.vy * distPosV.vy) + (distPosV.vz * distPosV.vz))
    }

    //% blockId=poly_flag_set
    //% blockNamespace=Polymesh
    //% block=" $this set flag of $flag right? $ok=toggleYesNo"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=10
    public setFlag(flag: MeshFlags, ok: boolean) {
        switch (flag) {
            case 0: default: this.flag.invisible = ok; break
            case 1: this.flag.noncull = ok; break
            case 2: this.flag.lod = ok; break
        }
    }

    //% blockId=poly_flag_get
    //% blockNamespace=Polymesh
    //% block=" $this get flag of $flag"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=5
    public getFlag(flag: MeshFlags) {
        switch (flag) {
            case 0: default: return this.flag.invisible;
            case 1: return this.flag.noncull;
            case 2: return this.flag.lod;
        }
        return false
    }

    //% blockId=poly_vertice_set
    //% blockNamespace=Polymesh
    //% block=" $this set vertice at $idx to $point3"
    //% point3.shadow=poly_shadow_point3
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh property"
    //% weight=10
    public setVertice(idx: number, point3: Polymesh.shadowPoint3) {
        if (Polymesh.isOutOfRange(idx, this.points.length + 1)) return;
        this.points[idx] = { x: point3.x, y: point3.y, z: point3.z }
    }

    //% blockId=poly_vertice_add
    //% blockNamespace=Polymesh
    //% block=" $this add vertice to $point3"
    //% point3.shadow=poly_shadow_point3
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh property"
    //% weight=9
    public addVertice(point3: Polymesh.shadowPoint3) { this.points.push({ x: point3.x, y: point3.y, z: point3.z }) }

    //% blockId=poly_vertice_del
    //% blockNamespace=Polymesh
    //% block=" $this remove vertice|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh remover"
    //% weight=10
    public delVertice(idx?: number) {
        if (idx) this.points.removeAt(idx);
        else this.points.pop();
    }

    //% blockId=poly_face_set
    //% blockNamespace=Polymesh
    //% block=" $this set face at $idx to color $c=colorindexpicker and $inds $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale|| and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh property"
    //% weight=8
    public setFace(idx: number, c: number, inds: Polymesh.shadowIndices, clface: Polymesh.shadowOffsetFace, billscale: Polymesh.shadowBillSize, img?: Image) {
        if (Polymesh.isOutOfRange(idx, this.faces.length + 1)) return;
        if (!billscale.scale) billscale.scale = 1
        if (!clface.oface) clface.oface = 0
        const indice = [inds.i1]
        if (inds.i2) indice.push(inds.i2);
        if (inds.i3) indice.push(inds.i3);
        if (inds.i4) indice.push(inds.i4);
        if (img) this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img };
        else this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale };
    }

    //% blockId=poly_face_add
    //% blockNamespace=Polymesh
    //% block=" $this add face to color $c=colorindexpicker and $inds $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale|| and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh property"
    //% weight=7
    public addFace(c: number, inds: Polymesh.shadowIndices, clface: Polymesh.shadowOffsetFace, billscale: Polymesh.shadowBillSize, img?: Image) {
        if (!billscale.scale) billscale.scale = 1
        if (!clface.oface) clface.oface = 0
        const indice = [inds.i1]
        if (inds.i2) indice.push(inds.i2);
        if (inds.i3) indice.push(inds.i3);
        if (inds.i4) indice.push(inds.i4);
        if (img) this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img });
        else this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale });
    }

    //% blockId=poly_face_del
    //% blockNamespace=Polymesh
    //% block=" $this remove face|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh remover"
    //% weight=9
    public delFace(idx?: number) {
        if (idx) this.faces.removeAt(idx);
        else this.faces.pop();
    }

    //% blockId=poly_getfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this get face color at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=10
    public getFaceColor(idx: number) {
        if (!this.faces[idx].color) return NaN
        return this.faces[idx].color
    }

    //% blockId=poly_setfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this set face color at $idx to $c=colorindexpicker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=9
    public setFaceColor(idx: number, c: number) {
        if (this.faces[idx].color === c) return;
        this.faces[idx].color = c
    }

    //% blockId=poly_getfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this get face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=8
    public getFaceImage(idx: number) {
        if (!this.faces[idx].img) return null
        return this.faces[idx].img
    }

    //% blockId=poly_setfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this set face image at $idx to $img=screen_image_picker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=7
    public setFaceImage(idx: number, img: Image) {
        if (this.faces[idx].img && this.faces[idx].img.equals(img)) return;
        this.faces[idx].img = img
    }

    //% blockId=poly_clearfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this clear face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=6
    public clearFaceImage(idx: number) {
        if (!this.faces[idx].img) return;
        this.faces[idx].img = null
    }

    //% blockId=poly_getfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this get face offset at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=5
    public getFaceOffset(idx: number) {
        if (!this.faces[idx].offset) return NaN
        return this.faces[idx].offset
    }

    //% blockId=poly_setfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this set face offset at $idx to $oface"
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=4
    public setFaceOffset(idx: number, oface: number) {
        if (this.faces[idx].offset === oface) return;
        this.faces[idx].offset = oface
    }

    //% blockId=poly_getfacescale
    //% blockNamespace=Polymesh
    //% block=" $this get face scale at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=5
    public getFaceScale(idx: number) {
        if (!this.faces[idx].scale) return NaN
        return this.faces[idx].scale
    }

    //% blockId=poly_setfacescale
    //% blockNamespace=Polymesh
    //% block=" $this set face scale at $idx to $scale"
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh face property"
    //% weight=4
    public setFaceScale(idx: number, scale: number) {
        if (this.faces[idx].scale === scale) return;
        this.faces[idx].scale = scale
    }

    //% blockId=poly_mesh_pivot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh pivot"
    //% weight=10
    public setPivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0: this.pivot.x = x; break
            case 1: this.pivot.y = x; break
            case 2: this.pivot.z = x; break
        }
    }

    //% blockId=poly_mesh_pivot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh pivot"
    //% weight=5
    public changePivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0: this.pivot.x += x; break
            case 1: this.pivot.y += x; break
            case 2: this.pivot.z += x; break
        }
    }

    //% blockId=poly_mesh_pivot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh pivot"
    //% weight=4
    public getPivot(choice: PolyPivot) {
        switch (choice) {
            case 0: return this.pivot.x
            case 1: return this.pivot.y
            case 2: return this.pivot.z
        }
        return NaN
    }

    //% blockId=poly_mesh_rot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh angle"
    //% weight=100
    public setAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0: this.rot.x = x; break
            case 1: this.rot.y = x; break
            case 2: this.rot.z = x; break
            case 3: this.rot.vx = x; break
            case 4: this.rot.vy = x; break
            case 5: this.rot.vz = x; break
            case 6: this.rot.ax = x; break
            case 7: this.rot.ay = x; break
            case 8: this.rot.az = x; break
            case 9: this.rot.fx = x; break
            case 10: this.rot.fy = x; break
            case 11: this.rot.fz = x; break
        }
    }

    //% blockId=poly_mesh_rot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh angle"
    //% weight=5
    public changeAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0: this.rot.x += x; break
            case 1: this.rot.y += x; break
            case 2: this.rot.z += x; break
            case 3: this.rot.vx += x; break
            case 4: this.rot.vy += x; break
            case 5: this.rot.vz += x; break
            case 6: this.rot.ax += x; break
            case 7: this.rot.ay += x; break
            case 8: this.rot.az += x; break
            case 9: this.rot.fx += x; break
            case 10: this.rot.fy += x; break
            case 11: this.rot.fz += x; break
        }
    }

    //% blockId=poly_mesh_rot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh angle"
    //% weight=4
    public getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0: return this.rot.x
            case 1: return this.rot.y
            case 2: return this.rot.z
            case 3: return this.rot.vx
            case 4: return this.rot.vy
            case 5: return this.rot.vz
            case 6: return this.rot.ax
            case 7: return this.rot.ay
            case 8: return this.rot.az
            case 9: return this.rot.fx
            case 10: return this.rot.fy
            case 11: return this.rot.fz
        }
        return NaN
    }

    //% blockId=poly_mesh_pos_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh position property"
    //% weight=10
    public setPos(choice: PolyPos, x: number) {
        switch (choice) {
            case 0: this.pos.x = x; break
            case 1: this.pos.y = x; break
            case 2: this.pos.z = x; break
            case 3: this.pos.vx = x; break
            case 4: this.pos.vy = x; break
            case 5: this.pos.vz = x; break
            case 6: this.pos.ax = x; break
            case 7: this.pos.ay = x; break
            case 8: this.pos.az = x; break
            case 9: this.pos.fx = x; break
            case 10: this.pos.fy = x; break
            case 11: this.pos.fz = x; break
        }
    }

    //% blockId=poly_mesh_pos_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh position property"
    //% weight=9
    public changePos(choice: PolyPos, x: number) {
        switch (choice) {
            case 0: this.pos.x += x; break
            case 1: this.pos.y += x; break
            case 2: this.pos.z += x; break
            case 3: this.pos.vx += x; break
            case 4: this.pos.vy += x; break
            case 5: this.pos.vz += x; break
            case 6: this.pos.ax += x; break
            case 7: this.pos.ay += x; break
            case 8: this.pos.az += x; break
            case 9: this.pos.fx += x; break
            case 10: this.pos.fy += x; break
            case 11: this.pos.fz += x; break
        }
    }

    //% blockId=poly_mesh_pos_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh position property"
    //% weight=8
    public getPos(choice: PolyPos) {
        switch (choice) {
            case 0: return this.pos.x
            case 1: return this.pos.y
            case 2: return this.pos.z
            case 3: return this.pos.vx
            case 4: return this.pos.vy
            case 5: return this.pos.vz
            case 6: return this.pos.ax
            case 7: return this.pos.ay
            case 8: return this.pos.az
            case 9: return this.pos.fx
            case 10: return this.pos.fy
            case 11: return this.pos.fz
        }
        return NaN
    }

}
