
document.getElementById('equationSelect').addEventListener('change', function() {
    const equation = this.value;
    const input3Container = document.getElementById('input3Container');
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');


    if (equation === 'serie2'){
      input3Container.style.display = 'none';
      input1.placeholder = 'Valore resistenza 1';
      input1.min = '0';
      input2.placeholder = 'Valore resistenza 2';
      input2.min = '0';
    } else if (equation === 'serie3'){
      input3Container.style.display = 'block';
      input1.placeholder = 'Valore resistenza 1';
      input1.min = '0';
      input2.placeholder = 'Valore resistenza 2';
      input2.min = '0';
      input3.placeholder = 'Valore resistenza 3';
      input3.min = '0';
    } else if (equation === 'parallelo2'){
      input3Container.style.display = 'none';
      input1.placeholder = 'Valore resistenza 1';
      input1.min = '0';
      input2.placeholder = 'Valore resistenza 2';
      input2.min = '0';
    } else if (equation === 'parallelo3'){
      input3Container.style.display = 'block';
      input1.placeholder = 'Valore resistenza 1';
      input1.min = '0';
      input2.placeholder = 'Valore resistenza 2';
      input2.min = '0';
      input3.placeholder = 'Valore resistenza 3';
      input3.min = '0';
    } else {
      input3Container.style.display = 'block';
      input1.placeholder = 'Inserire primo valore';
      input2.placeholder = 'Inserire secondo valore';
    }
  });


  document.getElementById('calculateButton').addEventListener('click', function() {
    const equation = document.getElementById('equationSelect').value;
    const input1 = parseFloat(document.getElementById('input1').value);
    const input2 = parseFloat(document.getElementById('input2').value);
    const input3 = parseFloat(document.getElementById('input3').value);
    let result;


    if (equation === 'tensione') {
      result = input1 * input2;
    } else if (equation === 'resistenza') {
      result = Math.abs(input1 / input2).toFixed(2);
    } else if (equation === 'intensita') {
      result = Math.abs(input1 / input2).toFixed(2);
    } else if (equation === 'serie2') {
      result = input1 + input2;
    } else if (equation === 'serie3') {
      result = input1 + input2 + input3;
    } else if (equation === 'parallelo2') {
      result = (input1 * input2) / (input1 + input2);
    } else if (equation === 'parallelo3') {
      result = (input1 * input2 * input3) / (input1 + input2 + input3);
    } else {
      result = 'Seleziona il calcolo da fare.';
    }


    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Risultato: ${result}`;
});
document.getElementById('pagmain').onclick = function() {
    window.location.href = 'index.html';
};