//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    ////  Welcome screen info


const player_name = document.querySelector('#name_field')
player_name.addEventListener('input', getPlayer)


const proceed = document.querySelector('#proceed_btn')
proceed.addEventListener('click', hideWelcomeShowGame)


const game_type = document.querySelectorAll('input[name="map"]')
game_type.forEach((radio_btn) => {
        
    radio_btn.addEventListener('click', function(event) {

        var item = event.target.value;


        if(item == 'custom') { 
            
            theFieldSetDynamic.className = "theFieldSet_CUS"
            document.getElementById('HxW').hidden = false 
        } 
        else {
            theFieldSetDynamic.className = "theFieldSet_SET"
            document.getElementById('HxW').hidden = true 
        }
    });
});

const theFieldSetDynamic = document.getElementById('theFieldSet')

///  WelcomeFunctions

/** Helper function to return current player */
function getPlayer (E) { return player_name.value }
/** Helper function to return the map initally chosen */
function getMap (E) { 
    let map
    for (const choice of game_type) {
        if (choice.checked) {
            map = choice.value
            break
        }
    }
    return map
}




///  Custom Section

const start_custom = document.querySelector('#start_custom')

//  *** custom table which is saved after creation ***

const custom_table = document.querySelector('#custom_table')

//  *** Modifable table used through the game ***
const OfficialTable = document.querySelector('#editable')




/// Handlers to handle winning/loading/saving
const win_screen = document.querySelector('#winner_screen')



/**   Function to hide the welcome screen after choosing the preferences */
function hideWelcomeShowGame (E) {
    
    let check = false
    if (getPlayer() === "") { check = false }
    else { check = true }


    if(check && getMap() != 'custom') {
        document.getElementById('welcome_screen').hidden = true

        makeMapAndPlay()
        showShowables()
    }
    else if (check && getMap() == 'custom') {

        document.getElementById('welcome_screen').hidden = true
        makeMapAndPlay()    //  Includes the radio button (CreateMap!)
        //showShowables() is already inside customMap()
    }
}


