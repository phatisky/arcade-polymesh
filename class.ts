
class polymesh {

    protected __del: boolean;

    protected faces_indices: Fx8[][]; protected faces_color: Fx8[]; protected faces_offset: Fx8[]; protected faces_scale: Fx8[]; protected faces_img: Image[];
    set faces(vals: { indices: number[], color: number, offset?: number, scale?: number, img?: Image }[]) {
        if (this.isDel()) return;
        this.faces_indices = vals.map(vs => vs.indices.map(v => Fx8(v))), this.faces_color = vals.map(v => Fx8(v.color))
        this.faces_offset = vals.map(v => v.offset ? Fx8(v.offset) : Fx8(0)), this.faces_scale = vals.map(v => v.scale ? Fx8(v.scale) : Fx8(1))
        this.faces_img = vals.map(v => v.img ? v.img : null)
    }
    get faces() {
        if (this.isDel()) return null
        return this.faces_indices.map((_, i) => ({
            indices: this.faces_indices[i].map(v => Fx.toFloat(v)), color: Fx.toInt(this.faces_color[i]),
            offset: Fx.toInt(this.faces_offset[i]), scale: Fx.toFloat(this.faces_scale[i]), img: this.faces_img[i],
        }))
    }

    protected points_xs: Fx8[]; protected points_ys: Fx8[]; protected points_zs: Fx8[];
    set points(vals: { x: number, y: number, z: number }[]) {
        if (this.isDel()) return;
        this.points_xs = vals.map(v => Fx8(v.x)), this.points_ys = vals.map(v => Fx8(v.y)), this.points_zs = vals.map(v => Fx8(v.z))
    }
    get points() {
        if (this.isDel()) return null
        return this.points_xs.map((_, i) => ({
            x: Fx.toFloat(this.points_xs[i]),
            y: Fx.toFloat(this.points_ys[i]),
            z: Fx.toFloat(this.points_zs[i]),
        }))
    }

    protected pivot_x: Fx8; protected pivot_y: Fx8; protected pivot_z: Fx8;
    set pivot(v: { x: number, y: number, z: number }) { if (this.isDel()) return; this.pivot_x = Fx8(v.x), this.pivot_y = Fx8(v.y), this.pivot_z = Fx8(v.z) }
    get pivot() { if (this.isDel()) return null; return { x: Fx.toFloat(this.pivot_x), y: Fx.toFloat(this.pivot_y), z: Fx.toFloat(this.pivot_z) } }

    protected rot_x: Fx8; protected rot_y: Fx8; protected rot_z: Fx8;
    protected rot_vx: Fx8; protected rot_vy: Fx8; protected rot_vz: Fx8;
    protected rot_ax: Fx8; protected rot_ay: Fx8; protected rot_az: Fx8;
    protected rot_fx: Fx8; protected rot_fy: Fx8; protected rot_fz: Fx8;
    set rot(v: {
        x: number, y: number, z: number,
        vx: number, vy: number, vz: number,
        ax: number, ay: number, az: number,
        fx: number, fy: number, fz: number
    }) {
        if (this.isDel()) return;
        if (this.rot_x !== Fx8(v.x)) this.rot_x = Fx8(v.x);
        if (this.rot_y !== Fx8(v.y)) this.rot_y = Fx8(v.y);
        if (this.rot_z !== Fx8(v.z)) this.rot_z = Fx8(v.z);
        if (this.rot_vx !== Fx8(v.vx)) this.rot_vx = Fx8(v.vx);
        if (this.rot_vy !== Fx8(v.vy)) this.rot_vy = Fx8(v.vy);
        if (this.rot_vz !== Fx8(v.vz)) this.rot_vz = Fx8(v.vz);
        if (this.rot_ax !== Fx8(v.ax)) this.rot_ax = Fx8(v.ax);
        if (this.rot_ay !== Fx8(v.ay)) this.rot_ay = Fx8(v.ay);
        if (this.rot_az !== Fx8(v.az)) this.rot_az = Fx8(v.az);
        if (this.rot_fx !== Fx8(v.fx)) this.rot_fx = Fx8(v.fx);
        if (this.rot_fy !== Fx8(v.fy)) this.rot_fy = Fx8(v.fy);
        if (this.rot_fz !== Fx8(v.fz)) this.rot_fz = Fx8(v.fz);
    }
    get rot() {
        if (this.isDel()) return null
        return {
            x: Fx.toFloat(this.rot_x), y: Fx.toFloat(this.rot_y), z: Fx.toFloat(this.rot_z),
            vx: Fx.toFloat(this.rot_vx), vy: Fx.toFloat(this.rot_vy), vz: Fx.toFloat(this.rot_vz),
            ax: Fx.toFloat(this.rot_ax), ay: Fx.toFloat(this.rot_ay), az: Fx.toFloat(this.rot_az),
            fx: Fx.toFloat(this.rot_fx), fy: Fx.toFloat(this.rot_fy), fz: Fx.toFloat(this.rot_fz),
        }
    }

