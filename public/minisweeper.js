function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]/4294967296 * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function sweep(board, x, y) { 
  const boardLength = Math.sqrt(board.length); 
  const index = y*boardLength + x; 
  if(index >= 0 && index < board.length) { 
    // valid space 
    if(board[index] > 9) { 
      // valid space to sweep 
      board[index] -= 10; 
      if(0==board[index]) { // empty space, keep sweeping 
        if(x>0) { 
          sweep(board, x-1, y-1); 
          sweep(board, x-1, y  ); 
          sweep(board, x-1, y+1); 
        }
        sweep(board, x  , y-1); 
        sweep(board, x  , y+1); 
        if(x<(boardLength-1)) { 
          sweep(board, x+1, y-1); 
          sweep(board, x+1, y  ); 
          sweep(board, x+1, y+1); 
        }
      }
    }
  }
}

function reveal(board) {
  for(let i=0; i < board.length; i++) { 
    if(19==board[i]) { 
      board[i] = 9; 
    }
  }
}

function getHTMLforCell(num, x, y, marks, outcome) { 
  switch(num) { 
    case 0: 
      return '<span class="minisweeper-cell minisweeper-empty">&nbsp;</span>'; 
    case 1: 
      return '<span class="minisweeper-cell minisweeper-number">1</span>'; 
    case 2: 
      return '<span class="minisweeper-cell minisweeper-number">2</span>'; 
    case 3: 
      return '<span class="minisweeper-cell minisweeper-number">3</span>'; 
    case 4: 
      return '<span class="minisweeper-cell minisweeper-number">4</span>'; 
    case 5: 
      return '<span class="minisweeper-cell minisweeper-number">5</span>'; 
    case 6: 
      return '<span class="minisweeper-cell minisweeper-number">6</span>'; 
    case 7: 
      return '<span class="minisweeper-cell minisweeper-number">7</span>'; 
    case 8: 
      return '<span class="minisweeper-cell minisweeper-number">8</span>'; 
    case 9: 
      return '<span class="minisweeper-cell minisweeper-bomb">💣</span>'; 
    default: 
      switch(outcome) { 
        case "win": 
          return '<span class="minisweeper-cell minisweeper-unrevealed">🚩</span>'; 
        case "lose": 
        case "confirm": 
          return '<span class="minisweeper-cell minisweeper-unrevealed">&nbsp</span>'; 
        default: 
          return `<span onclick="attempt(${x},${y});return false" oncontextmenu="mark(${x},${y});return false" class="minisweeper-cell minisweeper-unrevealed">${-1!=marks.indexOf(`${x}-${y}`) ? "🚩" : "&nbsp;"}</span>`; 
      }
  }
}

function attempt(x,y) {
  if(minisweeperState.timer===undefined || paused) { 
    if(minisweeperState.timer === undefined) { 
      minisweeperState.timer = 0; 
    }
    paused = false; 
    minisweeperState.currentTime = Date.now(); 
    localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
  }
  let outcome; 
  if(-1!=minisweeperState.marks.indexOf(`${x}-${y}`)) { 
    minisweeperState.marks.splice(minisweeperState.marks.indexOf(`${x}-${y}`), 1); 
  }
  else if(marking) { 
    mark(x,y); 
    return false; 
  }
  else { 
    sweep(minisweeperState.board, x, y); 
    const index = y*Math.sqrt(minisweeperState.board.length) + x; 
    if(minisweeperState.board[index]==9) { 
      reveal(minisweeperState.board); 
      outcome = "lose"; 
      paused = true; 
    }
    else if(minisweeperState.board.filter(el => el > 9).length < 11) { 
      // there are only bombs left, the player has won 
      minisweeperState.stats.wins += 1; 
      outcome = "win"; 
      paused = true; 
      // get final time 
      const newTime = Date.now(); 
      minisweeperState.timer += newTime - minisweeperState.currentTime; 
      if(minisweeperState.stats.fastest===undefined) { 
        minisweeperState.stats.fastest = minisweeperState.timer; 
      }
      else if(minisweeperState.stats.fastest > minisweeperState.timer) { 
        minisweeperState.stats.fastest = minisweeperState.timer; 
      }
    }
  }
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks, outcome); 
  localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
}

function mark(x,y) { 
  const markingString = `${x}-${y}`; 
  const markedIndex = minisweeperState.marks.indexOf(markingString); 
  if(-1==markedIndex) { 
    minisweeperState.marks.push(markingString); 
  }
  else { 
    minisweeperState.marks.splice(markedIndex, 1);
  }
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks); 
  localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
}

