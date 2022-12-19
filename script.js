//GLOBAL ELEMENTS (STATIC VARIABLES)
const orthoFront = document.querySelector('[data-orthoFront]');
const orthoRight = document.querySelector('[data-orthoRight]');
const orthoTop = document.querySelector('[data-orthoTop]');
const orthoBack = document.querySelector('[data-orthoBack]');
const orthoLeft = document.querySelector('[data-orthoLeft]');
const orthoBot = document.querySelector('[data-orthoBot]');

const orthoContainerArr = document.querySelectorAll('[data-orthoContainer]');
const squareContainerArr = document.querySelectorAll('[data-squareContainer]');


const colorArr = ['blue', 'green', 'red', 'purple', 'yellow'];
const pieceArr = Array.from(document.querySelectorAll('[data-pieceContainer]'));

const solveButton = document.getElementById('solve-button');

//PUBLIC STATIC VOID MAIN
// addTestingOnlyIndex();
enableShowOrthographicButton();
addEventListenerForPieces();

solveButton.addEventListener('click', solve);



//FUNCTIONS - SOLVE
let pieceArray;
let pieceOrientationsArr = [];
function solve() {
    start = Date.now();

    pieceOrientationsArr = [];
    pieceArray = extractUserInputToPieceArray();
    pieceArray.forEach(x => {
        pieceOrientationsArr.push(getPieceOrientations(x));
    })

    //don't solve thing that don't even have 27 cubes
    let numberOfCubes = optimizedTotalCubes(pieceArray[0],pieceArray[1],pieceArray[2],pieceArray[3],pieceArray[4]);
    if(numberOfCubes != 27) {
        alert(`Your pieces have ${numberOfCubes} cubes in total. It should be 27.`);
        return;
    }

    solutionExists = false;
    let a, b, c, d, e;
    let count = 0;

    for(a=0; a<pieceOrientationsArr[0].length; a++) {
        let testPieceA = copy333Array(pieceOrientationsArr[0][a]);
        for(b=0; b<pieceOrientationsArr[1].length; b++) {
            testPieceB = opitimizedAddAndCollisonCheck(testPieceA, pieceOrientationsArr[1][b]);
            if(testPieceB===false) continue;
            for(c=0; c<pieceOrientationsArr[2].length; c++) {
                testPieceC = opitimizedAddAndCollisonCheck(testPieceB, pieceOrientationsArr[2][c]);
                if(testPieceC===false) continue;
                for(d=0; d<pieceOrientationsArr[3].length; d++) {
                    testPieceD = opitimizedAddAndCollisonCheck(testPieceC, pieceOrientationsArr[3][d]);
                    if(testPieceD===false) continue;
                    for(e=0; e<pieceOrientationsArr[4].length; e++) {
                        testPieceE = opitimizedAddAndCollisonCheck(testPieceD, pieceOrientationsArr[4][e]);
                        if(testPieceE===false) continue;

                        if(optimizedisArrayFilled(testPieceE)) {
                                displaySolution(pieceOrientationsArr[0][a],
                                    pieceOrientationsArr[1][b], pieceOrientationsArr[2][c],
                                    pieceOrientationsArr[3][d], pieceOrientationsArr[4][e]);
                                    solutionExists = true;
                                    break;
                        }
                        count++;
                    }
                }
            }
        }
        //console log the percent completed
        const permutationLocation = 
        a*pieceOrientationsArr[1].length*pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
        +b*pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
        +c*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
        +d*pieceOrientationsArr[4].length
        +e;
        console.log("%Complete", Math.floor(100*permutationLocation/(pieceOrientationsArr[0].length*pieceOrientationsArr[1].length
            *pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length)));
    }

    //let the user know what happened
    if(!solutionExists) {
        alert('No Solution!');
    } else {
        alert('Solved! Scroll up to see orthographic');
    }
    console.log('solutionExists?', solutionExists);


    loadDataAnimation();


    //tries to add the two arrays and return the combined array
    //However, if the two arrays collide, false is returned
    function opitimizedAddAndCollisonCheck(arr1, arr2) {
        const returnArr = new333Array();
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                for(let k=0; k<3; k++) {
                    const sum = arr1[i][j][k] + arr2[i][j][k];
                    if(sum==2) {
                        return false; //collison
                    } else {
                        returnArr[i][j][k] = sum;
                    }
                }
            }
        }
        return returnArr;
    }

    //returns true if array is filled, otherwise false
    //assumes that there are no collisons
    function optimizedisArrayFilled(arr) {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                for(let k=0; k<3; k++) {
                    if(arr[i][j][k] == 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //returns the total cubes the five pieces have
    function optimizedTotalCubes(arr1,arr2,arr3,arr4,arr5) {
        let count = 0;
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                for(let k=0; k<3; k++) {
                    if(arr1[i][j][k] == 1) count++;
                    if(arr2[i][j][k] == 1) count++;
                    if(arr3[i][j][k] == 1) count++;
                    if(arr4[i][j][k] == 1) count++;
                    if(arr5[i][j][k] == 1) count++;
                }
            }
        }
        return count;
    }

    function loadDataAnimation() {
        const healthbar = document.querySelector('#health-bar span');
        const permutations = document.getElementById('permutations');
        const permutationsSkipped = document.getElementById('permutations-skipped');
        const excecutionTime = document.getElementById('excecution-time');

        const totalPermutations = pieceOrientationsArr[0].length*pieceOrientationsArr[1].length
        *pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length;
        const permutationLocation = 
            a*pieceOrientationsArr[1].length*pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
            +b*pieceOrientationsArr[2].length*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
            +c*pieceOrientationsArr[3].length*pieceOrientationsArr[4].length
            +d*pieceOrientationsArr[4].length
            +e;

        permutations.innerText = `Permutations Searched: ${count}/${totalPermutations}`;
        permutationsSkipped.innerText = `Permutations Skipped With Collisons Optimization: ${permutationLocation-count}`;
        excecutionTime.innerText = `Excecution Time: ${Date.now() - start}ms`;
    }
}

