
namespace Polymesh {

    export function introSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
        const array = arr.slice();
        const maxDepth = 2 * Math.floor(Math.log(array.length) / Math.log(2));

        const isSorted = (low: number, high: number) => {
            for (let i = low + 1; i <= high; i++) {
                if (compare(array[i - 1], array[i]) > 0) return false;
            }
            return true;
        };

        const insertionSort = (low: number, high: number) => {
            for (let i = low + 1; i <= high; i++) {
                const key = array[i];
                let j = i - 1;
                while (j >= low && compare(array[j], key) > 0) {
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = key;
            }
        };

        const heapify = (start: number, end: number) => {
            const swap = (i: number, j: number) => {
                [array[i], array[j]] = [array[j], array[i]];
            };
            const siftDown = (root: number, size: number) => {
                let largest = root;
                const left = 2 * root + 1 - start;
                const right = 2 * root + 2 - start;
                if (left < size && compare(array[start + left], array[start + largest]) > 0)
                    largest = left;
                if (right < size && compare(array[start + right], array[start + largest]) > 0)
                    largest = right;
                if (largest !== root) {
                    swap(start + root, start + largest);
                    siftDown(largest, size);
                }
            };
            const size = end - start + 1;
            for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
                siftDown(i, size);
            }
            for (let i = size - 1; i > 0; i--) {
                swap(start, start + i);
                siftDown(0, i);
            }
        };

        // Non-recursive stack-based IntroSort
        const stack: { low: number; high: number; depth: number }[] = [
            { low: 0, high: array.length - 1, depth: maxDepth },
        ];

        while (stack.length) {
            const { low, high, depth } = stack[stack.length-1];
            stack.pop();
            if (low >= high || isSorted(low, high)) continue;

            const size = high - low + 1;
            // use Insertion Sort for short
            if (size <= 16) {
                insertionSort(low, high);
                continue;
            }

            // use HeapSort on depth is empty
            if (depth === 0) {
                heapify(low, high);
                continue;
            }

            // QuickSort partition as median-of-three
            const mid = Math.floor((low + high) / 2);
            let a = array[low], b = array[mid], c = array[high];
            if (compare(a, b) > 0) [a, b] = [b, a];
            if (compare(b, c) > 0) [b, c] = [c, b];
            if (compare(a, b) > 0) [a, b] = [b, a];
            const pivot = b;

            let i = low, j = high;
            while (i <= j) {
                while (compare(array[i], pivot) < 0) i++;
                while (compare(array[j], pivot) > 0) j--;
                if (i <= j) {
                    [array[i], array[j]] = [array[j], array[i]];
                    i++;
                    j--;
                }
            }

            if (low < j) stack.push({ low, high: j, depth: depth - 1 });
            if (i < high) stack.push({ low: i, high, depth: depth - 1 });
        }

        return array;
    }

    export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
        const array = arr.slice(); // make copy to not edit original array
        const stack: [number, number][] = [[0, array.length - 1]];

        // check sorted function
        const isSorted = (low: number, high: number) => {
            for (let i = low + 1; i <= high; i++) {
                if (compare(array[i - 1], array[i]) > 0) return false;
            }
            return true;
        };

        // choose pivot function as median-of-three
        const choosePivot = (low: number, high: number): T => {
            const mid = Math.floor((low + high) / 2);
            let a = array[low], b = array[mid], c = array[high];
            // find median-of-three
            if (compare(a, b) > 0) [a, b] = [b, a];
            if (compare(b, c) > 0) [b, c] = [c, b];
            if (compare(a, b) > 0) [a, b] = [b, a];
            return b;
        };

        while (stack.length) {
            const [low, high] = stack[stack.length-1];
            stack.pop();
            if (low >= high || isSorted(low, high)) continue;

            const pivot = choosePivot(low, high);
            let i = low, j = high;

            // Lomuto-style partition
            while (i <= j) {
                while (compare(array[i], pivot) < 0) i++;
                while (compare(array[j], pivot) > 0) j--;
                if (i <= j) {
                    [array[i], array[j]] = [array[j], array[i]];
                    i++;
                    j--;
                }
            }

            // Push subset for non-sorting in stack
            if (low < j) stack.push([low, j]);
            if (i < high) stack.push([i, high]);
        }

        return array;
    }


}
