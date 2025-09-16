
namespace Polymesh {

    export function introSort<T>(arr: T[], compare: (a: T, b: T) => number): void {
        const n = arr.length;
        if (n <= 1) return;

        // ตรวจว่าข้อมูลเรียงแล้วหรือยัง
        let sorted = true;
        for (let i = 1; i < n; i++) {
            if (compare(arr[i - 1], arr[i]) > 0) {
                sorted = false;
                break;
            }
        }
        if (sorted) return;

        const maxDepth = 2 * Math.floor(Math.log(n) / Math.LOG2E);
        const stack: { left: number, right: number, depth: number }[] = [];
        stack.push({ left: 0, right: n - 1, depth: maxDepth });

        while (stack.length) {
            const { left, right, depth } = stack.pop();
            if (left >= right) continue;

            const size = right - left + 1;

            // ใช้ Insertion sort สำหรับขนาดเล็ก
            if (size <= 16) {
                for (let i = left + 1; i <= right; i++) {
                    const key = arr[i];
                    let j = i - 1;
                    while (j >= left && compare(arr[j], key) > 0) {
                        arr[j + 1] = arr[j];
                        j--;
                    }
                    arr[j + 1] = key;
                }
                continue;
            }

            // ถ้าเกินความลึก → ใช้ HeapSort กัน worst-case
            if (depth === 0) {
                heapSort(arr, left, right, compare);
                continue;
            }

            // เลือก pivot แบบ median-of-three
            const mid = left + ((right - left) >> 1);
            const pivotIndex = medianOfThree(arr, left, mid, right, compare);
            const pivot = arr[pivotIndex];

            // Partition (สามทาง รองรับค่าซ้ำ)
            let i = left, lt = left, gt = right;
            while (i <= gt) {
                const cmp = compare(arr[i], pivot);
                if (cmp < 0) {
                    swap(arr, lt++, i++);
                } else if (cmp > 0) {
                    swap(arr, i, gt--);
                } else {
                    i++;
                }
            }

            // Push subproblems (เรียง stack ใหญ่ก่อนเล็กทีหลัง)
            if (lt - 1 - left > right - (gt + 1)) {
                stack.push({ left, right: lt - 1, depth: depth - 1 });
                stack.push({ left: gt + 1, right, depth: depth - 1 });
            } else {
                stack.push({ left: gt + 1, right, depth: depth - 1 });
                stack.push({ left, right: lt - 1, depth: depth - 1 });
            }
        }

        function swap(arr: T[], i: number, j: number) {
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }

        function medianOfThree(arr: T[], a: number, b: number, c: number, compare: (x: T, y: T) => number): number {
            if (compare(arr[a], arr[b]) > 0) swap(arr, a, b);
            if (compare(arr[a], arr[c]) > 0) swap(arr, a, c);
            if (compare(arr[b], arr[c]) > 0) swap(arr, b, c);
            return b;
        }

        function heapSort(arr: T[], left: number, right: number, compare: (x: T, y: T) => number) {
            const n = right - left + 1;
            // build max heap
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(i, n);
            for (let end = n - 1; end > 0; end--) {
                swap(arr, left, left + end);
                siftDown(0, end);
            }

            function heapify(i: number, n: number) {
                siftDown(i, n);
            }

            function siftDown(i: number, n: number) {
                while (true) {
                    let largest = i;
                    const l = 2 * i + 1, r = 2 * i + 2;
                    if (l < n && compare(arr[left + l], arr[left + largest]) > 0) largest = l;
                    if (r < n && compare(arr[left + r], arr[left + largest]) > 0) largest = r;
                    if (largest === i) break;
                    swap(arr, left + i, left + largest);
                    i = largest;
                }
            }
        }
    }


    export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): void {
        if (arr.length <= 1) return;

        type Range = { left: number; right: number };
        const stack: Range[] = [{ left: 0, right: arr.length - 1 }];

        while (stack.length > 0) {
            const { left, right } = stack.pop();
            if (left >= right) continue;

            let i = left, j = right;
            const mid = (left + right) >> 1;
            const pivot = arr[mid];

            // ตรวจว่าช่วงนี้เรียงแล้วหรือไม่
            let sorted = true;
            for (let k = left; k < right; k++) {
                if (compare(arr[k], arr[k + 1]) > 0) {
                    sorted = false;
                    break;
                }
            }
            if (sorted) continue;

            // Partition (3-way partitioning)
            while (i <= j) {
                while (compare(arr[i], pivot) < 0) i++;
                while (compare(arr[j], pivot) > 0) j--;
                if (i <= j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    i++;
                    j--;
                }
            }

            // จัดลำดับความลึก (stack-based, หลีกเลี่ยง pivot แย่)
            if (j - left < right - i) {
                if (left < j) stack.push({ left, right: j });
                if (i < right) stack.push({ left: i, right });
            } else {
                if (i < right) stack.push({ left: i, right });
                if (left < j) stack.push({ left, right: j });
            }
        }
    }

}
