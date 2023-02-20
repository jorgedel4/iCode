particlesJS.load('particles-js', 'particles.json', function () {
    console.log('callback - particles.js config loaded');
});

function valida(a, b, c) {
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        return 'Rellena todos los campos';
    }
    if (a < 0 || b < 0 || c < 0) {
        return 'Ingresa valores positivos';
    }
    if (a <= 0 || b <= 0 || c <= 0) {
        return 'Eso no es un triangulo';
    }
    if (a + b < c || b + c < a || c + a < b) {
        return 'Eso no es un triangulo porque la suma de las longitudes de cualesquiera dos lados debe ser mayor o igual que la longitud del lado restante';
    }
    if (a == b && b == c) {
        return 'Triángulo equilátero';
    }
    if (a == b || b == c || c == a) {
        return 'Triángulo isósceles';
    } else {
        return 'Triangulo escaleno';
    }
}

const validateBtn = document.querySelector('#validate');

validateBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const a = parseFloat(document.querySelector('#a').value);
    const b = parseFloat(document.querySelector('#b').value);
    const c = parseFloat(document.querySelector('#c').value);

    document.querySelector('#result').textContent = valida(a, b, c);
    console.log(123, a);
});
