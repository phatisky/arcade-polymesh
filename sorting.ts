
namespace Polymesh {

    export function introSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        const maxDepth = 2 * Math.floor(Math.log(arr.length) / Math.log(2));
        introsortUtil(arr, 0, arr.length - 1, maxDepth, compare);
    }

    function introsortUtil<T>(
        arr: T[],
        start: number,
        end: number,
        depthLimit: number,
        compare: (a: T, b: T) => number
    ): void {
        const size = end - start + 1;
        if (size <= 16) {
            insertionSort(arr, start, end, compare);
            return;
        }

        if (depthLimit === 0) {
            heapSort(arr, start, end, compare);
            return;
        }

        const pivot = medianOfThree(arr, start, start + ((end - start) >> 1), end, compare);
        const p = partition(arr, start, end, pivot, compare);
        introsortUtil(arr, start, p - 1, depthLimit - 1, compare);
        introsortUtil(arr, p + 1, end, depthLimit - 1, compare);
    }

    function insertionSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && compare(arr[j], key) > 0) arr[j + 1] = arr[j], j--;
            arr[j + 1] = key;
        }
    }

    function heapSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        const size = end - start + 1;

        function siftDown(i: number, max: number) {
            let largest = i;
            while (true) {
                const left = 2 * i + 1, right = 2 * i + 2;
                if (left < max && compare(arr[start + left], arr[start + largest]) > 0) largest = left;
                if (right < max && compare(arr[start + right], arr[start + largest]) > 0) largest = right;
                if (largest === i) break;
                [arr[start + i], arr[start + largest]] = [arr[start + largest], arr[start + i]]
                i = largest, largest = i;
            }
        }

        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) siftDown(i, size);

        for (let i = size - 1; i > 0; i--) [arr[start], arr[start + i]] = [arr[start + i], arr[start]], siftDown(0, i);
    }

    function partition<T>(
        arr: T[],
        low: number,
        high: number,
        pivot: T,
        compare: (a: T, b: T) => number
    ): number {
        while (low <= high) {
            while (compare(arr[low], pivot) < 0) low++;
            while (compare(arr[high], pivot) > 0) high--;
            if (low <= high) [arr[low], arr[high]] = [arr[high], arr[low]], low++, high--;
        }
        return low;
    }

    function medianOfThree<T>(
        arr: T[],
        a: number,
        b: number,
        c: number,
        compare: (a: T, b: T) => number
    ): T {
        if (compare(arr[a], arr[b]) < 0) {
            if (compare(arr[b], arr[c]) < 0) return arr[b];
            else if (compare(arr[a], arr[c]) < 0) return arr[c];
            else return arr[a];
        } else {
            if (compare(arr[a], arr[c]) < 0) return arr[a];
            else if (compare(arr[b], arr[c]) < 0) return arr[c];
            else return arr[b];
        }
    }

}
