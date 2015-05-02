QUnit.module("player");
QUnit.test("pickSquare", function(assert) {
  var square = board.up_left;
  player.pickSquare(square);
  assert.equal($(square).text(), player.XO);
  assert.equal(square.disabled, true);
  board.clear(); // using this to "reset" the test
});

QUnit.module("computer");
QUnit.test("pickSquare", function(assert) {
	var square = board.up_right;
	computer.pickSquare(square);
	assert.equal(square.textContent, computer.XO);
	assert.equal(square.disabled, true);
	board.clear();
});
QUnit.test("checkForCounter with a counter move", function(assert) {
	player.pickSquare(board.middle_left);
	player.pickSquare(board.middle);
	assert.equal(computer.checkForCounter(), board.middle_right);
	board.clear();
});
QUnit.test("checkForCounter without a counter move", function(assert) {
	player.pickSquare($('.down_right'));
	assert.equal(computer.checkForCounter(), false);
	board.clear();
});
QUnit.test("checkForWinningMove with winning move", function(assert) {
	computer.pickSquare(board.up_mid);
	computer.pickSquare(board.middle);
	assert.equal(computer.checkForWinningMove(), board.down_mid);
	board.clear();
});
QUnit.test("checkForWinningMove without winning move", function(assert) {
	assert.equal(computer.checkForWinningMove(), false);
	board.clear();
});
QUnit.test("takeTurn", function(assert) {
	var corner_square_values;
	var edge_square_values;

	// test winning move
	computer.pickSquare(board.up_left);
	computer.pickSquare(board.up_mid);
	computer.takeTurn();
	assert.equal(board.up_right.textContent, computer.XO);
	board.clear();

	// test counter move
	player.pickSquare(board.up_mid);
	player.pickSquare(board.middle);
	computer.takeTurn();
	assert.equal(board.down_mid.textContent, computer.XO);
	board.clear();

	// test center move
	computer.takeTurn();
	assert.equal($(".mid")[0].textContent, computer.XO);
	board.clear();

	// test corner move
	player.pickSquare(board.middle);
	computer.takeTurn();
	corner_square_values = $.map(board.corners, function(n) { return n.textContent });
	assert.equal($.inArray(computer.XO, corner_square_values) >= 0, true);
	board.clear();
});

QUnit.module("board");
QUnit.test("init", function(assert) {
	assert.deepEqual(board.corners, [board.up_left, board.up_right, board.down_left, board.down_right]);
	assert.deepEqual(board.edges, [board.up_mid, board.middle_right, board.down_mid, board.middle_left]);
	assert.equal(board.getEmptySquares().length, 9);
});
QUnit.test("clear", function(assert) {
	player.pickSquare(board.up_left);
	player.pickSquare(board.down_left);
	computer.pickSquare(board.middle);
	board.clear();
	assert.equal(board.getEmptySquares().length, 9);
});
QUnit.test("disableEmptyButtons", function(assert) {
	var buttons = board.buttons;
	board.clear();
	board.disableEmptyButtons();
	for (var i = 0; i < buttons.length; i++) {
		assert.equal(buttons[i].disabled, true);
	}
});
QUnit.test("enableEmptyButtons when squares are empty", function(assert) {
	var button = board.up_mid;
	button.disabled = true;
	button.textContent = "";
	board.enableEmptyButtons();
	assert.equal(button.disabled, false);
});
QUnit.test("enableEmptyButtons when squares are not empty", function(assert) {
	var button = board.middle_right;
	button.textContent = computer.XO;
	button.disabled = true;
	board.enableEmptyButtons();
	assert.equal(button.disabled, true);
	board.clear();
});
QUnit.test("squareIsEmpty", function(assert) {
	var button = board.down_mid;
	button.disabled = false;
	button.textContent = "";
	assert.equal(board.squareIsEmpty(button), true);
});
QUnit.test("getEmptySquares", function(assert) {
	var buttons_to_fill = [board.up_mid, board.down_mid, board.middle_left, board.middle_right];
	for (var i = 0; i < buttons_to_fill.length; i++) {
		buttons_to_fill[i].disabled = true;
		buttons_to_fill[i].textContent = computer.XO;
	}
	assert.equal(board.getEmptySquares().length, 5);
	board.clear();
});

QUnit.module("game");
QUnit.test("checkForWin", function(assert) {
	function checkPossibilities(for_whom) {
		// rows
		for_whom.pickSquare(board.up_left);
		for_whom.pickSquare(board.up_mid);
		for_whom.pickSquare(board.up_right);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
		for_whom.pickSquare(board.middle_left);
		for_whom.pickSquare(board.middle);
		for_whom.pickSquare(board.middle_right);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
		for_whom.pickSquare(board.down_left);
		for_whom.pickSquare(board.down_mid);
		for_whom.pickSquare(board.down_right);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();

		// columns
		for_whom.pickSquare(board.up_left);
		for_whom.pickSquare(board.middle_left);
		for_whom.pickSquare(board.down_left);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
		for_whom.pickSquare(board.up_mid);
		for_whom.pickSquare(board.middle);
		for_whom.pickSquare(board.down_mid);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
		for_whom.pickSquare(board.up_right);
		for_whom.pickSquare(board.middle_right);
		for_whom.pickSquare(board.down_right);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();

		// diagonals
		for_whom.pickSquare(board.up_left);
		for_whom.pickSquare(board.middle);
		for_whom.pickSquare(board.down_right);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
		for_whom.pickSquare(board.up_right);
		for_whom.pickSquare(board.middle);
		for_whom.pickSquare(board.down_left);
		assert.equal(game.checkForWin(for_whom), true);
		board.clear();
	}
	checkPossibilities(player);
	checkPossibilities(computer);
});
QUnit.test("checkForDraw", function(assert) {
	var buttons = board.buttons;
	assert.equal(game.checkForDraw(), false);
	player.pickSquare(board.up_left);
	player.pickSquare(board.up_mid);
	computer.pickSquare(board.up_right);
	computer.pickSquare(board.middle_left);
	player.pickSquare(board.middle)
	player.pickSquare(board.middle_right);
	computer.pickSquare(board.down_left);
	computer.pickSquare(board.down_mid);
	player.pickSquare(board.down_right);
	assert.equal(game.checkForDraw(), true);
	board.clear();
});






