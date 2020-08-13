(function () {
    // This declares strict mode, which enforces cleaner code.
    // i.e. tells JS to give you an error when you use an undeclared variable.
    "use strict";

    ///////////////////////////////////////
    // Configuration
    ///////////////////////////////////////
    const GAME_VERSION = "1.0.0";

    // Page config
    let page = {
        FADE_TIME: 200,

        height: window.innerHeight,
        width: window.innerWidth,
        body: document.getElementsByTagName("body")[0],

        pages: {
            "load": document.getElementById("load-page"),
            "start": document.getElementById("start-page"),
            "customize": document.getElementById("customize-page"),
            "exploration": document.getElementById("exploration-page"),
            "battle": document.getElementById("battle-page"),
            "flee": document.getElementById("flee-page")
        },
        currentPage: "load",
        
        loadPageImg: document.getElementById("load-page-image"),

        avatarBtn: document.getElementById("avatar-img-button"),
        avatarImage: document.getElementById("avatar-img"),
        playCustomizeBtn: document.getElementById("play-button-customize"),

        textPassage: document.getElementById("text-passage"),
        textPassageContainer: document.getElementById("text-passage-container"),
        roomGraphic: document.getElementById("room-graphic"),
        loadingImage: document.getElementById("loading-image"),

        tileLayer1: null,
        tileLayer2: null,
        allTiles: null,

        imageModal: document.getElementById("image-modal"),
        closeModalBtn: document.getElementById("close-image-modal"),

        playBtn: document.getElementById("play-button"),
        backgroundImg: document.getElementById("background-img"),
        userInputName: document.getElementById("user-input-name"),
        input: document.getElementById("input-box-name"),
        musicBtn: document.getElementById("music-button"),

        battleBtn: document.getElementById("battle-button"),

        fleeBtn: document.getElementById("flee-button"),
        itemsBtn: document.getElementById("items-button"),
        rollDiceBtn: document.getElementById("dice-roller"),
        rollDiceFleeBtn: document.getElementById("dice-roller-flee"),
        diceImageList: document.querySelectorAll(".dice-img"),
        diceImageListFlee: document.querySelectorAll(".dice-img-flee"),
        mathQuestion: document.getElementById("math-question"),
        fleeDiceValue: document.getElementById("flee-dice-value"),
        fightWrapper: document.getElementById("fight-wrapper"),
        avatarImgBattle: document.getElementById("character-avatar"),
        avatarImgFlee: document.getElementById("character-avatar-flee"),

        infoBox: document.getElementById("battle-info-fight"),
        infoBoxFlee: document.getElementById("battle-info-flee"),

        submitBtn: document.getElementById("submit-answer"),
        userInput: document.getElementById("user-input"),
        mathResult: document.getElementById("math-result"),
        questionContainer: document.getElementById("dice-question-container"),
        questionContainerFlee: document.getElementById("dice-question-container-flee"),
        timeRemaining: document.getElementById("time-remaining"),
        progressBar: document.getElementById("progress-bar"),

        saveBtn: document.getElementById("save"),
        exitBtn: document.getElementById("exit"),

        monsterNames: ['Smokechild', 'The Giant Mutant Horror', 'Mournling', 'Corpsetooth', 'The Corrupt Troglodyte', 'The Aromatic Demon', 'The Barren Creeper', 'Cometthought', 'The Electric Dread Swine', 'The Illusionary Devourer'],
        monsterNameLabel: document.getElementById("monster-name"),
        monsterLevelLabelFlee: document.getElementById("monster-level-flee"),
        monsterNameLabelFlee: document.getElementById("monster-name-flee"),
        monsterLevelLabel: document.getElementById("monster-level"),
        monsterWrapper: document.getElementById("monster-wrapper"),
        monsterHealthText: document.getElementById("monster-percent"),
        monsterBarElement: document.getElementById("monster-bar"),
        monsterPicture: document.getElementById("monster-pic"),
        monsterHealthTextFlee: document.getElementById("monster-percent-flee"),
        monsterBarElementFlee: document.getElementById("monster-bar-flee"),
        monsterPictureFlee: document.getElementById("monster-pic-flee"),
        monsterFloaty: document.getElementById("monster-health-floaty"),
        monsterWeapon: document.getElementById("monster-weapon"),

        characterWrapper: document.getElementById("character-wrapper"),
        characterHealthText: document.getElementById("character-percent"),
        characterBarElement: document.getElementById("character-bar"),
        characterHealthTextFlee: document.getElementById("character-percent-flee"),
        characterBarElementFlee: document.getElementById("character-bar-flee"),
        characterWeapon: document.getElementById("character-weapon"),
        characterFloaty: document.getElementById("character-health-floaty"),
        characterExpFloaty: document.getElementById("character-exp-floaty"),
        characterAvatar: document.getElementById("character-avatar"),
        characterLevelLabel: document.getElementById("character-level"),
        characterNameLabel: document.getElementById("character-name"),
        characterLevelLabelFlee: document.getElementById("character-level-flee"),
        characterNameLabelFlee: document.getElementById("character-name-flee"),
        characterExperienceText: document.getElementById("experience-percent"),
        characterExperienceBar: document.getElementById("experience-bar"),
        characterExperienceTextFlee: document.getElementById("experience-percent-flee"),
        characterExperienceBarFlee: document.getElementById("experience-bar-flee"),

        // Toggle whether the background is faded
        setBgFade: function(bgFaded) {

            if (bgFaded) {
                page.backgroundImg.style.filter = "blur(12px) brightness(70%)";
            }
            else {
                page.backgroundImg.style.filter = "";
            }
        },

        // Toggle which page is shown
        goToPage: function(pageName) {
            
            this.pages[this.currentPage].style.display = "none";

            switch (pageName){
                case "start":
                    this.setBgFade(false);
                    resetBattlePage();
                    break;
                case "battle":
                    page.characterAvatar.style.top="0px";
                    page.monsterPicture.style.top="0px";
                    page.characterWrapper.style.visibility="visible";
                    page.monsterWrapper.style.visibility="visible";

                    if (isMusicOn && battleMusic.paused) {
                        music.pause();
                        battleMusic.currentTime = 0;
                        battleMusic.play();
                    }
                    break;
                case "exploration":
                    if (isMusicOn && music.paused) {
                        music.currentTime = 0;
                        music.play();
                        battleMusic.pause();
                    }
                    break;
                default:
                    //nothing
            }

            this.currentPage = pageName;
            this.pages[pageName].style.display = "block";
        },

        // function resize
        // Input: none
        // Side effects: changes the height and width properties of several page elements
        // Returns: none
        resize: function() {
            this.height = window.innerHeight;
            this.width = window.innerWidth;
            this.body.style.height = this.height+"px";
            this.body.style.width = this.width+"px";
            
            this.textPassageContainer.style.height = this.height * 0.25 + "px";
            this.roomGraphic.style.height = this.height * 0.60 + "px";
            this.roomGraphic.style.width = "100%";

            resizeRoomTable();
        }
    }
    

    // Flag for game save state
    let saveDataFound = null;

    // Player stats
    let player = {
        name: "Player 1",
        avatarImg: "assets/character1.png",
        level: 1,
        health: 25,
        totalHealth: 25,
        diceValues: null,
        exp: 0,
        totalExperience: 50
    };

    // Monster stats
    let monster = {
        name: "blank",
        level: 0,
        health: 0,
        totalHealth: 0
    };

    let countDown=0;

    // Values for countdown timer
    let countDownTimerValues={
        totalTime: 0,
        timeRemaining: -2,
        countDownIncrement: 0,
        barWidth:0
    }

    // Keeps track of avatar index
    let avatarCounter = 0;
    // Total number of avatars
    let numAvatar = 4;

     // Sound 
     let masterVolume = 0.1;
     let isMusicOn = false;

     let buttonSound = document.getElementById("button-sound");
     let diceSound = document.getElementById("dice-sound");
     let fireSound = document.getElementById("fire-sound");
     let swordSound = document.getElementById("sword-sound");
     let healthSound = document.getElementById("health-sound");
     let doorSound = document.getElementById("door-sound");
     let crumblingSound = document.getElementById("crumbling-sound");
     let music = document.getElementById("bgm");
     let battleMusic = document.getElementById("battle-bgm");

     // Configure the sounds
    let loudSFX = [diceSound, fireSound, swordSound, doorSound, crumblingSound]

    for (let i = 0; i < loudSFX.length; i++) {
        loudSFX[i].volume = masterVolume;
    }

     battleMusic.loop = true;
     battleMusic.volume = 0.03;
 
     music.loop = true;
     music.volume = 0.03;
     music.load();

    

    ///////////////////////////////////////
    // Room Generation
    ///////////////////////////////////////

    // Types of rooms
    let rooms = {
        numRoomTypes: 2,
        currentRoom: null,

        0: {
            name: "bedroom",
            auras: ["humid", "comfy", "dusty", "nostalgic"],
            objTypes: [15, 17, 19, 20, 21],
            guaranteedObjects: [18, 16],
            maxDoors: 2
        },

        1: {
            name: "storage room",
            auras: ["chilly", "lonely", "dusty", "smelly"],
            objTypes: [15, 20, 22, 23],
            guaranteedObjects: [],
            maxDoors: 1
        }
    }

    // Shapes of rooms
    let maps = {
        0: {
            array: [[5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8],
                    [7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8]],
            height: 10,
            width: 15
        },
        
        1: {
            array: [[5, 5, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [5, 5, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0,25,25, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0,25,25, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8],
                    [7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8]],
            height: 14,
            width: 20
        },

        2: {
            array: [[5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0,27,27, 28,28,0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0,27,27, 28,28,0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3],
                    [2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3],
                    [7, 7, 4, 4, 4, 4, 4, 4, 8, 8, 7, 7, 4, 4, 4, 4, 4, 4, 8, 8],
                    [7, 7, 4, 4, 4, 4, 4, 4, 8, 8, 7, 7, 4, 4, 4, 4, 4, 4, 8, 8]],
            height: 12,
            width: 20

        },

        numMaps: 3,
        currentMap: null,
        objMap: null
    }

    // The set of tiles to draw rooms
    let tileset = (function () {
        let sheet = "assets/interiorTileset.png";
        let tileSize = 64;

        return {
            tilesToLoad: 84,
            backgroundTiles: 8,
            transparent: loadTile(sheet, tileSize, tileSize, 1, 12),

            // Object tiles
            15: {
                name: "bag",
                tiles: [[loadTile(sheet, tileSize, tileSize, 4, 14)]],
                isTall: false,
                message: "It looks dirty. You'd rather not touch it.",
                clickEvent: null
            },
            16: {
                name: "wardrobe",
                tiles: [[loadTile(sheet, tileSize, tileSize, 2, 14),loadTile(sheet, tileSize, tileSize, 3, 14)],
                        [loadTile(sheet, tileSize, tileSize, 2, 15),loadTile(sheet, tileSize, tileSize, 3, 15)]],
                isTall: true,
                message: "It seems to be sturdily built out of oak.",
                clickEvent: function () {
                    let msg = "The wardrobe doors groan as you pull them apart. Inside, you find ";
                    let foundItems = "nothing but dust and cobwebs."

                    msg += foundItems;

                    page.textPassage.appendChild(createInteractiveText(" Open it?", function() {changeText(msg);}));
                }
            },
            17: {
                name: "vase of flowers",
                tiles: [[loadTile(sheet, tileSize, tileSize, 11, 14)]],
                isTall: false,
                message: "You take a sniff. It smells like cheap plastic.",
                clickEvent: null
            },
            18: {
                name: "bed",
                tiles: [[loadTile(sheet, tileSize, tileSize, 14, 13),loadTile(sheet, tileSize, tileSize, 15, 13)],
                        [loadTile(sheet, tileSize, tileSize, 14, 14),loadTile(sheet, tileSize, tileSize, 15, 14)],
                        [loadTile(sheet, tileSize, tileSize, 14, 15),loadTile(sheet, tileSize, tileSize, 15, 15)]],
                isTall: true,
                message: "It looks warm, but you're not tired yet.",
                clickEvent: null
            },
            19: {
                name: "candle",
                tiles: [[loadTile(sheet, tileSize, tileSize, 8, 11)]],
                isTall: false,
                message: "Romantic. If only you had something to light it with.",
                clickEvent: null
            },
            20: {
                name: "barrel",
                tiles: [[loadTile(sheet, tileSize, tileSize, 11, 12)],
                        [loadTile(sheet, tileSize, tileSize, 11, 13)]],
                isTall: true,
                message: "You try to pry it open, but it won't budge.",
                clickEvent: null
            },
            21: {
                name: "stool",
                tiles: [[loadTile(sheet, tileSize, tileSize, 12, 15)]],
                isTall: false,
                message: "You take a seat. You are bored. You stand up.",
                clickEvent: null
            },
            22: {
                name: "pile of logs",
                tiles: [[loadTile(sheet, tileSize, tileSize, 8, 12)]],
                isTall: false,
                message: " ",
                clickEvent: function() {
                    let finalMsg = "";
                    finalMsg += optionalRandomText("There is mold beginning to stretch across the surface of the wood. ");
                    finalMsg += optionalRandomText("Upon closer inspection, you notice that a community of "+
                                                   "bugs have made this their new home.");

                    page.textPassage.innerHTML += finalMsg;
                }
            },
            23: {
                name: "wooden keg",
                tiles: [[loadTile(sheet, tileSize, tileSize, 11, 15)]],
                isTall: false,
                message: "There is a clear liquid slowly leaking from the front. ",
                clickEvent: function() {
                    let newMessage;

                    page.textPassage.appendChild(
                        createInteractiveText("What could it be?", function() {
                            newMessage = "Whatever is in there, surely it's not good after who "+
                                          "knows how long it's been sitting there. ";

                            changeText(newMessage, function() {
                                page.textPassage.appendChild(
                                    createInteractiveText("Unless?", function() {
                                        newMessage = "Unless it's water. Or wine. Now that you think about it, there are quite "+
                                                     "a few things it could be that would still be safe to drink. ";

                                        changeText(newMessage, function() {
                                                page.textPassage.appendChild(
                                                    createInteractiveText("Try to drink it?", function() {
                                                        newMessage = "It looks like water, it feels like water, "+
                                                                     "and it tastes like water with rust in it. It must be water.";
                                                        changeText(newMessage);
                                                    })
                                                );
                                        });
                                    })
                                );
                            });
                        })
                    );
                }
            },

            // floor
            0: {
                name: "floor",
                tiles: [[loadTile(sheet, tileSize, tileSize, 14, 1)]],
            },

            // walls
            1: {
                name: "topWall",
                tiles: [[loadTile(sheet, tileSize, tileSize, 5, 1)],
                        [loadTile(sheet, tileSize, tileSize, 5, 2)]],
            },
            2: {
                name: "leftWall",
                tiles: [[loadTile(sheet, tileSize, tileSize, 0, 3),loadTile(sheet, tileSize, tileSize, 1, 3)]],
            },
            3: {
                name: "rightWall",
                tiles: [[loadTile(sheet, tileSize, tileSize, 6, 3),loadTile(sheet, tileSize, tileSize, 7, 3)]],
            },
            4: {
                name: "bottomWall",
                tiles: [[loadTile(sheet, tileSize, tileSize, 2, 7)],
                        [loadTile(sheet, tileSize, tileSize, 2, 8)]],
            },

            // corners
            5: {
                name: "topLeftCorner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 0, 1),loadTile(sheet, tileSize, tileSize, 1, 1)],
                        [loadTile(sheet, tileSize, tileSize, 0, 2),loadTile(sheet, tileSize, tileSize, 1, 2)]],
            },
            6: {
                name: "topRightCorner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 6, 1),loadTile(sheet, tileSize, tileSize, 7, 1)],
                        [loadTile(sheet, tileSize, tileSize, 6, 2),loadTile(sheet, tileSize, tileSize, 7, 2)]],
            },
            7: {
                name: "bottomLeftCorner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 0, 7),loadTile(sheet, tileSize, tileSize, 1, 7)], 
                        [loadTile(sheet, tileSize, tileSize, 0, 8),loadTile(sheet, tileSize, tileSize, 1, 8)]],
            },
            8: {
                name: "bottomRightCorner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 6, 7),loadTile(sheet, tileSize, tileSize, 7, 7)],
                        [loadTile(sheet, tileSize, tileSize, 6, 8),loadTile(sheet, tileSize, tileSize, 7, 8)]],
            },
            25: {
                name: "|_Corner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 2, 5),loadTile(sheet, tileSize, tileSize, 3, 5)],
                        [loadTile(sheet, tileSize, tileSize, 2, 6),loadTile(sheet, tileSize, tileSize, 3, 6)]],
            },
            26: {
                name: "_|Corner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 4, 5),loadTile(sheet, tileSize, tileSize, 5, 5)],
                        [loadTile(sheet, tileSize, tileSize, 4, 6),loadTile(sheet, tileSize, tileSize, 5, 6)]],
            },
            27: {
                name: "|--Corner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 2, 3),loadTile(sheet, tileSize, tileSize, 3, 3)],
                        [loadTile(sheet, tileSize, tileSize, 2, 4),loadTile(sheet, tileSize, tileSize, 3, 4)]],
            },
            28: {
                name: "--|Corner",
                tiles: [[loadTile(sheet, tileSize, tileSize, 4, 3),loadTile(sheet, tileSize, tileSize, 5, 3)],
                        [loadTile(sheet, tileSize, tileSize, 4, 4),loadTile(sheet, tileSize, tileSize, 5, 4)]],
            },

            // Doors
            11: {
                name: "topDoor",
                tiles: [[loadTile(sheet, tileSize, tileSize, 9, 6),loadTile(sheet, tileSize, tileSize, 10, 6),loadTile(sheet, tileSize, tileSize, 11, 6)],
                        [loadTile(sheet, tileSize, tileSize, 9, 7),loadTile(sheet, tileSize, tileSize, 10, 7),loadTile(sheet, tileSize, tileSize, 11, 7)]],
                clickEvent: doorEvent
            },
            12: {
                name: "leftDoor",
                tiles: [[loadTile(sheet, tileSize, tileSize, 12, 6),loadTile(sheet, tileSize, tileSize, 13, 6)],
                        [loadTile(sheet, tileSize, tileSize, 12, 7),loadTile(sheet, tileSize, tileSize, 13, 7)],
                        [loadTile(sheet, tileSize, tileSize, 12, 8),loadTile(sheet, tileSize, tileSize, 13, 8)]],
                clickEvent: doorEvent
            },
            13: {
                name: "rightDoor",
                tiles: [[loadTile(sheet, tileSize, tileSize, 14, 6),loadTile(sheet, tileSize, tileSize, 15, 6)],
                        [loadTile(sheet, tileSize, tileSize, 14, 7),loadTile(sheet, tileSize, tileSize, 15, 7)],
                        [loadTile(sheet, tileSize, tileSize, 14, 8),loadTile(sheet, tileSize, tileSize, 15, 8)]],
                clickEvent: doorEvent
            },
            14: {
                name: "bottomDoor",
                tiles: [[loadTile(sheet, tileSize, tileSize, 9, 8),loadTile(sheet, tileSize, tileSize, 10, 8),loadTile(sheet, tileSize, tileSize, 11, 8)],
                        [loadTile(sheet, tileSize, tileSize, 9, 9),loadTile(sheet, tileSize, tileSize, 10, 9),loadTile(sheet, tileSize, tileSize, 11, 9)]],
                clickEvent: doorEvent
            },
        }
    })();

    ///////////////////////////////////////
    // Room Functions
    ///////////////////////////////////////

    // function resizeRoomTable
    // Input: none
    // Side effects: Scales the height of the table HTML to the
    //               room graphic div
    // Returns: none
    function resizeRoomTable() {
        if (maps.currentMap === null) {return;}

        let roomHeight, tileDiv, tileImg, i;
        let tableHeight = maps.currentMap.height;

        roomHeight = Number(page.roomGraphic.style.height.slice(0, -2));
        for (i = 0; i < page.allTiles.length; i++) {
            tileDiv = page.allTiles[i].firstElementChild;
            tileImg = tileDiv.firstElementChild;

            if (tileImg.src.length > 0 ) {
                tileDiv.style.height = roomHeight / tableHeight + "px";
            }
        }
    }

    // function createInteractiveText
    // Input: prompt, the string of text that user can click on
    //        callback, a function that is executed upon user clicking the prompt
    // Returns: a <span> element containing the prompt text that can be clicked
    function createInteractiveText(prompt, callback) {
        let text = document.createElement("span");
        text.innerHTML = prompt;
        text.className = "clickable-text fade-in";
        text.addEventListener("click", function() {
            buttonSound.play();
            callback();
        }, false);

        return text;
    }

    // function optionalRandomText
    // Input: any number of strings
    // Side effects: none
    // Returns: a string containing a random combination 
    //          of the input strings (including the empty string)
    function optionalRandomText() {
        let len = arguments.length;
        let randomNum = randomInt(len + 1);
        let randomMessage = "";

        if (randomNum < len) {
            randomMessage = arguments[randomNum];
        }

        return randomMessage;
    }


    // function doorEvent
    // Input: none
    // Side effects: generates a new room, changes the random room flavor text, randomly executes battle sequence
    // Returns: none
    function doorEvent() {
        // don't do anything else until player is finished with the battle
        page.tileLayer2.removeEventListener("click", roomClickHandler);
        page.saveBtn.disabled = true;

        buttonSound.pause();
        doorSound.play();

        // is battle triggered? (1/2 chance)
        let battleTriggered = randomInt(2);

        if (battleTriggered) {

            // go to battle
            changeText("As you prepare to leave, something leaps out of the shadows! It charges at you!");
            page.battleBtn.style.display = "block";
            page.battleBtn.className += " fade-in";

            page.battleBtn.addEventListener("click", function myDoorHandler() {
                generateRoomGraphic();

                let currentRoom = rooms.currentRoom;
                let numAuras = currentRoom.auras.length;
                let aura = currentRoom.auras[ randomInt(numAuras) ];
                let msg = "You've entered what seems to be a "+currentRoom.name+". ";
                msg += "The air is... " + aura + ".";

                changeText(msg);

                page.saveBtn.disabled = false;
                page.tileLayer2.addEventListener("click", roomClickHandler);
                page.battleBtn.removeEventListener("click", myDoorHandler);

                page.battleBtn.className = "buttons";
            }, false);
        }

        // go to next room peacefully
        else {
            generateRoomGraphic();

            let currentRoom = rooms.currentRoom;
            let numAuras = currentRoom.auras.length;
            let aura = currentRoom.auras[ randomInt(numAuras) ];
            let msg = "You've entered what seems to be a "+currentRoom.name+". ";
            msg += "The air is... " + aura + ".";

            changeText(msg);

            page.saveBtn.disabled = false;
            page.tileLayer2.addEventListener("click", roomClickHandler);

            page.battleBtn.className = "buttons";
        }
    }

    // function changeText
    // Input: str, the string to change the flavor text to
    //        callback, an optional function to execute after animating the text change
    // Side effects: Changes the flavor text, executes callback (optionally)
    // Returns: none
    function changeText(str, callback) {
        // Fade out the old text
        page.textPassage.className = "fade-out";

        setTimeout(function() {
            // Fade in the new text
            page.textPassage.className = "fade-in";
            page.textPassage.innerHTML = str;

            if (callback) {
                callback();
            }
        }, page.FADE_TIME);
    }

    // function roomClickHandler
    // Input: event, the event object passed by event listeners
    // Side effects: changes the flavor text to info about the clicked object,
    //               executes any click events on the associated object
    // Returns: none
    function roomClickHandler(event) {
        let tile = getEventTarget(event).parentNode;
        
        if (tile.className === "room-object") {
            let obj = tileset[tile.dataset.objId];
            let msg = obj.message;

            buttonSound.play();

            if (msg) {
                msg = "It's a " + obj.name + ". " + msg;

                // Change the info text and run the callback when ready
                changeText(msg, obj.clickEvent);
            }
            else if (obj.clickEvent) {
                obj.clickEvent();
            }
        }
    }

    // function loadTile
    // Input: tilesheet, a string, the path to the spritesheet of tiles to use
    //        width, a number, the width(px) of each tile in the sheet
    //        height, a number, the height(px) of each tile in the sheet
    //        col, a number, the column in which to select the tile
    //        row, a number, the row in which to select the tile
    // Side effects: none
    // Returns: an image of the selected tile
    function loadTile(tilesheet, width, height, col, row) {
        let tileImage = document.createElement("img");
        let image = document.createElement("img");

        tileImage.addEventListener("load",  function myLoadHandler() {
            let spriteCanvas = document.createElement("canvas");
            let spriteContext = spriteCanvas.getContext('2d');

            spriteCanvas.width = width;
            spriteCanvas.height = height;

            spriteContext.drawImage(tileImage,
                                    col*width, row*height,
                                    width, height,
                                    0, 0,
                                    width, height);

            image.src = spriteCanvas.toDataURL('image/png');

            tileset.tilesToLoad--;
            if (tileset.tilesToLoad === 0) {
                // Wait until results come in from loadGame
                setTimeout(function dataCheck() {
                    if (saveDataFound !== null) {
                        generateRoomGraphic(saveDataFound);
                    }
                    else {
                        setTimeout(dataCheck, 500);
                    }

                }, 500);
            }

            tileImage.removeEventListener("load", myLoadHandler);
        }, false);

        tileImage.src = tilesheet;

        return image;
    }

    // function generateRoomGraphic
    // Input: none
    // Side effects: inserts a room into the HTML
    // Returns: none
    function generateRoomGraphic(loadFromFile=false) {
        let roomTable;
        let currentMap, currentRoom;
        let roomGraphic = page.roomGraphic;
        let previousFragment;

        // Show loading icon
        page.loadingImage.style.display = "inline-block";

        // Remove any traces of the previous room
        if (page.tileLayer2) {
            previousFragment = roomGraphic.getElementsByTagName("fragment")[0];
            roomGraphic.removeChild(previousFragment);

            page.tileLayer2.removeEventListener("click", roomClickHandler);
        }

        if (!loadFromFile) {
            // Choose the map shape
            maps.currentMap = maps[randomInt(maps.numMaps)];

            // Choose the room type
            rooms.currentRoom = rooms[randomInt(rooms.numRoomTypes)];
        }

        currentMap = maps.currentMap;
        currentRoom = rooms.currentRoom;

        // Generate new table HTML for the room
        roomTable = createRoomTable(currentMap.width, currentMap.height);

        // Load the room contents
        loadRoom(currentMap, currentRoom, loadFromFile);

        // Add event listener for clickable objects
        page.tileLayer2.addEventListener("click", roomClickHandler);

        // Resize the graphics according to size of the room
        resizeRoomTable();

        // Hide the loading icon
        page.loadingImage.style.display = "none";

        // Show the room
        roomGraphic.appendChild(roomTable);
        
    }

    // function createRoomTable
    // Input: xTiles, the number of tiles wide the room is
    //        yTiles, the number of tiles tall the room is
    // Side effects: none
    // Returns: a document fragment containing the room HTML
    function createRoomTable(xTiles, yTiles) {
        let i, j;
        let fragment;
        let table, table2, tbody, tr, td, div, img;

        // Create the fragment
        fragment = document.createElement("fragment");

        // First tile layer
        table = document.createElement("table");
        table.id = "tile-layer-1";
        table.cellSpacing = "0";
        fragment.appendChild(table);

        tbody = document.createElement("tbody");
        table.appendChild(tbody);

        for (i = 0; i < yTiles; i++) {
            tr = document.createElement("tr");
            tbody.appendChild(tr);

            for (j = 0; j < xTiles; j++) {
                td = document.createElement("td");
                div = document.createElement("div");
                img = document.createElement("img");

                tr.appendChild(td);
                td.appendChild(div);
                div.appendChild(img);
            }
        }

        // Create the second tile layer
        table2 = table.cloneNode(true);
        table2.id = "tile-layer-2";
        fragment.appendChild(table2);


        // Update page fields:
        page.allTiles = fragment.querySelectorAll("td");
        page.tileLayer1 = table;
        page.tileLayer2 = table2;

        return fragment;
    }

    // function isObjectColliding
    // Input: objMap, an array of numbers containing info about objects currently in the map
    //        obj, the object to check whether it's colliding with any other objects in the map
    //        coords, the coordinates at which the object would be
    // Side effects: none
    // Returns: true if the object is colliding with other objects,
    //          false if no collisions are detected
    function isObjectColliding(objMap, obj, coords) {
        let i, j;
        let objHeight = obj.tiles.length;
        let objWidth = obj.tiles[0].length;

        // Mark off the object on the object map
        for (i = 0; i < objHeight; i++) {
            for (j = 0; j < objWidth; j++) {
                if (objMap[ coords[0]+i ][ coords[1]+j ] !== 0) {
                    return true;
                }
            }
        }

        return false;
    }

    // function insertRandomDoors
    // Input: roomType, an object containing info about the type of room
    //        map, an array of numbers containing info about the room shape
    //        objMap, an array of numbers containing info about objects currently in the map
    //        doorPositions, an array of arrays containing x,y coordinates of possible wall spots to put a door
    // Side effects: Places doors in the objMap array. Mutates objMap.
    // Returns: none
    function insertRandomDoors(roomType, map, objMap, doorPositions) {
        let i, j, k;
        let numDoors = randomInt(roomType.maxDoors) + 1; // minimum 1 door
        let obj, objId, objHeight, objWidth;
        let availablePositions;
        let coords, positionIndex;
        
        availablePositions = doorPositions.slice(0);

        // Select random door positions
        for (i = 0; i < numDoors; i++) {
            do {
                positionIndex = randomInt(availablePositions.length);
                coords = doorPositions[positionIndex];
                mutableRemoveIndex(availablePositions, positionIndex);

                objId = map[ coords[0] ][ coords[1] ] + 10;
                obj = tileset[objId];
                objHeight = obj.tiles.length;
                objWidth = obj.tiles[0].length;

            } while (isObjectColliding(objMap, obj, coords));

            // Mark off the object on the object map
            for (j = 0; j < objHeight; j++) {
                for (k = 0; k < objWidth; k++) {
                    objMap[ coords[0]+j ][ coords[1]+k ] = objId;
                }
            }
        }
    }

    // function insertRandomObjects
    // Input: roomType, an object containing info about the type of room
    //        map, an array of numbers containing info about the room shape
    //        objMap, an array of numbers containing info about objects currently in the map
    //        floorPositions, an array of arrays containing x,y coordinates of possible floor spots to put an object
    //        tallPositions, an array of arrays containing x,y coordinates of possible places put "tall" objects
    // Side effects: Places objects in the objMap array. Mutates objMap.
    // Returns: none
    function insertRandomObjects(roomType, map, objMap, floorPositions, tallPositions) {
        let i, j, k;
        let numFloorTiles = floorPositions.length;
        let maxTiles = randomInt(numFloorTiles / 4);
        let numObjTypes = roomType.objTypes.length;
        let numObjTiles = 0;
        let obj, objId, objHeight, objWidth;

        let availablePositions;
        let coords, positionIndex;

        for (i = 0; i < roomType.guaranteedObjects.length; i++) {
            objId = roomType.guaranteedObjects[i];
            obj = tileset[objId];
            objHeight = obj.tiles.length;
            objWidth = obj.tiles[0].length;

            // Count the number of tiles taken so far
            numObjTiles += objHeight * objWidth;

            // Clone floor positions so we can edit the array
            availablePositions = floorPositions.slice(0);

            if (obj.isTall) {
                // allow selecting top floor y values - 1
                availablePositions = floorPositions.concat(tallPositions);
            }
            
            // objects can be placed at floor tiles minus width or height (origin point at top left corner)
            do {
                positionIndex = randomInt(availablePositions.length);
                coords = availablePositions[positionIndex];
                mutableRemoveIndex(availablePositions, positionIndex);
            } while (isObjectColliding(objMap, obj, coords) ||
                     map[ coords[0]+(objHeight-1) ] === undefined ||
                     map[ coords[0]+(objHeight-1) ][ coords[1]+(objWidth-1) ] !== 0 ||
                     map[ coords[0]+(objHeight-1) ][ coords[1] ] !== 0 ||
                     map[ coords[0] ][ coords[1]+(objWidth-1) ] !== 0 ||
                     map[ coords[0] ][ coords[1] ] !== 0);
            
            // Mark off the object on the object map
            for (j = 0; j < objHeight; j++) {
                for (k = 0; k < objWidth; k++) {
                    objMap[ coords[0]+j ][ coords[1]+k ] = objId;
                }
            }
        }

        // Select random object positions
        while (numObjTiles <= maxTiles) {
            objId = roomType.objTypes[randomInt(numObjTypes)];
            obj = tileset[objId];
            objHeight = obj.tiles.length;
            objWidth = obj.tiles[0].length;

            // Count the number of tiles taken so far
            numObjTiles += objHeight * objWidth;

            // Clone floor positions so we can edit the array
            availablePositions = floorPositions.slice(0);

            if (obj.isTall) {
                // allow selecting top floor y values - 1
                availablePositions = floorPositions.concat(tallPositions);
            }
            
            // objects can be placed at floor tiles minus width or height (origin point at top left corner)
            do {
                positionIndex = randomInt(availablePositions.length);
                coords = availablePositions[positionIndex];
                mutableRemoveIndex(availablePositions, positionIndex);
            } while (isObjectColliding(objMap, obj, coords) ||
                     map[ coords[0]+(objHeight-1) ] === undefined ||
                     map[ coords[0]+(objHeight-1) ][ coords[1]+(objWidth-1) ] !== 0 ||
                     map[ coords[0]+(objHeight-1) ][ coords[1] ] !== 0 ||
                     map[ coords[0] ][ coords[1]+(objWidth-1) ] !== 0 ||
                     map[ coords[0] ][ coords[1] ] !== 0);
            
            // Mark off the object on the object map
            for (j = 0; j < objHeight; j++) {
                for (k = 0; k < objWidth; k++) {
                    objMap[ coords[0]+j ][ coords[1]+k ] = objId;
                }
            }
        }
    }

    // function loadRoom
    // Input: roomContainer, a fragment containing the room HTML
    //        map, an array containing all the room shape info
    //        roomType, an object containing info about the room
    //                  (types of room objects, fluff info, etc.)
    // Side effects: Appends img elements for each tile to the table
    // Returns: none
    function loadRoom(map, roomType, loadFromFile=false) {
        let i, j, k, m;
        let tile1, tile2, tileMap, tileDiv;
        let xTiles = map.width;
        let yTiles = map.height;
        let objMap;
        let floorPositions = [], tallPositions = [], doorPositions = [];

        // Duplicate the map so we don't mess with the original
        map = JSON.parse(JSON.stringify(map.array));

        // Populate object map with 0's,
        // calculate positions of floor tiles
        objMap = [];
        tileMap = [];
        for (i = 0; i < yTiles; i++) {
            tileMap.push([]);
            objMap.push([]);

            for (j = 0; j < xTiles; j++) {
                tileMap[i].push(0);
                objMap[i].push(0);

                switch (map[i][j]) {
                    // Look for walls where doors can be placed
                    case 1:
                        if (i === 0 && map[i][j+2] === 1) {
                            doorPositions.push([i, j]);
                        }
                        break;
                    case 2:
                        if (j === 0 && map[i+2][j] === 2) {
                            doorPositions.push([i, j]);
                        }
                        break;
                    case 3:
                        if (j === xTiles-2 && map[i+2][j] === 3) {
                            doorPositions.push([i, j]);
                        }
                        break;
                    case 4:
                        if (i === yTiles-2 && map[i][j+2] === 4) {
                            doorPositions.push([i, j]);
                        }
                        break;

                    // Look for the floor tiles
                    case 0:
                        floorPositions.push([i, j]);

                        // Tall objects can cover the lower wall tile
                        if (map[i-1][j] === 1) {
                            tallPositions.push([i-1, j]);
                        }
                        break;

                    default:
                        //nothing
                    }
            }
        }

        if (!loadFromFile) {
            // Populate doors
            insertRandomDoors(roomType, map, objMap, doorPositions);

            // Populate room objects
            insertRandomObjects(roomType, map, objMap, floorPositions, tallPositions);

            // Update saved object map
            maps.objMap = objMap;
        }
        else {
            objMap = maps.objMap;
        }

        // Duplicate objMap so we don't change the original
        objMap = JSON.parse(JSON.stringify(objMap));

        // Fill in the room
        for (i = 0; i < yTiles; i++) {
            for (j = 0; j < xTiles; j++) {

                // Putting down background tiles
                // 1 in tileMap indicates that the spot has already been filled
                if (tileMap[i][j] === 0 && map[i][j] !== undefined) {
                    tile1 = tileset[ map[i][j] ];

                    for (k = 0; k < tile1.tiles.length; k++) {
                        for (m = 0; m < tile1.tiles[k].length; m++) {
                            tileDiv = page.tileLayer1.rows[i+k].cells[j+m].firstElementChild;
                            tileDiv.firstElementChild.src = tile1.tiles[k][m].src;
                            tileMap[i+k][j+m] = 1;
                        }
                    }
                }
                else if (map[i][j] === undefined) {
                    tileDiv = page.tileLayer1.rows[i].cells[j].firstElementChild;
                    tileDiv.firstElementChild.src = tileset.transparent.src;
                }

                // Putting down object tiles
                if (objMap[i][j] !== 0 && objMap[i][j] !== -1) {
                    tile2 = tileset[ objMap[i][j] ];

                    for (k = 0; k < tile2.tiles.length; k++) {
                        for (m = 0; m < tile2.tiles[k].length; m++) {
                            tileDiv = page.tileLayer2.rows[i+k].cells[j+m].firstElementChild;
                            tileDiv.firstElementChild.src = tile2.tiles[k][m].src;//.appendChild(tile2.tiles[k][m].cloneNode(false));
                            tileDiv.className = "room-object";
                            tileDiv.dataset.objId = objMap[i+k][j+m];
                            objMap[i+k][j+m] = -1;
                        }
                    }
                }
                // Keeping rest of the object layer transparent
                else if (objMap[i][j] === 0) {
                    tileDiv = page.tileLayer2.rows[i].cells[j].firstElementChild;
                    tileDiv.className = "";
                    tileDiv.firstElementChild.src = tileset.transparent.src;
                }
            }
        }

        // Resize accordingly
        resizeRoomTable();
    }

    ///////////////////////////////////////
    // Monster functions
    ///////////////////////////////////////

    // function initialiseMonster
    // Input: level, an integer representing the desired monster level
    // Side effects: Initialises the monster according to its level. 
    //               Monster health:
    //                  Level 1: [1,10]
    //                  Level 2: [11,20]
    //                  Level 3: [21,30]
    //                  Level 4: [31,40]
    //                  Level 5: [41,50]
    //               Monster total health for scaling the health bar
    //               Monster Picture: Random monster picture
    // Output: None
    // Monster level determines its stats and its attack
    function initialiseMonster(level){
        monster.name=page.monsterNames[randomInt(page.monsterNames.length)];
        page.monsterNameLabel.innerHTML="<p class=\"label-style\">" + monster.name + "</p>";
        page.monsterNameLabelFlee.innerHTML="<p class=\"label-style\">" + monster.name + "</p>";
        monster.level=level;
        //monster.health=(level*10)-randomInt(10);
        page.monsterLevelLabel.innerHTML="<p class=\"label-style\"> Level: "+monster.level+ "</p>";
        page.monsterLevelLabelFlee.innerHTML="<p class=\"label-style\"> Level: "+monster.level+ "</p>";
        monster.health=(level*10)-randomInt(10)
        monster.totalHealth=monster.health;
        page.monsterPicture.src = "assets/monster"+(randomInt(10)+1)+".png";
        page.monsterPictureFlee.src = page.monsterPicture.src;
        monsterDisplayHealth();
    }

    // function monsterDisplayHealth
    // Input: None
    // Side effects: Changes the health bar and the health value in the HTML page
    // Output: None
    function monsterDisplayHealth(){
        page.monsterHealthText.innerHTML = Math.round(monster.health)+" / "+monster.totalHealth;
        page.monsterBarElement.style.width = monster.health*100/monster.totalHealth+"%";
        page.monsterHealthTextFlee.innerHTML = monster.health+" / "+monster.totalHealth;
        page.monsterBarElementFlee.style.width = monster.health*100/monster.totalHealth+"%";
    }

    // function damageMonster
    // Input: damage, the amount of damage the player deals to the monster
    // Side effects: Changes the health of the monster and calls monsterDisplayHealth()
    // Output: None
    function damageMonster(damage){
        swordSound.play();
        page.characterWeapon.style.opacity=1;
        var bottom = 280;
        page.monsterFloaty.style.opacity=0;
        page.fightWrapper.style.visibility="hidden";
        var finalHealth=monster.health-damage;
        var rotate=0;
        var left=280;
        let throwWeapon = setInterval(function(){
            rotate+=40;
            left+=50;
            page.characterWeapon.style.transform = 'rotate('+(rotate%360)+'deg)';
            page.characterWeapon.style.left=left+"px";
            if (left>=1010){
                clearInterval(throwWeapon);
            }
        }, 100)
        setTimeout(function(){
            setTimeout(function(){
                if (monster.health>0){
                    if (document.getElementById("monster-attack-button") !== null){
                        document.getElementById("monster-attack-button").id = "old";
                    }
                    page.infoBox.innerHTML +=  "You have dealt "+damage+" damage to the monster.  ";
                    page.infoBox.innerHTML += "<button class=\"small-buttons\" id=\"monster-attack-button\"> OK </button> </br>";
                    updateScroll(); 
                    document.getElementById("monster-attack-button").addEventListener("click", function() {
                        monsterAttack();
                        document.getElementById("monster-attack-button").style.visibility = "hidden";
                    });    
                }
            }, 1300);
            page.characterWeapon.style.opacity=0;
            page.monsterFloaty.style.opacity=1;
            page.monsterFloaty.innerHTML="-"+damage;
            let monsterFloatyInterval = setInterval(function(){
                healthSound.play();
                page.monsterFloaty.style.opacity-=1/30;
                bottom+=(70/25);
                page.monsterFloaty.style.bottom=bottom+"px";
                monster.health = monster.health-(damage/30);
                monsterDisplayHealth();
                if (monster.health<=0){
                    setTimeout(function() {
                        let monsterAtkBtn = document.getElementById("monster-attack-button");

                        if (monsterAtkBtn) {
                            monsterAtkBtn.style.visibility = "hidden";
                        }
                    },5);
                    crumblingSound.play();
                    clearInterval(countDown);
                    clearInterval(monsterFloatyInterval);
                    page.infoBox.innerHTML += "<br> Congrats! You beat the monster! You have gained "+monster.level*2+" experience points! Leaving battle...";
                    let expAnimation = setInterval(function(){
                        healthSound.play();
                        player.exp=player.exp+(monster.level*2)/30;
                        playerDisplay();
                    }, 50);

                    var bottomXP = 280;
                    page.characterExpFloaty.style.opacity=1;
                    page.characterExpFloaty.innerHTML="+"+(monster.level*2);
                    let characterExpFloatyInterval = setInterval(function(){
                        page.characterExpFloaty.style.opacity-=1/30;
                        bottomXP+=(70/25);
                        page.characterExpFloaty.style.bottom=bottomXP+"px";
                        playerDisplay();
                        if (bottomXP === 290) {
                        clearInterval(characterExpFloatyInterval);
                        page.characterExpFloaty.style.opacity=0;
                        }
                    }, 50);

                    setTimeout(function(){
                        clearInterval(expAnimation);
                        if (document.getElementById("fight-to-main-buttons") !== null){
                            document.getElementById("fight-to-main-buttons").id = "old";
                        }
                        page.infoBox.innerHTML += "<button class=\"small-buttons\" id=\"fight-to-main-buttons\"> OK </button> </br>";
                        updateScroll(); 
                        document.getElementById("fight-to-main-buttons").addEventListener("click", function() {
                            buttonSound.play();
                            page.goToPage("exploration");
                            document.getElementById("fight-to-main-buttons").style.visibility = "hidden";
                        });
                    }, 1500);
                    var y = 0;
                    let monsterDrop = setInterval(function(){
                        y+=25;
                        page.monsterPicture.style.top=y+"px";
                    }, 100);
                    setTimeout(function(){
                        page.monsterWrapper.style.visibility="hidden";
                        clearInterval(monsterDrop);
                    }, 1000);
                }
                if (monster.health<=finalHealth){
                    clearInterval(monsterFloatyInterval);
                    monster.health=finalHealth;
                }
            }, 50)
        }, 1460)
    }
    
    ///////////////////////////////////////
    // Player functions
    ///////////////////////////////////////
    
    // function initialisePlayer
    // Input: None
    // Side effects: Updates the HTML page with any changes to the user's health or stats. 
    // Output: None
    function initialisePlayer(){
        var healthPercentage = player.health/player.totalHealth;
        player.totalHealth=10*player.level;
        player.totalExperience=5*player.level;
        // Current player health is calcualted as a percentage of the total health. Allows the current health to increase as the player levels up
        player.health=healthPercentage*player.totalHealth;
        page.characterLevelLabel.innerHTML="<p class=\"label-style\"> Level: "+player.level+"</p>";
        page.characterNameLabel.innerHTML= "<p class=\"label-style\">" + player.name + "</p>";
        page.characterLevelLabelFlee.innerHTML="<p class=\"label-style\"> Level: "+player.level+"</p>";
        page.characterNameLabelFlee.innerHTML="<p class=\"label-style\">" + player.name + "</p>";
        page.avatarImgBattle.src = player.avatarImg;
        playerDisplay();
    }

    // function playerDisplay
    // Input: None
    // Side effects: Changes the health bar and value in the HTML page for the player
    // Output: None
    function playerDisplay(){
        
        if (player.exp>=player.totalExperience){
            player.level++;
            page.infoBox.innerHTML+="<br> Congratulations! You have reached level "+player.level+"! ";
            player.totalExperience=5*player.level;
            player.exp=0;
        }
        page.characterBarElement.style.width = player.health*100/player.totalHealth+"%"
        page.characterHealthText.innerHTML= Math.round(player.health)+" / "+player.totalHealth;
        page.characterBarElementFlee.style.width = player.health*100/player.totalHealth+"%"
        page.characterHealthTextFlee.innerHTML = Math.round(player.health)+" / "+player.totalHealth;
        page.characterExperienceText.innerHTML=Math.round(player.exp*100/player.totalExperience)+"%"
        page.characterExperienceTextFlee.innerHTML=Math.round(player.exp*100/player.totalExperience)+"%"
        page.characterExperienceBar.style.width=player.exp*100/player.totalExperience+"%";
        page.characterExperienceBarFlee.style.width=player.exp*100/player.totalExperience+"%";
    }

    // function monsterAttack
    // Input: None
    // Side effects: Changes the health of the player and depending on the attack value of the monster
    //               Attack value = monsterLevel*[0,1]+1
    // Output: The amount of damage dealt to the player
    function monsterAttack(){
        fireSound.play();
        page.fightWrapper.style.visibility="hidden";
        page.monsterWeapon.style.opacity=1;
        var bottom = 280;
        var damage=Math.floor(Math.random() * player.totalHealth/5) + 1;
        var finalHealth=player.health-damage;
        var right=280;
        let throwWeapon = setInterval(function(){
            right+=50;
            page.monsterWeapon.style.right=right+"px";
            if (right>=1010){
                clearInterval(throwWeapon);
            }
        }, 100)
        setTimeout(function(){
            setTimeout(function(){
                if (player.health>0){
                    if (document.getElementById("reset-fight") !== null){
                        document.getElementById("reset-fight").id = "old";
                    }
                    page.infoBox.innerHTML += "<br> The monster dealt "+damage+" damage to you. Select fight or flee from the buttons on the left. ";
                    page.infoBox.innerHTML += "<button class=\"small-buttons\" id=\"reset-fight\"> OK </button> </br>";
                    updateScroll(); 
                    document.getElementById("reset-fight").addEventListener("click", function() {
                        buttonSound.play();
                        resetBattlePage();
                        page.rollDiceBtn.disabled = false;
                        page.rollDiceBtn.style.opacity= "1";
                        flicker(page.rollDiceBtn);
                        page.fleeBtn.disabled = false;
                        page.fleeBtn.style.opacity= "1";
                        flicker(page.fleeBtn);
                        document.getElementById("reset-fight").style.visibility = "hidden";
                    });    
                }
            }, 1500);
            
            page.monsterWeapon.style.opacity=0;
            page.characterFloaty.style.opacity=1;
            page.characterFloaty.innerHTML="-"+damage;
            let characterFloatyInterval = setInterval(function(){
                healthSound.play();
                page.characterFloaty.style.opacity-=1/30;
                bottom+=(70/25);
                page.characterFloaty.style.bottom=bottom+"px";
                player.health = player.health-(damage/30);
                playerDisplay();
                if (player.health<=0){
                    setTimeout(function() {
                        document.getElementById("reset-fight").style.visibility = "hidden";
                    },5);
                    crumblingSound.play();
                    clearInterval(countDown);
                    clearInterval(characterFloatyInterval);
                    page.infoBox.innerHTML += "Oh no! The monster dealt "+damage+" damage and defeated you. Leaving battle...  ";
                    if (document.getElementById("fight-to-main-buttons") !== null){
                        document.getElementById("fight-to-main-buttons").id = "old";
                    }
                    page.infoBox.innerHTML += "<button <button class=\"small-buttons\" id=\"fight-to-main-buttons\"> OK </button> </br>";
                    updateScroll(); 
                    document.getElementById("fight-to-main-buttons").addEventListener("click", function() {
                        buttonSound.play();
                        page.goToPage("exploration");
                        player.health=player.totalHealth;
                        document.getElementById("fight-to-main-buttons").style.visibility = "hidden";
                    });
                    var y = 0;
                    let characterDrop = setInterval(function(){
                        y+=25;
                        page.characterAvatar.style.top=y+"px";
                    }, 100);
                    setTimeout(function(){
                        page.characterWrapper.style.visibility="hidden";
                        clearInterval(characterDrop);
                    }, 1000);
                }
                if (player.health<=finalHealth){
                    clearInterval(characterFloatyInterval);
                    page.characterFloaty.style.opacity=0;
                    player.health=finalHealth;
                }
            }, 50)
        }, 1460)
        return damage;
    }
    
    ///////////////////////////////////////
    // Helper functions
    ///////////////////////////////////////

    // Flickering button
    function flicker(o) {
        o.style.webkitAnimation="none";
        setTimeout(function() {
            o.style.webkitAnimation = '';
        }, 10);
    }
    
    // function saveGame
    // Input: none
    // Side effects: updates localStorage object with various game fields
    // Returns: true if saving the game was successful, false otherwise
    function saveGame() {
        // Store game state in local storage
        if (typeof(Storage) !== "undefined") {
            try {
                localStorage.setItem('GOF_player', JSON.stringify(player));
                localStorage.setItem('GOF_mapShape', JSON.stringify(maps.currentMap));
                localStorage.setItem('GOF_objMap', JSON.stringify(maps.objMap));
                localStorage.setItem('GOF_gameVersion', JSON.stringify(GAME_VERSION));

                changeText("Game saved successfully. You may continue exploring.");
                return true;
            }
            catch (e) {
                changeText("Error: there was an issue when trying to save!");
            }
        }
        else {
            alert("Error: saving is unsupported on your system. Please update your web browser and try again.");
        }

        return false;
    }

    // function loadGame
    // Input: none
    // Side effects: updates various game fields according to localStorage
    // Returns: true if loading the game was successful, false otherwise
    function loadGame() {
        let loadedPlayer, loadedMapShape, loadedObjMap;
        let saveVersion;

        // Access game state in local storage
        if (typeof(Storage) !== "undefined") {
            try {
                loadedPlayer = JSON.parse(localStorage.getItem('GOF_player'));
                loadedMapShape = JSON.parse(localStorage.getItem('GOF_mapShape'));
                loadedObjMap = JSON.parse(localStorage.getItem('GOF_objMap'));
                saveVersion = JSON.parse(localStorage.getItem('GOF_gameVersion'));
            }
            catch(e) {
                alert("Error: save data missing or corrupted. Creating new save data...");
            }


            // Was game data loaded successfully?
            if (loadedPlayer && loadedMapShape && loadedObjMap) {
                
                // Return true if successful and load the game data
                if (saveVersion && saveVersion === GAME_VERSION) {
                    player = loadedPlayer;
                    maps.currentMap = loadedMapShape;
                    maps.objMap = loadedObjMap;
                    return true;
                }

                // Is the save data old?
                else {
                    alert("Uh-oh! It looks like your save data is outdated. Creating new save data...");
                }
            }

            // Unsuccessful at this point. Clear any corrupted data.
            localStorage.clear();
        }
        else {
            alert("Error: saving is unsupported on your system. Please update your web browser and try again.");
        }

        

        
        // Not successful :(
        return false;
    }

    // function checkName
    // Input: name, user's input in character's name field
    // Side effects: update player's name
    // Returns: none
    function checkName(name) {
        if(name.trim() === "") {
            player.name = page.input.placeholder;
        } else {
            player.name = name;
        }
    }
    
    // function getEventTarget
    // Input: e, the event
    // Side effects: none
    // Returns: the target of the event
    function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement;
    }

    // function randomInt
    // Input: max, [should be] an integer (you never know 'cuz javascript is bad)
    // Side effects: none
    // Returns: a random integer: 0 thru (max - 1)
    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // function mutableRemoveIndex
    // Input: array, the array we are removing an item from
    //        index, [should be] an integer; the position at which we are removing an item.
    // Side effects: removes the item from the array. The array itself is changed.
    // Returns: none
    function mutableRemoveIndex(array, index) {

        if (index >= array.length) {
            console.error('ERROR: mutableRemoveIndex: index is out of range');
            return;
        }
    
        if (array.length <= 0) {
            console.error('ERROR: mutableRemoveIndex: empty array');
            return;
        }
    
        // Overwrite array[index] with the last element in the array.
        array[index] = array[array.length-1];
        // Erase the last element.
        array[array.length-1] = undefined;
    
        // Shorten the array length.
        array.length = array.length-1;
    }

    // function debounce
    // Input: func, the function to call after the time period
    //        delay, [should be] an integer; the time in milliseconds after which to execute func
    //        immediate, a boolean; determines callback on leading edge (true) or trailing (false)
    // Side effects: calls func after the timeout
    // Returns: none
    function debounce(func, delay, immediate) {
        // This optimizes certain event listeners by only executing func
        // a certain amount of time after the event *stops* firing (useful for resize)
        let timeout;

        return function() {
            let context = this;
            let args = arguments;
            let callNow;

            let later = function() {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };

            callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, delay);

            if (callNow) 
                func.apply(context, args);
        };
    }

    // function rollDice
    // Input: numDice, an integer of how many dice are to be rolled
    //        max, an integer representing the number of faces of the dice
    // Side effects: create an array of size numDice and add dice values to the array 
    // Returns: an array of all the dice values 
    function rollDice(numDice,max) {
        let i;
        let diceValues = [];
        for(i = 0; i < numDice; i++){
            diceValues.push(randomInt(max)+1);
        }
        return diceValues;
    }
    
    // function initialiseTimer
    // Input: time, an integer representing the amount of time in seconds to count down from
    // Side effects: sets the countDownTimerValues dictionary to the appropriate values and runs the countdown. Updates the submit button look on the page. 
    // Outputs: None
    function initialiseTimer(time){
        countDown=0;
        page.submitBtn.innerHTML = "Go!";
        page.progressBar.style.width = "0%";
        page.submitBtn.disabled = false;
        countDownTimerValues.totalTime=time;
        countDownTimerValues.timeRemaining=time;
        countDownTimerValues.countDownIncrement = (1/(time))*100;
        countDownTimerValues.barWidth=0;

        countDown = setInterval(
            function(){
                page.progressBar.style.width = countDownTimerValues.barWidth.toString() + "%";
                page.submitBtn.innerHTML = "Go! 0:"+countDownTimerValues.timeRemaining.toString().padStart(2, '0');
                countDownTimerValues.barWidth+=countDownTimerValues.countDownIncrement;
                countDownTimerValues.timeRemaining-=1;

                if (countDownTimerValues.timeRemaining === -2){
                    clearInterval(countDown);
                    page.submitBtn.disabled = true;
                    monsterAttack();
                    page.infoBox.innerHTML += "<br> Oh no, time's up!</br>";
                    updateScroll(); 
                    if (document.getElementById("reset-fight") !== null){
                        document.getElementById("reset-fight").id = "old";
                    }
                    
                    page.fleeBtn.disabled = true;
                    //page.fleeBtn.style.backgroundColor = "red";
                    page.rollDiceBtn.disabled = true;
                    page.rollDiceBtn.style.opacity= "0.5";
                }
            }, 1000);
    } 

    // function nextTurn
    // Input: None
    // Side effects: Prepares the state of the game for the next turn; resets the timer, rolls the dice and asks for user input
    // Output: None
    function nextTurn(){
        page.fightWrapper.style.visibility="visible";
        page.monsterFloaty.style.opacity=0;
        let i;
        let diceImgs = page.diceImageList;
        //clearInterval(countDown);
        // setCountDownTimer(10);
        // if (countDown==0){
        initialiseTimer(5);
        // }
        player.diceValues = rollDice(2,6);
        page.fleeBtn.disabled = true;
        page.fleeBtn.style.opacity= "0.5";
        //page.fleeBtn.style.backgroundColor = "red";
        page.rollDiceBtn.disabled = true;
        page.rollDiceBtn.style.opacity= "0.5";

        // Update all dice images
        for (i = 0; i < diceImgs.length; i++) {
            diceImgs[i].src = "assets/dice" + player.diceValues[i] + ".png";
        }

        // Update the math question according to the dice rolls
        page.mathQuestion.innerHTML = player.diceValues[0]+" x "+player.diceValues[1]+" = ? Type below.";
        
        // Show the math question and input fields
        page.questionContainer.style.visibility = "visible";
    }

    // function resetBattlePage
    // Input: None
    // Side effects: Removes the current input, resets the submit button and hides the dice and input field
    // Output: None
    function resetBattlePage(){
        document.getElementById('input-box').value='';
        document.getElementById('input-box').placehodler='Type your answer here';
        page.fightWrapper.style.visibility="hidden";
        page.progressBar.style.width = "0%";
    }

    // function resetFleePage
    // Input: None
    // Side effects: Hides the dice field
    // Output: None
    function resetFleePage(){
        page.questionContainerFlee.style.visibility="hidden";
        page.rollDiceFleeBtn.disabled = false;
        page.rollDiceFleeBtn.style.opacity = 1;
    }

    // function checkAnswer
    // Input: userAnswer, an integer of the user's input number
    //        diceValues, an array of dice values
    //        operator, the operation to perform on the values
    // Side effects: sets text of the necessary HTML elements to provide user feedback
    //               and disables the submit button if the answer is right
    // Returns: true or false if the user was correct
    function checkAnswer(userAnswer, diceValues, operator) {
        let actualAnswer;
        let mathResult = page.mathResult;
        let dice1 = diceValues[0];
        let dice2 = diceValues[1];

        switch(operator){
            case "+":
                actualAnswer = dice1 + dice2;
                break;
            case "-":
                actualAnswer = dice1 - dice2;
                break;
            case "x":
                actualAnswer = dice1 * dice2;
                break;
            case "divide":
                actualAnswer = dice1/dice2;
                break;
        }

        // page.infoBox.innerHTML += "<br> dice1 + " " + operator + " " + dice2 +" = " + actualAnswer + ". ";
        if (isNaN(userAnswer)) {
            page.infoBox.innerHTML += "<br> Oops! Please enter a valid number.";
            updateScroll(); 
            return false;
        }
        else if (userAnswer===actualAnswer){
            if (document.getElementById("monster-attack-button") !== null){
                document.getElementById("monster-attack-button").id = "old";
            }
            page.infoBox.innerHTML += "<br>"+dice1 + " " + operator + " " + dice2 +" = " + actualAnswer + ". You got it right! ";
            page.submitBtn.disabled = true;
            clearInterval(countDown);
            page.progressBar.style.width="100%";
            damageMonster(actualAnswer);
            if(monster.health===0){
                page.goToPage("exploration");
            }
            return true;
        }
        else{
            page.infoBox.innerHTML += "<br> You got it wrong. Try again.";
            updateScroll(); 
            return false;
        }
    }

    // function isFlee
    // Input: diceTotalValue, total dice value rolled from flee page
    // Returns: true if total dice value is greater than or equal to 8, false otherwise
    function isFlee(diceTotalValue) {
        // if(diceTotalValue % 2 === 0) {
        //  return true;
        // } else {
        //     return false;
        // }
        if (diceTotalValue>=8){
            return true;
        }
        else {
            return false;
        }
    }   

    // function updateScroll keeps scroll at the bottom
    function updateScroll() {
        page.infoBox.scrollTop = page.infoBox.scrollHeight;
        page.infoBoxFlee.scrollTop = page.infoBoxFlee.scrollHeight;
    }

    ///////////////////////////////////////
    // Event Listeners
    ///////////////////////////////////////

    // When the window loads, size the page and load any saved states
    window.addEventListener("load", function(){
        // Resize the page initially
        page.resize();

        // Look for saved games
        saveDataFound = loadGame();

        // Move from the loading page to the title menu
        page.goToPage("start");
    }, false);

    // Resize when window changes size
    window.addEventListener("resize", debounce(function(){page.resize();}, 250, false), false);


    // Play button event
    page.playBtn.addEventListener("click", function () {
        buttonSound.play();
        if(!saveDataFound) {
            page.goToPage("customize");
        } else {
            page.goToPage("exploration");
        }
        page.setBgFade(true);
    }, false);

    // Music button event
    page.musicBtn.addEventListener("click", function () {
        if (!isMusicOn) {
            music.play();
            page.musicBtn.innerHTML = "Disable Music";
        } else {
            music.pause();
            page.musicBtn.innerHTML = "Enable Music";
        }
        isMusicOn = !isMusicOn;
    }, false);

    // Customize button event
    page.playCustomizeBtn.addEventListener("click", function (e) {
        buttonSound.play();
        e.preventDefault();
        checkName(page.userInputName.name.value.trim());
        page.goToPage("exploration");
    }, false);

    // Clicking on the avatar to change pictures
    page.avatarBtn.addEventListener("click", function() {
        let source;

        buttonSound.play();
        avatarCounter++;
        source = "assets/character"+(avatarCounter%numAvatar+1)+".png";
        page.avatarImage.src = source;
        player.avatarImg = source;
    }, false);
    
    // Save & Exit buttons
    page.exitBtn.addEventListener("click", function(){
        page.goToPage("start");
        buttonSound.play();
    }, false);

    page.saveBtn.addEventListener("click", function() {
        saveDataFound = saveGame();
        buttonSound.play();
     }, false);

    // Battle button
    page.battleBtn.addEventListener("click", function() {
        buttonSound.play();
        playerDisplay();
        page.characterWrapper.display="visible";
        page.monsterFloaty.style.opacity=0;
        page.characterFloaty.style.opacity=0;
        initialiseMonster(randomInt(player.level+1)+1);
        initialisePlayer();
        //page.imageModal.style.display = "block";
        page.infoBox.innerHTML += "<br> You encountered "+monster.name+"! Would you like to fight it or flee from it?";
        updateScroll(); 
        page.fleeBtn.disabled = false;
        page.fleeBtn.style.opacity= "1";
        flicker(page.fleeBtn);
        //page.fleeBtn.style.backgroundColor = "red";
        page.rollDiceBtn.disabled = false;
        page.rollDiceBtn.style.opacity= "1";
        flicker(page.rollDiceBtn);
        page.goToPage("battle");
        

        updateScroll(); 

        this.style.display = "none";
    }, false);

    // Exit button for the popup
    page.closeModalBtn.addEventListener("click", function () {
        page.imageModal.style.display = "none";
    }, false);

    // Clicking outside of the popup closes the popup
    window.addEventListener("click", function(event) {
        if (event.target === page.imageModal) {
            page.imageModal.style.display = "none";
        }
    }, false);

    // Button for rolling the dice on fight page
    page.rollDiceBtn.addEventListener("click", function() {
        diceSound.play();
        nextTurn();
    }, false);

    // Button for rolling the dice on flee page
    page.rollDiceFleeBtn.addEventListener("click", function() {
        let i;
        let diceImgs = page.diceImageListFlee;

        diceSound.play();

        page.rollDiceFleeBtn.disabled = true;
        page.rollDiceFleeBtn.style.opacity= "0.5";
        
        player.diceValues = rollDice(2,6);

        // Update all dice images
        for (i = 0; i < diceImgs.length; i++) {
            diceImgs[i].src = "assets/dice" + player.diceValues[i] + ".png";
        }

        // Update the math question according to the dice rolls
        page.fleeDiceValue.innerHTML = "You rolled a total of "+(player.diceValues[0]+player.diceValues[1])+" !";
        
        // Show the math question and input fields
        page.questionContainerFlee.style.visibility = "visible";

        if (isFlee(player.diceValues[0]+player.diceValues[1]) === true) {
            page.infoBoxFlee.innerHTML += "<br> Yes, you are ready to flee! You're safe. Leaving battle... ";
            page.infoBox.innerHTML += "<br> You have successfully fled from "+monster.name+ ".";
            if (document.getElementById("flee-to-main-button") !== null){
                document.getElementById("flee-to-main-button").id = "old";
            }
            page.infoBoxFlee.innerHTML += "<button class=\"small-buttons\" id=\"flee-to-main-button\"> OK </button> </br>";
            updateScroll(); 
            document.getElementById("flee-to-main-button").style.visibility = "visible";
            document.getElementById("flee-to-main-button").addEventListener("click", function() {
                buttonSound.play();
                resetFleePage();
                page.goToPage("exploration");
                document.getElementById("flee-to-main-button").disabled= true;
                document.getElementById("flee-to-main-button").style.visibility = "hidden";
            });
        } else {
            page.infoBoxFlee.innerHTML += "<br> No, you are not!  You lost "+player.totalHealth/10+" of your health as a result. Returning to battle... ";
            var threshold = player.health-player.totalHealth/10;
            let healthAnimation = setInterval(function(){
                healthSound.play();
                player.health=player.health-(monster.totalHealth/300);
                if(player.health<=threshold){
                    clearInterval(healthAnimation);
                }
                playerDisplay();
            }, 50)
            
            page.infoBox.innerHTML += "<br> Click the attack button on the left once you are ready to fight the monster! ";
            if (document.getElementById("flee-to-fight-button") !== null){
                document.getElementById("flee-to-fight-button").id = "old";
            }
            page.infoBoxFlee.innerHTML += "<button class=\"small-buttons\" id=\"flee-to-fight-button\"> OK </button> </br>";
            updateScroll(); 
            document.getElementById("flee-to-fight-button").addEventListener("click", function() {
                buttonSound.play();
                resetFleePage();
                page.goToPage("battle");
                monsterAttack();
                document.getElementById("flee-to-fight-button").disabled= true;
                page.fleeBtn.disabled = true;
                page.fleeBtn.style.opacity = "0.5";
                page.rollDiceBtn.disabled = true;
                page.rollDiceBtn.style.opacity= "0.5";
                page.fleeBtn.style.webkitAnimation = "pause";
                page.rollDiceBtn.style.webkitAnimation = "pause";
                document.getElementById("flee-to-fight-button").style.visibility = "hidden";
                updateScroll(); 
            });
        }
    }, false);

    //Flee button on fight page
    page.fleeBtn.addEventListener("click", function() {
        buttonSound.play();
        page.goToPage("flee");
        page.avatarImgFlee.src = player.avatarImg;
        page.infoBoxFlee.innerHTML += "<br> Click the Flee button on the left. Roll at least an 8 to see if you are ready to flee! </br>";
        updateScroll(); 
    });

    //Items button on flee page
    page.itemsBtn.addEventListener("click", function () {
        buttonSound.play();
        alert("Page under construction...");
    });

    // Input validation

    // Check user answer when they press the Enter key or press the submit button
    page.userInput.addEventListener("submit", function(e){ 
        e.preventDefault();
        buttonSound.play();
        
        // Get the user's input
        let userAnswer = page.userInput.answer.value;

        // Clear the answer box
        page.userInput.answer.value = '';

        // If nothing is entered, give appropriate message
        if (userAnswer.trim() === '') {
            userAnswer = NaN;
        }
        // Otherwise, try to convert to a number
        else {
            userAnswer = Number(userAnswer);
        }

        // document.getElementById("math-result").style.visibility = 'visible';
        
        if(isNaN(userAnswer) && checkAnswer(userAnswer, player.diceValues, "x") === false) {
            // page.infoBox.innerHTML += "<br> The monster is still waiting for you. </br>";
        }
        else if(checkAnswer(userAnswer, player.diceValues, "x") === true) {
            // page.infoBox.innerHTML += "<br> Congrats! You just beat the monster! Leaving battle in victory... ";
            // page.infoBox.innerHTML += "<button class=\"red-button\" id=\"fight-to-main-buttons\"> OK </button> </br>";
        } 

        // document.getElementById("fight-to-main-buttons").addEventListener("click", function() {
        //     page.nextPage();
        //     page.nextPage();
        //     document.getElementById("fight-to-main-buttons").style.visibility = "hidden";
        // });

        // document.getElementById("monster-attack-button").addEventListener("click", function() {monsterAttack()});
        // document.getElementById("reset-fight").addEventListener("click", function() {nextTurn()});

    }, false);

})();