/**   Function to create the map and go to playScreen */
function makeMapAndPlay () {

    const map = getMap()

    switch (map) {


        case 'easy':
            document.getElementById('game_screen').hidden = false
            easyMap()
            cellInteractor()
        break


        case 'medium':
            document.getElementById('game_screen').hidden = false
            mediumMap()
            cellInteractor()
        break


        case 'hard':
            document.getElementById('game_screen').hidden = false
            hardMap()
            cellInteractor()
        break

        case 'custom':
            document.getElementById('game_board_custom').hidden = false
            customMap()
            //cellInteractor() is already inside customMap()
        break
    }
    //This function simply colors the black tiles accorindlgy if they're correct 
    checkBlackTilesForRequireMents()
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    ////  Game screen

/// Timer, Name 


var game_timer = document.querySelector('#game_timer')


/** Helper to return current time of the game */
function getTime () {
    return game_timer.innerHTML
}


let theInterval;


/** Creation of the timer, and loading it onto the game_timer.innerText */
function startTimer () {

    theInterval = setInterval(incrementSeconds, 1000);


    var secs = 0;
    var mins = 0;
    var hours = 0;

    var secs_str = secs
    var mins_str = mins
    var hours_str = hours

    function incrementSeconds() {
        
        secs++

        if(secs == 60) {
            mins += 1
            secs = 0
        }
        if(mins == 60) {
            hours += 1
            mins = 0
        }


        if(secs >= 10) { secs_str = secs }
        else { secs_str = '0'+secs }

        if(mins >= 10) { mins_str = mins }
        else { mins_str = '0'+mins }

        if(hours >= 10) { hours_str = hours }
        else { hours_str = '0'+hours }

        var time_elapsed = `${hours_str}:${mins_str}:${secs_str}`
        game_timer.innerText = 'Elapsed time: '+time_elapsed
    }
}


/** Stops the game timer */
function stopTimer () {
    clearInterval(theInterval)
    game_timer.innerHTML = 'Elapsed time: 00:00:00'
}


/** Starts the timer, shows the player name and game mode on the game screen */
function showShowables () {

    startTimer()
    document.getElementById('player_name').innerHTML = 'Player: '+getPlayer()
    document.getElementById('game_mode').innerHTML = 'Map: '+getMap()
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    ////  Restart  , MainMenu at GameScreen , Save, Save_Screen , Leave , Load , Into LatestResults, LocalStorage


///  Restart game button
const restartButton = document.querySelectorAll('#restart_game')                                                 
restartButton.forEach((btn) => { btn.addEventListener('click', restartGame) }) 


/** Restarts the game with the same settings */
function restartGame () {

    win_screen.hidden = true
    
    stopTimer()


    if (getMap() === 'custom') {
        customStarter()
    }
    else {
        OfficialTable.innerHTML = ''
        hideWelcomeShowGame()
    }
}



/// GoToMainMenu
const menu_btn = document.querySelectorAll('#main_menu')
menu_btn.forEach((btn) => { btn.addEventListener('click', goHome) }) 


/** Goes to the mainPage after the click, alerts the player to save the game if required */
function goHome () {


    //GameScreenIsEnabled
    if (!document.getElementById('game_screen').hidden) {
        if (confirm("Current game progress will be lost unless saved! Are you sure?")) {
        
            document.getElementById('game_screen').hidden = true
            document.getElementById('welcome_screen').hidden = false
            stopTimer()
            OfficialTable.innerHTML = ''
        }
    }
    //CreateCustomIsEnabled
    else if(!document.getElementById('game_board_custom').hidden) {

        document.getElementById('game_board_custom').hidden = true
        document.getElementById('welcome_screen').hidden = false
        stopTimer()
        OfficialTable.innerHTML = ''
    }
    //WinnerScreenIsEnabled
    else {
        
        document.getElementById('winner_screen').hidden = true
        document.getElementById('welcome_screen').hidden = false
        stopTimer()
        game_timer.innerHTML = ''
        OfficialTable.innerHTML = ''
    }
}



/// Custom Games screen

const showCustomGamesBtn = document.querySelector('#showCustomGames_btn')
showCustomGamesBtn.addEventListener('click',presentCustomGames)


/** Shows the custom games */
function presentCustomGames () {
    
    if(player_name.value) {
        document.getElementById('welcome_screen').hidden = true
        document.getElementById('customGames_screen').hidden = false
        getCustomGames()
        customGamesButtonListeners()
    }
    else {
        alert("Have a name in the name field to continue")
    }
}


/** Modifies selected custom map */


/** Helper for customGames */
function getCustomGamesHelper (E) {

    const PName = E['Player']
    const MName = E['Map']
    const Table = E['Table']
    const PResult = `${PName} --- ${MName}`
    return [PResult,Table]
}


/** Gives buttons to custom games and makes them interactable */
function getCustomGames () {

    var Stored = JSON.parse(localStorage.Custom_Games)
    let s = ''
    let sbtn = '<button id="chooseCustom">Play</button> <button id="modifyCustom">Modify</button>'

    for (let i=Stored.length-1; i>=0; i--) {
        var tmp = getCustomGamesHelper(Stored[i])
        s+=('<li>'+ sbtn +('<table>' + ('<caption>'+tmp[0]+'</caption>') + tmp[1] +'</table>')  +'</li>')
    }
    document.getElementById('customGamesList').innerHTML = s
}


var OfficialChosenCustomTable;
var OfficialChosenCustomTableInfo;

/** Important, adds event listeners to the dynamically generated buttons, and invokes given functions after being pressed */
function customGamesButtonListeners () {

    const theModifyButton = document.querySelectorAll('#modifyCustom')
    theModifyButton.forEach((btn) => {
        
        btn.addEventListener('click', function(E) {

            

            //MapValuesChanging
            var fixer = (E.target.parentNode.children[2]).children[1]
            OfficialChosenCustomTable = fixer.outerHTML
    

            var tmp = (E.target.parentNode.children[2]).children[0]
            OfficialChosenCustomTableInfo = tmp.innerHTML.split(' --- ')


            //player_name.value = OfficialChosenCustomTableInfo[0]
            player_name.value = player_name.value


            for (const choice of game_type) {
                if (choice.value === OfficialChosenCustomTableInfo[1]) {


                    if(choice.value === 'custom') {
                        theFieldSetDynamic.className = "theFieldSet_CUS" 
                        document.getElementById('HxW').hidden = false 
                    } 
                    else { 
                        theFieldSetDynamic.className = "theFieldSet_SET"
                        document.getElementById('HxW').hidden = true 
                    }
                    choice.checked = true
                }   
            }


            //Start Custom modification
            modifySelectedCustom(OfficialChosenCustomTable)
            
        });
    });


    const thePlayButton = document.querySelectorAll('#chooseCustom')
    thePlayButton.forEach((btn) => {
        
        btn.addEventListener('click', function(E) {

            //MapValuesChanging
            var fixer = (E.target.parentNode.children[2]).children[1]
            OfficialChosenCustomTable = fixer.outerHTML
    

            var tmp = (E.target.parentNode.children[2]).children[0]
            OfficialChosenCustomTableInfo = tmp.innerHTML.split(' --- ')


            //player_name.value = OfficialChosenCustomTableInfo[0]
            player_name.value = player_name.value


            for (const choice of game_type) {
                if (choice.value === OfficialChosenCustomTableInfo[1]) {


                    if(choice.value === 'custom') {
                        theFieldSetDynamic.className = "theFieldSet_CUS" 
                        document.getElementById('HxW').hidden = false 
                    } 
                    else { 
                        theFieldSetDynamic.className = "theFieldSet_SET"
                        document.getElementById('HxW').hidden = true 
                    }
                    choice.checked = true
                }   
            }

            //PlayCustom
            playSelectedCustom(OfficialChosenCustomTable)
            
        });
    });


}


/** Modifes the selected custom map */
function modifySelectedCustom (E) {

    document.getElementById('customGames_screen').hidden = true
    document.getElementById('game_board_custom').hidden = false

    custom_table.innerHTML = E
    custom_table.addEventListener ('click', onLeftClick)
    custom_table.addEventListener ('contextmenu', onRightClick)
    start_custom.addEventListener('click', customStarter);    
}

/** Loads selected custom map */
function playSelectedCustom (E) {

    document.getElementById('customGames_screen').hidden = true
    custom_table.innerHTML = E

    //customStarter()
    OfficialTable.innerHTML = custom_table.innerHTML
    

    document.getElementById('game_board_custom').hidden = true
    document.getElementById('game_screen').hidden = false

    //This function simply colors the black tiles accorindlgy if they're correct 
    checkBlackTilesForRequireMents()

    showShowables()
    cellInteractor()
}






const leaveCustomGames = document.querySelector('#leaveCustomGames')
leaveCustomGames.addEventListener('click',goBackToMainMenuFromCustom)

/** Goes back from custom to mainmenu */
function goBackToMainMenuFromCustom () {

    document.getElementById('customGames_screen').hidden = true
    document.getElementById('welcome_screen').hidden = false
}


/** Puts the newly created custom map into storage */
function putCustomMapIntoLocalStorage () {

    //PreCaution incase it was deleted by user
    makeLocalStorage ()

    if(localStorage.getItem('Custom_Games')) {

        var tmp = JSON.parse(localStorage.Custom_Games);
        const dict = {
            Player: getPlayer(),
            Map: getMap(),
            Table: custom_table.innerHTML
        };
        tmp.push(dict);
        localStorage.setItem('Custom_Games',JSON.stringify(tmp));
    }   
}




///  Save current game
const save_btn = document.querySelector('#save_game')
save_btn.addEventListener('click',saveGame)
makeLocalStorage()



/** Creates the local storage variables, can be invoked multiple times without overwriting */
function makeLocalStorage() {

    if (!localStorage.getItem('Latest_Results')) {
        var theList = []
        localStorage.setItem('Latest_Results',JSON.stringify(theList))
    }
    if (!localStorage.getItem('Saved_Games')) {
        var theList = []
        localStorage.setItem('Saved_Games',JSON.stringify(theList))
    }
    if (!localStorage.getItem('Custom_Games')) {
        var theList = []
        localStorage.setItem('Custom_Games',JSON.stringify(theList))
    }
}



/** Saves current game to local Storage */
function saveGame () {

    if (confirm ("Are you sure you want save the current game?")) {

        //Extra check
        makeLocalStorage()

        var tmp = JSON.parse(localStorage.Saved_Games);
        const dict = {
            Player: getPlayer(),
            Map: getMap(),
            Time: getTime().split(' ')[2],
            Table: OfficialTable.innerHTML
        };
        tmp.push(dict);
        localStorage.setItem('Saved_Games',JSON.stringify(tmp));
    }
    else {
        
    }
}



/// Saved Games screen

/** Takes a saved game and returns the results as a string
 * @param E dictionary
 */
function getSavedGamesHelper (E) {

    const PName = E['Player']
    const MName = E['Map']
    const GTime = E['Time']
    const Table = E['Table']
    const PResult = `${PName} --- ${MName} --- ${GTime}`
    return [PResult,Table]
}


/** Puts the saved games with their buttons into local stroage */
function getSavedGames () {

    var Stored = JSON.parse(localStorage.Saved_Games)
    let s = ''
    let sbtn = '<button id="chooseSaved">Choose</button>'

    for (let i=Stored.length-1; i>=0; i--) {
        var tmp = getSavedGamesHelper(Stored[i])
        s+=('<li>'+ sbtn +('<table>' + ('<caption>'+tmp[0]+'</caption>') + tmp[1] +'</table>')  +'</li>')
    }
    document.getElementById('savedGamesList').innerHTML = s
}


const showSavedGamesBtn = document.querySelector('#showSavedGames_btn')
showSavedGamesBtn.addEventListener('click',presentSavedGames)


// Variables to load the game.
var OfficialChosenSavedTable;
var OfficialChosenSavedTableInfo;


/** Helper for presentSavedGames, it only adds the interactable buttons to that screen and modifies the values to make the game ready */
function presentSavedGamesHelper () {

    const theChoice = document.querySelectorAll('#chooseSaved')
    theChoice.forEach((btn) => {
        
        btn.addEventListener('click', function(E) {


            //MapValuesChanging
            var fixer = (E.target.parentNode.children[1]).children[1]
            OfficialChosenSavedTable = fixer.outerHTML
    

            var tmp = (E.target.parentNode.children[1]).children[0]
            OfficialChosenSavedTableInfo = tmp.innerHTML.split(' --- ')


            player_name.value = OfficialChosenSavedTableInfo[0]
            for (const choice of game_type) {
                if (choice.value === OfficialChosenSavedTableInfo[1]) {


                    if(choice.value === 'custom') {
                        theFieldSetDynamic.className = "theFieldSet_CUS" 
                        document.getElementById('HxW').hidden = false 
                    } 
                    else { 
                        theFieldSetDynamic.className = "theFieldSet_SET"
                        document.getElementById('HxW').hidden = true 
                    }
                    choice.checked = true
                }   
            }

            alert(`You have chosen: ${OfficialChosenSavedTableInfo[0]}'s saved game!`)
        });
    });
}


/** Goes to savedGames_screen and hides the welcome_screen */
function presentSavedGames () {

    getSavedGames()
    document.getElementById('welcome_screen').hidden = true
    document.getElementById('savedGames_screen').hidden = false
    
    presentSavedGamesHelper()
}



/// Leave saved games section
const leaveSavedGamesBtn = document.querySelector('#leaveSavedGames')
leaveSavedGamesBtn.addEventListener('click',leaveSavedGamesScreen)


/** Goes back to welcome_screen and hides savedGames_screen */
function leaveSavedGamesScreen () {

    document.getElementById('savedGames_screen').hidden = true
    document.getElementById('welcome_screen').hidden = false
}






/// Load game

const loadSavedGameBtn = document.querySelector('#load_btn')
loadSavedGameBtn.addEventListener('click',loadSavedGame)

/** Loads chosen saved game */
function loadSavedGame () {

    if(OfficialChosenSavedTable) {
        OfficialTable.innerHTML = OfficialChosenSavedTable
        custom_table.innerHTML = OfficialChosenSavedTable
        document.getElementById('custom_table').innerHTML = OfficialChosenSavedTable


        cellInteractor()
        checkBlackTilesForRequireMents()
        showShowables()


        document.getElementById('savedGames_screen').hidden = true
        document.getElementById('game_screen').hidden = false
    }
}




/// LatestResults
const lrList = document.querySelector('#latestResultsList')
display_localStorage_lrList()

/** Updates localStorage for LatestResultsList after winning */
function update_localStorage_lrList () {

    if(localStorage.getItem('Latest_Results')) {

        var tmp = JSON.parse(localStorage.Latest_Results);
        const dict = {
            Player: getPlayer(),
            Map: getMap(),
            Time: getTime().split(' ')[2],
        };
        tmp.push(dict);
        localStorage.setItem('Latest_Results',JSON.stringify(tmp));
    }   
}


/** Takes latest result dictionary and represents it correctly 
 * @param E dictionary
 */
function display_localStorage_lrListHelper (E) {

    const PName = E['Player']
    const MName = E['Map']
    const GTime = E['Time']
    const PResult = `Name: ${PName} --- Map: ${MName} --- Elapsed time: ${GTime}`
    return PResult
}


/** Puts the recent the recent results from local stroage into latestResultsList for welcome screen */
function display_localStorage_lrList () {

    var Stored = JSON.parse(localStorage.Latest_Results)
    let s = ''

    for (let i=Stored.length-1; i>=0; i--) {
        s+=('<li>'+ display_localStorage_lrListHelper(Stored[i])+'</li>')
    }
    document.getElementById('latestResultsList').innerHTML = s
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    //// GameFocusedFunctions

///  Functions for preset maps

/**   Generate black cell (tile) */
function mb (E) { 
    if (E>=0) {
        return `<td id="black_tile" data-complete="false">${E}</td>` 
    }
    else {
        return `<td id="black_tile" data-complete="true"></td>` 
    }
}


/**   Generate table according to matrix */
function genTable_preset (table) {  

    let s =''
    for (let i=0; i<table.length; i++) {
        s += '<tr>'
        for (let j=0; j<table[i].length; j++) {
            s += table[i][j] 
        }
        s+= '</tr>'
    }
    OfficialTable.innerHTML += s
}
const nt ='<td id=normal_tile data-litby=0></td>'

/**   Generate default easyMap */
function easyMap() {

    let table = [
        [nt,nt,nt,mb(1),nt,nt,nt],
        [nt,mb(0),nt,nt,nt,mb(2),nt],
        [nt,nt,nt,nt,nt,nt,nt],
        [mb(),nt,nt,mb(),nt,nt,mb()],
        [nt,nt,nt,nt,nt,nt,nt],
        [nt,mb(),nt,nt,nt,mb(2),nt],
        [nt,nt,nt,mb(3),nt,nt,nt]
    ]
    
    genTable_preset(table)
}

/**   Generate default mediumMap */
function mediumMap() {
    
    let table = [
        [nt,nt,mb(0),nt,mb(),nt,nt],
        [nt,nt,nt,nt,nt,nt,nt],
        [mb(),nt,mb(),nt,mb(3),nt,mb()],
        [nt,nt,nt,mb(1),nt,nt,nt],
        [mb(2),nt,mb(),nt,mb(),nt,mb()],
        [nt,nt,nt,nt,nt,nt,nt],
        [nt,nt,mb(),nt,mb(2),nt,nt]
    ]
    return genTable_preset(table)
}

/**   Generates default hardMap */
function hardMap() {

    let table = [
        [nt,mb(),nt,nt,nt,nt,nt,nt,nt,nt],
        [nt,nt,nt,nt,nt,mb(3),nt,mb(2),nt,mb()],
        [nt,mb(0),mb(),nt,nt,nt,nt,mb(),nt,nt],
        [nt,nt,nt,nt,mb(),nt,nt,nt,nt,nt],
        [nt,mb(1),nt,nt,mb(),mb(1),mb(),nt,nt,nt],
        [nt,nt,nt,mb(),mb(),mb(),nt,nt,mb(3),nt],
        [nt,nt,nt,nt,nt,mb(),nt,nt,nt,nt],
        [nt,nt,mb(1),nt,nt,nt,nt,mb(0),mb(),nt],
        [mb(3),nt,mb(),nt,mb(0),nt,nt,nt,nt,nt],
        [nt,nt,nt,nt,nt,nt,nt,nt,mb(0),nt]
    ]
    return genTable_preset(table)
}



///  Functions inside the custom map creation

/**   Generates a blank table */
function genTable_custom (h,w) {  

    let s =''
    for (let i=0; i<h; i++) {
        s += '<tr>'
        for (let j=0; j<w; j++) {
            s += nt
        }
        s+= '</tr>'
    }
    return s
}

/**   Make action to cell during the creation of the custom map */
function onLeftClick (E) {


    if (E.target.matches('td')) {


        if (E.target.id == 'black_tile' && E.target.innerHTML == '') {
            E.target.innerHTML = 0
            E.target.dataset.complete = "false"
        }
        else if (E.target.id == 'black_tile' && E.target.innerHTML != '') {
            let tmp = parseInt(E.target.innerHTML)
            tmp++
            if(tmp <= 4) { E.target.innerHTML = tmp }
        }
        else if (E.target.id != 'black_tile') {
            E.target.dataset.complete = "true"
            E.target.id = 'black_tile'
            E.target.innerHTML = ''
        }
    }
  
}

/**   Make action to cell during the creation of the custom map */
function onRightClick (E) {

    if (E.target.id == 'black_tile' && E.target.innerHTML == '') {
        E.target.id = 'normal_tile'
        E.target.removeAttribute("data-complete")
        E.target.style.backgroundColor = ''
        E.target.innerHTML = ''
    }
    else if (E.target.id == 'black_tile' && parseInt(E.target.innerHTML) >=1 ) {
        let tmp = parseInt(E.target.innerHTML)
        tmp--
        E.target.innerHTML = tmp
    }
    else if (E.target.id == 'black_tile' && parseInt(E.target.innerHTML) == 0) {
        E.target.innerHTML = ''
        E.target.dataset.complete = "true"
    }
}


//  Moves the screen to the mainGamePlay screen after finishing the creation of the map

/** Creation screen of the custom map, uses customerStarter() which includes the cellInteractor () */
function customMap () {

    const h = parseInt(document.getElementById('H').value) 
    const w = parseInt(document.getElementById('W').value) 

    let s = genTable_custom(h,w)
    custom_table.innerHTML = s


    //Adding Event Listeners in the new HxW custom_table section
    custom_table.addEventListener ('click', onLeftClick)
    custom_table.addEventListener ('contextmenu', onRightClick)
    start_custom.addEventListener('click', customStarter); 
}


/** Starts a custom game, loads the custom_table.innerHTML onto the OfficialTable, contains cellInteractor() and checkBlackTilesForRequireMents */
function customStarter () {
    
    OfficialTable.innerHTML = custom_table.innerHTML
    putCustomMapIntoLocalStorage()

    document.getElementById('game_board_custom').hidden = true
    document.getElementById('game_screen').hidden = false

    //This function simply colors the black tiles accorindlgy if they're correct 
    checkBlackTilesForRequireMents()

    showShowables()
    cellInteractor()
}



/// GamePlay functions


//  TileMakers and Lighters

/** Makes a normal tile
 * @parameter E (E.target which is the tile itself)
 */
function makeNormalTile(E) {

    E.dataset.litby = 0
    E.style.backgroundColor = ''
    E.id = 'normal_tile'
}

/** lights up the tile
 * @parameter E (E.target which is the tile itself)
 */
function lightUpNormalTile (E) {

    E.style.backgroundColor = 'yellow'
    E.dataset.litby = parseInt(E.dataset.litby) + 1
}

/** Makes a lamp tile
 * @parameter E (E.target which is the tile itself)
 */
function makeLampTile(E) {

    E.dataset.litby = parseInt(E.dataset.litby) + 1
    E.id = 'lamp_tile'
    E.innerHTML = "💡"
}



/**   Getting location of the cell */
function getCellLocation (E) {
    
    var tmp = document.getElementById("editable");
    let colNum = 0;
    let rowNum = 0;
    
    for (var i = 0, row; row = tmp.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (col === E) {
                colNum = j;
                rowNum = i;
                break
            }
        }
    }

    return [rowNum,colNum]
}





/**  Function to interact with one cell on the official table  (Can determine Winner) */
function cellInteractor() {

    for (let i=0; i<OfficialTable.rows.length; i++) {
        for(let j=0; j<OfficialTable.rows[i].cells.length; j++) {
            (OfficialTable.rows[i].cells[j]).addEventListener("click", doTile)
        }
    }
    

    /** Interact with tile, uses youWon() function incase the game is won */
    function doTile (E) {

        const rowNum = getCellLocation(E.target)[0]
        const colNum = getCellLocation(E.target)[1]
        
        if (E.target.id == 'normal_tile') {
            
            makeLampTile(E.target)
            ColorifyTiles(rowNum,colNum)
        }
        else if (E.target.id == 'lamp_tile') {
            
            E.target.id = 'normal_tile'
            E.target.style.backgroundColor = 'yellow'
            E.target.innerHTML = ""
            unlightUpNormalTile(E.target)
            deColorifyTiles(rowNum,colNum)
        }



        //After interacting with cell, do the following:


        //This function simply colors the black tiles accorindlgy if they're correct 
        checkBlackTilesForRequireMents()


        if (youWon()) {

            document.getElementById('game_screen').hidden = true
            document.getElementById('winner_screen').hidden = false
            stopTimer()
        }


    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        ////    Section for coloring, decoloring, and lighting


///  Functions to color cells

/** Colors tiles Up,Down,Left,Right */
function ColorifyTiles (rowNum,colNum) {

    ColorRight(rowNum,colNum)
    ColorLeft(rowNum,colNum)
    ColorUp(rowNum,colNum)
    ColorDown(rowNum,colNum)
}

/**   ColorRight */
function ColorRight (rowNum,colNum) {
    
    
    var tmp = document.getElementById("editable");
    
    if (colNum != tmp.rows[0].cells.length-1) {
        let row = tmp.rows[rowNum]

        for (var j = colNum+1; j<row.cells.length; j++) {
            
            let col = row.cells[j] 
            if (col.id == 'normal_tile') lightUpNormalTile(col);

            else if (col.id == 'lamp_tile') {
                col.dataset.litby = parseInt(col.dataset.litby) + 1
                col.style.backgroundColor = "red"
                tmp.rows[rowNum].cells[colNum].style.backgroundColor = "red"
            }

            else if (col.id == 'black_tile')  break
        }
    }
}

/**   ColorLeft */
function ColorLeft (rowNum,colNum) {

    if (colNum != 0) {
        var tmp = document.getElementById("editable");
        let row = tmp.rows[rowNum]

        for (var j = colNum-1; j>=0; j--) {

            let col = row.cells[j] 
            if (col.id == 'normal_tile') lightUpNormalTile(col)
            else if (col.id == 'lamp_tile') {

                col.dataset.litby = parseInt(col.dataset.litby) + 1
                col.style.backgroundColor = "red"
                tmp.rows[rowNum].cells[colNum].style.backgroundColor = "red"
            }
            
            else if (col.id == 'black_tile') break
        }
    }
}

/**   ColorUp */
function ColorUp (rowNum,colNum) {

    if (rowNum != 0) {
        var tmp = document.getElementById("editable");

        for (var i = rowNum-1; i>=0; i--) {

            let tile = tmp.rows[i].cells[colNum]
            if (tile.id == 'normal_tile') lightUpNormalTile(tile)

            else if (tile.id == 'lamp_tile') {
                tile.dataset.litby = parseInt(tile.dataset.litby) + 1
                tile.style.backgroundColor = "red"
                tmp.rows[rowNum].cells[colNum].style.backgroundColor = "red"
            }

            else if (tile.id == 'black_tile') break
        }
    }
}

/**  ColorDown */
function ColorDown (rowNum,colNum) {

    var tmp = document.getElementById("editable");
    if (rowNum != tmp.rows.length-1) {

        for (var i = rowNum+1; i<tmp.rows.length; i++) {

            let tile = tmp.rows[i].cells[colNum]
            if (tile.id == 'normal_tile') lightUpNormalTile(tile)

            else if (tile.id == 'lamp_tile') {
                tile.dataset.litby = parseInt(tile.dataset.litby) + 1
                tile.style.backgroundColor = "red"
                tmp.rows[rowNum].cells[colNum].style.backgroundColor = "red"
            }

            else if (tile.id == 'black_tile') break
        }
    }
}


/// Functions to decolor cells

/**   Function to remove or decrease lit of normal tile */
function unlightUpNormalTile(E) {

    E.dataset.litby = parseInt(E.dataset.litby) - 1
    if(parseInt(E.dataset.litby) == 0) { makeNormalTile(E) }
}

/**   Function which deals with a tile that is a lamp_tile on the way */
function dealWithLitLight (E) {

    E.dataset.litby = parseInt(E.dataset.litby) - 1
    if (parseInt(E.dataset.litby) == 1) {
        E.style.backgroundColor = ''
    }
}

/**   Function to deColorify tiles around the clicked tile */
function deColorifyTiles (rowNum,colNum) {

    deColorRight(rowNum,colNum)
    deColorLeft(rowNum,colNum)
    deColorUp(rowNum,colNum)
    deColorDown(rowNum,colNum)
}


/**   Function to deColor tiles on the right */
function deColorRight (rowNum,colNum) {

    var tmp = document.getElementById("editable");
    if (colNum != tmp.rows[0].cells.length-1) {
        let row = tmp.rows[rowNum]
        for (var j = colNum+1; j<row.cells.length; j++) {

            let col = row.cells[j] 
            if (col.id == 'normal_tile') unlightUpNormalTile(col);
            else if (col.id == 'lamp_tile') dealWithLitLight (col)
            else if (col.id == 'black_tile')  break
        }
    }
}

/**   Function to deColor tiles on the left */
function deColorLeft (rowNum, colNum) {

    if (colNum != 0) {
        var tmp = document.getElementById("editable");
        let row = tmp.rows[rowNum]

        for (var j = colNum-1; j>=0; j--) {

            let col = row.cells[j] 
            if (col.id == 'normal_tile') unlightUpNormalTile(col)
            else if (col.id == 'lamp_tile') dealWithLitLight(col)
            else if (col.id == 'black_tile') break
        }
    }
}

/**   Function to deColor tiles above */
function deColorUp (rowNum,colNum) {

    if (rowNum != 0) {
        var tmp = document.getElementById("editable");

        for (var i = rowNum-1; i>=0; i--) {

            let tile = tmp.rows[i].cells[colNum]
            if (tile.id == 'normal_tile') unlightUpNormalTile(tile)
            else if (tile.id == 'lamp_tile') dealWithLitLight(tile)
            else if (tile.id == 'black_tile') break
        }
    }
}

/**   Function to decOlor tiles below */
function deColorDown (rowNum,colNum) {

    var tmp = document.getElementById("editable");
    if (rowNum != tmp.rows.length-1) {

        for (var i = rowNum+1; i<tmp.rows.length; i++) {

            let tile = tmp.rows[i].cells[colNum]
            if (tile.id == 'normal_tile') unlightUpNormalTile(tile)
            else if (tile.id == 'lamp_tile') dealWithLitLight(tile)
            else if (tile.id == 'black_tile') break
        }
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    ////    Winning, losing game functions. (Checkers)


/// Winning functions


/**   Checks if the lamps are correctly placed */
function checkIfLampsAreCorrect (E) {

    const rows = OfficialTable.rows
    for (let i = 0; i < rows.length; i++) {

        let col = rows[i].cells
        for (let j = 0; j < col.length; j++) {

            if(col[j].id == 'lamp_tile' && parseInt(col[j].dataset.litby) != 1) {
                return false;
            }
        }
    }
    return true;
}


/**  Checks if the black_tiles have their conditions satisfied, colors the black tiles accordingly */ 
function checkBlackTilesForRequireMents (E) {

    const rows = OfficialTable.rows

    for (let i = 0; i<rows.length; i++) {
        let col = rows[i].cells
        for (let j = 0; j<col.length; j++) {

            if (col[j].id == "black_tile") {
                

                //Case where the tile has no number on it
                if (!parseInt(col[j].innerHTML) && (col[j].innerHTML) != '0') {
                    col[j].style.color = 'green';
                    continue;
                }
                
                
                const tmp = getCellLocation(col[j])
                const theI = tmp[0]
                const theJ = tmp[1]
                const theValue = parseInt(col[j].innerHTML)
                let countChecker = 0


                //upTile
                if (theI-1 >= 0) {
                    if (rows[theI-1].cells[theJ].id == 'lamp_tile') {
                        countChecker++
                    }
                }
                //downTile
                if (theI+1 < rows.length) {
                    if (rows[theI+1].cells[theJ].id == 'lamp_tile') {
                        countChecker++
                    }
                }
                //leftTile
                if (theJ-1 >= 0) {
                    if (rows[theI].cells[theJ-1].id == 'lamp_tile') {
                        countChecker++
                    }
                }
                //rightTile
                if (theJ+1 < col.length) {
                    if (rows[theI].cells[theJ+1].id == 'lamp_tile') {
                        countChecker++
                    }
                }



                if (theValue == countChecker) { 

                    col[j].dataset.complete = 'true'
                    col[j].style.color = 'green'
                }
                //Not satisifed
                else { 
        
                    col[j].dataset.complete ='false'
                    col[j].style.color = ''
                }
                
            }
        }
    }
}


/** Checks if all the black functions have their conditions satisifed */
function checkIfBlackTilesAreCorrect (E) {

    const rows = OfficialTable.rows
    for (let i = 0; i<rows.length; i++) {
        let col = rows[i].cells
        for (let j = 0; j<col.length; j++) {
            if (col[j].id == "black_tile") {
                if (col[j].dataset.complete == 'false') return false;
            }
        }
    }
    return true
}


/**   Checks if all interactable tiles are lit */
function checkIfAllTilesAreLit (E) {

    const rows = OfficialTable.rows
    for (let i = 0; i < rows.length; i++) {

        let col = rows[i].cells
        for (let j = 0; j < col.length; j++) {

            if(col[j].id != 'black_tile' && parseInt(col[j].dataset.litby) < 1) {
                return false;
            }
        }
    }
    return true;
}


/**   Function to check if the player won the game */
function youWon (E) {

    if (checkIfAllTilesAreLit() && checkIfLampsAreCorrect() && checkIfBlackTilesAreCorrect()) {

        document.getElementById('winningDetails').innerHTML = "Name: "+getPlayer() + " --- " +"Map: "+ getMap() + " --- " + getTime()

        //Extra check incase it was deleted by the user
        makeLocalStorage()
        update_localStorage_lrList()
        display_localStorage_lrList()
    
        return true; 
    }
    else return false
}