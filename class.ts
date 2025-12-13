
class polymesh {

    data: {[id: string]: any};
    protected __del: boolean; protected __prop_upd: control.FrameCallback; kind: number; idx: number;
    private zeroF: Fx8 = Fx8(0); private oneF: Fx8 = Fx8(1);

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

    protected createFacesImgLODcache() {
        this.faces_imgs = this.faces.map(_ => ({}))
    }

    protected updImgLodCache() {
        if (!this.flag.lod) return;
        const imgNewData = this.faces_imgs.filter((v, i) => {
            const cimg = this.faces[i].img
            if (!cimg) return false;
            const imgh = Polymesh.hashImage(cimg)
            return !v[imgh];
        })
        if (imgNewData.length <= 0) return;
        const imgNewDataInds = imgNewData.map((_, i) => i)
        while (imgNewDataInds.length > 0) this.updFaceImg(imgNewDataInds.pop());
    }

    protected updImgLodCacheSlot() {
        if (!this.flag.lod) return;
        if (this.faces_imgs.length === this.faces.length) return;
        const newLODcache = this.faces.map((v, i) => {
            if (!v.img) return {};
            if (this.faces_imgs[i]) return this.faces_imgs[i];
            return {};
        });
        this.faces_imgs = newLODcache
    }

    protected updFaceImg(idx: number, im?: Image) {
        const cimg = im ? im : (this.faces[idx].img ? this.faces[idx].img : null);
        if (!cimg) return;
        const square = Polymesh.gcd(cimg.width, cimg.height)
        const imgh = Polymesh.hashImage(cimg)
        if (!this.faces_imgs[idx]) this.faces_imgs[idx] = {}
        else if (this.faces_imgs[idx][imgh] && this.faces_imgs[idx][imgh][this.faces_imgs[idx][imgh].length - 1].equals(cimg)) return;
        this.faces_imgs[idx][imgh] = [];
        if (Polymesh.isEmptyImage(cimg)) {
            this.faces_imgs[idx][imgh].push(image.create(cimg.width, cimg.height));
            return;
        }
        let img = image.create(1, 1), scale = 0.2;
        while (img.width < cimg.width || img.height < cimg.height) {
            Polymesh.resizeImage(cimg.clone(), img, true);
            this.faces_imgs[idx][imgh].push(img.clone());
            const scaleD = scale;
            img = image.create(Math.max(1, Math.trunc(scaleD * cimg.width)), Math.max(1, Math.trunc(scaleD * cimg.height)));
            scale *= square * (scale * 7.95);
        } this.faces_imgs[idx][imgh].push(cimg.clone());
    }

    faces: Polymesh.Face[];

    protected faces_imgs: {[imgh: string]: Image[]}[]; protected faces_imgs_cache_ref: {[imgh: string]: number};
    get vfaces(): Polymesh.FaceLOD[] {
        if (this.isDel()) return null
        return this.faces.map((v, i) => {
            if (v.img) return {
                    indices: v.indices, color: v.color,
                    offset: v.offset, scale: v.scale,
                    img: v.img, imgs: this.faces_imgs[i][Polymesh.hashImage(v.img)] ? this.faces_imgs[i][Polymesh.hashImage(v.img)] : [v.img]
                };
            return {
                indices: v.indices, color: v.color,
                offset: v.offset, scale: v.scale
            }
        })
    }

    points: Polymesh.Vector3[]; pivot: Polymesh.Vector3; flag: { invisible: boolean, noncull: boolean, lod: boolean }

    protected rot_x:  Fx8; protected rot_y:  Fx8; protected rot_z:  Fx8;
    protected rot_vx: Fx8; protected rot_vy: Fx8; protected rot_vz: Fx8;
    protected rot_ax: Fx8; protected rot_ay: Fx8; protected rot_az: Fx8;
    protected rot_fx: Fx8; protected rot_fy: Fx8; protected rot_fz: Fx8;

