
class polymesh {

    data: {[id: string]: any};
    protected __del: boolean; protected __prop_upd: control.FrameCallback; kind: number; idx: number;

    //% blockId=poly_kind_set
    //% blockNamespace=Polymesh
    //% block=" $this set kind to $id"
    //% this.shadow=variables_get this.defl=myMesh
    //% id.shadow=poly_kind_shadow
    //% group="mesh kind"
    //% weight=11
    setKind(id: number) {
        if (this.kind === Math.floor(id)) return;
        Polymesh.__meshes_upd_kind(this, id)
    }

    //% blockId=poly_kind_get
    //% blockNamespace=Polymesh
    //% block=" $this get kind"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="mesh kind"
    //% weight=9
    getKind() {
        return Math.floor(this.kind);
    }

    protected upd_faceImg(idx: number, size: number) {
        const cimg = this.faces_img[idx];
        if (!this.faces_imgs[idx]) this.faces_imgs[idx] = {};
        if (!cimg) return;
        const imgh = Polymesh.hashImage(this.faces_img[idx])
        this.faces_imgs[idx][imgh] = [];
        if (Polymesh.isEmptyImage(cimg)) {
            this.faces_imgs[idx][imgh].push(image.create(cimg.width, cimg.height))
            return
        }
        let img = image.create(1, 1), scale = 0.1;
        while (img.width < cimg.width || img.height < cimg.height) {
            Polymesh.resizeImage(cimg.clone(), img, true);
            this.faces_imgs[idx][imgh].push(img.clone());
            const scaleD = scale;
            img = image.create(Math.max(1, Math.trunc(scaleD * cimg.width)), Math.max(1, Math.trunc(scaleD * cimg.height)));
            scale *= 2;
        } this.faces_imgs[idx][imgh].push(cimg.clone());
    }

