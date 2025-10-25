
class polymesh {

    data: {[id: string]: any};
    protected __del: boolean; protected __prop_upd: control.FrameCallback; kind: number; kind_idx: number;

    __upd() {
        Polymesh.__mesh[this.kind][this.kind_idx] = this;
    }

    //% blockId=poly_kind_set
    //% blockNamespace=Polymesh
    //% block=" $this set kind to $id"
    //% this.shadow=variables_get this.defl=myMesh
    //% id.shadow=poly_kind_shadow
    //% group="mesh kind"
    //% weight=11
    setKind(id: number) {
        if (Math.round(this.kind) === Math.round(id)) return;
        Polymesh.__mesh[Math.round(this.kind)][this.kind_idx] = null;
        this.kind = Math.round(id);
        const kind = Math.round(this.kind);
        if (!Polymesh.__mesh[kind]) Polymesh.__mesh[kind] = [];
        const kind_idx = Polymesh.__mesh[kind].indexOf(null)
        if (kind_idx < 0) Polymesh.__mesh[kind].push(null)
        this.kind_idx = (kind_idx >= 0) ? kind_idx : Polymesh.__mesh[kind].length - 1
        Polymesh.__mesh[kind][this.kind_idx] = this;
    }

    //% blockId=poly_kind_get
    //% blockNamespace=Polymesh
    //% block=" $this get kind"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh kind"
    //% weight=9
    getKind() {
        return Math.round(this.kind);
    }

    protected faces_indices: Fx8[][]; protected faces_color: Fx8[]; protected faces_offset: Fx8[]; protected faces_scale: Fx8[]; protected faces_img: Image[];
    set faces(vals: { indices: number[], color: number, offset?: number, scale?: number, img?: Image }[]) {
        if (vals == null || vals.length <= 0) {
            this.faces_indices = [], this.faces_color = [], this.faces_offset = [], this.faces_scale = [], this.faces_img = [];
            return;
        }​
        if (this.isDel()) return;
        this.faces_indices = vals.map(vs => vs.indices.map(v => Fx8(v))), this.faces_color = vals.map(v => Fx8(v.color))
        this.faces_offset = vals.map(v => v.offset ? Fx8(v.offset) : Fx8(0)), this.faces_scale = vals.map(v => v.scale ? Fx8(v.scale) : Fx8(1))
        this.faces_img = vals.map(v => v.img ? v.img : null);
        this.__upd();
    }
    get faces() {
        if (this.isDel()) return null
        return this.faces_indices.map((_, i) => ({
            indices: this.faces_indices[i].map(v => Fx.toFloat(v)), color: Fx.toInt(this.faces_color[i]),
            offset: Fx.toInt(this.faces_offset[i]), scale: Fx.toFloat(this.faces_scale[i]), img: this.faces_img[i],
        }))
    }

    protected points_xs: Fx8[]; protected points_ys: Fx8[]; protected points_zs: Fx8[];
    set points(vals: Polymesh.Vector3[]) {
        if (vals == null || vals.length <= 0) {
            this.points_xs = [], this.points_ys = [], this.points_zs = [];
            return;
        }
        if (this.isDel()) return;
        this.points_xs = vals.map(v => Fx8(v.x)), this.points_ys = vals.map(v => Fx8(v.y)), this.points_zs = vals.map(v => Fx8(v.z));
        this.__upd();
    }
    get points() {
        if (this.isDel()) return null
        return this.points_xs.map((_, i) => ({
            x: Fx.toFloat(this.points_xs[i]),
            y: Fx.toFloat(this.points_ys[i]),
            z: Fx.toFloat(this.points_zs[i]),
        }))
    }

    protected points_m_xs: Fx8[]; protected points_m_ys: Fx8[]; protected points_m_zs: Fx8[];
    set points_m(vals: Polymesh.Vector3[]) {
        if (vals == null || vals.length <= 0) {
            this.points_m_xs = [], this.points_m_ys = [], this.points_m_zs = [];
            return;
        }
        if (this.isDel()) return;
        this.points_m_xs = vals.map(v => Fx8(v.x)), this.points_m_ys = vals.map(v => Fx8(v.y)), this.points_m_zs = vals.map(v => Fx8(v.z));
        this.__upd();
    }
    get points_m() {
        if (this.isDel()) return null
        return this.points_m_xs.map((_, i) => ({
            x: Fx.toFloat(this.points_m_xs[i]),
            y: Fx.toFloat(this.points_m_ys[i]),
            z: Fx.toFloat(this.points_m_zs[i]),
        }))
    }

