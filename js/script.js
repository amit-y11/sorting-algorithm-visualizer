const main_body = document.querySelector(".main-body");
const start_btn = document.querySelector("#start-btn");
const reset_btn = document.querySelector('#reset-btn');
const algo_type = document.querySelector('#algo-type');
const speed = document.querySelector('#speed');
const darkMode = document.querySelector('#darkMode');
const arr = [];
const arr_color = [];
let speed_val = 15; // slow -> 50 ms normal -> 15 ms fast -> 5 ms
let isSorting = false;


for(let i=0;i<30;i++){
    let num = getRandomLength();
    arr.push(num);
    arr_color.push("bg-primary");
}


function getRandomLength(){
    return (Math.random() * 500);
}


function toggleStartButton(){
	if (algo_type.value < "1" || isSorting) {
		start_btn.setAttribute("disabled", true);
	} else {
		start_btn.removeAttribute("disabled");
	}
}


function speedChanged(){
    if(speed.value == 0)
        speed_val = 50;
    else if(speed.value == 1)
        speed_val = 15;
    else
        speed_val = 5;
}


function draw(){
    main_body.innerHTML = '';
    for(let i in arr){
        const height = arr[i] + 'px';
        div = document.createElement('div');
        div.setAttribute("id",i);
        div.setAttribute("class",`col ${arr_color[i]} poles`);
        div.style.height = height;
        div.style.border = '1px solid black';
        main_body.appendChild(div);
    }
}


draw();


function reset(){
    isSorting = false;
    arr.splice(0,arr.length);
    arr_color.splice(0,arr_color.length);
    for(let i=0;i<30;i++){
        let num = getRandomLength();
        arr.push(num);
        arr_color.push("bg-primary");
    } 
    draw();
    toggleStartButton();
}


function scan(index){
    document.getElementById(index).classList.remove("bg-primary");
    document.getElementById(index).classList.add("bg-warning");
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function visualizeAlgo(){
    // set speed as selected in the options
    speedChanged();

    if (algo_type.value === '1')
        visualizeSelectionSort();
    else if(algo_type.value === '2')
        visualizeInsertionSort();
    else if(algo_type.value === '3') {
        visualizeBubbleSort();
    }
}

async function visualizeSelectionSort(){
    let n = arr.length;
    isSorting = true;

    toggleStartButton();

    for(let i=0; i <= n - 2; i++){

        scan(i);
        await sleep(speed_val);
        let min = arr[i];

        for(let j = i + 1; j < n; j++){

            if(isSorting){

                scan(j);
                await sleep(speed_val);
                if(arr[j] < min){
                    min = arr[j];
                    let temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                }
                draw();
            }
            else{
                return;
            }
        }
        arr_color[i]= "bg-success";
    }

    arr_color[n-1] = "bg-success";
    arr_color[n-2] = "bg-success";
    isSorting = false;

    draw();
    toggleStartButton();
}


async function visualizeInsertionSort(){
    let n = arr.length;
    isSorting = true;

    toggleStartButton();

    for(let i=1; i < n; i++){

        scan(i);
        await sleep(speed_val);
        let k = arr[i];
        let j = i -1;

        while(j>=0 && arr[j]>k){

            if(isSorting){

                scan(j+1);
                await sleep(speed_val);
                arr[j+1]=arr[j];
                arr[j] = k;
                j=j-1;
                draw();
            }
            else{
                return;
            }
        }
        arr[j+1]=k;
    }
    isSorting = false;

    for(let i=0; i < n; i++){
        scan(i);
        arr_color[i]= "bg-success";
        await sleep(5);
        draw();
    }

    toggleStartButton();
}


async function visualizeBubbleSort() {
    const n = arr.length;
    isSorting = true;

    toggleStartButton();
    for(let i = 0; i<n-1; i++) {
        for(let j=0; j<n-i-1; j++) {
            if(isSorting) {
                scan(j);
                await sleep(speed_val);
                if(arr[j] > arr[j+1]) {
                    scan(j+1);
                    await sleep(speed_val);
                    [arr[j] , arr[j+1]] = [arr[j+1], arr[j]];
                }
                draw();
            }
            else {
                return;
            }
        }
        arr_color[n-i-1]= "bg-success";
    }

    arr_color[0] = "bg-success";
    isSorting = false;

    draw();
    toggleStartButton();
}

function themeChanged() {
    if (darkMode.checked == false) {
        document.body.style.backgroundColor = "rgb(206, 203, 203)";
        document.body.style.color = "black";
        localStorage.setItem('themeState','light');

    } else if (darkMode.checked == true) {
        document.body.style.backgroundColor = "rgb(19, 19, 19)";
        document.body.style.color = "white";
        localStorage.setItem('themeState','dark');
    }
}


function setTheme(){
    let themeState = localStorage.getItem('themeState');
    if (themeState == 'dark'){
        darkMode.checked = true;
        document.body.style.backgroundColor = "rgb(19, 19, 19)";
        document.body.style.color = "white";
    }
    else{
        document.body.style.backgroundColor = "rgb(206, 203, 203)";
        document.body.style.color = "black";
    }
}

setTheme();


// Event Listeners
start_btn.addEventListener("click",visualizeAlgo);
reset_btn.addEventListener("click",reset);
algo_type.addEventListener("change",toggleStartButton);
speed.addEventListener("change",speedChanged);
darkMode.addEventListener('change', themeChanged);