function displaySolution(arr1, arr2, arr3, arr4, arr5) {
    arrayToOrthoDisplay(arr1, colorArr[0], true);
    arrayToOrthoDisplay(arr2, colorArr[1], false);
    arrayToOrthoDisplay(arr3, colorArr[2], false);
    arrayToOrthoDisplay(arr4, colorArr[3], false);
    arrayToOrthoDisplay(arr5, colorArr[4], false);
}

function doesSolutionWork(arr1,arr2,arr3,arr4,arr5) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) {
                if( (arr1[i][j][k]+arr2[i][j][k]+arr3[i][j][k]
                    +arr4[i][j][k]+arr5[i][j][k]) != 1) {
                        return false;
                }
            }
        }
    }
    return true;
}

function getPieceOrientations(piece) {
    let returnArr = [];
    let tempPiece = copy333Array(piece);
    for(let i=0; i<4; i++) {
        tempPiece = rotateForward90(tempPiece);
        for(let j=0; j<4; j++) {
            tempPiece = rotateRight90(tempPiece);
            for(let k=0; k<4; k++) {
                tempPiece = rotateTop90(tempPiece);

                // Shifting
                for(let up=-2; up<=2; up++) {
                    for(let left=-2; left<=2; left++) {
                        for(let front=-2; front<=2; front++) {
                            returnArr.push(shift(tempPiece,up,left,front));
                        }
                    }
                }
            }

        }
    }
    returnArr = deleteDuplicates(returnArr);
    if(returnArr.length == 0) {
        returnArr.push(piece);
    }
    return returnArr;
}


function deleteDuplicates(arr) {
    const returnArr = [];
    for(let i=0; i<arr.length; i++) {
        for(let j=i+1; j<arr.length; j++) {
            hasDuplicate = false;
            if(isSameArray(arr[i],arr[j])) {
                hasDuplicate = true; break;
            }
        }
        if(!hasDuplicate) returnArr.push(arr[i]);
    }
    return returnArr;
}

function isSameArray(arr1, arr2) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) {
                if(arr1[i][j][k] != arr2[i][j][k]) {
                    return false;
                }
            }
        }
    }
    return true;
}


function extractUserInputToPieceArray() {
    returnArr = [];
    pieceArr.forEach((x,i) => {
        returnArr.push(pieceNumToArray(i));
    })
    return returnArr;
}

function rotateTop90(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        let temp = returnArr[i][0][0];
        returnArr[i][0][0] = returnArr[i][0][2];
        returnArr[i][0][2] = returnArr[i][2][2];
        returnArr[i][2][2] = returnArr[i][2][0];
        returnArr[i][2][0] = temp;

        temp = returnArr[i][0][1];
        returnArr[i][0][1] = returnArr[i][1][2];
        returnArr[i][1][2] = returnArr[i][2][1];
        returnArr[i][2][1] = returnArr[i][1][0];
        returnArr[i][1][0] = temp;    
    }
    return returnArr;
}

