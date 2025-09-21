namespace Polymesh {

    export function introSort2nd<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        if (arr.length <= 1 || isSorted(arr, compare)) return;

        const maxDepth = (Math.floor(Math.log(arr.length) / Math.LOG2E) << 1);

        const stack: { start: number, end: number, depth: number }[] = [];
        stack.push({ start: 0, end: arr.length - 1, depth: maxDepth });

        while (stack.length) {
            const { start, end, depth } = stack.pop();
            const size = end - start + 1;

            if (size <= 16) {
                insertionSort(arr, start, end, compare);
                continue;
            }

            if (depth === 0) {
                heapSort(arr, start, end, compare);
                continue;
            }

            const pivot = partition(arr, start, end, compare);

            // Recur on smaller partition first (no stack depth)
            if (pivot - 1 - start < end - (pivot + 1)) {
                stack.push({ start: pivot + 1, end, depth: depth - 1 });
                stack.push({ start, end: pivot - 1, depth: depth - 1 });
            } else {
                stack.push({ start, end: pivot - 1, depth: depth - 1 });
                stack.push({ start: pivot + 1, end, depth: depth - 1 });
            }
        }
    }

    function insertionSort<T>(
        arr: T[],
        start: number,
        end: number,
        compare: (a: T, b: T) => number
    ) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && compare(arr[j], key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    function heapify<T>(
        arr: T[],
        i: number,
        max: number,
        start: number,
        compare: (a: T, b: T) => number
    ) {
        let largest = i;
        while (true) {
            const left = (i << 1) + 1, right = (i << 1) + 2;

            if (left < max && compare(arr[start + left], arr[start + largest]) > 0) largest = left;
            if (right < max && compare(arr[start + right], arr[start + largest]) > 0) largest = right;

            if (largest === i) break;
            const tmp = arr[start + i]; arr[start + i] = arr[start + largest], arr[start + largest] = tmp;// [arr[start + i], arr[start + largest]] = [arr[start + largest], arr[start + i]];
            i = largest;
        }
    }

    function heapSort<T>(
        arr: T[],
        start: number,
        end: number,
        compare: (a: T, b: T) => number
    ) {
        const size = end - start + 1;
        for (let i = (size >> 1) - 1; i >= 0; i--) heapify(arr, i, size, start, compare);
        for (let i = size - 1; i > 0; i--) {
            const tmp = arr[start]; arr[start] = arr[start + i], arr[start + i] = tmp;// [arr[start], arr[start + i]] = [arr[start + i], arr[start]];
            heapify(arr, 0, i, start, compare);
        }
    }

    function partition<T>(
        arr: T[],
        low: number,
        high: number,
        compare: (a: T, b: T) => number
    ): number {
        const pivotIndex = (low + high) >> 1;
        const pivot = arr[pivotIndex];
        let tmp: T

        // เอา pivot ไปท้ายไว้ก่อน
        tmp = arr[pivotIndex]; arr[pivotIndex] = arr[high], arr[high] = tmp;// [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];

        let i = low;
        for (let j = low; j < high; j++) {
            if (compare(arr[j], pivot) < 0) { // Near → Far
                tmp = arr[i]; arr[i] = arr[j], arr[j] = tmp;// [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }

        tmp = arr[i]; arr[i] = arr[high], arr[high] = tmp;// [arr[i], arr[high]] = [arr[high], arr[i]];
        return i;
    }

    function isSorted<T>(arr: T[], compare: (a: T, b: T) => number): boolean {
        for (let i = 1; i < arr.length; i++) {
            if (compare(arr[i - 1], arr[i]) > 0) return false;
        }
        return true;
    }

}