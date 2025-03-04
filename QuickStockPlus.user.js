// ==UserScript==
// @name         Quick Stock+
// @version      1
// @description  Extremely customizable GUI Quick Stock filtering, no code editing required
// @author       Flutterz
// @match        https://www.neopets.com/quickstock.phtml*
// @icon         https://i.imgur.com/jU6IJ7C.png
// @grant        none
// ==/UserScript==

//HOW TO USE THIS SCRIPT
//Simply open Quick Stock and click the Quick Stock+ button
//There are a few filtering rules loaded by default to hide all donate and discard buttons, and to do stuff with nerkmids and codestones, feel free to edit or remove them
//Rules are applied in ascending order e.g. if rule 1 sets "Negg" to Stock and rule 5 sets "Negg" to Deposit, "Negg" will be set to Deposit
//To rearrange rules, edit a rule's number - all other rules will be shifted over so that the rule ends up in the correct position
//When using partial or exact match, you can list multiple items by using a semicolon ; between each item. Note: this does not apply to regex
//Use the Test Match button for a preview of which of the items currently in your quick stock fit the filter
//Colors can be hex colors (#ff10ab) or named colors that CSS supports (cyan, beige, etc.)
//Only one rule can be edited at a time, and no changes are saved until you press the buttons to save or delete a rule!




//CODE STARTS HERE
//Declaring all the elements used by the custom menu
//Main panel

//Check browser to use different styles because CSS is stupid
let isChrome = window.navigator.userAgent.includes("Chrome");

let panel = document.createElement('div');
//Different styles based on chrome or firefox because CSS is stupid
if (isChrome){
    panel.style="position:relative; right:-830px; top:650px; margin-right:-400px; margin-top:-600px; width:350px; height:600px; background-color:white; border-style:solid; display:none;";
} else {
    panel.style="position:relative; right:-830px; top:80px; margin-right:-400px; margin-top:-600px; width:350px; height:600px; background-color:white; border-style:solid; display:none;";
}

document.getElementsByClassName("content")[0].before(panel);

//Button to open panel
let img = document.createElement('img');
img.setAttribute('src',"data:image/png;base64,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");

//Different styles based on chrome or firefox because CSS is stupid
if (isChrome){
    img.style="position:relative; right:-810px; top:100px; margin:-50px; cursor: pointer;";
} else {
    img.style="position:absolute; right:60px; top:280px; margin:-50px; cursor: pointer; z-index:5;";
}

img.onclick = () => {
    togglePanel();
};
document.getElementsByClassName("content")[0].before(img);



//Text bits
let panelHeader = document.createElement('div');
panelHeader.innerHTML = "<br><center> ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Quick Stock+</center><br><br><br>Rule Number:<br><br>Match: ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ NP ­ ­ ­ ­ ­ ­ NC<br><br><br><br>Actions:<br><br> ­ ­ ­ ­ No Action<br><br> ­ ­ ­ ­ Check box:<br><br> ­ ­ ­ ­ Uncheck box:<br><br> ­ ­ ­ ­ Disable box:<br><br> ­ ­ ­ ­ Re-enable box:<br><br> ­ ­ ­ ­ No Color<br><br> ­ ­ ­ ­ Single Color:<br><br> ­ ­ ­ ­ Alternate Colors:<br><br> ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Rule Enabled:";
panelHeader.style="position:relative; left:5px; font-size:16px; white-space:pre;";
panel.append(panelHeader);


//Area for warning messages
let warningMsg = document.createElement('div');
warningMsg.style="position:absolute; left:145px; margin:-100px; width:340px; top:107px; z-index:5; font-size:9px; color:red;";
panel.prepend(warningMsg);

//List of rules
let ruleSelect = document.createElement('select');
ruleSelect.style="position:absolute; left:105px; margin:-100px; width:340px; top:150px; z-index:5; font-size:10px;";
panel.prepend(ruleSelect);
ruleSelect.appendChild(document.createElement('option'));
ruleSelect.children[0].innerText = "Add new Rule...";
ruleSelect.children[0].value = "New Rule";
ruleSelect.oninput = () => {
    ruleSelected();
};

