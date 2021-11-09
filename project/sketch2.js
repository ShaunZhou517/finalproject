let collages=new Array()
collages[0]=collage1
collages[1]=collage2
collages[2]=collage3

let oBox = document.querySelector('.box')
let oDivcollages = document.querySelector('.collages[i]')
// let oDiv2 = document.querySelector('.collage2')
//The position of the image relative to the browser when the mouse is pressed
let x 
let y 
let DELTA = 1.1 // The magnification of each zoom in/out

// Mouse down to get the position and add event listener
const mouseDown = e => {
    for(i=0;i<=collages.length;i++){
    let transfcollages = getTransform(oDivcollages)
    //Image initial position
    x = e.clientX - transfcollages.transX 
    y = e.clientY - transfcollages.transY 
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
}
}

// Mouse drag update transform
const mouseMove = e => {
    for(i=0;i<=collages.length;i++){
    let multiple = getTransform(oDivcollages).multiple
    let moveX = e.clientX - x 
    let moveY = e.clientY - y 
    let newTransfcollages= limitBorder(oDivcollages, oBox, moveX, moveY, multiple)
    oDivcollages.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransfcollages.transX}, ${newTransfcollages.transY})`
}
}

// Mouse up Remove the listener
const mouseUp = () => {
    for(i=0;i<=collages.length;i++){
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
}
}

// Mouse wheel zoom update transform
const zoom = e => {
    let transf1 = getTransform(oDivcollages)
    if (e.deltaY < 0) {
        transfcollages.multiple *= DELTA // 放大DELTA倍
    } else {
        transfcollagesmultiple /= DELTA // 缩小DELTA倍
    }
    let newTransfcollages = limitBorder(oDivcollages, oBox, transfcollages.transX, transfcollages.transY, transfcollages.multiple)
    oDivcollages.style.transform = `matrix(${transfcollages.multiple}, 0, 0, ${transfcollages.multiple}, ${newTransfcollages.transX}, ${newTransfcollages.transY})`
}

/**
  * Obtain the transform matrix through getComputedStyle and split it with split
  * Such as oDiv's transform: translate(100, 100);
  * getComputedStyle can get "matrix(1, 0, 0, 1, 100, 100)"
  * When the transform attribute does not rotate rotate and stretch skew
  * The 1, 4, 5, and 6 parameters of metrix are multiples in the x direction, multiples in the y direction, offset in the x direction, and offset in the y direction
  * Respectively use string segmentation to get the corresponding parameters
  */
const getTransform = DOM => {
    let arr = getComputedStyle(DOM).transform.split(',')
    return {
        transX: isNaN(+arr[arr.length - 2]) ? 0 : +arr[arr.length - 2], // 获取translateX
        transY: isNaN(+arr[arr.length - 1].split(')')[0]) ? 0 : +arr[arr.length - 1].split(')')[0], // 获取translateX
        multiple: +arr[3] // 获取图片缩放比例
    }
}

/**
  * Get the x, y offset of the transform bounded by the border
  * innerDOM: inner box DOM
  * outerDOM: border box DOM
  * moveX: x moving distance of the box
  * moveY: the y moving distance of the box
  */
const limitBorder = (innerDOM, outerDOM, moveX, moveY, multiple) => {
    let { clientWidth: innerWidth, clientHeight: innerHeight, offsetLeft: innerLeft, offsetTop: innerTop } = innerDOM
    let { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM
    let transX
    let transY
    //When the enlarged picture exceeds the box, the picture can be dragged to align with the frame at most
    if (innerWidth * multiple > outerWidth || innerHeight * multiple > outerHeight) {
        if (innerWidth * multiple > outerWidth && innerWidth * multiple > outerHeight) {
            transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        } else if (innerWidth * multiple > outerWidth && !(innerWidth * multiple > outerHeight)) {
            transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        } else if (!(innerWidth * multiple > outerWidth) && innerWidth * multiple > outerHeight) {
            transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        }
    }
    // When the picture is smaller than the box size, the picture cannot be dragged out of the frame
    else {
        transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
    }
    return { transX, transY }
}

const init = () => {
    // Prohibit text/picture selection
    document.addEventListener('selectstart', e => { e.preventDefault() })
    // Mouse down event
    oDivcollages.addEventListener('mousedown', mouseDown)
    // Picture zoom
    oDivcollages.addEventListener('wheel', zoom)
}

collages[i].init()