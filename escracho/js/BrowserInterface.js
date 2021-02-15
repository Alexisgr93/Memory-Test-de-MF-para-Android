/**
 * Author: Maximo Mena
 * GitHub: mmenavas
 * Twitter: @menamaximo
 * Project: Memory Workout
 * Description: The game interface
 */

/**
 * @TODO Refactor code.
 */
(function($) {

  /************ Start hard coded settings ******************/

  // How long a non matching card is displayed once clicked.
  
//Cuánto tiempo se muestra una tarjeta que no coincide una vez que se hace clic.

  var nonMatchingCardTime = 1000;

  /************ End hard coded settings ******************/

  // Handle clicking on settings icon
  //Manejar haciendo clic en el icono de configuración..
  var settings = document.getElementById('memory--settings-icon');
  var modal = document.getElementById('memory--settings-modal');
  var handleOpenSettings = function (event) {
    event.preventDefault();
    modal.classList.toggle('show');
  };
  settings.addEventListener('click', handleOpenSettings);

  // Handle settings form submission
  var reset = document.getElementById('memory--settings-reset');
  var handleSettingsSubmission = function (event) {
    event.preventDefault();

    var selectWidget = document.getElementById("memory--settings-grid").valueOf();
    var grid = selectWidget.options[selectWidget.selectedIndex].value;
    var gridValues = grid.split('x');
    var cards = $.initialize(Number(gridValues[0]), Number(gridValues[1]));

    if (cards) {
      document.getElementById('memory--settings-modal').classList.remove('show');
      document.getElementById('memory--end-game-modal').classList.remove('show');
      document.getElementById('memory--end-game-message').innerText = "";
      document.getElementById('memory--end-game-score').innerText = "";
      buildLayout($.cards, $.settings.rows, $.settings.columns);
    }

  };
  reset.addEventListener('click', handleSettingsSubmission);

  // Handle clicking on card
  //Manejar haciendo clic en la tarjeta.
  var handleFlipCard = function (event) {

    event.preventDefault();

    var status = $.play(this.index);
    console.log(status);

    if (status.code != 0 ) {
      this.classList.toggle('clicked');
    }

    if (status.code == 3 ) {
      setTimeout(function () {
        var childNodes = document.getElementById('memory--cards').childNodes;
        childNodes[status.args[0]].classList.remove('clicked');
        childNodes[status.args[1]].classList.remove('clicked');
      }.bind(status), nonMatchingCardTime);
    }
    else if (status.code == 4) {
      var score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
      var message = getEndGameMessage(score);

      document.getElementById('memory--end-game-message').textContent = message;
      document.getElementById('memory--end-game-score').textContent =
          'Score: ' + score + ' / 100';

      document.getElementById("memory--end-game-modal").classList.toggle('show');
    }

  };

  var getEndGameMessage = function(score) {
    var message = "";

    if (score == 100) {
      message = "Excelente Trabajo!"
    }
    else if (score >= 70 ) {
      message = "Buen Trabajo!"
    }
    else if (score >= 50) {
      message = "Buen Trabajo!"
    }
    else {
      message = "Puedes hacerlo mejor.";
    }

    return message;
  }

  // Build grid of cards
  //Construye una grilla de cartas.
  var buildLayout = function (cards, rows, columns) {
    if (!cards.length) {
      return;
    }

    var memoryCards = document.getElementById("memory--cards");
    var index = 0;

    var cardMaxWidth = document.getElementById('memory--app-container').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

    var cardMaxHeight = document.getElementById('memory--app-container').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

    // Clean up. Remove all child nodes and card clicking event listeners.
	//Limpiar. Elimine todos los nodos secundarios y los oyentes del evento que hagan clic en la tarjeta.
    while (memoryCards.firstChild) {
      memoryCards.firstChild.removeEventListener('click', handleFlipCard);
      memoryCards.removeChild(memoryCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
		//Use cloneNode (true) de lo contrario, solo se agrega un nodo.
        memoryCards.appendChild(buildCardNode(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }

    // Resize cards to fit in viewport
	//Cambiar el tamaño de las tarjetas para que quepa en la ventana gráfica.
    if (cardMaxHeight > cardHeightForMaxWidth) {
      // Update height
	  //Altura de actualización
      memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      memoryCards.style.width = document.getElementById('memory--app-container').offsetWidth + "px";
      memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
    }
    else {
      // Update Width
	  //Ancho de actualización.
      memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      memoryCards.style.height = document.getElementById('memory--app-container').offsetHeight + "px";
      memoryCards.style.top = 0;
    }

  };

  // Update on resize
  //Actualización sobre el cambio de tamaño.
  window.addEventListener('resize', function() {
    buildLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  // Build single card
  //Construye una sola carta.
  var buildCardNode = function (index, card, width, height) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.classList.add("flip-container");
    if (card.isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + card.value);
    if (card.isMatchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };

})(MemoryGame);
