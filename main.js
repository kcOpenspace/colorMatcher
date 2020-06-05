/*
COLOR MATCHER
BY KEN CHAN
Last Modified: May 2020

XKCD COLOR List
https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/xkcd.json

Main JS calculates RGB and CMYK Values from Hex and Gets all Colors in Table format
Color comparison in compareColor.js
*/
/********************************************************************************* */

const tableBody = document.querySelector('#colorTable tbody');

//Gets The Full list of Colors from XKCD JSON LIST
function getAll() {
    
    tableBody.innerHTML = "";

    fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/xkcd.json')
        .then(res => res.json())
        .then(colors => {
            var count =0;
            colors.colors.forEach(color => {
                count++;
                const colorCell = document.createElement('td');
                const nameCell = document.createElement('td');
                const hexCell = document.createElement('td');
                const rgbCell = document.createElement('td');
                const cmykCell = document.createElement('td');

                const colorName = color.color;
                const colorHex = color.hex;

                //convert hex to rgb
                const colorRGB = HEX2RGB(colorHex);
                //convert hex to CMYK
                const colorCMYK = hexToCMYK(colorHex);

                colorCell.style.background = colorHex;
                nameCell.innerText = colorName;
                hexCell.innerText = colorHex;
                rgbCell.innerText = colorRGB;
                cmykCell.innerText = colorCMYK;

                const row = document.createElement('tr');
                row.appendChild(colorCell);
                row.appendChild(nameCell);
                row.appendChild(hexCell);
                row.appendChild(rgbCell);
                row.appendChild(cmykCell);
                
                tableBody.append(row);
                
                return count;
            })
            console.log(count);
        })
        .catch(err => {
            console.log("Error Loading Json Colors");
        })

}

function clearAll() {
    tableBody.innerHTML = "";
}


// Convert Hex To RGB
// Function Code borrowed from :
// https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a#file-hex2rgb-js

function HEX2RGB (hex) {
    "use strict";
    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }
    if ((hex.length < 2) || (hex.length > 6)) {
        return false;
    }
    var values = hex.split(''),
        r,
        g,
        b;

    if (hex.length === 2) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = r;
        b = r;
    } else if (hex.length === 3) {
        r = parseInt(values[0].toString() + values[0].toString(), 16);
        g = parseInt(values[1].toString() + values[1].toString(), 16);
        b = parseInt(values[2].toString() + values[2].toString(), 16);
    } else if (hex.length === 6) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = parseInt(values[2].toString() + values[3].toString(), 16);
        b = parseInt(values[4].toString() + values[5].toString(), 16);
    } else {
        return false;
    }
    return [r, g, b];
}


//Convert Hex to CMYK
//Function Borrowed from:
//http://www.javascripter.net/faq/hex2cmyk.htm
//Minor change to Rounding the return values to whole numbers

function hexToCMYK (hex) {
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;
   
    hex = (hex.charAt(0)=="#") ? hex.substring(1,7) : hex;
   
    if (hex.length != 6) {
     alert ('Invalid length of the input hex value!');   
     return; 
    }
    if (/[0-9a-f]{6}/i.test(hex) != true) {
     alert ('Invalid digits in the input hex value!');
     return; 
    }
   
    var r = parseInt(hex.substring(0,2),16); 
    var g = parseInt(hex.substring(2,4),16); 
    var b = parseInt(hex.substring(4,6),16); 
   
    // BLACK
    if (r==0 && g==0 && b==0) {
     computedK = 1;
     return [0,0,0,1];
    }
   
    computedC = 1 - (r/255);
    computedM = 1 - (g/255);
    computedY = 1 - (b/255);
   
    var minCMY = Math.min(computedC,Math.min(computedM,computedY));
   
    computedC = Math.round(((computedC - minCMY) / (1 - minCMY))*100);
    computedM = Math.round(((computedM - minCMY) / (1 - minCMY))*100);
    computedY = Math.round(((computedY - minCMY) / (1 - minCMY))*100);
    computedK = Math.round(minCMY*100);
   
    return [computedC,computedM,computedY,computedK];
}