    set rot(v: Polymesh.Motion3) {
        if (!v || v == null) {
            this.rot_x  = null; this.rot_y  = null; this.rot_z  = null;
            this.rot_vx = null; this.rot_vy = null; this.rot_vz = null;
            this.rot_ax = null; this.rot_ay = null; this.rot_az = null;
            this.rot_fx = null; this.rot_fy = null; this.rot_fz = null;
            return
        }
        this.rot_x  = Fx8(v.x) ; this.rot_y  = Fx8(v.y) ; this.rot_z  = Fx8(v.z) ;
        this.rot_vx = Fx8(v.vx); this.rot_vy = Fx8(v.vy); this.rot_vz = Fx8(v.vz);
        this.rot_ax = Fx8(v.vx); this.rot_ay = Fx8(v.vy); this.rot_az = Fx8(v.vz);
        this.rot_fx = Fx8(v.vx); this.rot_fy = Fx8(v.vy); this.rot_fz = Fx8(v.vz);
    }

    get rot(): Polymesh.Motion3 {
        return {
            x:  Fx.toFloat(this.rot_x) , y:  Fx.toFloat(this.rot_y) , z:  Fx.toFloat(this.rot_z) ,
            vx: Fx.toFloat(this.rot_vx), vy: Fx.toFloat(this.rot_vy), vz: Fx.toFloat(this.rot_vz),
            ax: Fx.toFloat(this.rot_ax), ay: Fx.toFloat(this.rot_ay), az: Fx.toFloat(this.rot_az),
            fx: Fx.toFloat(this.rot_fx), fy: Fx.toFloat(this.rot_fy), fz: Fx.toFloat(this.rot_fz),
        }
    }

    protected pos_x:  Fx8; protected pos_y:  Fx8; protected pos_z:  Fx8;
    protected pos_vx: Fx8; protected pos_vy: Fx8; protected pos_vz: Fx8;
    protected pos_ax: Fx8; protected pos_ay: Fx8; protected pos_az: Fx8;
    protected pos_fx: Fx8; protected pos_fy: Fx8; protected pos_fz: Fx8;

    set pos(v: Polymesh.Motion3) {
        if (!v || v == null) {
            this.pos_x  = null; this.pos_y  = null; this.pos_z  = null;
            this.pos_vx = null; this.pos_vy = null; this.pos_vz = null;
            this.pos_ax = null; this.pos_ay = null; this.pos_az = null;
            this.pos_fx = null; this.pos_fy = null; this.pos_fz = null;
            return
        }
        this.pos_x  = Fx8(v.x) ; this.pos_y  = Fx8(v.y) ; this.pos_z  = Fx8(v.z) ;
        this.pos_vx = Fx8(v.vx); this.pos_vy = Fx8(v.vy); this.pos_vz = Fx8(v.vz);
        this.pos_ax = Fx8(v.vx); this.pos_ay = Fx8(v.vy); this.pos_az = Fx8(v.vz);
        this.pos_fx = Fx8(v.vx); this.pos_fy = Fx8(v.vy); this.pos_fz = Fx8(v.vz);
    }

    get pos(): Polymesh.Motion3 {
        return {
            x:  Fx.toFloat(this.pos_x) , y:  Fx.toFloat(this.pos_y) , z:  Fx.toFloat(this.pos_z) ,
            vx: Fx.toFloat(this.pos_vx), vy: Fx.toFloat(this.pos_vy), vz: Fx.toFloat(this.pos_vz),
            ax: Fx.toFloat(this.pos_ax), ay: Fx.toFloat(this.pos_ay), az: Fx.toFloat(this.pos_az),
            fx: Fx.toFloat(this.pos_fx), fy: Fx.toFloat(this.pos_fy), fz: Fx.toFloat(this.pos_fz),
        }
    }

    pointCam<T>(f: (v: Polymesh.Vector3) => T|Polymesh.Vector3) {
        return this.points.map(v => {
            const vpoint = { x: this.pos.x + v.x, y: this.pos.y + v.y, z: this.pos.z + v.z };
            const vpivot = { x: this.pos.x + this.pivot.x, y: this.pos.y + this.pivot.y, z: this.pos.z + this.pivot.z };
            return f(Polymesh.rotatePoint3D(vpoint, vpivot, this.rot));
        })
    }

