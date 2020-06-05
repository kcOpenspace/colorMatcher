/*
Comparison JS file
Convert Hex into RGB values and compare inputted color values with existing list of colors to find
distance of colors and stash it into an array which is outputted to a new table body, 
with most similiar colors based on RGB distance.
=============================================================================

Created By: Ken Chan
Last Modified: May 2020
*/


//Listen to Enter Key event on input to execute colorMatch function
var input = document.getElementById('selectedColor');
input.addEventListener('keydown', function(event) {
    if(event.keyCode === 13){
        event.preventDefault();
        const inputColor = document.getElementById('selectedColor').value;
        validateInput(inputColor);
    }
})

//Validate input values for correct Hex Color input
//Had a problem validating through one conditional IF statement with all conditions
function validateInput(inputText) {
    if (typeof inputText !== 'string') {
        alert('Invalid Hex Color values entered. Example of a valid Hex is #fff000');
    }
    else{
        if (inputText.substring(0,1)==='#' && inputText.length===7){
            //remove Hash from the string
            inputText = inputText.substring(1);
            if (!isNaN('0x'+inputText)) {
                colorMatch();
            }
            else {
                alert('Invalid Hex Color values entered. Example of a valid Hex is #fff000');
            }
        }
        else {
            alert('Invalid Hex Color values entered. Example of a valid Hex is #fff000');
        }
    }
}

function convertInput() {
    //get inputted color
    const inputColor = document.getElementById('selectedColor').value;

    //convert to RGB
    const colorRGB = HEX2RGB(inputColor);
    return colorRGB;
}

function colorMatch() {
    // The Selected Color RGB;
    const selectedRGB = convertInput();

    //Match array to store matching colors
    var match = [];

    //getAll list of colors and compare
    fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/xkcd.json')
        .then(res => res.json())
        .then(colors => {

            //Loop for list of colors
            var count =0;
            colors.colors.forEach(color => {

                //TODO : CSS COlOR VALIDATOR

                const colorName = color.color;
                const colorHex = color.hex;
                const colorRGB = HEX2RGB(colorHex); //convert hex to rgb
                const colorCMYK = hexToCMYK(colorHex); //convert hex to CMYK

                //Compare each color in list to selected color
                var percent = compareColor(selectedRGB,colorRGB);
                console.log('p:'+percent);

                //lower percenteage means similiar, percentage < 10% gives best solution
                //increase the percentage to widen the range of matches
                if (percent < 10) {
                    //push the matching color object into the match array
                    match.push({'p':percent, 'color':colorName, 'hex':colorHex, 'rgb':colorRGB, 'cmyk':colorCMYK});
                    count++;
                }


                return count;
            })

            //SORT the matches by lowest percentage difference
            //Best Match at the top of array
            match.sort((x,y) => x.p - y.p);

            console.log(match);
            console.log(count);

            displayMatch(match);
            
        })
        .catch(err => {
            console.log("Error Comparing Json Colors");
        })
        
}


//COMPARE COLORS BY DISTANCE
//This function compares two colors by their distance using the rmeans distance formula
function compareColor(selectedColor,colorRGB) {
    const color1 = selectedColor;
    const color2 = colorRGB;
    console.log('color1: '+color1);
    console.log('color2: '+color2);

    var r1 = color1[0];
    var g1 = color1[1];
    var b1 = color1[2];

    var r2 = color2[0];
    var g2 = color2[1];
    var b2 = color2[2];
    
    var r = Math.abs(r1-r2);
    var g = Math.abs(g1-g2);
    var b = Math.abs(b1-b2);

    //color distance with rmean
    var rmean = Math.abs(r1+r2)/2;
    var d = Math.sqrt( ((512+rmean)*r*r) + 4*g*g + ((767-rmean)*b*b) );
    var p = d.toFixed(4)/100;
    console.log('d:'+d);
    
    //return the Percentage difference value
    return p;
}


//DISPLAY THE MATCHING RESULTS
function displayMatch(match) {

    //If the matching array has more than 50 colors then limit colors to first 50 by removing any after
    if (match.length > 50) {
        match.splice(50,match.length);
    }
    
    //Show divider text
    const divider = document.querySelector('.divider');
    divider.style.display = 'block';

    //Empty table body
    tableBody.innerHTML = "";

    //create a new table body and populate each row
    match.forEach(match => {

        const colorCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const hexCell = document.createElement('td');
        const rgbCell = document.createElement('td');
        const cmykCell = document.createElement('td');
    
        const colorName = match.color;
        const colorHex = match.hex;
        const colorRGB = match.rgb;
        const colorCMYK = match.cmyk;

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

    })
}