//Rule number
let ruleNumberBox = document.createElement('input');
ruleNumberBox.style="position:absolute; left:176px; margin:-50px; width:50px; top:146px; z-index:5;";
panel.prepend(ruleNumberBox);

//Select exact partial or regex match
let matchTypeSelect = document.createElement('select');
matchTypeSelect.style="position:absolute; left:115px; margin:-50px; width:65px; top:184px; z-index:5;";
panel.prepend(matchTypeSelect);
matchTypeSelect.appendChild(document.createElement('option'));
matchTypeSelect.appendChild(document.createElement('option'));
matchTypeSelect.appendChild(document.createElement('option'));
matchTypeSelect.children[0].innerText = "Partial";
matchTypeSelect.children[0].value="p";
matchTypeSelect.children[1].innerText = "Exact";
matchTypeSelect.children[1].value="e";
matchTypeSelect.children[2].innerText = "Regex";
matchTypeSelect.children[2].value="r";

//Match string
let matchBox = document.createElement('input');
matchBox.style="position:absolute; left:175px; margin:-150px; width:300px; top:322px; z-index:5;";
panel.prepend(matchBox);

//Toggle filtering NP items
let npCheck = document.createElement('input');
npCheck.type = 'checkbox';
npCheck.checked = true;
npCheck.style="position:absolute; left:184px; margin:-20px; top:157px; z-index:5;";
panel.prepend(npCheck);

//Toggle filtering NC items
let ncCheck = document.createElement('input');
ncCheck.type = 'checkbox';
ncCheck.checked = true;
ncCheck.style="position:absolute; left:248px; margin:-20px; top:157px; z-index:5;";
panel.prepend(ncCheck);

//Test the match criteria
let matchButton = document.createElement('button');
matchButton.style="position:absolute; left:305px; margin:-50px; top:183px; z-index:5;";
matchButton.innerText = "Test Match";
panel.prepend(matchButton);
matchButton.onclick = () => {
    testMatch();
};

//Summary of match test
let matchReport = document.createElement('div');
matchReport.style="position:absolute; left:305px; margin:-50px; top:160px; z-index:5; font-size:9px;";
matchReport.innerText = "";
panel.prepend(matchReport);

//Action type selection
let radio1 = document.createElement('input');
radio1.type = 'radio';
radio1.name = 'qsRadio1';
radio1.id = "r1";
radio1.style="position:absolute; left:27px; margin:-20px; top:270px; z-index:5;";
radio1.checked = "checked";
panel.prepend(radio1);
radio1.onclick = () => {
    toggleAction(-1);
};

let radio2 = document.createElement('input');
radio2.type = 'radio';
radio2.name = 'qsRadio1';
radio2.style="position:absolute; left:27px; margin:-20px; top:308px; z-index:5;";
panel.prepend(radio2);
radio2.onclick = () => {
    toggleAction(1);
};

let radio3 = document.createElement('input');
radio3.type = 'radio';
radio3.name = 'qsRadio1';
radio3.style="position:absolute; left:27px; margin:-20px; top:346px; z-index:5;";
panel.prepend(radio3);
radio3.onclick = () => {
    toggleAction(2);
};

let radio4 = document.createElement('input');
radio4.type = 'radio';
radio4.name = 'qsRadio1';
radio4.style="position:absolute; left:27px; margin:-20px; top:384px; z-index:5;";
panel.prepend(radio4);
radio4.onclick = () => {
    toggleAction(3);
};

let radio5 = document.createElement('input');
radio5.type = 'radio';
radio5.name = 'qsRadio1';
radio5.style="position:absolute; left:27px; margin:-20px; top:422px; z-index:5;";
panel.prepend(radio5);
radio5.onclick = () => {
    toggleAction(4);
};

//Color change selection
let radio6 = document.createElement('input');
radio6.type = 'radio';
radio6.name = 'qsRadio2';
radio6.style="position:absolute; left:27px; margin:-20px; top:460px; z-index:5;";
radio6.checked = "checked";
panel.prepend(radio6);
radio6.onclick = () => {
    toggleColor(-1);
};

