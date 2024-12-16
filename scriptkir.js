document.getElementById('pagmain').onclick = function() {
    window.location.href = 'index.html';
};

document.getElementById('calculateButton').addEventListener('click', function() {
    const res1 = parseFloat(document.getElementById('res1').value);
    const res2 = parseFloat(document.getElementById('res2').value);
    const res3 = parseFloat(document.getElementById('res3').value);
    const res4 = parseFloat(document.getElementById('res4').value);
    const tens = parseFloat(document.getElementById('ten').value);

    const result1 = tens / (res1 + ((res3 + res4) * res2) / (res2 + res3 + res4));
    const result2 = result1 * ((res3 + res4) / (res2 + res3 + res4));
    const result3 = result1 * (res2 / (res2 + res3 + res4));

    const resultDiv1 = document.getElementById('result1');
    resultDiv1.textContent = `Risultato: ${result1.toFixed(2)}`;
    const resultDiv2 = document.getElementById('result2');
    resultDiv2.textContent = `Risultato: ${result2.toFixed(2)}`;
    const resultDiv3 = document.getElementById('result3');
    resultDiv3.textContent = `Risultato: ${result3.toFixed(2)}`;
});
