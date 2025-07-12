
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export enum Angles {
        //% block="Angle x"
        AngleX = 0,
        //% block="Angle y"
        AngleY = 1,
        //% block="Angle z"
        AngleZ = 2,
    }
    export enum Cameras {
        //% block="Camera x"
        CamX = 0,
        //% block="Camera y"
        CamY = 1,
        //% block="Camera z"
        CamZ = 2,
        //% block="Camera zoom"
        Zoom = 3,
    }
    export enum PointProp {
        //% block="x"
        x = 0,
        //% block="y"
        y = 1,
        //% block="z"
        z = 2,
        //% block="vx"
        vx = 3,
        //% block="vy"
        vy = 4,
        //% block="vz"
        vz = 5,
    }
    export enum PivotPos {
        //% block="Pivot x"
        PivotX = 0,
        //% block="Pivot y"
        PivotY = 1,
        //% block="Pivot z"
        PivotZ = 2,
    }
    export enum SortingMethods {
        //% block="accurate"
        Accurate = 0,
        //% block="fast"
        Fast = 1,
    }

    //% blockid=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new mesh() }

    export class mesh {
        faces: { indices: number[], color: number, img?: Image }[]
        points: { x: number, y: number, z: number }[]
        pivot: { x: number, y: number, z: number}
        rot: { x: number, y: number, z: number }
        pos: {x: number, y: number, z: number, vx: number, vy: number, vz: number}
        
        home() {
            forever( function() {
                const deltaT = game.currentScene().eventContext.deltaTimeMillis
                if (this.pos.vx !== 0) this.pos.x += this.pos.vx * deltaT
                if (this.pos.vy !== 0) this.pos.y += this.pos.vy * deltaT
                if (this.pos.vz !== 0) this.pos.z += this.pos.vz * deltaT
            })
        }

        constructor() {
            this.faces = [{ indices: [0, 0, 0], color: 0, img: null }]
            this.points = [{ x: 0, y: 0, z: 0 }]
            this.pivot = { x: 0, y: 0, z: 0 }
            this.rot = { x: 0, y: 0, z: 0 }
            this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
        }

        //% blockid=poly_addvertice
        //% block=" $this set vertice at $idx by x: $x y: $y z: $z"
        //% this.shadow=variables_get this.defl=myMesh
        //% ccv.shadow=poly_shadow_vertice
        //% group="mesh property"
        //% weight=10
        public setVertice(idx: number, x: number, y: number, z: number) { this.points[idx] = { x: x, y: y, z: z } }

        //% blockid=poly_setface
        //% block=" $this set face in color $c=colorindexpicker at $idx by idc1 $i1 idc2 $i2|| idc3 $i3 idc4 $i4 and texture $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=9
        public setFace(idx: number, c: number, i1: number, i2: number, i3?: number, i4?: number, img?: Image) {
            let indice = [i1, i2]
            if (i3) indice.push(i3)
            if (i4) indice.push(i4)

            if (indice.length > 3 && img) this.faces[idx] = { indices: indice, color: c, img: img }
            else this.faces[idx] = { indices: indice, color: c }
        }

        //% blockid=poly_delvertice
        //% block=" $this remove vertice at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=8
        public delVertice(idx: number) { this.points.removeAt(idx) }

        //% blockid=poly_delface
        //% block=" $this remove face at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=7
        public delFace(idx: number) { this.faces.removeAt(idx) }

        //% blockid=poly_mesh_pivot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=10
        public setPivot(choice: PivotPos, x: number) {
            switch(choice) {
                case 0: this.pivot.x = x; break
                case 1: this.pivot.y = x; break
                case 2: this.pivot.z = x; break
            }
        }

        //% blockid=poly_mesh_pivot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=5
        public changePivot(choice: PivotPos, x: number) {
            switch (choice) {
                case 0: this.pivot.x += x; break
                case 1: this.pivot.y += x; break
                case 2: this.pivot.z += x; break
            }
        }

        //% blockid=poly_mesh_pivot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=4
        public getPivot(choice: PivotPos) {
            switch (choice) {
                case 0: return this.pivot.x
                case 1: return this.pivot.y
                case 2: return this.pivot.z
            }
            return NaN
        }

        //% blockid=poly_mesh_rot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=100
        public setAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x = x; break
                case 1: this.rot.y = x; break
                case 2: this.rot.z = x; break
            }
        }

        //% blockid=poly_mesh_rot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=5
        public changeAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x += x; break
                case 1: this.rot.y += x; break
                case 2: this.rot.z += x; break
            }
        }

        //% blockid=poly_mesh_rot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=4
        public getAngle(choice: Angles) {
            switch (choice) {
                case 0: return this.rot.x
                case 1: return this.rot.y
                case 2: return this.rot.z
            }
            return NaN
        }

        //% blockid=poly_mesh_pos_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pos"
        //% weight=10
        public setPos(choice: PointProp, x: number) {
            switch (choice) {
                case 0: this.pos.x = x; break
                case 1: this.pos.y = x; break
                case 2: this.pos.z = x; break
                case 3: this.pos.vx = x; break
                case 4: this.pos.vy = x; break
                case 5: this.pos.vz = x; break
            }
        }

        //% blockid=poly_mesh_pos_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pos"
        //% weight=10
        public changePos(choice: PointProp, x: number) {
            switch (choice) {
                case 0: this.pos.x += x; break
                case 1: this.pos.y += x; break
                case 2: this.pos.z += x; break
                case 3: this.pos.vx += x; break
                case 4: this.pos.vy += x; break
                case 5: this.pos.vz += x; break
            }
        }

        //% blockid=poly_mesh_pos_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pos"
        //% weight=10
        public getPos(choice: PointProp) {
            switch (choice) {
                case 0: return this.pos.x
                case 1: return this.pos.y
                case 2: return this.pos.z
                case 3: return this.pos.vx
                case 4: return this.pos.vy
                case 5: return this.pos.vz
            }
            return NaN
        }

    }

    let ax = 0, az = 0, ay = 0
    let camx = 0, camy = 0, camz = 0
    let zoom = 1, sort = 0

    function rotatePoint3D(point: { x: number, y: number, z: number }, pivot: { x: number, y: number, z: number }, angle: { x: number, y: number, z: number }) {

        // move point with pivot to 1st place
        let dx = point.x - pivot.x;
        let dy = point.y - pivot.y;
        let dz = point.z - pivot.z;

        // --- rotate around x ---
        let dy1 = dy * Math.cos(angle.x) - dz * Math.sin(angle.x);
        let dz1 = dy * Math.sin(angle.x) + dz * Math.cos(angle.x);
        dy = dy1;
        dz = dz1;

        // --- rotate around y ---
        let dx1 = dx * Math.cos(angle.y) + dz * Math.sin(angle.y);
        dz1 = -dx * Math.sin(angle.y) + dz * Math.cos(angle.y);
        dx = dx1;
        dz = dz1;

        // --- rotate around z ---
        dx1 = dx * Math.cos(angle.z) - dy * Math.sin(angle.z);
        dy1 = dx * Math.sin(angle.z) + dy * Math.cos(angle.z);
        dx = dx1;
        dy = dy1;

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    }

    //% blockid=poly_rendermesh
    //% block=" $plm render to $image=screen_image_picker|| as inner? $inner=toggleYesNo or fullrender? $fullren=toggleYesNo and line render color? $lineren=colorindexpicker"
    //% plm.shadow=variables_get plm.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(plm: mesh, image: Image, inner?: boolean, fullren?: boolean, lineren?: number) {
        const centerX = image.width >> 1;
        const centerY = image.height >> 1;

        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosZ = Math.cos(az), sinZ = Math.sin(az);

        // Transform vertices
        const rotated = plm.points.map(v => {
            let vpoint: { point: { x: number, y: number, z: number }, pivot: { x: number, y: number, z: number }}
                vpoint.point = { x: plm.pos.x + v.x, y: plm.pos.y + v.y, z: plm.pos.z + v.z}
                vpoint.pivot = { x: plm.pos.x + plm.pivot.x, y: plm.pos.y + plm.pivot.y, z: plm.pos.z + plm.pivot.z }
            const vpos: {x: number, y: number, z: number} = rotatePoint3D(vpoint.point, vpoint.pivot, plm.rot)
            // camera offset
            let x = vpos.x - camx;
            let y = vpos.y - camy;
            let z = vpos.z - camz;

            // rotate camera
            let tx = x * cosY + z * sinY;
            z = -x * sinY + z * cosY;
            x = tx;

            let ty = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = ty;

            tx = x * cosZ - y * sinZ;
            y = x * sinZ + y * cosZ;
            x = tx;

            // Perspective
            const dist = 150;
            const scale = dist / (dist + z);
            return {
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z
            };
        })

        // Sort triangles
        const tris = plm.faces.slice();
        switch (sort) {
            case 0: tris.sort((a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
            case 1: default: introSort(tris, rotated); break
        }
        
        // Render
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -150)) continue;
            if (inds.every(i => (rotated[i].x < 0 || rotated[i].x >= image.width) || (rotated[i].y < 0 || rotated[i].y >= image.height))) continue;
            
            if (!fullren) if (!rotated.some((ro) => (inds.every(i => inner ? rotated[i].z > ro.z : rotated[i].z < ro.z)))) continue;
            
            // Draw line canvas when have line color index
            if (lineren && lineren > 0) {
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, lineren);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, lineren);
                if (inds.length > 3) helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, lineren), helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, lineren);
                else helpers.imageDrawLine(image, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, lineren);
                continue;
            }
            
            // Draw line when no shape
            helpers.imageDrawLine(
                image,
                rotated[inds[0]].x, rotated[inds[0]].y,
                rotated[inds[1]].x, rotated[inds[1]].y,
                t.color
            );
            // Draw solid when is vertice shape
            if (inds.length > 2) {
                helpers.imageFillTriangle(
                    image,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }
            if (inds.length > 3) {
                helpers.imageFillTriangle(
                    image,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }

            // Draw texture over
            if (t.img && inds.length === 4) {
                distortImage(t.img.clone(), image,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[3]].x, rotated[inds[3]].y
                );
            }

        }
        
    }

    function introSort(arr: { indices: number[] }[], rot: { z: number }[]) {
        const maxDepth = 2 * Math.ceil(Math.log(arr.length) / Math.log(2));
        introsortUtil(arr, 0, arr.length - 1, maxDepth, rot);
    }

    function introsortUtil(arr: { indices: number[] }[], start: number, end: number, depthLimit: number, rot: { z: number }[]) {
        const size = end - start + 1;

        if (size < 16) {
            insertionSort(arr, start, end, rot);
            return;
        }

        if (depthLimit === 0) {
            heapSort(arr, start, end, rot);
            return;
        }

        const pivot = partitionIntro(arr, start, end, avgZ(rot, arr[start + ((end - start) >> 1)].indices), rot);
        introsortUtil(arr, start, pivot - 1, depthLimit - 1, rot);
        introsortUtil(arr, pivot, end, depthLimit - 1, rot);
    }

    function insertionSort(arr: { indices: number[] }[], start: number, end: number, rot: { z: number }[]) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && avgZ(rot, arr[j].indices) < avgZ(rot, key.indices)) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    function heapSort(arr: { indices: number[] }[], start: number, end: number, rot: { z: number }[]) {
        const heapSize = end - start + 1;

        for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
            heapify(arr, heapSize, i, start, rot);
        }

        for (let i = heapSize - 1; i > 0; i--) {
            const tmp = arr[start];
            arr[start] = arr[start + i];
            arr[start + i] = tmp;
            heapify(arr, i, 0, start, rot);
        }
    }

    function heapify(arr: { indices: number[] }[], size: number, root: number, offset: number, rot: { z: number }[]) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size && avgZ(rot, arr[offset + left].indices) > avgZ(rot, arr[offset + largest].indices)) {
            largest = left;
        }
        if (right < size && avgZ(rot, arr[offset + right].indices) > avgZ(rot, arr[offset + largest].indices)) {
            largest = right;
        }
        if (largest !== root) {
            const tmp = arr[offset + root];
            arr[offset + root] = arr[offset + largest];
            arr[offset + largest] = tmp;
            heapify(arr, size, largest, offset, rot);
        }
    }

    function partitionIntro(arr: { indices: number[] }[], left: number, right: number, pivot: number, rot: { z: number }[]) {
        while (left <= right) {
            while (avgZ(rot, arr[left].indices) > pivot) left++;
            while (avgZ(rot, arr[right].indices) < pivot) right--;
            if (left <= right) {
                const tmp = arr[left];
                arr[left] = arr[right];
                arr[right] = tmp;
                left++;
                right--;
            }
        }
        return left;
    }

    function avgZ(rot: { z: number }[], inds: number[]): number {
        return inds.reduce((s, i) => s + rot[i].z, 0) / inds.length;
    }

    function distortImage(src: Image, dest: Image,
        X1: number, Y1: number, X2: number, Y2: number,
        X3: number, Y3: number, X4: number, Y4: number) {
        for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
                const col = src.getPixel(src.width - x, src.height - y);
                if (!col || (col && col <= 0)) continue;
                const sx = (s: number, m?: boolean) => Math.trunc((1 - ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s)) * (X1 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X2 - X1)) + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (X3 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X4 - X3)))
                const sy = (s: number, m?: boolean) => Math.trunc((1 - ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s)) * (Y1 + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (Y3 - Y1)) + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (Y2 + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (Y4 - Y2)))
                if ((sx(zoom, true) < 0 || sx(zoom) >= dest.width) || (sy(zoom, true) < 0 || sy(zoom) >= dest.height)) continue;
                helpers.imageFillTriangle(dest, sx(zoom, true), sy(zoom), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
                helpers.imageFillTriangle(dest, sx(zoom), sy(zoom, true), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
            }
        }
    }

    //% blockid=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax += x; break
            case 1: ay += x; break
            case 2: az += x; break
        }
    }
    //% blockid=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: camx += x; break
            case 1: camy += x; break
            case 2: camz += x; break
            case 3: default: zoom += x; break
        }
    }
    //% blockid=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax = x; break
            case 1: ay = x; break
            case 2: az = x; break
        }
    }
    //% blockid=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: camx = x; break
            case 1: camy = x; break
            case 2: camz = x; break
            case 3: default: zoom = x; break
        }
    }

    //% blockid=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: SortingMethods) {
        sort = method
    }

    //% blockid=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: Angles) {
        switch (choice) {
            case 0: return ax
            case 1: return ay
            case 2: return az
        }
        return NaN
    }

    //% blockid=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: Cameras) {
        switch (choice) {
            case 0: return camx
            case 1: return camy
            case 2: return camz
            case 3: default: return zoom
        }
        return NaN
    }

    //% blockid=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setcCampos(x: number, y: number, z: number) {
        camx = x, camy = y, camz = z
    }

}