let radio7 = document.createElement('input');
radio7.type = 'radio';
radio7.name = 'qsRadio2';
radio7.style="position:absolute; left:27px; margin:-20px; top:498px; z-index:5;";
panel.prepend(radio7);
radio7.onclick = () => {
    toggleColor(1);
};

let radio8 = document.createElement('input');
radio8.type = 'radio';
radio8.name = 'qsRadio2';
radio8.style="position:absolute; left:27px; margin:-20px; top:536px; z-index:5;";
panel.prepend(radio8);
radio8.onclick = () => {
    toggleColor(2);
};

//Action target selections
let boxSelect = [];
boxSelect[1] = document.createElement('select');
boxSelect[1].style="position:absolute; left:180px; margin:-50px; width:70px; top:338px; z-index:5;";
boxSelect[1].disabled = true;
panel.prepend(boxSelect[1]);
for (let i = 0; i < 7; i++){
    let inum = i + 2;
    boxSelect[1].appendChild(document.createElement('option'));
    boxSelect[1].children[i].innerText = tlAct(inum);
    boxSelect[1].children[i].value = inum;
}

boxSelect[2] = document.createElement('select');
boxSelect[2].style="position:absolute; left:200px; margin:-50px; width:70px; top:376px; z-index:5;";
boxSelect[2].disabled = true;
panel.prepend(boxSelect[2]);
for (let i = 0; i < 7; i++){
    let inum = i + 2;
    boxSelect[2].appendChild(document.createElement('option'));
    boxSelect[2].children[i].innerText = tlAct(inum);
    boxSelect[2].children[i].value = inum;
}

boxSelect[3] = document.createElement('select');
boxSelect[3].style="position:absolute; left:190px; margin:-50px; width:70px; top:414px; z-index:5;";
boxSelect[3].disabled = true;
panel.prepend(boxSelect[3]);
for (let i = 0; i < 7; i++){
    let inum = i + 2;
    boxSelect[3].appendChild(document.createElement('option'));
    boxSelect[3].children[i].innerText = tlAct(inum);
    boxSelect[3].children[i].value = inum;
}

boxSelect[4] = document.createElement('select');
boxSelect[4].style="position:absolute; left:210px; margin:-50px; width:70px; top:452px; z-index:5;";
boxSelect[4].disabled = true;
panel.prepend(boxSelect[4]);
for (let i = 0; i < 7; i++){
    let inum = i + 2;
    boxSelect[4].appendChild(document.createElement('option'));
    boxSelect[4].children[i].innerText = tlAct(inum);
    boxSelect[4].children[i].value = inum;
}

//Color selections
let colorBox = [];
colorBox[1] = document.createElement('input');
colorBox[1].style="position:absolute; left:175px; margin:-30px; width:60px; top:506px; z-index:5;";
colorBox[1].disabled = true;
panel.prepend(colorBox[1]);
colorBox[1].oninput = () => {
    updateColor(colorBox[1]);
};

colorBox[2] = document.createElement('input');
colorBox[2].style="position:absolute; left:210px; margin:-30px; width:60px; top:544px; z-index:5;";
colorBox[2].disabled = true;
panel.prepend(colorBox[2]);
colorBox[2].oninput = () => {
    updateColor(colorBox[2]);
};

colorBox[3] = document.createElement('input');
colorBox[3].style="position:absolute; left:285px; margin:-30px; width:60px; top:544px; z-index:5;";
colorBox[3].disabled = true;
panel.prepend(colorBox[3]);
colorBox[3].oninput = () => {
    updateColor(colorBox[3]);
};

//Toggle if rule is enabled
let enabledCheck = document.createElement('input');
enabledCheck.type = 'checkbox';
enabledCheck.checked = true;
enabledCheck.style="position:absolute; left:250px; margin:-20px; top:575px; z-index:5;";
panel.prepend(enabledCheck);