function makeBoard() { 
  const board = [...new Array(10).fill(9),...new Array(71).fill(0)]; 
  shuffleArray(board); 
  // count spaces around bombs 
  const boardLength = Math.sqrt(board.length); // must be a square number... 
  for(let x = 0; x < boardLength; x++) { 
    for(let y = 0; y < boardLength; y++) { 
      // walk array 
      const index = y*boardLength+x; 
      if(board[index]==9) { 
        // we are at a bomb
        // let's try to add 1 to every square around this bomb 
        // we have to do 8 iterations 
        let tmpIndex; 
        if(x > 0) { 
          tmpIndex = (y-1)*boardLength+(x-1); // iteration 1
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = y*boardLength+(x-1); // iteration 2 
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = (y+1)*boardLength+(x-1); // iteration 3
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
        }
        tmpIndex = (y-1)*boardLength+x; // iteration 4
        if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
          board[tmpIndex] += 1; 
        }
        tmpIndex = (y+1)*boardLength+x; // iteration 5
        if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
          board[tmpIndex] += 1; 
        }
        if(x < (boardLength-1)) { 
          tmpIndex = (y-1)*boardLength+(x+1); // iteration 6
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = y*boardLength+(x+1); // iteration 7
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = (y+1)*boardLength+(x+1); // iteration 8
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
        }
      }
    }
  }
  // finally, increment every space by 10 
  for(let i = 0; i < board.length; i++) { 
    board[i] += 10; 
  }
  return board; 
}