    protected motionUpdatePos(delta: Fx8) {
        // Acceleration of position
        if (this.pos_ax !== Fx8(0)) this.pos_vx = Fx.add(this.pos_vx, Fx.mul(this.pos_ax, delta))
        if (this.pos_ay !== Fx8(0)) this.pos_vy = Fx.add(this.pos_vy, Fx.mul(this.pos_ay, delta))
        if (this.pos_az !== Fx8(0)) this.pos_vz = Fx.add(this.pos_vz, Fx.mul(this.pos_az, delta))

        // Friction of position
        if (this.pos_fx !== Fx8(0)) this.pos_vx = Fx.mul(this.pos_vx, Fx.mul(Fx.sub(Fx8(1), this.pos_fx), delta))
        if (this.pos_fy !== Fx8(0)) this.pos_vy = Fx.mul(this.pos_vy, Fx.mul(Fx.sub(Fx8(1), this.pos_fy), delta))
        if (this.pos_fz !== Fx8(0)) this.pos_vz = Fx.mul(this.pos_vz, Fx.mul(Fx.sub(Fx8(1), this.pos_fz), delta))

        // Velocity of position
        if (this.pos_vx !== Fx8(0)) this.pos_x = Fx.add(this.pos_x, Fx.mul(this.pos_vx, delta))
        if (this.pos_vy !== Fx8(0)) this.pos_y = Fx.add(this.pos_y, Fx.mul(this.pos_vy, delta))
        if (this.pos_vz !== Fx8(0)) this.pos_z = Fx.add(this.pos_z, Fx.mul(this.pos_vz, delta))
    }
    protected motionUpdateRot(delta: Fx8) {
        // Acceleration of rotation
        if (this.rot_ax !== Fx8(0)) this.rot_vx = Fx.add(this.rot_vx, Fx.mul(this.rot_ax, delta))
        if (this.rot_ay !== Fx8(0)) this.rot_vy = Fx.add(this.rot_vy, Fx.mul(this.rot_ay, delta))
        if (this.rot_az !== Fx8(0)) this.rot_vz = Fx.add(this.rot_vz, Fx.mul(this.rot_az, delta))

        // Friction of rotation
        if (this.rot_fx !== Fx8(0)) this.rot_vx = Fx.mul(this.rot_vx, Fx.mul(Fx.sub(Fx8(1), this.rot_fx), delta))
        if (this.rot_fy !== Fx8(0)) this.rot_vy = Fx.mul(this.rot_vy, Fx.mul(Fx.sub(Fx8(1), this.rot_fy), delta))
        if (this.rot_fz !== Fx8(0)) this.rot_vz = Fx.mul(this.rot_vz, Fx.mul(Fx.sub(Fx8(1), this.rot_fz), delta))

        // Velocity of rotation
        if (this.rot_vx !== Fx8(0)) this.rot_x = Fx.add(this.rot_x, Fx.mul(this.rot_vx, delta))
        if (this.rot_vy !== Fx8(0)) this.rot_y = Fx.add(this.rot_y, Fx.mul(this.rot_vy, delta))
        if (this.rot_vz !== Fx8(0)) this.rot_z = Fx.add(this.rot_z, Fx.mul(this.rot_vz, delta))
    }

    loop() {
        this.__prop_upd = control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
            const delta = Fx8(control.eventContext().deltaTime)
            this.motionUpdateRot(delta), this.motionUpdatePos(delta);
            this.updImgLodCacheSlot();
            this.updImgLodCache();
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
        this.createFacesImgLODcache();
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
        this.faces_imgs_cache_ref = null, this.faces_imgs = null, this.faces = null, this.points = null, this.pivot = null, this.rot = null, this.pos = null, this.flag = null, this.data = null;
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
        this.points[idx] = { x: point3.x, y: point3.y, z: point3.z }
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
        this.points.push({ x: point3.x, y: point3.y, z: point3.z })
    }