    protected faces_indices: Fx8[][]; protected faces_color: Fx8[]; protected faces_offset: Fx8[]; protected faces_scale: Fx8[]; protected faces_img: Image[]; faces_imgs: {[imgh: string]: Image[]}[];
    set faces(vals: Polymesh.Face[]) {
        if (vals == null || vals.length <= 0) {
            this.faces_indices = [], this.faces_color = [], this.faces_offset = [], this.faces_scale = [], this.faces_img = [], this.faces_imgs = [];
            return;
        }​
        if (this.isDel()) return;
        this.faces_indices = vals.map(vs => vs.indices.map(v => Fx8(v))), this.faces_color = vals.map(v => Fx8(v.color))
        this.faces_offset = vals.map(v => v.offset ? Fx8(v.offset) : Fx8(0)), this.faces_scale = vals.map(v => v.scale ? Fx8(v.scale) : Fx8(1))
        this.faces_img = vals.map(v => v.img ? v.img : null);
        this.faces_imgs = []
        for (let i = 0; i < this.faces_img.length; i++) this.upd_faceImg(i, 2)
    }
    get faces() {
        if (this.isDel()) return null
        return this.faces_indices.map((_, i) => ({
            indices: this.faces_indices[i].map(v => Fx.toFloat(v)), color: Fx.toInt(this.faces_color[i]),
            offset: Fx.toInt(this.faces_offset[i]), scale: Fx.toFloat(this.faces_scale[i]), img: this.faces_img[i], imgs: this.faces_imgs[i][Polymesh.hashImage(this.faces_img[i])]
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
    }
    get points() {
        if (this.isDel()) return null
        return this.points_xs.map((_, i) => ({
            x: Fx.toFloat(this.points_xs[i]),
            y: Fx.toFloat(this.points_ys[i]),
            z: Fx.toFloat(this.points_zs[i]),
        }))
    }

    pointCam<T>(f: (v: Polymesh.Vector3) => T) {
        return this.points.map(v => {
            const vpoint = { x: this.pos.x + v.x, y: this.pos.y + v.y, z: this.pos.z + v.z };
            const vpivot = { x: this.pos.x + this.pivot.x, y: this.pos.y + this.pivot.y, z: this.pos.z + this.pivot.z };
            return f(Polymesh.rotatePoint3D(vpoint, vpivot, this.rot));
        })
    }

    protected pivot_x: Fx8; protected pivot_y: Fx8; protected pivot_z: Fx8;
    set pivot(v: Polymesh.Vector3) { if (this.isDel()) return; this.pivot_x = Fx8(v.x), this.pivot_y = Fx8(v.y), this.pivot_z = Fx8(v.z) }
    get pivot() { if (this.isDel()) return null; return { x: Fx.toFloat(this.pivot_x), y: Fx.toFloat(this.pivot_y), z: Fx.toFloat(this.pivot_z) } }

    rot: Polymesh.Motion3; pos: Polymesh.Motion3;

    protected upd_img_lod_cache() {
        if (!this.flag.lod) return;
        const imgNewData = this.faces_imgs.filter((v, i) => {
            if (!this.faces_img[i]) return false;
            const imgh = Polymesh.hashImage(this.faces_img[i])
            return !v[imgh];
        }).map((_, i) => i)
        if (imgNewData.length <= 0) return;
        while (imgNewData.length > 0) this.upd_faceImg(imgNewData.pop(), 2)
    }

    flag: { invisible: boolean, noncull: boolean, lod: boolean }
    loop() {
        this.__prop_upd = control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
            const delta = control.eventContext().deltaTime
            Polymesh.updateMotion(this.pos, delta); Polymesh.updateMotion(this.rot, delta);
            this.upd_img_lod_cache();
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
        this.__del = false;
        this.loop();
    }

    constructor(kind: number, idx: number) {
        this.kind = Math.floor(kind);
        this.idx = Math.floor(idx);
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
        Polymesh.__meshes_del(this);
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
        if (this.isDel()) return NaN
        return Polymesh.meshDistZ(this) * Polymesh.NORMAL_DIST
    }

    //% blockId=poly_dist_zdepth
    //% blockNamespace=Polymesh
    //% block=" $this as Z of depth"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=6
    zDepth() {
        if (this.isDel()) return NaN
        return Polymesh.meshDepthZ(this)
    }

    //% blockId=poly_dist_camera
    //% blockNamespace=Polymesh
    //% block=" $this get distance from camera"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=8
    distFromCamera() {
        if (this.isDel()) return NaN
        const distPos = { x: Polymesh.cam.x - this.pos.x, y: Polymesh.cam.y - this.pos.y, z: Polymesh.cam.z - this.pos.z }
        const distSum = (distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z)
        return Math.sqrt(distSum)
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
        if (this.isDel()) return NaN
        const distPos = { x: otherMesh.pos.x - this.pos.x, y: otherMesh.pos.y - this.pos.y, z: otherMesh.pos.z - this.pos.z }
        const distSum = (distPos.x * distPos.x) + (distPos.y * distPos.y) + (distPos.z * distPos.z)
        return Math.sqrt(distSum)
    }

    //% blockId=poly_normal_speed
    //% blockNamespace=Polymesh
    //% block=" $this get normal speed"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=10
    normalSpeed() {
        if (this.isDel()) return NaN
        const distPosV = { vx: this.pos.vx, vy: this.pos.vy, vz: this.pos.vz }
        const distSum = (distPosV.vx * distPosV.vx) + (distPosV.vy * distPosV.vy) + (distPosV.vz * distPosV.vz)
        return Math.sqrt(distSum)
    }

    //% blockId=poly_flag_set
    //% blockNamespace=Polymesh
    //% block="$this set flag of $flag right? $ok=toggleYesNo"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=10
    setFlag(flag: MeshFlags, ok: boolean) {
        if (this.isDel()) return
        switch (flag) {
            case 0x0: default: this.flag.invisible = ok; break;
            case 0x1:          this.flag.noncull   = ok; break;
            case 0x2:          this.flag.lod       = ok; break;
        }
    }

    //% blockId=poly_flag_get
    //% blockNamespace=Polymesh
    //% block=" $this get flag of $flag"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Flag mesh"
    //% weight=5
    getFlag(flag: MeshFlags) {
        if (this.isDel()) return null
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
        if (this.isDel()) return
        if (Polymesh.isOutOfRange(idx, this.points.length + 1)) return;
        this.points_xs[idx] = Fx8(point3.x), this.points_ys[idx] = Fx8(point3.y), this.points_zs[idx] = Fx8(point3.z);// this.points[idx] = { x: point3.x, y: point3.y, z: point3.z }
    }

    //% blockId=poly_vertice_add
    //% blockNamespace=Polymesh
    //% block=" $this add vertice to $point3"
    //% point3.shadow=poly_shadow_point3
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=9
    addVertice(point3: Polymesh.shadowPoint3) {
        if (this.isDel()) return
        this.points_xs.push(Fx8(point3.x)), this.points_ys.push(Fx8(point3.y)), this.points_zs.push(Fx8(point3.z));// this.points.push({ x: point3.x, y: point3.y, z: point3.z })
    }

    //% blockId=poly_vertice_del
    //% blockNamespace=Polymesh
    //% block=" $this remove vertice|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=10
    delVertice(idx?: number) {
        if (this.isDel()) return
        if (idx) this.points_xs.removeAt(idx), this.points_ys.removeAt(idx), this.points_zs.removeAt(idx);// this.points.removeAt(idx);
        else this.points_xs.pop(), this.points_ys.pop(), this.points_zs.pop();// this.points.pop();
    }

    //% blockId=poly_face_set
    //% blockNamespace=Polymesh
    //% block=" $this set face at $idx to color $c=colorindexpicker and $inds|| $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=8
    setFace(idx: number, c: number, inds: Polymesh.shadowIndices, clface?: Polymesh.shadowOffsetFace, billscale?: Polymesh.shadowBillSize, img?: Image) {
        if (this.isDel()) return
        if (Polymesh.isOutOfRange(idx, this.faces.length + 1)) return;
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = img;
        else this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = null;
        this.upd_faceImg(idx, 2)
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
        if (this.isDel()) return
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(img);
        else this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(null);
        this.upd_faceImg(this.faces_img.length - 1, 2)
    }

    //% blockId=poly_face_del
    //% blockNamespace=Polymesh
    //% block=" $this remove face|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=9
    delFace(idx?: number) {
        if (this.isDel()) return
        if (idx) this.faces_indices.removeAt(idx), this.faces_color.removeAt(idx), this.faces_offset.removeAt(idx), this.faces_scale.removeAt(idx), this.faces_img.removeAt(idx);// this.faces.removeAt(idx);
        else this.faces_indices.pop(), this.faces_color.pop(), this.faces_offset.pop(), this.faces_scale.pop(), this.faces_img.pop();// this.faces.pop();
    }

    //% blockId=poly_getfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this get face color at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=10
    getFaceColor(idx: number) {
        if (this.isDel()) return NaN
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
        if (this.isDel()) return
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
        if (this.isDel()) return null
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
        if (this.isDel()) return
        if (this.faces_img[idx] && this.faces_img[idx].equals(img)) return;
        this.faces_img[idx] = img
        this.upd_faceImg(idx, 2)
    }

    //% blockId=poly_clearfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this clear face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=6
    clearFaceImage(idx: number) {
        if (this.isDel()) return
        if (!this.faces_img[idx]) return;
        this.faces_img[idx] = null
        this.faces_imgs[idx] = {}
    }

    //% blockId=poly_getfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this get face offset at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceOffset(idx: number) {
        if (this.isDel()) return NaN
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
    setFaceOffset(idx: number, oface: number) {
        if (this.isDel()) return
        if (this.faces_offset[idx] === Fx8(oface)) return;
        this.faces_offset[idx] = Fx8(oface);
    }

    //% blockId=poly_getfacescale
    //% blockNamespace=Polymesh
    //% block=" $this get face scale at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceScale(idx: number) {
        if (this.isDel()) return NaN
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
        if (this.isDel()) return
        if (this.faces_scale[idx] === Fx8(scale)) return;
        this.faces_scale[idx] = Fx8(scale);
    }

    //% blockId=poly_mesh_pivot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=10
    setPivot(choice: PolyPivot, x: number) {
        if (this.isDel()) return
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx8(x)) this.pivot_x = Fx8(x); break;
            case 0x1: if (this.pivot_y !== Fx8(x)) this.pivot_y = Fx8(x); break;
            case 0x2: if (this.pivot_z !== Fx8(x)) this.pivot_z = Fx8(x); break;
        };
    }

