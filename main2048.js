var board = new Array();
var score = 0;

$(document).ready(function() {
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
            board[i][j] = 0
        }
    }

    updateBoardView();

    score = 0;
}

//整体数据刷新
function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`)
            var theNumberCell = $(`#number-cell-${i}-${j}`);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

//生成一个数字
function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4))
        randy = parseInt(Math.floor(Math.random() * 4))
        times++;
    }
    //如果50次都没找到正确位置，则手动查找
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);


    return true;
}

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout(`generateOneNumber()`, 210);
                setTimeout(`isgameover()`, 300);
            }
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout(`generateOneNumber()`, 210);
                setTimeout(`isgameover()`, 300);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout(`generateOneNumber()`, 210);
                setTimeout(`isgameover()`, 300);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout(`generateOneNumber()`, 210);
                setTimeout(`isgameover()`, 300);
            }
            break;
        default:
            break;
    }
});

//游戏是否结束
function isgameover() {
    //没空间了并且没有操作空间了
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

//游戏结束
function gameover() {
    alert('游戏结束！')
}

//向左移动
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    /**
     * 落脚位置是否为空？
     * 落脚位置数字和待判定元素数字是否相同？
     * 移动路径中是否有障碍物？
     */
    for (var i = 0; i < 4; i++) {
        //对后三列进行搜索
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    //当前元素不为0并且没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k); //从位置i,j 移动到 i,k
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //两数相等并且也没有障碍物 
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        //相加
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        //加分
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(`updateBoardView()`, 200);
    return true
}

//向右移动
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    for (var i = 0; i < 4; i++) {
        //对前三列进行搜索
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    //当前元素不为0并且没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k); //从位置i,j 移动到 i,k
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //两数相等并且也没有障碍物 
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        //相加
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score)
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(`updateBoardView()`, 200);
    return true
}

//向上移动
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }

    for (var j = 0; j < 4; j++) {
        //对后三行进行搜索
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    //当前元素不为0并且没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //两数相等并且也没有障碍物 
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        //相加
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score)
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(`updateBoardView()`, 200);
    return true
}

//向下移动
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //对前三行进行遍历
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    //当前元素不为0并且没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j); //从位置i,j 移动到 i,k
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //两数相等并且也没有障碍物 
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        //相加
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score)
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(`updateBoardView()`, 200);
    return true
}