namespace Polymesh {

    export function introSort<T>(arr: T[], compare: (a: T, b: T) => number): void {
        if (arr.length <= 1 || isSorted(arr, compare)) return;
        const maxDepth = (Math.floor(Math.log(arr.length) / Math.LOG2E) << 1);
        const stack: { s: number, e: number, d: number }[] = [{ s: 0, e: arr.length - 1, d: maxDepth }];
        let tmp: T;

        while (stack.length) {
            const { s, e, d } = stack.pop();
            const size = e - s + 1;
            if (size <= 16) { insertionSort(arr, s, e, compare); continue; }
            if (d === 0) { heapSort(arr, s, e, compare); continue; }

            const p = partition(arr, s, e, compare);
            if ((p - 1) - s < e - (p + 1)) stack.push({ s: p + 1, e, d: d - 1 }), stack.push({ s, e: p - 1, d: d - 1 });
            else stack.push({ s, e: p - 1, d: d - 1 }), stack.push({ s: p + 1, e, d: d - 1 });
        }
    }

    function insertionSort<T>(arr: T[], s: number, e: number, cmp: (a: T, b: T) => number) {
        for (let i = s + 1; i <= e; i++) {
            const key = arr[i]; let j = i - 1;
            while (j >= s && cmp(arr[j], key) > 0) { arr[j + 1] = arr[j]; j--; }
            arr[j + 1] = key;
        }
    }

    function heapify<T>(arr: T[], i: number, n: number, s: number, cmp: (a: T, b: T) => number) {
        let largest = i, tmp: T;
        while (true) {
            const l = (i << 1) + 1, r = (i << 1) + 2;
            if (l < n && cmp(arr[s + l], arr[s + largest]) > 0) largest = l;
            if (r < n && cmp(arr[s + r], arr[s + largest]) > 0) largest = r;
            if (largest === i) break;
            tmp = arr[s + i]; arr[s + i] = arr[s + largest]; arr[s + largest] = tmp;
            i = largest;
        }
    }

    function heapSort<T>(arr: T[], s: number, e: number, cmp: (a: T, b: T) => number) {
        const n = e - s + 1; let tmp: T;
        for (let i = (n >> 1) - 1; i >= 0; i--) heapify(arr, i, n, s, cmp);
        for (let i = n - 1; i > 0; i--) {
            tmp = arr[s]; arr[s] = arr[s + i]; arr[s + i] = tmp;
            heapify(arr, 0, i, s, cmp);
        }
    }

    function partition<T>(arr: T[], lo: number, hi: number, cmp: (a: T, b: T) => number): number {
        const mid = (lo + hi) >> 1, pivot = arr[mid]; let tmp: T;
        tmp = arr[mid]; arr[mid] = arr[hi]; arr[hi] = tmp;
        let i = lo;
        for (let j = lo; j < hi; j++) {
            if (cmp(arr[j], pivot) < 0) {
                tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                i++;
            }
        }
        tmp = arr[i]; arr[i] = arr[hi]; arr[hi] = tmp;
        return i;
    }

}