    //% blockId=poly_mesh_pivot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=5
    changePivot(choice: PolyPivot, x: number) {
        if (this.isDel()) return
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx.add(this.pivot_x, Fx8(x))) this.pivot_x = Fx.add(this.pivot_x, Fx8(x)); break;
            case 0x1: if (this.pivot_y !== Fx.add(this.pivot_y, Fx8(x))) this.pivot_y = Fx.add(this.pivot_y, Fx8(x)); break;
            case 0x2: if (this.pivot_z !== Fx.add(this.pivot_z, Fx8(x))) this.pivot_z = Fx.add(this.pivot_z, Fx8(x)); break;
        };
    }

    //% blockId=poly_mesh_pivot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=4
    getPivot(choice: PolyPivot) {
        if (this.isDel()) return NaN
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
        if (this.isDel()) return
        Polymesh.setMotion(this.rot, choice, x)
    }

    //% blockId=poly_mesh_rot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=5
    changeAngle(choice: PolyAngle, x: number) {
        if (this.isDel()) return
        Polymesh.changeMotion(this.rot, choice, x)
    }

    //% blockId=poly_mesh_rot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=4
    getAngle(choice: PolyAngle) {
        if (this.isDel()) return NaN
        return Polymesh.getMotion(this.rot, choice)
    }

    //% blockId=poly_mesh_pos_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=10
    setPos(choice: PolyPos, x: number) {
        if (this.isDel()) return
        Polymesh.setMotion(this.pos, choice, x)
    }

    //% blockId=poly_mesh_pos_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=9
    changePos(choice: PolyPos, x: number) {
        if (this.isDel()) return
        Polymesh.changeMotion(this.pos, choice, x)
    }

    //% blockId=poly_mesh_pos_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=8
    getPos(choice: PolyPos) {
        if (this.isDel()) return NaN
        return Polymesh.getMotion(this.pos, choice)
    }

}