    protected points_ren_xs: Fx8[]; protected points_ren_ys: Fx8[]; protected points_ren_zs: Fx8[];
    set points_ren(vals: Polymesh.Vector3[]) {
        if (vals == null || vals.length <= 0) {
            this.points_ren_xs = [], this.points_ren_ys = [], this.points_ren_zs = [];
            return;
        }
        if (this.isDel()) return;
        this.points_ren_xs = vals.map(v => Fx8(v.x)), this.points_ren_ys = vals.map(v => Fx8(v.y)), this.points_ren_zs = vals.map(v => Fx8(v.z));
        this.__upd();
    }
    get points_ren() {
        if (this.isDel()) return null
        return this.points_ren_xs.map((_, i) => ({
            x: Fx.toFloat(this.points_ren_xs[i]),
            y: Fx.toFloat(this.points_ren_ys[i]),
            z: Fx.toFloat(this.points_ren_zs[i]),
        }))
    }

    protected updatePointMotions() {
        if (this.isStaticPos() && this.isStaticRot()) return;
        this.points_m = this.points.map(v => {
            const vpoint = { x: msh.pos.x + v.x, y: msh.pos.y + v.y, z: msh.pos.z + v.z }
            const vpivot = { x: msh.pos.x + msh.pivot.x, y: msh.pos.y + msh.pivot.y, z: msh.pos.z + msh.pivot.z }
            return rotatePoint3D(vpoint, vpivot, msh.rot)
        })
        this.updatePerspective()
    }

    updatePerspective() {
        
        this.points_ren = this.points_m.map(v => {
            const vpoint = { x: msh.pos.x + v.x, y: msh.pos.y + v.y, z: msh.pos.z + v.z }
            const vpivot = { x: msh.pos.x + msh.pivot.x, y: msh.pos.y + msh.pivot.y, z: msh.pos.z + msh.pivot.z }
            return rotatePoint3D(vpoint, vpivot, msh.rot)
        })
    }

    protected pivot_x: Fx8; protected pivot_y: Fx8; protected pivot_z: Fx8;
    set pivot(v: Polymesh.Vector3) { if (this.isDel()) return; this.pivot_x = Fx8(v.x), this.pivot_y = Fx8(v.y), this.pivot_z = Fx8(v.z) }
    get pivot() { if (this.isDel()) return null; return { x: Fx.toFloat(this.pivot_x), y: Fx.toFloat(this.pivot_y), z: Fx.toFloat(this.pivot_z) } }

    pos: Polymesh.Motion3; rot: Polymesh.Motion3;

    protected staticPos: boolean;
    isStaticPos() {
        if (this.staticPos) {
            this.staticPos = false
            return true
        }
        return (
            this.pos.vx !== 0 &&
            this.pos.vy !== 0 &&
            this.pos.vz !== 0
        )
    };

    protected staticRot: boolean;
    isStaticRot() {
        if (this.staticRot) {
            this.staticRot = false
            return true
        }
        return (
            this.rot.vx !== 0 &&
            this.rot.vy !== 0 &&
            this.rot.vz !== 0
        )
    };
    