//Save or create the rule
let saveButton = document.createElement('button');
saveButton.style="position:absolute; left:185px; margin:-50px; top:625px; z-index:5;";
saveButton.innerText = "Create Rule";
panel.prepend(saveButton);
saveButton.onclick = () => {
    saveRule();
};

//Delete the rule
let deleteButton = document.createElement('button');
deleteButton.style="position:absolute; left:310px; margin:-50px; top:625px; z-index:5; color:#990000;";
deleteButton.innerText = "Delete Rule";
deleteButton.disabled = true;
panel.prepend(deleteButton);
deleteButton.onclick = () => {
    deleteRule();
};

//Various declarations
const row = document.querySelectorAll('td:nth-child(6)');
let matched = 0;
const defaultRules = "{1;;p3;;;;d5;;a};{1;;p3;;;;d4;;a};{1;;r1;;[A-Z]*( Codestone)$;;b3;;c#ffcccc;;c#ffdcdc};{1;;r1;;[A-Z]*( Nerkmid)( X)*( XX)*$;;b2;;c#ffcccc;;c#ffdcdc}";

//Load rules or set to default
let ruleString = window.localStorage.getItem('qspRules');
if (ruleString == null) {
    warningMsg.innerText = "No saved settings found! Loading default...";
    warningMsg.style.left = "180px";
    window.localStorage.setItem('qspRules',defaultRules);
    ruleString = defaultRules;
}
parseRuleString(ruleString);

//Add submit and clear form buttons at the top of quick stock
let upperButtons = document.createElement('div');
upperButtons.innerHTML = "<center><td colspan=\"8\" align=\"center\" bgcolor=\"#eeeebb\"><input type=\"submit\" value=\"Submit\" onclick=\" if (!check_discard()) { return false; } \">&nbsp;&nbsp;<input type=\"reset\" value=\"Clear Form\"></td></center>";
row[0].parentElement.parentElement.parentElement.before(upperButtons);


//Parse saved info into rules in the menus
function parseRuleString(ruleString){
    //Check for outer brackets and remove them
    if ((ruleString.substring(0,1)!="{")||(ruleString.substring(ruleString.length-1)!="}")){
        //If no outer brackets aka invalid string
        warningMsg.innerText = "Quick Stock+ settings could not be loaded! Loading default...";
        ruleString = defaultRules;
        window.localStorage.setItem('qspRules',defaultRules);
    }
    ruleString = ruleString.substring(1,ruleString.length-1);
    //Split into separate rules if possible
    if (ruleString.includes("};{")){
        ruleString = ruleString.split("};{");
    } else {
        //If not possible that means there are 0 or 1 rules
        if (ruleString!=""){
            //1 rule
            let temp = ruleString;
            ruleString = [];
            ruleString.push(temp);
        } else {
            //0 rules
            ruleNumberBox.value = 1;
            return;
        }
    }
    //Go through and generate rule names, and apply the rules
    for (let i = 0; i < ruleString.length; i++){
        let ruleName = "";
        let actions = ruleString[i].split(";;");
        //Check and apply action
        switch (actions[3][0]){
            case "a":
                break;
            case "b":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],setBox,parseInt(actions[3][1])):"";
                ruleName = "Check "+tlAct(parseInt(actions[3][1]));
                break;
            case "c":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],unsetBox,parseInt(actions[3][1])):"";
                ruleName = "Uncheck "+tlAct(parseInt(actions[3][1]));
                break;
            case "d":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],disableBox,parseInt(actions[3][1])):"";
                ruleName = "Disable "+tlAct(parseInt(actions[3][1]));
                break;
            case "e":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],enableBox,parseInt(actions[3][1])):"";
                ruleName = "Enable "+tlAct(parseInt(actions[3][1]));
                break;
        }
        //Check and apply coloring
        switch (actions[4][0]){
            case "b":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],setColor,"",actions[4].substring(1)):"";
                if (ruleName==""){
                    ruleName = "Color";
                } else {
                    ruleName += " & Color";
                }
                break;
            case "c":
                actions[0]==1?applyAnyRule(actions[1][0],actions[1][1],actions[2],setColor,"",actions[4].substring(1),actions[5].substring(1)):"";
                if (ruleName==""){
                    ruleName = "Color";
                } else {
                    ruleName += " & Color";
                }
                break;
        }
        //Default name if rule doesn't do anything
        if (ruleName=="")ruleName = "Do Nothing";
        //Add filter conditions to name
        if ((actions[2]!="")&&(actions[1][1]!="0")){
            let summary = actions[2];
            if (summary.length > 25) summary = summary.substring(0,22)+"...";
            switch (actions[1][1]){
                case "1":
                    ruleName += " NP";
                    break;
                case "2":
                    ruleName += " NC";
                    break;
            }
            switch (actions[1][0]){
                case "e":
                    ruleName += " Exact ["+summary+"]";
                    break;
                case "p":
                    ruleName += " Partial ["+summary+"]";
                    break;
                case "r":
                    ruleName += " Regex ["+summary+"]";
                    break;
            }
        } else {
            if (((actions[1][0]=="e")&&(actions[2]==""))||(actions[1][1]=="0")){
                ruleName += " Nothing";
            } else {
                ruleName += " All";
                if (actions[1][1]=="1"){
                    ruleName += " NP";
                } else if (actions[1][1]=="2"){
                    ruleName += " NC";
                }
            }
        }
        //Add new rule to list with generated name
        let newRuleOption = document.createElement('option');
        let inum = i+1;
        if (actions[0]==1){
            newRuleOption.innerText = inum+" "+ruleName;
        } else {
            newRuleOption.innerText = inum+"* "+ruleName;
        }
        newRuleOption.value = inum+";;"+ruleString[i];
        ruleSelect.appendChild(newRuleOption);
    }
    ruleNumberBox.value = ruleString.length+1;
}