    protected pos_x: Fx8; protected pos_y: Fx8; protected pos_z: Fx8;
    protected pos_vx: Fx8; protected pos_vy: Fx8; protected pos_vz: Fx8;
    protected pos_ax: Fx8; protected pos_ay: Fx8; protected pos_az: Fx8;
    protected pos_fx: Fx8; protected pos_fy: Fx8; protected pos_fz: Fx8;
    set pos(v: {
        x: number, y: number, z: number,
        vx: number, vy: number, vz: number,
        ax: number, ay: number, az: number,
        fx: number, fy: number, fz: number
    }) {
        if (this.isDel()) return;
        if (this.pos_x !== Fx8(v.x)) this.pos_x = Fx8(v.x);
        if (this.pos_y !== Fx8(v.y)) this.pos_y = Fx8(v.y);
        if (this.pos_z !== Fx8(v.z)) this.pos_z = Fx8(v.z);
        if (this.pos_vx !== Fx8(v.vx)) this.pos_vx = Fx8(v.vx);
        if (this.pos_vy !== Fx8(v.vy)) this.pos_vy = Fx8(v.vy);
        if (this.pos_vz !== Fx8(v.vz)) this.pos_vz = Fx8(v.vz);
        if (this.pos_ax !== Fx8(v.ax)) this.pos_ax = Fx8(v.ax);
        if (this.pos_ay !== Fx8(v.ay)) this.pos_ay = Fx8(v.ay);
        if (this.pos_az !== Fx8(v.az)) this.pos_az = Fx8(v.az);
        if (this.pos_fx !== Fx8(v.fx)) this.pos_fx = Fx8(v.fx);
        if (this.pos_fy !== Fx8(v.fy)) this.pos_fy = Fx8(v.fy);
        if (this.pos_fz !== Fx8(v.fz)) this.pos_fz = Fx8(v.fz);
    }
    get pos() {
        if (this.isDel()) return null
        return {
            x: Fx.toFloat(this.pos_x), y: Fx.toFloat(this.pos_y), z: Fx.toFloat(this.pos_z),
            vx: Fx.toFloat(this.pos_vx), vy: Fx.toFloat(this.pos_vy), vz: Fx.toFloat(this.pos_vz),
            ax: Fx.toFloat(this.pos_ax), ay: Fx.toFloat(this.pos_ay), az: Fx.toFloat(this.pos_az),
            fx: Fx.toFloat(this.pos_fx), fy: Fx.toFloat(this.pos_fy), fz: Fx.toFloat(this.pos_fz),
        }
    }

