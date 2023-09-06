import { MultiColorThreeScene } from "./multiColorThreeScene";
import { ThreeScene } from "./threeScene";

const orthoContainerArr = document.querySelectorAll('[data-orthoContainer]');   //references to the six orthographic views on top
const squareContainerArr = document.querySelectorAll('[data-squareContainer]'); //references to the 18 square grids


const pieceSceneArr = [];   //Three scence objects of the 6 scenes besdies the grids
//create all 6 scences and store them in the pieceSceneArr
initPieceScences();
function initPieceScences() {
    const pieceSceneDomArr = document.querySelectorAll('[data-pieceScene]'); //refrences to the 6 scences beside the grids DOM
    pieceSceneDomArr.forEach( (scenceDom, scenceDomIndex) => {

        //create a new scence
        const scene = new ThreeScene(scenceDom);

        //give the scence the right color
        const colors = [
            0x0000ff, // Blue
            0x008000, // Green
            0xff0000, // Red
            0x800080, // Purple
            0xffff00, // Yellow
        ];        
        scene.setCubeColor(colors[scenceDomIndex]);

        //render the scence with its corresponding cubeGrid
        scene.setCubeGrid(pieceNumToArray(scenceDomIndex));
        scene.createCubesWithOutlines();

        //make the scence respond to clicks to its corresponding grids
        //scenes 0-6 correspond to grids 0-17
        squareContainerArr[scenceDomIndex * 3].addEventListener('click', (container, containerIndex) => {
            scene.setCubeGrid(pieceNumToArray(scenceDomIndex));
            scene.createCubesWithOutlines();
        })
        squareContainerArr[scenceDomIndex * 3 + 1].addEventListener('click', (container, containerIndex) => {
            scene.setCubeGrid(pieceNumToArray(scenceDomIndex));
            scene.createCubesWithOutlines();
        })
        squareContainerArr[scenceDomIndex * 3 + 2].addEventListener('click', (container, containerIndex) => {
            scene.setCubeGrid(pieceNumToArray(scenceDomIndex));
            scene.createCubesWithOutlines();
        })

        pieceSceneArr.push(scene);
    })
}

//create the multiColorScene
const solutionSceneDOM = document.querySelector('[data-solutionIsometric]');
const solutionScene = new MultiColorThreeScene(solutionSceneDOM);
initSolutionScene();

function initSolutionScene() {
    solutionScene.setCubeGrid([
        [[1,1,1],[1,1,1],[1,1,1]],
        [[1,1,1],[1,1,1],[1,1,1]],
        [[1,1,1],[1,1,1],[1,1,1]]
    ]);
    window.addEventListener('renderIsometric', () => {
        console.log('lsdjflksjdflk');

        const bluePiece = JSON.parse(localStorage.getItem('bluePiece'));
        const greenPiece = JSON.parse(localStorage.getItem('greenPiece'));
        const redPiece = JSON.parse(localStorage.getItem('redPiece'));
        const purplePiece = JSON.parse(localStorage.getItem('purplePiece'));
        const yellowPiece = JSON.parse(localStorage.getItem('yellowPiece'));

        //corresponding color values
        const colors = [
            0x0000ff, // Blue
            0x008000, // Green
            0xff0000, // Red
            0x800080, // Purple
            0xffff00, // Yellow
        ];     
        
        //create the color 3x3x3 array
        const colorArr = new333Array();
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                for(let k=0; k<3; k++) {
                    if(bluePiece[i][j][k] == 1) {
                        colorArr[i][j][k] = colors[0];
                    }
                    if(greenPiece[i][j][k] == 1) {
                        colorArr[i][j][k] = colors[1];
                    }
                    if(redPiece[i][j][k] == 1) {
                        colorArr[i][j][k] = colors[2];
                    }
                    if(purplePiece[i][j][k] == 1) {
                        colorArr[i][j][k] = colors[3];
                    }
                    if(yellowPiece[i][j][k] == 1) {
                        colorArr[i][j][k] = colors[4];
                    }
                }
            }
        }

        //set the colors to the scene
        solutionScene.setColors(colorArr);

        //render the isometric view
        solutionScene.createCubesWithOutlines();
        
    })
}


window.addEventListener('keypress', printAll);

function printAll() {
    console.log(orthoFront);
    console.log(squareContainerArr);
    const arr = pieceNumToArray(0);
    console.log(arr);
}

//gets a 3x3x3 array of the piece representation of the nth grid set
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

//creates empty 3x3x3 array
function new333Array() {
    //[layer(bot to top)][row(back to front)][col(left to rigth)]
    return  [
        [[0,0,0],[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0],[0,0,0]],
        [[0,0,0],[0,0,0],[0,0,0]]
    ];
}