//Main rule application function, calls all the other functions
function applyAnyRule(tr,npnc,word,doFunction,num,color,color2){
    if (tr == "e"){
        applyExactRule(npnc,word,doFunction,num,color,color2);
    } else if (tr == "p"){
        applyPartialRule(npnc,word,doFunction,num,color,color2);
    } else if (tr == "r"){
        applyRegexRule(npnc,word,doFunction,num,color,color2);
    }
}

//Apply function to partial matches
function applyPartialRule(npnc,word,doFunction,num,color,color2){
    let wordList = word.split(";");
    for (let i = 0; i < row.length-1; i++){
        for (let j = 0; j < wordList.length; j++){
            if ((getItemName(i).toLowerCase().includes(wordList[j].trim().toLowerCase()))&&(npnc!="0")){
                let nc = !row[i].parentElement.children[1].outerHTML.includes("hidden");
                if ((!nc&&(npnc=="1"))||(nc&&(npnc=="2"))||(npnc=="3")){
                    if ((i%2!=0)&&(color2!=null)){
                        doFunction(i,num,color2);
                    } else {
                        doFunction(i,num,color);
                    }
                }
            }
        }
    }
}

//Apply function to exact matches
function applyExactRule(npnc,word,doFunction,num,color,color2){
    let wordList = word.split(";");
    for (let i = 0; i < row.length-1; i++){
        for (let j = 0; j < wordList.length; j++){
            if ((getItemName(i)==wordList[j].trim())&&(npnc!="0")){
                let nc = !row[i].parentElement.children[1].outerHTML.includes("hidden");
                if ((!nc&&(npnc=="1"))||(nc&&(npnc=="2"))||(npnc=="3")){
                    if ((i%2!=0)&&(color2!=null)){
                        doFunction(i,num,color2);
                    } else {
                        doFunction(i,num,color);
                    }
                }
            }
        }
    }
}

