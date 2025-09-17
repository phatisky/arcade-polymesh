
namespace Polymesh {

    export function introSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        if (arr.length <= 1) return;

        // if sorted will not run it
        if (isSorted(arr, compare)) return;

        const maxDepth = 2 * Math.floor(Math.log(arr.length) / Math.LOG2E);
        introsortUtil(arr, 0, arr.length - 1, maxDepth, compare);
    }

    function introsortUtil<T>(
        arr: T[],
        start: number,
        end: number,
        depthLimit: number,
        compare: (a: T, b: T) => number
    ): void {
        while (end > start) {
            const size = end - start + 1;

            // use insertion sort on small array
            if (size <= 16) {
                insertionSort(arr, start, end, compare);
                return;
            }

            // if too depth use fallback on heapSort
            if (depthLimit === 0) {
                heapSort(arr, start, end, compare);
                return;
            }

            // choose pivot as median-of-three
            const pivot = medianOfThree(
                arr,
                start,
                start + ((end - start) >> 1),
                end,
                compare
            );

            const p = partition(arr, start, end, pivot, compare);

            // manage large item 1st to unstack depth
            if (p - start < end - p) {
                introsortUtil(arr, start, p - 1, depthLimit - 1, compare);
                start = p;
            } else {
                introsortUtil(arr, p, end, depthLimit - 1, compare);
                end = p - 1;
            }
        }
    }

    export function quickSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        if (arr.length <= 1) return;

        // if sorted will not run it
        if (isSorted(arr, compare)) return;

        quickSortUtil(arr, 0, arr.length - 1, compare);
    }

    function quickSortUtil<T>(
        arr: T[],
        start: number,
        end: number,
        compare: (a: T, b: T) => number
    ): void {
        while (start < end) {
            const size = end - start + 1;

            // if small array use insertion sort
            if (size <= 16) {
                insertionSort(arr, start, end, compare);
                return;
            }

            // choose pivot as median-of-three
            const pivot = medianOfThree(
                arr,
                start,
                start + ((end - start) >> 1),
                end,
                compare
            );

            // split zone by partition
            const p = partition(arr, start, end, pivot, compare);

            // select small to resume (tail recursion elimination)
            if (p - start < end - p) {
                quickSortUtil(arr, start, p - 1, compare);
                start = p; // use right area
            } else {
                quickSortUtil(arr, p, end, compare);
                end = p - 1; // use left area
            }
        }
    }

    function isSorted<T>(arr: T[], compare: (a: T, b: T) => number): boolean {
        for (let i = 1; i < arr.length; i++) {
            if (compare(arr[i - 1], arr[i]) > 0) return false;
        }
        return true;
    }

    function insertionSort<T>(
        arr: T[],
        start: number,
        end: number,
        compare: (a: T, b: T) => number
    ): void {
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

    function heapSort<T>(
        arr: T[],
        start: number,
        end: number,
        compare: (a: T, b: T) => number
    ): void {
        const size = end - start + 1;

        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
            heapify(arr, i, size, start, compare);
        }

        for (let i = size - 1; i > 0; i--) {
            swap(arr, start, start + i);
            heapify(arr, 0, i, start, compare);
        }
    }

    function heapify<T>(
        arr: T[],
        i: number,
        size: number,
        offset: number,
        compare: (a: T, b: T) => number
    ): void {
        while (true) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < size && compare(arr[offset + left], arr[offset + largest]) > 0) {
                largest = left;
            }
            if (right < size && compare(arr[offset + right], arr[offset + largest]) > 0) {
                largest = right;
            }
            if (largest === i) break;

            swap(arr, offset + i, offset + largest);
            i = largest;
        }
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
            if (low <= high) {
                swap(arr, low, high);
                low++;
                high--;
            }
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

    function swap<T>(arr: T[], i: number, j: number): void {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

}