const displayBoard = (element, board, marks, outcome) => { 
  element.textContent = ''; 
  const boardLength = Math.sqrt(board.length); 
  const board2D = []; 
  for(let i = 0; i < board.length; i += boardLength) { 
    board2D.push( board.slice(i,i+boardLength) ); 
  }
  const swept = board.filter(el => el < 9).length; 
  const clear = Math.floor((swept/71)*100);
  element.insertAdjacentHTML('beforeend', 
`
  <div id="minisweeper-board" style="text-align:center">
    ${board2D.map( (row, y) => { 
      return `
        <div class="minisweeper-row" style="cursor:pointer">
          ${row.map( (cell, x) => `${getHTMLforCell(cell, x, y, marks, outcome)}` ).join('')}
        </div>
      `; 
    }).join('')}
  </div>
`
  );
  if(outcome=="confirm") { 
    element.insertAdjacentHTML('beforeend', 
      `
        <div id="minisweeper-controls">
          <div>
            <div>Are you sure?</div>
          </div>
          <div>
            <div><a href="#" onclick="cancelRestartMiniSweeper();return false">Cancel</a></div>
            <div><a href="#" onclick="restartMinisweeper();return false">Confirm</a></div>
          </div>
        </div>
      `
    ); 
    try { document.getElementById('emotion').textContent = '🤔'; } catch(err) {}
  }
  else if(outcome) { 
    element.insertAdjacentHTML('beforeend', 
`
  <div id="minisweeper-controls">
    <div>
      <div>${outcome=="win" ? `😎 You won in ${parseInt(minisweeperState.timer/1000)}.${parseInt(minisweeperState.timer%1000)}s! Play again?` : "😵 You lost. Try again?"}</div>
    </div>
    <div>
      <div><a href="#" id="shareOutcomeButton">Share</a></div>
      <div><a href="#" onclick="statsMinisweeper();return false">📊</a></div>
      <div><a href="#" onclick="restartMinisweeper();return false">New game</a></div>
    </div>
  </div>
`
    ); 

    document.getElementById('shareOutcomeButton').addEventListener('click',function(e) {
      if(!farcasterSDK || !appURL) return false; 
      const shareText = outcome=="win" ? `I just won a game of Minesweeper in ${parseInt(minisweeperState.timer/1000)}.${parseInt(minisweeperState.timer%1000)} seconds${minisweeperState.stats.fastest===minisweeperState.timer ? ' (my best time so far!)' : ''} 😎 Want to try? Play below 👇` : `I just lost a game of Minesweeper 😭 Think you can do better? Play below 👇`; 
      farcasterSDK.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${appURL}`); 
      return false; 
    }); 

    try { document.getElementById('emotion').textContent = outcome==='win' ? '😎' : '😵'; } catch(err) {}
  }
  else { 
    element.insertAdjacentHTML('beforeend', 
`
  <div id="minisweeper-controls">
    <div>
      <div>Cleared: ${clear}%</div>
      <div id="minisweeper-timer">Time: ${minisweeperState.timer!==undefined ? parseInt(minisweeperState.timer/1000) : 0}s</div>
    </div>
    <div>
      <div>${marking ? '<a href="#" onclick="setMarking(false);return false">🧹 Sweep</a>' : '<a href="#" onclick="setMarking(true);return false">🚩 Flag</a>'}</div>
      <div><a href="#" onclick="statsMinisweeper();return false">📊</a></div>
      <div><a href="#" onclick="confirmRestartMinisweeper();return false">New game</a></div>
    </div>
  </div>
`
    ); 
    try { document.getElementById('emotion').textContent = '🙂'; } catch(err) {}
  }
}

const setMarking = (bool) => { 
  marking = bool; 
  goBackMinisweeper(); 
  return false; 
}

const confirmRestartMinisweeper = () => { 
  paused = true; 
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks, "confirm"); 
  return false;
}

const cancelRestartMiniSweeper = () => { 
  paused = false; 
  minisweeperState.currentTime = Date.now(); 
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks);
  return false; 
}

const restartMinisweeper = () => { 
  marking = false; 
  paused = true; 
  minisweeperState.timer = undefined; 
  minisweeperState.board = makeBoard(); 
  minisweeperState.marks = []; 
  minisweeperState.stats.games++; 
  localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
  startMinisweeper(minisweeperElement); 
  return false;
}

const statsMinisweeper = () => { 
  paused = true; 
  minisweeperElement.textContent = ''; 
  minisweeperElement.insertAdjacentHTML('beforeend', 
`
    <div><b>Stats</b></div>
    <div id="minisweeper-controls">
      <hr />
      <div>
        <div>Games played</div>
        <div>${minisweeperState.stats.games}</div>
      </div>
      <div>
        <div>Games won</div>
        <div>${minisweeperState.stats.wins}</div>
      </div>
      <div>
        <div>Success rate</div>
        <div>${(Math.round(minisweeperState.stats.wins *100) / minisweeperState.stats.games).toFixed(2)}%</div>
      </div>
      ${minisweeperState.stats.fastest ? `
      <div>
        <div>Fastest win</div>
        <div>${parseInt(minisweeperState.stats.fastest/1000)}.${parseInt(minisweeperState.stats.fastest%1000)}s</div>
      </div>
      ` : ''}
      <hr />
      <div>
        <div>
          <a href="#" onclick="shareStats();return false" class="centered">Share</a>
        </div>
        <div>
          <a href="#" onclick="goBackMinisweeper();return false" class="centered">Go Back</a>
        </div>
      </div>
    </div>
`
  ); 

  try { document.getElementById('emotion').textContent = '🤓'; } catch(err) {}
  return false;
}

const shareStats = () => { 
  if(!farcasterSDK || !appURL) return false; 
  const gamesPlayedSuffix = minisweeperState.stats.games == 1 ? '' : 's'; 
  const gamesWonSuffix = minisweeperState.stats.wins == 1 ? '' : 's'; 
  let shareText = `My Minesweeper stats: ${minisweeperState.stats.games} game${gamesPlayedSuffix}, ${minisweeperState.stats.wins} win${gamesWonSuffix}!`; 
  if(minisweeperState.stats.fastest) { 
    shareText = `${shareText} Fastest win: ${parseInt(minisweeperState.stats.fastest/1000)}.${parseInt(minisweeperState.stats.fastest%1000)}s!`; 
  }
  farcasterSDK.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${appURL}`); 
  return false; 
}

const goBackMinisweeper = () => { 
  let outcome; 
  if(minisweeperState.board.indexOf(19)==-1) { 
    outcome = "lose"; 
  }
  else if(minisweeperState.board.filter(el => el > 9).length < 11) { 
    outcome = "win";
  } 
  else { 
    paused = false; 
    minisweeperState.currentTime = Date.now(); 
  }
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks, outcome); 
  return false; 
}

var minisweeperState; 
var marking = false; 
var minisweeperElement; 
var farcasterSDK; 
var appURL; 
var paused = true; 

const startMinisweeper = (element, sdk, appUrl) => { 
  minisweeperElement = element; 
  if(sdk!==undefined) {
    farcasterSDK = sdk; 
  }
  if(appUrl !== undefined) { 
    appURL = appUrl; 
  }
  minisweeperState = localStorage.getItem("minisweeperState"); 
  if(minisweeperState) { 
    minisweeperState = JSON.parse(minisweeperState); 
    if(!("timer" in minisweeperState)) { 
      minisweeperState.timer = undefined; 
    }
    if(!("currentTime" in minisweeperState)) { 
      minisweeperState.currentTime = Date.now(); 
    }
    if(!("fastest" in minisweeperState.stats)) { 
      minisweeperState.stats.fastest = undefined; 
    }
  } else { 
    minisweeperState = { board: makeBoard(), marks: [], timer: undefined, currentTime: Date.now(), stats: { games:1, wins: 0, fastest: undefined }};
  } 
  let outcome; 
  if(minisweeperState.board.indexOf(19)==-1) { 
    outcome = "lose"; 
  }
  else if(minisweeperState.board.filter(el => el > 9).length < 11) { 
    outcome = "win";
  } 
  displayBoard(minisweeperElement, minisweeperState.board, minisweeperState.marks, outcome); 
  localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
  setInterval(() => { 
    if(minisweeperState.timer!==undefined && !paused) { 
      const newTime = Date.now(); 
      minisweeperState.timer += newTime - minisweeperState.currentTime; 
      minisweeperState.currentTime = newTime; 
      localStorage.setItem("minisweeperState", JSON.stringify(minisweeperState)); 
      try { 
        document.getElementById('minisweeper-timer').textContent = `Time: ${parseInt(minisweeperState.timer/1000)}s`;
      } catch(err) { }
    }
  },100); 
}