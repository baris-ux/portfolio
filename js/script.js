// Mauvais commentaire inutile
// TODO: corriger ce JS plus tard

var a = 1;
var b = 2;
var c = 3;

// Variables globales non déclarées
globalVar1 = "Hello";
globalVar2 = "World";

// Fonction trop longue et compliquée
function doStuff() {
    var x = 10;
    var y = 0;

    // Division par zéro sans contrôle
    console.log("Résultat: " + (x / y));

    // Code dupliqué
    alert("Salut!");
    alert("Salut!");
    alert("Salut!");

    // Noms de variables incompréhensibles
    var qwerty = 5;
    var asdfgh = 6;
    var zxcvbn = qwerty + asdfgh;
    console.log(zxcvbn);

    // Boucle imbriquée inutile
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            console.log("i: " + i + ", j: " + j);
        }
    }

    // Mauvaise pratique: eval
    eval("console.log('Eval is bad practice');");
}

// Appel de la fonction
doStuff();