function rotateForward90(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        let temp = returnArr[2][0][i];
        returnArr[2][0][i] = returnArr[2][2][i];
        returnArr[2][2][i] = returnArr[0][2][i];
        returnArr[0][2][i] = returnArr[0][0][i];
        returnArr[0][0][i] = temp;

        temp = returnArr[2][1][i];
        returnArr[2][1][i] = returnArr[1][2][i];
        returnArr[1][2][i] = returnArr[0][1][i];
        returnArr[0][1][i] = returnArr[1][0][i];
        returnArr[1][0][i] = temp;    
    } 
    return returnArr;
}

function rotateRight90(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        let temp = returnArr[2][i][0];
        returnArr[2][i][0] = returnArr[2][i][2];
        returnArr[2][i][2] = returnArr[0][i][2];
        returnArr[0][i][2] = returnArr[0][i][0];
        returnArr[0][i][0] = temp;

        temp = returnArr[2][i][1];
        returnArr[2][i][1] = returnArr[1][i][2];
        returnArr[1][i][2] = returnArr[0][i][1];
        returnArr[0][i][1] = returnArr[1][i][0];
        returnArr[1][i][0] = temp;    
    } 
    return returnArr;
}

function shift(piece, up, left, front) {
    let tempPiece = copy333Array(piece);
    while(up > 0) {
        if(!canShiftUp(tempPiece)) return new333Array();
        tempPiece = shiftUp(tempPiece);
        up--;
    }
    while(up < 0) {
        if(!canShiftDown(tempPiece)) return new333Array();
        tempPiece = shiftDown(tempPiece);
        up++;
    }
    while(left > 0) {
        if(!canShiftLeft(tempPiece)) return new333Array();
        tempPiece = shiftLeft(tempPiece);
        left--;
    }
    while(left < 0) {
        if(!canShiftRight(tempPiece)) return new333Array();
        tempPiece = shiftRight(tempPiece);
        left++;
    }
    while(front > 0) {
        if(!canShiftFront(tempPiece)) return new333Array();
        tempPiece = shiftFront(tempPiece);
        front--;
    }
    while(front < 0) {
        if(!canShiftBack(tempPiece)) return new333Array();
        tempPiece = shiftBack(tempPiece);
        front++;
    }

    return tempPiece;
}

function shiftUp(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[2][i][j] = returnArr[1][i][j];
            returnArr[1][i][j] = returnArr[0][i][j];
            returnArr[0][i][j] = 0;
        }
    }
    return returnArr;
}

function shiftDown(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[0][i][j] = returnArr[1][i][j];
            returnArr[1][i][j] = returnArr[2][i][j];
            returnArr[2][i][j] = 0;
        }
    }
    return returnArr;
}

function shiftLeft(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[i][j][0] = returnArr[i][j][1];
            returnArr[i][j][1] = returnArr[i][j][2];
            returnArr[i][j][2] = 0;
        }
    }
    return returnArr;
}

function shiftRight(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[i][j][2] = returnArr[i][j][1];
            returnArr[i][j][1] = returnArr[i][j][0];
            returnArr[i][j][0] = 0;
        }
    }
    return returnArr;
}

function shiftFront(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[i][2][j] = returnArr[i][1][j];
            returnArr[i][1][j] = returnArr[i][0][j];
            returnArr[i][0][j] = 0;
        }
    }
    return returnArr;
}

function shiftBack(piece) {
    let returnArr = copy333Array(piece);
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            returnArr[i][0][j] = returnArr[i][1][j];
            returnArr[i][1][j] = returnArr[i][2][j];
            returnArr[i][2][j] = 0;
        }
    }
    return returnArr;
}

function canShiftUp(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[2][i][j] == 1) {
                return false;
            }
        }
    }
    return true;
}

function canShiftDown(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[0][i][j] == 1) {
                return false;
            }
        }
    }
    return true;
}

function canShiftLeft(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[i][j][0] == 1) {
                return false;
            }
        }
    }
    return true;
}

function canShiftRight(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[i][j][2] == 1) {
                return false;
            }
        }
    }
    return true;
}

function canShiftFront(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[i][2][j] == 1) {
                return false;
            }
        }
    }
    return true;
}