//Apply functions to regex matches
function applyRegexRule(npnc,word,doFunction,num,color,color2){
    let cased = false;
    if (word.indexOf("/")==0){
        if (word.lastIndexOf("i")!=word.length-1) cased = true;
        word = word.substring(1,word.lastIndexOf("/"));
    }
    let wordRegex = new RegExp(word, "i");
    if (cased) wordRegex = new RegExp(word);
    for (let i = 0; i < row.length-1; i++){
        if ((getItemName(i).search(wordRegex)>-1)&&(npnc!="0")){
            let nc = !row[i].parentElement.children[1].outerHTML.includes("hidden");
            if ((!nc&&(npnc=="1"))||(nc&&(npnc=="2"))||(npnc=="3")){
                if ((i%2!=0)&&(color2!=null)){
                    doFunction(i,num,color2);
                } else {
                    doFunction(i,num,color);
                }
            }
        }
    }
}

//Check box given the row and column
function setBox(elem,num){
    if(!row[elem].parentElement.children[1].outerHTML.includes("hidden"))num = num-1;
    if (row[elem].parentElement.children[num].children.length > 0) row[elem].parentElement.children[num].children[0].checked = true;
}

//Uncheck box given the row and column
function unsetBox(elem,num){
    if(!row[elem].parentElement.children[1].outerHTML.includes("hidden"))num = num-1;
    if (row[elem].parentElement.children[num].children.length > 0) row[elem].parentElement.children[num].children[0].checked = false;
}

//Disable box given the row and column
function disableBox(elem,num){
    if(!row[elem].parentElement.children[1].outerHTML.includes("hidden"))num = num-1;
    if(!row[elem].parentElement.children[num].innerText.includes("N/A"))row[elem].parentElement.children[num].innerHTML = "=/=";
}

//Re-enable box given the row and column
function enableBox(elem,num){
    let numb = elem+1;
    let valu = tlAct(num).toLowerCase();
    if(row[elem].parentElement.children[num].innerHTML == "=/=")row[elem].parentElement.children[num].innerHTML = "<input type=\"radio\" name=\"radio_arr["+numb+"]\" value=\""+valu+"\" ondblclick=\"this.checked = false; checkall[1].checked = false;\">";
}

//Poor man's dictionary
function tlAct(num){
    switch (num){
        case 2:
            return "Stock";
        case 3:
            return "Deposit";
        case 4:
            return "Donate";
        case 5:
            return "Discard";
        case 6:
            return "Gallery";
        case 7:
            return "Closet";
        case 8:
            return "Shed";
    }
}

//Get the name of an item in a row for checking against filters
function getItemName(elem){
    return row[elem].parentElement.children[0].innerText;
}

//Set the color of a row, also used to set a border for testing matches
function setColor(elem,num,color){
    if (!color.includes("border")){
        row[elem].parentElement.style.backgroundColor = color;
    } else {
        let width = color.substring(7);
        let col = "black";
        matched++;
        //Unlike actual borders inset box shadows don't move other elements around and actually display properly
        row[elem].parentElement.style.boxShadow = "inset "+width+"px "+width+"px "+col+", inset -"+width+"px "+width+"px "+col+", inset "+width+"px -"+width+"px "+col+", inset -"+width+"px -"+width+"px "+col;
    }
}

//Show and hide panel when clicking button
function togglePanel(){
    panel.style.display=="none"?panel.style.display = "flex":panel.style.display = "none";
}

//Update the color of color boxes, called whenever they're changed
function updateColor(box){
    box.style.backgroundColor = box.value;
}

//Test the current match parameters
function testMatch(){
    applyAnyRule("p",3,"",setColor,"","border:0");
    matched = 0;
    let npNC = 0;
    npCheck.checked?npNC++:"";
    ncCheck.checked?npNC+=2:"";
    applyAnyRule(matchTypeSelect.value,npNC,matchBox.value,setColor,"","border:2");
    matched==1?matchReport.innerText = "Matched 1 item":matchReport.innerText = "Matched " + matched + " items";
}

//Switch between action types
function toggleAction(num){
    for (let i = 1; i < 5; i++){
        boxSelect[i].disabled = true;
        boxSelect[i].value = 2;
    }
    if (num>0)boxSelect[num].disabled = false;
}