    flag: { invisible: boolean, noncull: boolean, lod: boolean }
    __home__() {
        forever(() => {
            if (this.isDel()) return;
            const delta = Fx8(control.eventContext().deltaTime)

            // Acceleration angle of this mesh
            if (this.rot_ax !== Fx8(0)) this.rot_vx = Fx.add(this.rot_vx, Fx.mul(this.rot_ax, delta))
            if (this.rot_ay !== Fx8(0)) this.rot_vy = Fx.add(this.rot_vy, Fx.mul(this.rot_ay, delta))
            if (this.rot_az !== Fx8(0)) this.rot_vz = Fx.add(this.rot_vz, Fx.mul(this.rot_az, delta))

            // Friction angle of this mesh
            if (this.rot_fx !== Fx8(0)) this.rot_vx = this.rot_vx < Fx8(0) ? Fx.min(Fx.add(this.rot_vx, Fx.mul(Fx.abs(this.rot_fx), delta)), Fx8(0)) : Fx.max(Fx.sub(this.rot_vx, Fx.mul(Fx.abs(this.rot_fx), delta)), Fx8(0))
            if (this.rot_fy !== Fx8(0)) this.rot_vy = this.rot_vy < Fx8(0) ? Fx.min(Fx.add(this.rot_vy, Fx.mul(Fx.abs(this.rot_fy), delta)), Fx8(0)) : Fx.max(Fx.sub(this.rot_vy, Fx.mul(Fx.abs(this.rot_fy), delta)), Fx8(0))
            if (this.rot_fz !== Fx8(0)) this.rot_vz = this.rot_vz < Fx8(0) ? Fx.min(Fx.add(this.rot_vz, Fx.mul(Fx.abs(this.rot_fz), delta)), Fx8(0)) : Fx.max(Fx.sub(this.rot_vz, Fx.mul(Fx.abs(this.rot_fz), delta)), Fx8(0))

            // Velocity angle of this mesh
            if (this.rot_vx !== Fx8(0)) this.rot_x = Fx.add(this.rot_x, Fx.mul(this.rot_vx, delta));
            if (this.rot_vy !== Fx8(0)) this.rot_y = Fx.add(this.rot_y, Fx.mul(this.rot_vy, delta));
            if (this.rot_vz !== Fx8(0)) this.rot_z = Fx.add(this.rot_z, Fx.mul(this.rot_vz, delta));

            // Acceleration position of this mesh
            if (this.pos_ax !== Fx8(0)) this.pos_vx = Fx.add(this.pos_vx, Fx.mul(this.pos_ax, delta))
            if (this.pos_ay !== Fx8(0)) this.pos_vy = Fx.add(this.pos_vy, Fx.mul(this.pos_ay, delta))
            if (this.pos_az !== Fx8(0)) this.pos_vz = Fx.add(this.pos_vz, Fx.mul(this.pos_az, delta))

            // Friction position of this mesh
            if (this.pos_fx !== Fx8(0)) this.pos_vx = this.pos_vx < Fx8(0) ? Fx.min(Fx.add(this.pos_vx, Fx.mul(Fx.abs(this.pos_fx), delta)), Fx8(0)) : Fx.max(Fx.sub(this.pos_vx, Fx.mul(Fx.abs(this.pos_fx), delta)), Fx8(0))
            if (this.pos_fy !== Fx8(0)) this.pos_vy = this.pos_vy < Fx8(0) ? Fx.min(Fx.add(this.pos_vy, Fx.mul(Fx.abs(this.pos_fy), delta)), Fx8(0)) : Fx.max(Fx.sub(this.pos_vy, Fx.mul(Fx.abs(this.pos_fy), delta)), Fx8(0))
            if (this.pos_fz !== Fx8(0)) this.pos_vz = this.pos_vz < Fx8(0) ? Fx.min(Fx.add(this.pos_vz, Fx.mul(Fx.abs(this.pos_fz), delta)), Fx8(0)) : Fx.max(Fx.sub(this.pos_vz, Fx.mul(Fx.abs(this.pos_fz), delta)), Fx8(0))

            // Velocity position of this mesh
            if (this.pos_vx !== Fx8(0)) this.pos_x = Fx.add(this.pos_x, Fx.mul(this.pos_vx, delta));
            if (this.pos_vy !== Fx8(0)) this.pos_y = Fx.add(this.pos_y, Fx.mul(this.pos_vy, delta));
            if (this.pos_vz !== Fx8(0)) this.pos_z = Fx.add(this.pos_z, Fx.mul(this.pos_vz, delta));
        })
    }

    constructor() {
        this.faces = [];
        this.points = [];
        this.pivot = { x: 0, y: 0, z: 0 };
        this.rot = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
        this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
        this.flag = { invisible: false, noncull: false, lod: false };
        this.__del = false;
        this.__home__();
    }

    //% blockId=poly_dist_del
    //% blockNamespace=Polymesh
    //% block="delete $this"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=15
    public del() {
        this.__del = true;
        this.faces = null, this.points = null, this.pivot = null;
        this.rot = null, this.pos = null, this.flag = null;
    }

    //% blockId=poly_dist_isdel
    //% blockNamespace=Polymesh
    //% block=" $this is deleted"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=13
    public isDel() {
        return this.__del
    }

    //% blockId=poly_dist_zdist
    //% blockNamespace=Polymesh
    //% block=" $this get view distance"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=7
    public zDist() {
        return Polymesh.meshDistZ(this) * Polymesh.XDIST
    }

