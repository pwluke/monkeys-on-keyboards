import { atom } from 'jotai';

// Default matrices - similar to the ones in the matrix component
const defaultMatrices = [
  [
    [1, 0, 0, 0],
    [0, 1, 0, 10],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, 10],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, -10],
    [0, 1, 0, 5],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, 0],
    [0, 1, 0, -10],
    [0, 0, 1, 5],
    [0, 0, 0, 1]
  ],
  [
    [0.707, -0.707, 0, 15],
    [0.707, 0.707, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  [
    [0.5, 0, 0, -5],
    [0, 0.5, 0, -5],
    [0, 0, 0.5, 0],
    [0, 0, 0, 1]
  ],
  [
    [2, 0, 0, 20],
    [0, 2, 0, 10],
    [0, 0, 2, 0],
    [0, 0, 0, 1]
  ],
  [
    [1, 0, 0, 0],
    [0, 0, -1, 0],
    [0, 1, 0, 15],
    [0, 0, 0, 1]
  ]
];

// Atom to store the matrices
export const matricesAtom = atom(defaultMatrices);

// Atom to store the picked color from MaterialPicker
export const pickedColorAtom = atom(null);