//Switch between coloring types
function toggleColor(num){
    for (let i = 1; i < 4; i++){
        colorBox[i].disabled = true;
        colorBox[i].value = "";
        updateColor(colorBox[i]);
    }
    if (num==1){
        colorBox[1].disabled = false;
    } else if (num==2){
        colorBox[2].disabled = false;
        colorBox[3].disabled = false;
    }
}

//Save current rule
function saveRule(){
    //Make sure number is valid
    if (isNaN(ruleNumberBox.value)) {
        warningMsg.innerText = "Invalid rule number!";
        warningMsg.style.left = "230px";
        return;
    }
    ruleNumberBox.value = Math.floor(ruleNumberBox.value);
    ruleNumberBox.value<1?ruleNumberBox.value=1:"";
    //Create a string from the rule
    let newRule = enabledCheck.checked?"1;;":"0;;";
    let npNC = 0;
    npCheck.checked?npNC++:"";
    ncCheck.checked?npNC+=2:"";
    newRule += matchTypeSelect.value+npNC+";;"+sanitize(matchBox.value)+";;";
    if (radio1.checked){
        newRule += "a;;";
    } else if (radio2.checked){
        newRule += "b" + boxSelect[1].value + ";;";
    } else if (radio3.checked){
        newRule += "c" + boxSelect[2].value + ";;";
    } else if (radio4.checked){
        newRule += "d" + boxSelect[3].value + ";;";
    } else if (radio5.checked){
        newRule += "e" + boxSelect[4].value + ";;";
    }
    if (radio6.checked){
        newRule += "a";
    } else if (radio7.checked){
        if (!CSS.supports('color',sanitize(colorBox[1].value))){
            warningMsg.innerText = "Invalid color detected!";
            warningMsg.style.left = "230px";
            return;
        }
        newRule += "b" + sanitize(colorBox[1].value);
    } else if (radio8.checked){
        if ((!CSS.supports('color',sanitize(colorBox[2].value)))||(!CSS.supports('color',sanitize(colorBox[3].value)))){
            warningMsg.innerText = "Invalid color detected!";
            warningMsg.style.left = "230px";
            return;
        }
        newRule += "c" + sanitize(colorBox[2].value) + ";;c" + sanitize(colorBox[3].value);
    }

    if (ruleSelect.value!="New Rule"){
        //Editing an existing rule
        if (ruleSelect.value.split(";;")[0] == ruleNumberBox.value){
            //Rule number unchanged - simply replace the same string
            let rules = ruleString.substring(1,ruleString.length-1).split("};{");
            rules[ruleNumberBox.value-1] = newRule;
            let newString = "{";
            for (let i = 0; i < rules.length;i++){
                newString += rules[i] + "};{";
            }
            newString += "}";
            newString = newString.replaceAll(";{}","");
            window.localStorage.setItem('qspRules',newString);
        } else {
            //Rule number changed - insert rule at new location and remove from old location
            let rules = ruleString.substring(1,ruleString.length-1).split("};{");
            rules.splice(ruleSelect.value.split(";;")[0]-1, 1);
            rules.splice(ruleNumberBox.value-1, 0, newRule);
            let newString = "{";
            for (let i = 0; i < rules.length;i++){
                newString += rules[i] + "};{";
            }
            newString += "}";
            newString = newString.replaceAll(";{}","");
            window.localStorage.setItem('qspRules',newString);
        }
    } else {
        //Creating new rule - insert at appropriate location
        let rules = ruleString.substring(1,ruleString.length-1).split("};{");
        rules.splice(ruleNumberBox.value-1, 0, newRule);
        let newString = "{";
        for (let i = 0; i < rules.length;i++){
            newString += rules[i] + "};{";
        }
        newString += "}";
        newString = newString.replaceAll(";{}","");
        window.localStorage.setItem('qspRules',newString);
    }
    //Reload the page because I don't want to do all of the validation to make sure everything I update everything perfectly on a big change lol
    warningMsg.innerText = "Saving Rule...";
    warningMsg.style.left = "230px";
    warningMsg.style.color = "green";
    window.location.reload();
}

