
namespace Polymesh {

    export function introSort<T>(arr: T[], compare: (a: T, b: T) => number) {
        if (arr.length <= 1 || isSorted(arr, compare)) return;
        const maxDepth = Math.floor(Math.log(arr.length) / Math.LOG2E) << 1;
        const stack: { start: number; end: number; depth: number }[] = [{ start: 0, end: arr.length - 1, depth: maxDepth }];
        let i: number, tmp: T

        while (stack.length) {
            const { start, end, depth } = stack.pop(), size = end - start + 1;
            if (size <= 1) continue;

            if (size <= 16) { // insertion sort
                for (let i = start + 1; i <= end; i++) {
                    tmp = arr[i];
                    let j = i - 1;
                    while (j >= start && compare(arr[j], tmp) > 0) arr[j + 1] = arr[j], j--;
                    arr[j + 1] = tmp;
                }
            continue; } // end insertion sort

            if (depth <= 0) { // heap sort
                const shiftDown = (size: number, i: number) => {
                    while (true) {
                        let largest = i;
                        const left = (i << 1) + 1, right = left + 1;

                        if (left < size && compare(arr[start + left], arr[start + largest]) > 0) largest = left; if (right < size && compare(arr[start + right], arr[start + largest]) > 0) largest = right; if (largest === i) break;

                        tmp = arr[start + i], arr[start + i] = arr[start + largest], arr[start + largest] = tmp;
                        i = largest;
                    }
                }
                for (let i = (size >> 1) - 1; i >= 0; i--) shiftDown(size, i);
                for (let i = size - 1; i > 0; i--) {
                    tmp = arr[start]; arr[start] = arr[start + i], arr[start + i] = tmp;
                    shiftDown(i, 0);
                }
            continue; } // end heap sort

            const pivotIndex = (start + end) >> 1; // partition
            tmp = arr[pivotIndex];
            arr[pivotIndex] = arr[end], arr[end] = tmp;

            i = start;
            for (let j = start; j < end; j++) {
                if (compare(arr[j], arr[end]) < 0) { // Near → Far
                    tmp = arr[i]; arr[i] = arr[j], arr[j] = tmp;
                    i++;
                }
            }

            tmp = arr[i]; arr[i] = arr[end], arr[end] = tmp; // end partition

            // Push larger partition first to minimize stack usage
            if ((i - 1) - start > end - (i + 1)) stack.push({ start, end: i - 1, depth: depth - 1 }), stack.push({ start: i + 1, end, depth: depth - 1 });
            else stack.push({ start: i + 1, end, depth: depth - 1 }), stack.push({ start, end: i - 1, depth: depth - 1 });
        }
    }

}