    //% blockId=poly_vertice_del
    //% blockNamespace=Polymesh
    //% block=" $this remove vertice|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=10
    delVertice(idx?: number) {
        if (this.isDel()) return
        if (idx) this.points.removeAt(idx);
        else this.points.pop();
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
        const indice = [inds.i1]
        if (inds.i2) indice.push(inds.i2);
        if (inds.i3) indice.push(inds.i3);
        if (inds.i4) indice.push(inds.i4);
        if (img) this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img.clone() };
        else this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: null }
        this.updFaceImg(idx)
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
        const indice = [inds.i1]
        if (inds.i2) indice.push(inds.i2);
        if (inds.i3) indice.push(inds.i3);
        if (inds.i4) indice.push(inds.i4);
        if (img) this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img.clone() });
        else this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: null });
        this.updFaceImg(this.faces.length - 1)
    }

    //% blockId=poly_face_del
    //% blockNamespace=Polymesh
    //% block=" $this remove face|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=9
    delFace(idx?: number) {
        if (this.isDel()) return
        if (idx) this.faces.removeAt(idx);
        else this.faces.pop();
    }

    //% blockId=poly_getfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this get face color at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=10
    getFaceColor(idx: number) {
        if (this.isDel()) return NaN
        if (!this.faces[idx].color) return NaN
        return this.faces[idx].color
    }

    //% blockId=poly_setfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this set face color at $idx to $c=colorindexpicker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=9
    setFaceColor(idx: number, c: number) {
        if (this.isDel()) return
        if (this.faces[idx].color === c) return;
        this.faces[idx].color = c
    }

    //% blockId=poly_getfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this get face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=8
    getFaceImage(idx: number) {
        if (this.isDel()) return null
        if (!this.faces[idx].img) return null
        return this.faces[idx].img
    }

    //% blockId=poly_setfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this set face image at $idx to $img=screen_image_picker|| and LOD as $imgs=lists_create_with"
    //% imgs.defl=screen_image_picker
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=7
    setFaceImage(idx: number, img: Image, imgs?: Image[]) {
        if (this.isDel()) return
        if (this.faces[idx].img && this.faces[idx].img.equals(img)) return;
        this.faces[idx].img = img
        if (imgs) {
            const imgh = Polymesh.hashImage(img);
            if (this.faces_imgs[idx][imgh]) return;
            else this.faces_imgs[idx] = {};
            this.faces_imgs[idx][imgh] = imgs.slice();
            if (this.faces_imgs[idx][imgh][this.faces_imgs[idx][imgh].length - 1]) this.faces_imgs[idx][imgh][this.faces_imgs[idx][imgh].length - 1] = img.clone();
        } else this.updFaceImg(idx)
    }

    //% blockId=poly_clearfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this clear face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=6
    clearFaceImage(idx: number) {
        if (this.isDel()) return
        if (!this.faces[idx].img) return;
        this.faces[idx].img = null
        this.createFacesImgLODcache();
    }

    //% blockId=poly_getfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this get face offset at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceOffset(idx: number) {
        if (this.isDel()) return NaN
        if (!this.faces[idx].offset) return NaN
        return this.faces[idx].offset
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
        if (this.faces[idx].offset === oface) return;
        this.faces[idx].offset = oface;
    }

    //% blockId=poly_getfacescale
    //% blockNamespace=Polymesh
    //% block=" $this get face scale at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    getFaceScale(idx: number) {
        if (this.isDel()) return NaN
        if (!this.faces[idx].scale) return NaN;
        return this.faces[idx].scale;
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
        if (this.faces[idx].scale === scale) return;
        this.faces[idx].scale = scale;
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
            case 0x0: if (this.pivot.x !== x) this.pivot.x = x; break;
            case 0x1: if (this.pivot.y !== x) this.pivot.y = x; break;
            case 0x2: if (this.pivot.z !== x) this.pivot.z = x; break;
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
            case 0x0: if (this.pivot.x !== (this.pivot.x + x)) this.pivot.x += x; break;
            case 0x1: if (this.pivot.y !== (this.pivot.y + x)) this.pivot.y += x; break;
            case 0x2: if (this.pivot.z !== (this.pivot.z + x)) this.pivot.z += x; break;
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
            case 0x0: this.pivot.x;
            case 0x1: this.pivot.y;
            case 0x2: this.pivot.z;
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
        const obj = this.rot
        if (Polymesh.setMotion(obj, choice, x)) this.rot = obj
    }

    //% blockId=poly_mesh_rot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=5
    changeAngle(choice: PolyAngle, x: number) {
        if (this.isDel()) return
        const obj = this.rot
        if (Polymesh.changeMotion(obj, choice, x)) this.rot = obj
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
        const obj = this.pos
        if (Polymesh.setMotion(obj, choice, x)) this.pos = obj
    }

    //% blockId=poly_mesh_pos_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=9
    changePos(choice: PolyPos, x: number) {
        if (this.isDel()) return
        const obj = this.pos
        if (Polymesh.changeMotion(obj, choice, x)) this.pos = obj
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