//Delete a rule from the list
function deleteRule(){
    let rules = ruleString.substring(1,ruleString.length-1).split("};{");
    let toDelete = parseInt(ruleSelect.value.split(";;")[0]);
    let newString = "{";
    for (let i = 0; i < rules.length;i++){
        if (i != toDelete-1){
            newString += rules[i] + "};{";
        }
    }
    newString += "}";
    newString = newString.replaceAll(";{}","");
    window.localStorage.setItem('qspRules',newString);
    warningMsg.innerText = "Deleting Rule...";
    warningMsg.style.left = "230px";
    warningMsg.style.color = "green";
    window.location.reload();
}

//Get rid of {} and double semicolons because those are used for formatting the saved data
function sanitize(inString){
    inString += "";
    inString = inString.replaceAll(";;",";").replaceAll("{","").replaceAll("}","");
    while (inString.includes(";;")){
        inString = inString.replaceAll(";;",";");
    }
    return inString;
}

//Set all the panel elements to the correct values when switching between different rules
function ruleSelected(){
    if (ruleSelect.value!="New Rule"){
        //If selecting existing rule read values to be set
        let parse = ruleSelect.value.split(";;");
        ruleNumberBox.value = parse[0];
        matchTypeSelect.value = parse[2][0];
        switch (parse[2][1]){
            case "0":
                npCheck.checked = false;
                ncCheck.checked = false;
                break;
            case "1":
                npCheck.checked = true;
                ncCheck.checked = false;
                break;
            case "2":
                npCheck.checked = false;
                ncCheck.checked = true;
                break;
            case "3":
                npCheck.checked = true;
                ncCheck.checked = true;
                break;
        }
        matchBox.value = parse[3];
        switch (parse[4][0]){
            case "a":
                radio1.checked = "checked";
                toggleAction(-1);
                break;
            case "b":
                radio2.checked = "checked";
                toggleAction(1);
                boxSelect[1].value = parse[4][1];
                break;
            case "c":
                radio3.checked = "checked";
                toggleAction(2);
                boxSelect[2].value = parse[4][1];
                break;
            case "d":
                radio4.checked = "checked";
                toggleAction(3);
                boxSelect[3].value = parse[4][1];
                break;
            case "e":
                radio5.checked = "checked";
                toggleAction(4);
                boxSelect[4].value = parse[4][1];
                break;
        }
        switch (parse[5][0]){
            case "a":
                radio6.checked = "checked";
                toggleColor(-1);
                colorBox[1].value = "";
                updateColor(colorBox[1]);
                colorBox[2].value = "";
                updateColor(colorBox[2]);
                colorBox[3].value = "";
                updateColor(colorBox[3]);
                break;
            case "b":
                radio7.checked = "checked";
                toggleColor(1);
                colorBox[1].value = parse[5].substring(1);
                updateColor(colorBox[1]);
                break;
            case "c":
                radio8.checked = "checked";
                toggleColor(2);
                colorBox[2].value = parse[5].substring(1);
                updateColor(colorBox[2]);
                colorBox[3].value = parse[6].substring(1);
                updateColor(colorBox[3]);
                break;
        }
        enabledCheck.checked = parse[1]==1?true:false;
        deleteButton.disabled = false;
        saveButton.innerText = "Save Rule";
    } else {
        //If selecting create new rule set to default values
        ruleNumberBox.value = ruleString.split("};{").length+1;
        matchTypeSelect.value = "p";
        matchBox.value = "";
        npCheck.checked = true;
        ncCheck.checked = true;
        radio1.checked = "checked";
        radio6.checked = "checked";
        toggleAction(-1);
        toggleColor(-1);
        colorBox[1].value = "";
        updateColor(colorBox[1]);
        colorBox[2].value = "";
        updateColor(colorBox[2]);
        colorBox[3].value = "";
        updateColor(colorBox[3]);
        enabledCheck.checked = true;
        deleteButton.disabled = true;
        saveButton.innerText = "Create Rule";
    }
}
