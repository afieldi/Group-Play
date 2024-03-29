const api = require ( "./api" );

var robot = require("robotjs");


function clickPhaseButton ( callback = () => {} ) {
    var screen = robot.getScreenSize ( );
    robot.moveMouse ( screen.width * .86,
                      screen.height * .5 );
    setTimeout ( ( ) => {
        robot.mouseClick ( "left", false );
        setTimeout ( ( ) => {
            callback ( );
        }, 200);
    }, 200);
}

function setCardsToAttack() {

}

function clickOnCard ( cardId, callback = ( ) => { } )
{
    api.getRectangles ( ( data ) => {
        if ( data == "ERROR" )
        {
            return;
        }
        for ( var card of data [ "Rectangles" ] )
        {
            if ( card [ "CardID" ] == cardId )
            {
                var cardHeight = card [ "Height" ];
                var cardWidth = card [ "Width" ];
                var screen = robot.getScreenSize ( );
                robot.moveMouse  (  card [ "TopLeftX" ] + ( cardWidth / 2 ),
                                    screen.height - ( card [ "TopLeftY" ] - ( cardHeight / 2 ) ) );
                robot.mouseClick ( "left", false );
                setTimeout ( ( ) => {
                    callback ( );
                }, 200 );
            }
        }
    });
}

function mulliganCard ( cardId, callback = () => { } )
{
    api.getRectangles ( ( data ) => {
        if ( data == "ERROR" )
        {
            return;
        }
        for ( var card of data [ "Rectangles" ] )
        {
            if ( card [ "CardID" ] == cardId )
            {
                var screen = robot.getScreenSize ( );
                var midX = card [ "TopLeftX" ] + ( card [ "Width" ] * .5 );
                var y = screen.height - ( card [ "TopLeftY" ] - ( card [ "Height" ] + 75 ) );
                console.log ( y );
                robot.moveMouse ( midX, y );
                setTimeout ( ( ) => {
                    robot.mouseClick ( "left", false );
                    setTimeout ( ( ) => {
                        callback ( );
                    }, 200 );
                }, 200 );
            }
        }
    })
}

function challengerCard ( theirCardId, ourCardId, callback = () => {} )
{
    api.getRectangles ( ( data ) => {
        if ( data == "ERROR" )
        {
            return;
        }
        data = JSON.parse ( JSON.stringify ( data ) );
        var c1;
        var c2;
        console.log ( ourCardId );
        for ( var card of data [ "Rectangles" ] )
        {
            console.log ( card [ "CardID"] );
            console.log ( card [ "CardID" ] == ourCardId );
            if ( card [ "CardID" ] == theirCardId )
            {
                // console.log ( "xx" );
                c1 = card;
            }
            if ( card [ "CardID" ] == ourCardId )
            {
                console.log ( 1 );
                // console.log ( card );
                // console.log ( 2 );
                c2 = card;
            }
        }
        console.log ( "moving card" );
        if ( c1 == undefined || c2 == undefined )
        {
            // This is probably bad and can trap us in an infinite loop. 
            setTimeout ( ( ) => {
                console.log ( "card was undef. Retrying" );
                challengerCard ( theirCardId, ourCardId, callback );
            }, 1000 );
            return;
        }
        var screen = robot.getScreenSize ( );
        var c1Height = c1 [ "Height" ];
        var c1Width = c1 [ "Width" ];
        var c2Width = c2 [ "Width" ];
        console.log ( screen );
        console.log ( ( c1 [ "TopLeftY" ] + ( c1Height / 2 ) ) );
        robot.moveMouse  (  c1 [ "TopLeftX" ] + ( c1Width / 2 ),
                            screen.height - ( c1 [ "TopLeftY" ] - ( c1Height / 2 ) ) );

        robot.mouseToggle ( "down" );
        // REEE this setTimeout chain is so bad
        // But needed to give the computer time to register each input
        setTimeout ( ( ) => {
            robot.dragMouse ( c2 [ "TopLeftX" ] + ( c2Width / 2 ) , screen.height / 2 );
            setTimeout ( ( ) => {
                robot.mouseToggle ( "up" );                    
                setTimeout ( ( ) => {
                    callback ( );
                }, 200 );
            }, 200 );
        }, 200 );
        return;
    } );
}

