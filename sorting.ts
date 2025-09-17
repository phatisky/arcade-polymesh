
namespace Polymesh {

    export function introSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number,
        quickSort?: boolean
    ) {
        const maxDepth = 2 * Math.floor(Math.log(arr.length) / Math.LOG2E);
        if (isSorted(arr, compare)) return; // check if array is sorted

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

            const pivot = medianOfThree(arr, start, start + (size >> 1), end, compare);
            const p = partition(arr, start, end, pivot, compare);

            if (p - 1 > start) stack.push({ start, end: p - 1, depth: depth - 1 });
            if (p < end) stack.push({ start: p, end, depth: depth - 1 });
        }
    }

    export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number) {
        if (isSorted(arr, compare)) return; // check if array is sorted

        const stack: { start: number, end: number }[] = [];
        stack.push({ start: 0, end: arr.length - 1 });

        while (stack.length) {
            const { start, end } = stack.pop();
            const size = end - start + 1;

            if (size <= 16) {
                insertionSort(arr, start, end, compare);
                continue;
            }

            const pivot = medianOfThree(arr, start, start + (size >> 1), end, compare);
            const p = partition(arr, start, end, pivot, compare);

            if (p - 1 > start) stack.push({ start, end: p - 1 });
            if (p < end) stack.push({ start: p, end });
        }
    }

    // helper function
    function insertionSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && compare(arr[j], key) > 0) arr[j + 1] = arr[j], j--;
            arr[j + 1] = key;
        }
    }

    function heapify<T>(arr: T[], i: number, max: number, start: number, compare:(a: T, b: T) => number) {
        let largest = i;
        while (true) {
            const left = 2 * i + 1, right = 2 * i + 2;
            if (left < max && compare(arr[start + left], arr[start + largest]) > 0) largest = left;
            if (right < max && compare(arr[start + right], arr[start + largest]) > 0) largest = right;
            if (largest === i) break;
            [arr[start + i], arr[start + largest]] = [arr[start + largest], arr[start + i]];
            i = largest;
        }
    }

    function heapSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        const size = end - start + 1;
        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) heapify(arr, i, size, start, compare);
        for (let i = size - 1; i > 0; i--) {
            [arr[start], arr[start + i]] = [arr[start + i], arr[start]];
            heapify(arr, 0, i, start, compare);
        }
    }

    function partition<T>(arr: T[], low: number, high: number, pivot: T, compare: (a: T, b: T) => number) {
        while (low <= high) {
            while (compare(arr[low], pivot) < 0) low++;
            while (compare(arr[high], pivot) > 0) high--;
            if (low <= high) [arr[low], arr[high]] = [arr[high], arr[low]], low++, high--;
        }
        return low;
    }

    function medianOfThree<T>(arr: T[], a: number, b: number, c: number, compare: (a: T, b: T) => number): T {
        const A = arr[a], B = arr[b], C = arr[c];
        if (compare(A, B) < 0) {
            if (compare(B, C) < 0) return B;
            else if (compare(A, C) < 0) return C;
            else return A;
        } else {
            if (compare(A, C) < 0) return A;
            else if (compare(B, C) < 0) return C;
            else return B;
        }
    }

    function isSorted<T>(arr: T[], compare: (a: T, b: T) => number): boolean {
        for (let i = 1; i < arr.length; i++) if (compare(arr[i - 1], arr[i]) > 0) return false;
        return true;
    }

}
