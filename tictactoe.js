"use strict";

$(document).ready(function() {
  var player = {
    XO: "X",
    score: 0,

    pickSquare: function(square) {
      square.textContent = player.XO;
      square.disabled = true;
    }
  };

  var computer = {
    XO: "O",
    score: 0,

    takeTurn: function() {
      var empty_squares;
      var square_to_pick;

      // if there's a winning move, pick it
      square_to_pick = computer.checkForWinningMove();
      if (square_to_pick != false) {
        computer.pickSquare(square_to_pick);
        game.nextTurn();
        return;
      }

      // if player is about to win, make a counter move
      square_to_pick = computer.checkForCounter();
      if (square_to_pick != false) {
        computer.pickSquare(square_to_pick);
        game.nextTurn();
        return;
      }

      // if center is available, pick it
      if (board.squareIsEmpty(null, board.middle)) {
        computer.pickSquare(board.middle);
        game.nextTurn();
        return;
      }

      // if player's first move was center, we want a random corner
      if (game.turn === 2 && !board.squareIsEmpty(null, board.middle)) {
        square_to_pick = board.getRandomSquare(board.corners);
        computer.pickSquare(square_to_pick);
        game.nextTurn();
        return;
      }

      // if it's the computer's 2nd move, and the player has center and 1 corner, we want a corner
      if (game.turn === 4 && !board.squareIsEmpty(null, board.middle) && board.cornerIsOccupied(player)) {
        square_to_pick = board.getRandomSquare($(board.corners).filter(board.getEmptySquares()));
        computer.pickSquare(square_to_pick);
        game.nextTurn();
        return;
      }

      // if it's the computer's 2nd move, and the player has 2 opposing corners, we want an edge
      if (game.turn === 4 && 
          (board.up_left.textContent === player.XO && board.down_right.textContent === player.XO ||
           board.up_right.textContent === player.XO && board.down_left.textContent === player.XO)) {
        square_to_pick = board.getRandomSquare(board.edges);
        computer.pickSquare(square_to_pick);
        game.nextTurn();
        return;
      }

      // if nothing above applies, we can just pick a random square
      console.log('random!!')
      empty_squares = board.getEmptySquares();
      computer.pickSquare(board.getRandomSquare(empty_squares));
      game.nextTurn();
    },

    pickSquare: function(square) {
      $(square).text(computer.XO);
      square.disabled = true;
    },

    checkForCounter: function() {
      var empty_squares = board.getEmptySquares();
      var num_empty = empty_squares.length;

      for (var i = 0; i < num_empty; i++) {
        $(empty_squares[i]).text(player.XO);
        if (game.checkForWin(player)) {
          $(empty_squares[i]).text("");
          return empty_squares[i];
        }
        $(empty_squares[i]).text("");
      }
      return false;
    },

    checkForWinningMove: function() {
      var empty_squares = board.getEmptySquares();
      var num_empty = empty_squares.length;

      for (var i = 0; i < num_empty; i++) {
        $(empty_squares[i]).text(computer.XO);
        if (game.checkForWin(computer)) {
          $(empty_squares[i]).text("");
          return empty_squares[i];
        }
        $(empty_squares[i]).text("");
      }
      return false;
    }
  };

  var board = {
    up_left: $('.up_left')[0],
    up_mid: $('.up')[0],
    up_right: $('.up_right')[0],
    middle_left: $('.left')[0],
    middle: $('.mid')[0],
    middle_right: $('.right')[0],
    down_left: $('.down_left')[0],
    down_mid: $('.down')[0],
    down_right: $('.down_right')[0],
    element: $('.board'),
    buttons: $('.board > button'),
    corners: [],
    edges: [],

    init: function() {
      board.corners = [this.up_left, this.up_right, this.down_left, this.down_right];
      board.edges = [this.up_mid, this.middle_right, this.down_mid, this.middle_left];
      board.clear();
      board.attachHandlers();
    },

    attachHandlers: function() {
      board.buttons.on('click', function() {
        player.pickSquare(this);
        game.nextTurn();
      });
    },

    clear: function() {
      var num_buttons = board.buttons.length;

      for (var i = 0; i < num_buttons; i++) {
        board.buttons[i].disabled = false;
      }
      board.buttons.text("");
      game.is_player_turn = true;
      game.turn = 1;
      $('.msg').text("Good luck!");
    },

    disableEmptyButtons: function() {
      var empty_squares = board.getEmptySquares();
      for (var i = 0; i < empty_squares.length; i++) {
        empty_squares[i].disabled = true;
      }
    },

    enableEmptyButtons: function() {
      var empty_squares = this.getEmptySquares();
      for (var i = 0; i < empty_squares.length; i++) {
        empty_squares[i].disabled = false;
      }
    },

    squareIsEmpty: function(i, square) {
      return $(square).text() === "";
    },

    getEmptySquares: function() {
      return this.buttons.filter(this.squareIsEmpty);
    },

    getRandomSquare: function(squares) {
      return squares[Math.floor(Math.random()*squares.length)];
    },

    cornerIsOccupied: function(by_whom) {
      var corner_square_values = $.map(board.corners, function(n) { return n.textContent }); 
      return $.inArray(by_whom.XO, corner_square_values) >= 0;
    }
  };

  var game = {
    player_score: 0,
    computer_score: 0,
    is_player_turn: false,
    turn: 0, // player's first turn is 1, computer's first turn is 2

    init: function() {
      $('.player_xo').text(player.XO);
      $('.msg').text("Good luck!");
      board.init()
      this.attachHandlers();
    },

    attachHandlers: function() {
      $('.new_game').on('click', function() {
        board.clear();
      });
    },

    // @param for_whom should be a computer or player object
    checkForWin: function(for_whom) {
      if (// check rows
          board.up_left.textContent === for_whom.XO     && board.up_mid.textContent === for_whom.XO   && board.up_right.textContent === for_whom.XO ||
          board.middle_left.textContent === for_whom.XO && board.middle.textContent === for_whom.XO   && board.middle_right.textContent === for_whom.XO ||
          board.down_left.textContent === for_whom.XO   && board.down_mid.textContent === for_whom.XO && board.down_right.textContent === for_whom.XO ||
          // check columns 
          board.up_left.textContent === for_whom.XO  && board.middle_left.textContent === for_whom.XO  && board.down_left.textContent === for_whom.XO ||
          board.up_mid.textContent === for_whom.XO   && board.middle.textContent === for_whom.XO       && board.down_mid.textContent === for_whom.XO ||
          board.up_right.textContent === for_whom.XO && board.middle_right.textContent === for_whom.XO && board.down_right.textContent === for_whom.XO ||
          // check diagonals
          board.up_left.textContent === for_whom.XO   && board.middle.textContent === for_whom.XO && board.down_right.textContent === for_whom.XO ||
          board.down_left.textContent === for_whom.XO && board.middle.textContent === for_whom.XO && board.up_right.textContent === for_whom.XO) {
        return true;
      }
      return false;
    },

    checkForDraw: function() {
      return (board.getEmptySquares().length === 0);
    },

    nextTurn: function() {
      game.turn++;
      if (this.checkForDraw()) {
        $('.msg').text("It's a draw!");
      }
      else if (this.checkForWin(computer)) {
        $('.msg').text("You lost!");
        game.is_player_turn = false;
        this.computer_score++;
        board.disableEmptyButtons();
      }
      else if (this.checkForWin(player)) {
        $('.msg').text("You won! Wait... something went wrong.");
        this.player_score++;
        board.disableEmptyButtons();
      }
      else {
        game.is_player_turn = !game.is_player_turn;
        if (!this.is_player_turn) {
          computer.takeTurn();
        }
      }
    }
  };

  game.init(); // start the game!

  // globalize for testing purposes
  window.board = board;
  window.game = game;
  window.player = player;
  window.computer = computer;
});