    flag: { invisible: boolean, noncull: boolean, lod: boolean }
    loop() {
        this.__prop_upd = control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
            const delta = control.eventContext().deltaTime
            Polymesh.updateMotion(this.rot, delta);
            Polymesh.updateMotion(this.pos, delta);
            this.updatePointMotions();
        });
    }

    init() {
        this.data = {};
        this.faces = [];
        this.points = [];
        this.pivot = { x: 0, y: 0, z: 0 };
        this.rot = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
        this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
        this.flag = { invisible: false, noncull: false, lod: false };
        this.__del = false, this.staticPos = true, this.staticRot = true;
        this.loop();
    }

    constructor(id: number) {
        this.kind = Math.round(id);
        const kind = this.kind;
        if (!Polymesh.__mesh[kind]) Polymesh.__mesh[kind] = [];
        const kind_idx = Polymesh.__mesh[kind].indexOf(null)
        if (kind_idx < 0) Polymesh.__mesh[kind].push(null)
        this.kind_idx = (kind_idx >= 0) ? kind_idx : Polymesh.__mesh[kind].length - 1
        Polymesh.__mesh[kind][this.kind_idx] = this;
        this.init();
    }

    //% blockId=poly_dist_del
    //% blockNamespace=Polymesh
    //% block="delete $this"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=15
    del() {
        this.__del = true; control.eventContext().unregisterFrameHandler(this.__prop_upd);
        this.faces = null, this.points = null, this.pivot = null, this.rot = null, this.pos = null, this.flag = null, this.data = null;
        Polymesh.__mesh[this.kind][this.kind_idx] = null;
    }

    //% blockId=poly_dist_isdel
    //% blockNamespace=Polymesh
    //% block=" $this is deleted"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=13
    isDel() {
        return this.__del
    }

    //% blockId=poly_dist_zdist
    //% blockNamespace=Polymesh
    //% block=" $this get view distance"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=7
    zDist() {
        return Polymesh.meshDistZ(this) * Polymesh.NORMAL_DIST
    }

    //% blockId=poly_dist_zdepth
    //% blockNamespace=Polymesh
    //% block=" $this as Z of depth"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=6
    zDepth() {
        return Polymesh.meshDepthZ(this)
    }

    //% blockId=poly_dist_camera
    //% blockNamespace=Polymesh
    //% block=" $this get distance from camera"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=8
    distFromCamera() {
        const distPos = { x: Polymesh.cam.x - this.pos.x, y: Polymesh.cam.y - this.pos.y, z: Polymesh.cam.z - this.pos.z }
        const distSum = (distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z)
        return distSum * Polymesh.q_rsqrt(distSum)
    }

    //% blockId=poly_dist_othermesh
    //% blockNamespace=Polymesh
    //% block=" $this get distance from $otherMesh"
    //% this.shadow=variables_get this.defl=myMesh
    //% otherMesh.shadow=variables_get otherMesh.defl=otherMesh
    //% group="Mesh util"
    //% weight=9
    distBetween(otherMesh: polymesh) {
        if (otherMesh.isDel()) return NaN
        const distPos = { x: otherMesh.pos.x - this.pos.x, y: otherMesh.pos.y - this.pos.y, z: otherMesh.pos.z - this.pos.z }
        const distSum = (distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z)
        return distSum * Polymesh.q_rsqrt(distSum)
    }

    //% blockId=poly_normal_speed
    //% blockNamespace=Polymesh
    //% block=" $this get normal speed"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=10
    normalSpeed() {
        const distPosV = { vx: this.pos.vx, vy: this.pos.vy, vz: this.pos.vz }
        const distSum = (distPosV.vx * distPosV.vx) + (distPosV.vy * distPosV.vy) + (distPosV.vz * distPosV.vz)
        return distSum * Polymesh.q_rsqrt(distSum)
    }

    //% blockId=poly_flag_set
    //% blockNamespace=Polymesh
    //% block="$this set flag of $flag right? $ok=toggleYesNo"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=10
    setFlag(flag: MeshFlags, ok: boolean) {
        switch (flag) {
            case 0x0: default: this.flag.invisible = ok; break;
            case 0x1:          this.flag.noncull   = ok; break;
            case 0x2:          this.flag.lod       = ok; break;
        }
        this.__upd();
    }

    //% blockId=poly_flag_get
    //% blockNamespace=Polymesh
    //% block=" $this get flag of $flag"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=5
    getFlag(flag: MeshFlags) {
        switch (flag) {
            case 0x0: default: return this.flag.invisible;
            case 0x1:          return this.flag.noncull;
            case 0x2:          return this.flag.lod;
        }
        return false
    }

    //% blockId=poly_vertice_set
    //% blockNamespace=Polymesh
    //% block=" $this set vertice at $idx to $point3"
    //% point3.shadow=poly_shadow_point3
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=10
    setVertice(idx: number, point3: Polymesh.shadowPoint3) {
        if (Polymesh.isOutOfRange(idx, this.points.length + 1)) return;
        this.points_xs[idx] = Fx8(point3.x), this.points_ys[idx] = Fx8(point3.y), this.points_zs[idx] = Fx8(point3.z);// this.points[idx] = { x: point3.x, y: point3.y, z: point3.z }
        this.__upd();
    }

    //% blockId=poly_vertice_add
    //% blockNamespace=Polymesh
    //% block=" $this add vertice to $point3"
    //% point3.shadow=poly_shadow_point3
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=9
    addVertice(point3: Polymesh.shadowPoint3) {
        this.points_xs.push(Fx8(point3.x)), this.points_ys.push(Fx8(point3.y)), this.points_zs.push(Fx8(point3.z));// this.points.push({ x: point3.x, y: point3.y, z: point3.z })
        this.__upd();
    }

    //% blockId=poly_vertice_del
    //% blockNamespace=Polymesh
    //% block=" $this remove vertice|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=10
    delVertice(idx?: number) {
        if (idx) this.points_xs.removeAt(idx), this.points_ys.removeAt(idx), this.points_zs.removeAt(idx);// this.points.removeAt(idx);
        else this.points_xs.pop(), this.points_ys.pop(), this.points_zs.pop();// this.points.pop();
        this.__upd();
    }

    //% blockId=poly_face_set
    //% blockNamespace=Polymesh
    //% block=" $this set face at $idx to color $c=colorindexpicker and $inds|| $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=8
    setFace(idx: number, c: number, inds: Polymesh.shadowIndices, clface?: Polymesh.shadowOffsetFace, billscale?: Polymesh.shadowBillSize, img?: Image) {
        if (Polymesh.isOutOfRange(idx, this.faces.length + 1)) return;
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = img;
        else this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = null;
        this.__upd();
    }

    //% blockId=poly_face_add
    //% blockNamespace=Polymesh
    //% block=" $this add face to color $c=colorindexpicker and $inds|| $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=7
    addFace(c: number, inds: Polymesh.shadowIndices, clface?: Polymesh.shadowOffsetFace, billscale?: Polymesh.shadowBillSize, img?: Image) {
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(img);
        else this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(null);
        this.__upd();
    }

    //% blockId=poly_face_del
    //% blockNamespace=Polymesh
    //% block=" $this remove face|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=9
    delFace(idx?: number) {
        if (idx) this.faces_indices.removeAt(idx), this.faces_color.removeAt(idx), this.faces_offset.removeAt(idx), this.faces_scale.removeAt(idx), this.faces_img.removeAt(idx);// this.faces.removeAt(idx);
        else this.faces_indices.pop(), this.faces_color.pop(), this.faces_offset.pop(), this.faces_scale.pop(), this.faces_img.pop();// this.faces.pop();
        this.__upd();
    }

    //% blockId=poly_getfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this get face color at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=10
    getFaceColor(idx: number) {
        if (!this.faces_color[idx]) return NaN
        return Fx.toInt(this.faces_color[idx])
    }

    //% blockId=poly_setfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this set face color at $idx to $c=colorindexpicker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=9
    setFaceColor(idx: number, c: number) {
        if (this.faces_color[idx] === Fx8(c)) return;
        this.faces_color[idx] = Fx8(c)
    }

    //% blockId=poly_getfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this get face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=8
    getFaceImage(idx: number) {
        // if (this.isDel()) return null
        if (!this.faces_img[idx]) return null
        return this.faces_img[idx]
    }

    //% blockId=poly_setfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this set face image at $idx to $img=screen_image_picker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=7
    setFaceImage(idx: number, img: Image) {
        if (this.faces_img[idx] && this.faces_img[idx].equals(img)) return;
        this.faces_img[idx] = img
        this.__upd();
    }

    //% blockId=poly_clearfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this clear face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=6
    clearFaceImage(idx: number) {
        if (!this.faces_img[idx]) return;
        this.faces_img[idx] = null
        this.__upd();
    }

    //% blockId=poly_getfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this get face offset at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceOffset(idx: number) {
        if (!this.faces_offset[idx]) return NaN
        return Fx.toFloat(this.faces_offset[idx])
    }

    //% blockId=poly_setfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this set face offset at $idx to $oface"
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=4
    setFaceOffset(idx: number, oface: number) {;
        if (this.faces_offset[idx] === Fx8(oface)) return;
        this.faces_offset[idx] = Fx8(oface);
        this.__upd();
    }

    //% blockId=poly_getfacescale
    //% blockNamespace=Polymesh
    //% block=" $this get face scale at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceScale(idx: number) {
        if (!this.faces_scale[idx]) return NaN;
        return Fx.toFloat(this.faces_scale[idx]);
    }

    //% blockId=poly_setfacescale
    //% blockNamespace=Polymesh
    //% block=" $this set face scale at $idx to $scale"
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=4
    setFaceScale(idx: number, scale: number) {
        if (this.faces_scale[idx] === Fx8(scale)) return;
        this.faces_scale[idx] = Fx8(scale);
        this.__upd();
    }

    //% blockId=poly_mesh_pivot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=10
    setPivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx8(x)) this.pivot_x = Fx8(x); break;
            case 0x1: if (this.pivot_y !== Fx8(x)) this.pivot_y = Fx8(x); break;
            case 0x2: if (this.pivot_z !== Fx8(x)) this.pivot_z = Fx8(x); break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_pivot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=5
    changePivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx.add(this.pivot_x, Fx8(x))) this.pivot_x = Fx.add(this.pivot_x, Fx8(x)); break;
            case 0x1: if (this.pivot_y !== Fx.add(this.pivot_y, Fx8(x))) this.pivot_y = Fx.add(this.pivot_y, Fx8(x)); break;
            case 0x2: if (this.pivot_z !== Fx.add(this.pivot_z, Fx8(x))) this.pivot_z = Fx.add(this.pivot_z, Fx8(x)); break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_pivot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=4
    getPivot(choice: PolyPivot) {
        switch (choice) {
            case 0x0: return Fx.toFloat(this.pivot_x);
            case 0x1: return Fx.toFloat(this.pivot_y);
            case 0x2: return Fx.toFloat(this.pivot_z);
        };
        return NaN
    }

    //% blockId=poly_mesh_rot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=100
    setAngle(choice: PolyAngle, x: number) {
        this.staticRot = true;
        switch (choice) {
            case 0x0: if (this.rot.x  !== x) this.staticRot = false, this.rot.x  = x; break;
            case 0x1: if (this.rot.y  !== x) this.staticRot = false, ​this.rot.y  = x; break;
            case 0x2: if (this.rot.z  !== x) this.staticRot = false, this.rot.z  = x; break;
            case 0x3: if (this.rot.vx !== x) this.staticRot = false, this.rot.vx = x; break;
            case 0x4: if (this.rot.vy !== x) this.staticRot = false, this.rot.vy = x; break;
            case 0x5: if (this.rot.vz !== x) this.staticRot = false, this.rot.vz = x; break;
            case 0x6: if (this.rot.ax !== x) this.staticRot = false, this.rot.ax = x; break;
            case 0x7: if (this.rot.ay !== x) this.staticRot = false, this.rot.ay = x; break;
            case 0x8: if (this.rot.az !== x) this.staticRot = false, this.rot.az = x; break;
            case 0x9: if (this.rot.fx !== x) this.staticRot = false, this.rot.fx = x; break;
            case 0xA: if (this.rot.fy !== x) this.staticRot = false, this.rot.fy = x; break;
            case 0xB: if (this.rot.fz !== x) this.staticRot = false, this.rot.fz = x; break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_rot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=5
    changeAngle(choice: PolyAngle, x: number) {
        this.staticRot = true;
        switch (choice) {
            case 0x0: if (this.rot.x  !== (this.rot.x  + x)) this.staticRot = false, this.rot.x  += x; break;
            case 0x1: if (this.rot.y  !== (this.rot.y  + x)) this.staticRot = false, this.rot.y  += x; break;
            case 0x2: if (this.rot.z  !== (this.rot.z  + x)) this.staticRot = false, this.rot.z  += x; break;
            case 0x3: if (this.rot.vx !== (this.rot.vx + x)) this.staticRot = false, this.rot.vx += x; break;
            case 0x4: if (this.rot.vy !== (this.rot.vy + x)) this.staticRot = false, this.rot.vy += x; break;
            case 0x5: if (this.rot.vz !== (this.rot.vz + x)) this.staticRot = false, this.rot.vz += x; break;
            case 0x6: if (this.rot.ax !== (this.rot.ax + x)) this.staticRot = false, this.rot.ax += x; break;
            case 0x7: if (this.rot.ay !== (this.rot.ay + x)) this.staticRot = false, this.rot.ay += x; break;
            case 0x8: if (this.rot.az !== (this.rot.az + x)) this.staticRot = false, this.rot.az += x; break;
            case 0x9: if (this.rot.fx !== (this.rot.fx + x)) this.staticRot = false, this.rot.fx += x; break;
            case 0xA: if (this.rot.fy !== (this.rot.fy + x)) this.staticRot = false, this.rot.fy += x; break;
            case 0xB: if (this.rot.fz !== (this.rot.fz + x)) this.staticRot = false, this.rot.fz += x; break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_rot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=4
    getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0x0: return this.rot.x;
            case 0x1: return this.rot.y;
            case 0x2: return this.rot.z;
            case 0x3: return this.rot.vx;
            case 0x4: return this.rot.vy;
            case 0x5: return this.rot.vz;
            case 0x6: return this.rot.ax;
            case 0x7: return this.rot.ay;
            case 0x8: return this.rot.az;
            case 0x9: return this.rot.fx;
            case 0xA: return this.rot.fy;
            case 0xB: return this.rot.fz;
        };
        return NaN;
    }

    //% blockId=poly_mesh_pos_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=10
    setPos(choice: PolyPos, x: number) {
        this.staticPos = true;
        switch (choice) {
            case 0x0: if (this.pos.x  !== x) this.staticPos = false, this.pos.x  = x; break;
            case 0x1: if (this.pos.y  !== x) this.staticPos = false, this.pos.y  = x; break;
            case 0x2: if (this.pos.z  !== x) this.staticPos = false, this.pos.z  = x; break;
            case 0x3: if (this.pos.vx !== x) this.staticPos = false, this.pos.vx = x; break;
            case 0x4: if (this.pos.vy !== x) this.staticPos = false, this.pos.vy = x; break;
            case 0x5: if (this.pos.vz !== x) this.staticPos = false, this.pos.vz = x; break;
            case 0x6: if (this.pos.ax !== x) this.staticPos = false, this.pos.ax = x; break;
            case 0x7: if (this.pos.ay !== x) this.staticPos = false, this.pos.ay = x; break;
            case 0x8: if (this.pos.az !== x) this.staticPos = false, this.pos.az = x; break;
            case 0x9: if (this.pos.fx !== x) this.staticPos = false, this.pos.fx = x; break;
            case 0xA: if (this.pos.fy !== x) this.staticPos = false, this.pos.fy = x; break;
            case 0xB: if (this.pos.fz !== x) this.staticPos = false, this.pos.fz = x; break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_pos_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=9
    changePos(choice: PolyPos, x: number) {
        this.staticPos = true;
        switch (choice) {
            case 0x0: if (this.pos.x  !== (this.pos.x  + x)) this.staticPos = false, this.pos.x  += x; break;
            case 0x1: if (this.pos.y  !== (this.pos.y  + x)) this.staticPos = false, this.pos.y  += x; break;
            case 0x2: if (this.pos.z  !== (this.pos.z  + x)) this.staticPos = false, this.pos.z  += x; break;
            case 0x3: if (this.pos.vx !== (this.pos.vx + x)) this.staticPos = false, this.pos.vx += x; break;
            case 0x4: if (this.pos.vy !== (this.pos.vy + x)) this.staticPos = false, this.pos.vy += x; break;
            case 0x5: if (this.pos.vz !== (this.pos.vz + x)) this.staticPos = false, this.pos.vz += x; break;
            case 0x6: if (this.pos.ax !== (this.pos.ax + x)) this.staticPos = false, this.pos.ax += x; break;
            case 0x7: if (this.pos.ay !== (this.pos.ay + x)) this.staticPos = false, this.pos.ay += x; break;
            case 0x8: if (this.pos.az !== (this.pos.az + x)) this.staticPos = false, this.pos.az += x; break;
            case 0x9: if (this.pos.fx !== (this.pos.fx + x)) this.staticPos = false, this.pos.fx += x; break;
            case 0xA: if (this.pos.fy !== (this.pos.fy + x)) this.staticPos = false, this.pos.fy += x; break;
            case 0xB: if (this.pos.fz !== (this.pos.fz + x)) this.staticPos = false, this.pos.fz += x; break;
        };
        this.__upd();
    }

    //% blockId=poly_mesh_pos_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=8
    getPos(choice: PolyPos) {
        switch (choice) {
            case 0x0: return this.pos.x;
            case 0x1: return this.pos.y;
            case 0x2: return this.pos.z;
            case 0x3: return this.pos.vx;
            case 0x4: return this.pos.vy;
            case 0x5: return this.pos.vz;
            case 0x6: return this.pos.ax;
            case 0x7: return this.pos.ay;
            case 0x8: return this.pos.az;
            case 0x9: return this.pos.fx;
            case 0xA: return this.pos.fy;
            case 0xB: return this.pos.fz;
        }
        return NaN
    }

}