    //% blockId=poly_dist_zdepth
    //% blockNamespace=Polymesh
    //% block=" $this as Z of depth"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=6
    public zDepth() {
        return Polymesh.meshDepthZ(this)
    }

    //% blockId=poly_dist_camera
    //% blockNamespace=Polymesh
    //% block=" $this get distance from camera"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh util"
    //% weight=8
    public distFromCamera() {
        const distPos = { x: Polymesh.camx - this.pos.x, y: Polymesh.camy - this.pos.y, z: Polymesh.camz - this.pos.z }
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
    public distBetween(otherMesh: polymesh) {
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
    public normalSpeed() {
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
    public setFlag(flag: MeshFlags, ok: boolean) {
        switch (flag) {
            case 0x0: default: this.flag.invisible = ok; break
            case 0x1:          this.flag.noncull   = ok; break
            case 0x2:          this.flag.lod       = ok; break
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
    public setVertice(idx: number, point3: Polymesh.shadowPoint3) {
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
    public addVertice(point3: Polymesh.shadowPoint3) {
        this.points_xs.push(Fx8(point3.x)), this.points_ys.push(Fx8(point3.y)), this.points_zs.push(Fx8(point3.z));// this.points.push({ x: point3.x, y: point3.y, z: point3.z })
    }

    //% blockId=poly_vertice_del
    //% blockNamespace=Polymesh
    //% block=" $this remove vertice|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=10
    public delVertice(idx?: number) {
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
    public setFace(idx: number, c: number, inds: Polymesh.shadowIndices, clface?: Polymesh.shadowOffsetFace, billscale?: Polymesh.shadowBillSize, img?: Image) {
        if (Polymesh.isOutOfRange(idx, this.faces.length + 1)) return;
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = img;
        else this.faces_indices[idx] = indice, this.faces_color[idx] = Fx8(c), this.faces_offset[idx] = Fx8(clface.oface), this.faces_scale[idx] = Fx8(billscale.scale), this.faces_img[idx] = null;
        // const indice = [inds.i1]
        // if (inds.i2) indice.push(inds.i2);
        // if (inds.i3) indice.push(inds.i3);
        // if (inds.i4) indice.push(inds.i4);
        // if (img) this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img };
        // else this.faces[idx] = { indices: indice, color: c, offset: clface.oface, scale: billscale.scale };
    }

    //% blockId=poly_face_add
    //% blockNamespace=Polymesh
    //% block=" $this add face to color $c=colorindexpicker and $inds|| $clface=poly_shadow_offsetface $billscale=poly_shadow_billscale and texture $img=screen_image_picker"
    //% inds.shadow=poly_shadow_indices
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh property"
    //% weight=7
    public addFace(c: number, inds: Polymesh.shadowIndices, clface?: Polymesh.shadowOffsetFace, billscale?: Polymesh.shadowBillSize, img?: Image) {
        if (!billscale) billscale = new Polymesh.shadowBillSize(1)
        if (!clface) clface = new Polymesh.shadowOffsetFace(0)
        const indice = [Fx8(inds.i1)]
        if (inds.i2) indice.push(Fx8(inds.i2));
        if (inds.i3) indice.push(Fx8(inds.i3));
        if (inds.i4) indice.push(Fx8(inds.i4));
        if (img) this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(img);
        else this.faces_indices.push(indice), this.faces_color.push(Fx8(c)), this.faces_offset.push(Fx8(clface.oface)), this.faces_scale.push(Fx8(billscale.scale)), this.faces_img.push(null);
        // const indice = [inds.i1]
        // if (inds.i2) indice.push(inds.i2);
        // if (inds.i3) indice.push(inds.i3);
        // if (inds.i4) indice.push(inds.i4);
        // if (img) this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale, img: img });
        // else this.faces.push({ indices: indice, color: c, offset: clface.oface, scale: billscale.scale });
    }

    //% blockId=poly_face_del
    //% blockNamespace=Polymesh
    //% block=" $this remove face|| at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh remover"
    //% weight=9
    public delFace(idx?: number) {
        if (idx) this.faces_indices.removeAt(idx), this.faces_color.removeAt(idx), this.faces_offset.removeAt(idx), this.faces_scale.removeAt(idx), this.faces_img.removeAt(idx);// this.faces.removeAt(idx);
        else this.faces_indices.pop(), this.faces_color.pop(), this.faces_offset.pop(), this.faces_scale.pop(), this.faces_img.pop();// this.faces.pop();
    }

    //% blockId=poly_getfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this get face color at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=10
    public getFaceColor(idx: number) {
        if (!this.faces_color[idx]) return NaN
        return Fx.toInt(this.faces_color[idx])
    }

    //% blockId=poly_setfacecolor
    //% blockNamespace=Polymesh
    //% block=" $this set face color at $idx to $c=colorindexpicker"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=9
    public setFaceColor(idx: number, c: number) {
        if (this.faces_color[idx] === Fx8(c)) return;
        this.faces_color[idx] = Fx8(c)
    }

    //% blockId=poly_getfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this get face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=8
    public getFaceImage(idx: number) {
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
    public setFaceImage(idx: number, img: Image) {
        if (this.faces_img[idx] && this.faces_img[idx].equals(img)) return;
        this.faces_img[idx] = img
    }

    //% blockId=poly_clearfaceimage
    //% blockNamespace=Polymesh
    //% block=" $this clear face image at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=6
    public clearFaceImage(idx: number) {
        if (!this.faces_img[idx]) return;
        this.faces_img[idx] = null
    }

    //% blockId=poly_getfaceoffset
    //% blockNamespace=Polymesh
    //% block=" $this get face offset at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    public getFaceOffset(idx: number) {
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
    public setFaceOffset(idx: number, oface: number) {
        if (this.faces_offset[idx] === Fx8(oface)) return;
        this.faces_offset[idx] = Fx8(oface)
    }

    //% blockId=poly_getfacescale
    //% blockNamespace=Polymesh
    //% block=" $this get face scale at $idx"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=5
    public getFaceScale(idx: number) {
        if (!this.faces_scale[idx]) return NaN
        return Fx.toFloat(this.faces_scale[idx])
    }

    //% blockId=poly_setfacescale
    //% blockNamespace=Polymesh
    //% block=" $this set face scale at $idx to $scale"
    //% oface.min=-1 oface.max=1
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh face property"
    //% weight=4
    public setFaceScale(idx: number, scale: number) {
        if (this.faces_scale[idx] === Fx8(scale)) return;
        this.faces_scale[idx] = Fx8(scale)
    }

    //% blockId=poly_mesh_pivot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=10
    public setPivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx8(x)) this.pivot_x = Fx8(x); break
            case 0x1: if (this.pivot_y !== Fx8(x)) this.pivot_y = Fx8(x); break
            case 0x2: if (this.pivot_z !== Fx8(x)) this.pivot_z = Fx8(x); break
        }
    }

    //% blockId=poly_mesh_pivot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=5
    public changePivot(choice: PolyPivot, x: number) {
        switch (choice) {
            case 0x0: if (this.pivot_x !== Fx.add(this.pivot_x, Fx8(x))) this.pivot_x = Fx.add(this.pivot_x, Fx8(x)); break
            case 0x1: if (this.pivot_y !== Fx.add(this.pivot_y, Fx8(x))) this.pivot_y = Fx.add(this.pivot_y, Fx8(x)); break
            case 0x2: if (this.pivot_z !== Fx.add(this.pivot_z, Fx8(x))) this.pivot_z = Fx.add(this.pivot_z, Fx8(x)); break
        }
    }

    //% blockId=poly_mesh_pivot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh pivot"
    //% weight=4
    public getPivot(choice: PolyPivot) {
        switch (choice) {
            case 0x0: return Fx.toFloat(this.pivot_x)
            case 0x1: return Fx.toFloat(this.pivot_y)
            case 0x2: return Fx.toFloat(this.pivot_z)
        }
        return NaN
    }

    //% blockId=poly_mesh_rot_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=100
    public setAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (this.rot_x  !== Fx8(x)) this.rot_x  = Fx8(x); break
            case 0x1: if (this.rot_y  !== Fx8(x)) this.rot_y  = Fx8(x); break
            case 0x2: if (this.rot_z  !== Fx8(x)) this.rot_z  = Fx8(x); break
            case 0x3: if (this.rot_vx !== Fx8(x)) this.rot_vx = Fx8(x); break
            case 0x4: if (this.rot_vy !== Fx8(x)) this.rot_vy = Fx8(x); break
            case 0x5: if (this.rot_vz !== Fx8(x)) this.rot_vz = Fx8(x); break
            case 0x6: if (this.rot_ax !== Fx8(x)) this.rot_ax = Fx8(x); break
            case 0x7: if (this.rot_ay !== Fx8(x)) this.rot_ay = Fx8(x); break
            case 0x8: if (this.rot_az !== Fx8(x)) this.rot_az = Fx8(x); break
            case 0x9: if (this.rot_fx !== Fx8(x)) this.rot_fx = Fx8(x); break
            case 0xA: if (this.rot_fy !== Fx8(x)) this.rot_fy = Fx8(x); break
            case 0xB: if (this.rot_fz !== Fx8(x)) this.rot_fz = Fx8(x); break
        }
    }

    //% blockId=poly_mesh_rot_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=5
    public changeAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (this.rot_x  !== Fx.add(this.rot_x , Fx8(x))) this.rot_x  = Fx.add(this.rot_x , Fx8(x)); break
            case 0x1: if (this.rot_y  !== Fx.add(this.rot_y , Fx8(x))) this.rot_y  = Fx.add(this.rot_y , Fx8(x)); break
            case 0x2: if (this.rot_z  !== Fx.add(this.rot_z , Fx8(x))) this.rot_z  = Fx.add(this.rot_z , Fx8(x)); break
            case 0x3: if (this.rot_vx !== Fx.add(this.rot_vx, Fx8(x))) this.rot_vx = Fx.add(this.rot_vx, Fx8(x)); break
            case 0x4: if (this.rot_vy !== Fx.add(this.rot_vy, Fx8(x))) this.rot_vy = Fx.add(this.rot_vy, Fx8(x)); break
            case 0x5: if (this.rot_vz !== Fx.add(this.rot_vz, Fx8(x))) this.rot_vz = Fx.add(this.rot_vz, Fx8(x)); break
            case 0x6: if (this.rot_ax !== Fx.add(this.rot_ax, Fx8(x))) this.rot_ax = Fx.add(this.rot_ax, Fx8(x)); break
            case 0x7: if (this.rot_ay !== Fx.add(this.rot_ay, Fx8(x))) this.rot_ay = Fx.add(this.rot_ay, Fx8(x)); break
            case 0x8: if (this.rot_az !== Fx.add(this.rot_az, Fx8(x))) this.rot_az = Fx.add(this.rot_az, Fx8(x)); break
            case 0x9: if (this.rot_fx !== Fx.add(this.rot_fx, Fx8(x))) this.rot_fx = Fx.add(this.rot_fx, Fx8(x)); break
            case 0xA: if (this.rot_fy !== Fx.add(this.rot_fy, Fx8(x))) this.rot_fy = Fx.add(this.rot_fy, Fx8(x)); break
            case 0xB: if (this.rot_fz !== Fx.add(this.rot_fz, Fx8(x))) this.rot_fz = Fx.add(this.rot_fz, Fx8(x)); break
        }
    }

    //% blockId=poly_mesh_rot_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh angle"
    //% weight=4
    public getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0x0: return Fx.toFloat(this.rot_x)
            case 0x1: return Fx.toFloat(this.rot_y)
            case 0x2: return Fx.toFloat(this.rot_z)
            case 0x3: return Fx.toFloat(this.rot_vx)
            case 0x4: return Fx.toFloat(this.rot_vy)
            case 0x5: return Fx.toFloat(this.rot_vz)
            case 0x6: return Fx.toFloat(this.rot_ax)
            case 0x7: return Fx.toFloat(this.rot_ay)
            case 0x8: return Fx.toFloat(this.rot_az)
            case 0x9: return Fx.toFloat(this.rot_fx)
            case 0xA: return Fx.toFloat(this.rot_fy)
            case 0xB: return Fx.toFloat(this.rot_fz)
        }
        return NaN
    }

    //% blockId=poly_mesh_pos_set
    //% blockNamespace=Polymesh
    //% block=" $this set $choice to $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=10
    public setPos(choice: PolyPos, x: number) {
        switch (choice) {
            case 0x0: if (this.pos_x  !== Fx8(x)) this.pos_x  = Fx8(x); break
            case 0x1: if (this.pos_y  !== Fx8(x)) this.pos_y  = Fx8(x); break
            case 0x2: if (this.pos_z  !== Fx8(x)) this.pos_z  = Fx8(x); break
            case 0x3: if (this.pos_vx !== Fx8(x)) this.pos_vx = Fx8(x); break
            case 0x4: if (this.pos_vy !== Fx8(x)) this.pos_vy = Fx8(x); break
            case 0x5: if (this.pos_vz !== Fx8(x)) this.pos_vz = Fx8(x); break
            case 0x6: if (this.pos_ax !== Fx8(x)) this.pos_ax = Fx8(x); break
            case 0x7: if (this.pos_ay !== Fx8(x)) this.pos_ay = Fx8(x); break
            case 0x8: if (this.pos_az !== Fx8(x)) this.pos_az = Fx8(x); break
            case 0x9: if (this.pos_fx !== Fx8(x)) this.pos_fx = Fx8(x); break
            case 0xA: if (this.pos_fy !== Fx8(x)) this.pos_fy = Fx8(x); break
            case 0xB: if (this.pos_fz !== Fx8(x)) this.pos_fz = Fx8(x); break
        }
    }

    //% blockId=poly_mesh_pos_change
    //% blockNamespace=Polymesh
    //% block=" $this change $choice by $x"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=9
    public changePos(choice: PolyPos, x: number) {
        switch (choice) {
            case 0x0: if (this.pos_x  !== Fx.add(this.pos_x , Fx8(x))) this.pos_x  = Fx.add(this.pos_x , Fx8(x)); break
            case 0x1: if (this.pos_y  !== Fx.add(this.pos_y , Fx8(x))) this.pos_y  = Fx.add(this.pos_y , Fx8(x)); break
            case 0x2: if (this.pos_z  !== Fx.add(this.pos_z , Fx8(x))) this.pos_z  = Fx.add(this.pos_z , Fx8(x)); break
            case 0x3: if (this.pos_vx !== Fx.add(this.pos_vx, Fx8(x))) this.pos_vx = Fx.add(this.pos_vx, Fx8(x)); break
            case 0x4: if (this.pos_vy !== Fx.add(this.pos_vy, Fx8(x))) this.pos_vy = Fx.add(this.pos_vy, Fx8(x)); break
            case 0x5: if (this.pos_vz !== Fx.add(this.pos_vz, Fx8(x))) this.pos_vz = Fx.add(this.pos_vz, Fx8(x)); break
            case 0x6: if (this.pos_ax !== Fx.add(this.pos_ax, Fx8(x))) this.pos_ax = Fx.add(this.pos_ax, Fx8(x)); break
            case 0x7: if (this.pos_ay !== Fx.add(this.pos_ay, Fx8(x))) this.pos_ay = Fx.add(this.pos_ay, Fx8(x)); break
            case 0x8: if (this.pos_az !== Fx.add(this.pos_az, Fx8(x))) this.pos_az = Fx.add(this.pos_az, Fx8(x)); break
            case 0x9: if (this.pos_fx !== Fx.add(this.pos_fx, Fx8(x))) this.pos_fx = Fx.add(this.pos_fx, Fx8(x)); break
            case 0xA: if (this.pos_fy !== Fx.add(this.pos_fy, Fx8(x))) this.pos_fy = Fx.add(this.pos_fy, Fx8(x)); break
            case 0xB: if (this.pos_fz !== Fx.add(this.pos_fz, Fx8(x))) this.pos_fz = Fx.add(this.pos_fz, Fx8(x)); break
        }
    }

    //% blockId=poly_mesh_pos_get
    //% blockNamespace=Polymesh
    //% block=" $this get $choice"
    //% this.shadow=variables_get this.defl=myMesh
    //% group="Mesh position property"
    //% weight=8
    public getPos(choice: PolyPos) {
        switch (choice) {
            case 0x0: return Fx.toFloat(this.pos_x)
            case 0x1: return Fx.toFloat(this.pos_y)
            case 0x2: return Fx.toFloat(this.pos_z)
            case 0x3: return Fx.toFloat(this.pos_vx)
            case 0x4: return Fx.toFloat(this.pos_vy)
            case 0x5: return Fx.toFloat(this.pos_vz)
            case 0x6: return Fx.toFloat(this.pos_ax)
            case 0x7: return Fx.toFloat(this.pos_ay)
            case 0x8: return Fx.toFloat(this.pos_az)
            case 0x9: return Fx.toFloat(this.pos_fx)
            case 0xA: return Fx.toFloat(this.pos_fy)
            case 0xB: return Fx.toFloat(this.pos_fz)
        }
        return NaN
    }

}
