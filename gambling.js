const luckyBtn = document.getElementById('luckyBtn');
    
luckyBtn.addEventListener('click', () => {
    let gamble = Math.random();
    if (gamble < 0.25) {
        count += 100;
        counterEl.textContent = count;
        messageEl.style.display = 'block';
        messageEl.textContent = 'You won 100 points!';
    } else if (gamble < 0.5) {
        count -= 5000;
        if (count < 0) count = 0;
        counterEl.textContent = count;
        messageEl.style.display = 'block';
        messageEl.textContent = 'You lost 5000 points!';
    } else if (gamble < 0.75) {
        count += 500;
        counterEl.textContent = count;
        messageEl.style.display = 'block';
        messageEl.textContent = 'Jackpot! You won 500 points!';
    } else if (gamble += 1000000)
    {
        
        count += 1000000;
        counterEl.textContent = count;
        messageEl.style.display = 'block';
        messageEl.textContent = 'JACKPOT: You won 1,000,000 points!';
    } else {
        count = 0;
        counterEl.textContent = count;
        messageEl.style.display = 'block';
        messageEl.textContent = 'Bad luck! You lost all points!';
    }
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 2000);
});