function canShiftBack(piece) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            if(piece[i][0][j] == 1) {
                return false;
            }
        }
    }
    return true;
}


//FUNCTIONS - MATH
function new333Array() {
    //[layer(bot to top)][row(back to front)][col(left to rigth)]
    return  [
        [[0,0,0],[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0],[0,0,0]]
    ];
}

function copy333Array(arr) {
    const returnArr = new333Array();
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) {
                returnArr[i][j][k] = arr[i][j][k];
            }
        }
    }
    return returnArr;
}

function addArray(arr1, arr2) {
    const returnArr = new333Array();
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) {
                if(arr1[i][j][k]==1 || arr2[i][j][k]==1) {
                    returnArr[i][j][k] = 1;
                }
            }
        }
    }
    return returnArr;
}

function isArrayFilled(arr) {
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) {
                if(arr[i][j][k] == 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

function pieceNumToArray(pieceNum) {
    const bot = Array.from(squareContainerArr[3*pieceNum + 0].children);
    const mid = Array.from(squareContainerArr[3*pieceNum + 1].children);
    const top = Array.from(squareContainerArr[3*pieceNum + 2].children);

    return layersToArray(bot, mid, top);


    function layersToArray(bot, mid, top) {
        const returnArr = new333Array();
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(bot[i*3+j].classList.contains('selected')) returnArr[0][i][j] = 1;
                if(mid[i*3+j].classList.contains('selected')) returnArr[1][i][j] = 1;
                if(top[i*3+j].classList.contains('selected')) returnArr[2][i][j] = 1;
            }
        }
        return returnArr;
    }
}

function displayAllOrtho() {
    pieceArr.forEach((x,i) => {
        arrayToOrthoDisplay(pieceNumToArray(i),colorArr[i],false);
    })
}

function arrayToOrthoDisplay(arr, color, clearOrhto=true) {
    if(clearOrhto)  clearOrthoDisplay();
    addFrontView();
    addRightView();
    addTopView();
    addBackView();
    addLeftView();
    addBotView();

    function clearOrthoDisplay() {
        orthoContainerArr.forEach(x => {
            Array.from(x.children).forEach(y => {
                y.classList.remove('selected');
                colorArr.forEach(z => {
                    y.classList.remove(z);
                })
            })
        })
    }

    function addFrontView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[i][2][j] == 1) {
                    Array.from(orthoFront.children)[3*(2-i)+j].classList.add(color, 'selected');
                }
            }
        }
    }

    function addRightView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[i][j][2] == 1) {
                    Array.from(orthoRight.children)[3*(2-i)+(2-j)].classList.add(color, 'selected');
                }
            }
        }
    }

    function addTopView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[2][i][j] == 1) {
                    Array.from(orthoTop.children)[3*i+j].classList.add(color, 'selected');
                }
            }
        }
    }

    function addBackView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[i][0][j] == 1) {
                    Array.from(orthoBack.children)[3*(2-i)+(2-j)].classList.add(color, 'selected');
                }
            }
        }
    }

    function addLeftView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[i][j][0] == 1) {
                    Array.from(orthoLeft.children)[3*(2-i)+j].classList.add(color, 'selected');
                }
            }
        }
    }

    function addBotView() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(arr[0][i][j] == 1) {
                    Array.from(orthoBot.children)[3*(2-i)+j].classList.add(color, 'selected');
                }
            }
        }
    }
}


//FUNCTIONS - GENERAL
function addEventListenerForPieces() {
    squareContainerArr.forEach(x => {
        Array.from(x.children).forEach(y => {
            y.addEventListener('click', () => {
                if(y.classList.contains('selected')) {
                    y.classList.remove('selected');
                } else {
                    y.classList.add('selected');
                }
            });
        })
    })
}

function addTestingOnlyIndex() {
    squareContainerArr.forEach(x => {
        Array.from(x.children).forEach((y,i) => {
            y.innerText = i;
        })
    })
    const orthoContainer = document.querySelectorAll('[data-orthoContainer]');
    orthoContainer.forEach((x,i) => {})
    orthoContainer.forEach(x => {
        Array.from(x.children).forEach((y,i) => {
            y.innerText = i;
        })
    })
}

function enableShowOrthographicButton() {
    pieceArr.forEach((x,i) => {
        x.querySelector('button').addEventListener('click', () => {
            arrayToOrthoDisplay(pieceNumToArray(i), colorArr[i]);
        })
    })
}