function playCard( cardId, callback = () => {} ) {
    api.getRectangles ( ( data ) => {
        if ( data == "ERROR" )
        {
            return;
        }
        for ( var card of data [ "Rectangles" ] )
        {
            // console.log ( card );
            if ( card [ "CardID" ] == cardId )
            {
                var screen = robot.getScreenSize ( );
                var cardHeight = card [ "Height" ];
                var cardWidth = card [ "Width" ];
                robot.moveMouse  (  card [ "TopLeftX" ] + ( cardWidth / 2 ),
                                    screen.height - ( card [ "TopLeftY" ] - ( cardHeight / 2 ) ) );
                // robot.mouseClick ( "right", false );
                robot.mouseToggle ( "down" );
                // REEE this setTimeout chain is so bad
                // But needed to give the computer time to register each input
                setTimeout ( ( ) => {
                    robot.dragMouse ( screen.width / 2, screen.height / 2 );
                    setTimeout ( ( ) => {
                        robot.mouseToggle ( "up" );                    
                        setTimeout ( ( ) => {
                            callback ( );
                        }, 200 );
                    }, 200 );
                }, 200 );
                return;
            }
        }
    } );
}

function startGame ( callback = () => { } )
{
    setTimeout ( ( ) => {
        robot.moveMouse ( 1610, 934 );
        setTimeout ( ( ) => {
            robot.mouseClick ( "left", false );
            setTimeout ( ( ) => {
                callback ( );
            }, 200 );
        }, 200 );
    }, 200 );
}

function doMoves ( moves, callback = () => { console.log ( "REEE" ); } )
{
    if ( moves.length == 0 )
    {
        console.log ( "last move" );
        setTimeout ( ( ) => {
            callback ( );
        }, 1000 );
        return;
    }
    
    console.log ( "starting a move" );
    var move = moves.splice ( 0, 1 ) [ 0 ];
    
    setTimeout ( ( ) => {
        switch (move [ "type" ]) {
            case 0:
                console.log ( "Playing" ); 
                playCard ( move [ "target" ], ( ) => { doMoves ( moves, callback ); } );
                break;
            case 1:
                console.log ( "Targetiong" );
                clickOnCard ( move [ "target" ], ( ) => { doMoves ( moves, callback ); } )
                break;
            case 2:
                console.log ( "defending" );
                challengerCard ( move [ "target" ], move [ "refCard" ], ( ) => { doMoves ( moves, callback ) } );
                break;
            case 3:
                console.log ( "Challengeing" );
                challengerCard ( move [ "target" ], move [ "refCard" ], ( ) => { doMoves ( moves, callback ) } );
                break;
            case 4:
                console.log ( "ending phase" );
                clickPhaseButton ( ( ) => { doMoves ( moves, callback ) } );
                break;
            case 5:
                console.log ( "mulliganing" );
                mulliganCard ( move [ "target" ], ( ) => { doMoves ( moves, callback ) } );
                break;
            default:
                break;
        }
    }, 500 );

    // setTimeout ( () => {
    //     playCard ( 1979673340, ( ) => {
    //         setTimeout ( ( ) => {
    //             challengerCard ( 338737632, 1979673340, ( ) => {
    //                 setTimeout ( ( ) => {
    //                     clickPhaseButton ( );
    //                 }, 300 );
    //             } );
    //         }, 500 );
    //     });
    // }, 2000 );
    
}

module.exports = {
    clickPhaseButton: clickPhaseButton,
    setCardsToAttack: setCardsToAttack,
    playCard: playCard,
    challengerCard: challengerCard,
    doMoves: doMoves,
    startGame: startGame,
    mulliganCard: mulliganCard
};