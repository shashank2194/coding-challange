let betsSampleArray = [
    'Bet:W:1:3',
    'Bet:W:2:4',
    'Bet:W:3:5',
    'Bet:W:4:5',
    'Bet:W:1:16',
    'Bet:W:2:8',
    'Bet:W:3:22',
    'Bet:W:4:57',
    'Bet:W:1:42',
    'Bet:W:2:98',
    'Bet:W:3:63',
    'Bet:W:4:15',
    'Bet:P:1:31',
    'Bet:P:2:89',
    'Bet:P:3:28',
    'Bet:P:4:72',
    'Bet:P:1:40',
    'Bet:P:2:16',
    'Bet:P:3:82',
    'Bet:P:4:52',
    'Bet:P:1:18',
    'Bet:P:2:74',
    'Bet:P:3:39',
    'Bet:P:4:105',
    'Bet:E:1,2:13',
    'Bet:E:2,3:98',
    'Bet:E:1,3:82',
    'Bet:E:3,2:27',
    'Bet:E:1,2:5',
    'Bet:E:2,3:61',
    'Bet:E:1,3:28',
    'Bet:E:3,2:25',
    'Bet:E:1,2:81',
    'Bet:E:2,3:47',
    'Bet:E:1,3:93',
    'Bet:E:3,2:51',
    'Result:2:3:1'
];
const toteVars = {
    arrayInputBets: [],
    strResults: '',
    commissionVal: {
        win: 0.15,
        place: 0.12,
        exacta: 0.18
    },
    strFinalResult: '',
    calculateRanking: function () {
        let valFirst = this.strResults.split(':')[1];
        let valSecond = this.strResults.split(':')[2];
        let valThird = this.strResults.split(':')[3];
        return ({
            valFirst,
            valSecond,
            valThird
        });
    }
};
function splitPool(arrayInput) {
    let outResult = {
        arrayWin: [],
        arrayPlace: [],
        arrayExacta: []
    };
    for (let i = 0; i < arrayInput.length; i++) {
        if (arrayInput[i].indexOf(':w') > -1) {
            outResult.arrayWin.push(arrayInput[i]);
        }
        else if (arrayInput[i].indexOf(':p') > -1) {
            outResult.arrayPlace.push(arrayInput[i]);
        }
        else if (arrayInput[i].indexOf(':e') > -1) {
            outResult.arrayExacta.push(arrayInput[i]);
        }
    }
    return outResult;
}
const ProduceCalc = {
    WinProduce: function (winArrayIn, commissionIn) {
        let localGrpAmount = 0;
        let localWinStakeSum = 0;
        let localResult = 0;
        let localRanking = toteVars.calculateRanking();
        for (let i = 0; i < winArrayIn.length; i++) {
            let tempObj = winArrayIn[i].split(':');
            let localWinVal = tempObj[2];
            let localWinStake = parseFloat(tempObj[3]);
            localGrpAmount += localWinStake;
            if (localWinVal == localRanking.valFirst) {
                localWinStakeSum += localWinStake;
            }
        }
        localResult = (localWinStakeSum !== 0) ? (localGrpAmount * (1 - commissionIn)) / (localWinStakeSum) : 0;
        return localResult.toFixed(2);
    },
    PlaceProduce: function (placeArrayIn, commissionIn) {
        let stakeOne = 0, stakeTwo = 0, stakeThree = 0;
        let firstItem = 0, secondItem = 0, thirdItem = 0;
        let localGrpAmount = 0;
        let ranksLocal = toteVars.calculateRanking();
        for (let i = 0; i < placeArrayIn.length; i++) {
            let currObj = placeArrayIn[i].split(':');
            let placeSelection = currObj[2];
            let placeLocal = parseFloat(currObj[3]);
            localGrpAmount += placeLocal;
            switch (placeSelection) {
                case (ranksLocal.valFirst):
                    {
                        stakeOne += placeLocal;
                    }
                    break;
                case (ranksLocal.valSecond):
                    {
                        stakeTwo += placeLocal;
                    }
                    break;
                case (ranksLocal.valThird):
                    {
                        stakeThree += placeLocal;
                    }
                    break;
                default:
                    {
                    }
                    break;
            }
        }
        localGrpAmount = localGrpAmount / 3;
        firstItem = stakeOne !== 0 ? (localGrpAmount * (1 - commissionIn)) / (stakeOne) : 0;
        secondItem = stakeTwo !== 0 ? (localGrpAmount * (1 - commissionIn)) / (stakeTwo) : 0;
        thirdItem = stakeThree !== 0 ? (localGrpAmount * (1 - commissionIn)) / (stakeThree) : 0;
        firstItem = parseInt(firstItem.toFixed(2));
        secondItem = parseInt(secondItem.toFixed(2));
        thirdItem = parseInt(thirdItem.toFixed(2));
        return ({ firstItem, secondItem, thirdItem });
    },
    ExactaProduce: function (exactaArrayIn, commissionIn) {
        let localGrpAmount = 0;
        let sumExactaStake = 0;
        let result = 0;
        let localRanks = toteVars.calculateRanking();
        for (let i = 0; i < exactaArrayIn.length; i++) {
            let tempObj = exactaArrayIn[i].split(':');
            let exactaPick = tempObj[2];
            let exactaStakeVal = parseFloat(tempObj[3]);
            let exactaRankVal = localRanks.valFirst + ',' + localRanks.valSecond;
            localGrpAmount += exactaStakeVal;
            if (exactaPick == exactaRankVal) {
                sumExactaStake += exactaStakeVal;
            }
        }
        result = sumExactaStake !== 0 ? (localGrpAmount * (1 - commissionIn)) / (sumExactaStake) : 0;
        return result.toFixed(2);
    }
};
function calcDividends(winIn, placeIn, exactaIn) {
    let winString = '';
    let placeString = '';
    let exactaString = '';
    let ranksLocal = toteVars.calculateRanking();
    winString = `Win:${ranksLocal.valFirst}:$${winIn}\n`;
    placeString = `Place:${ranksLocal.valFirst}:$${placeIn['firstItem']}\n`;
    placeString += `Place:${ranksLocal.valSecond}:$${placeIn['secondItem']}\n`;
    placeString += `Place:${ranksLocal.valThird}:$${placeIn['thirdItem']}\n`;
    exactaString = `Exacta:${ranksLocal.valFirst},${ranksLocal.valSecond}:$${exactaIn}\n`;
    return (winString + placeString + exactaString);
}
function MainFunction() {
    var SplittedData = splitPool(toteVars.arrayInputBets);
    var winProduced = ProduceCalc.WinProduce(SplittedData.arrayWin, toteVars.commissionVal.win);
    var placeProduced = ProduceCalc.PlaceProduce(SplittedData.arrayPlace, toteVars.commissionVal.place);
    var exactaProduced = ProduceCalc.ExactaProduce(SplittedData.arrayExacta, toteVars.commissionVal.exacta);
    let dividendsResult = calcDividends(winProduced, placeProduced, exactaProduced);
    toteVars.strFinalResult = dividendsResult;
    process.stdout.write('\n\nFinal Result:\n\n');
    process.stdout.write(dividendsResult);
    process.exit(0);
}
var readlineSync = require('readline-sync');
var answer = readlineSync.question('How you want to provide input (m for manual/ a for auto)? :');
if (answer == 'm') {
    console.log('Provide inputs below with newline : \n\n');
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (cmd) {
        cmd.slice(0, cmd.length - 1);
        var line_lower = cmd.toLowerCase();
        if (line_lower.search("result:") > -1) {
            toteVars.strResults = line_lower;
            MainFunction();
        }
        else if (line_lower.search("bet:") > -1) {
            toteVars.arrayInputBets.push(line_lower);
        }
        else {
            process.exit(0);
        }
    });
}
else {
    console.log("Input : \n");
    betsSampleArray.forEach(element => {
        console.log(element);
        var line_lower = element.toLowerCase();
        if (line_lower.search("result:") > -1) {
            toteVars.strResults = line_lower;
        }
        else if (line_lower.search("bet:") > -1) {
            toteVars.arrayInputBets.push(line_lower);
        }
        else {
            process.exit(0);
        }
    });
    MainFunction();
}
//# sourceMappingURL=index.js.map