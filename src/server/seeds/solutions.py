#CQ0000000000000000001
def double_number(number):
    return number * 2

#CQ0000000000000000002
"3"

#CQ0000000000000000003
def sum_numbers(a, b):
    return a + b

#CQ0000000000000000004
"1"

#CQ0000000000000000005
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

#CQ0000000000000000006
"Hello, Alice"

#CQ0000000000000000007
def fibonacci(n):
    sequence = [0, 1]  # Inicializar la secuencia con los primeros dos términos

    if n <= 2:
        return sequence[:n]  # Devolver la secuencia parcial si n es 1 o 2

    while len(sequence) < n:
        next_term = sequence[-1] + sequence[-2]  # Calcular el siguiente término
        sequence.append(next_term)  # Agregar el siguiente término a la secuencia

    return sequence

#CQ0000000000000000008
"15"

#CQ0000000000000000009
def calculate_average(numbers):
    if not numbers:
        return None  # Devolver None si la lista está vacía

    total = sum(numbers)  # Calcular la suma de los números en la lista
    average = total / len(numbers)  # Calcular el promedio

    return average

#CQ0000000000000000010
"3"

#CQ0000000000000000011
def calculate_square(number):
    square = number ** 2
    return square

#CQ0000000000000000012
"16"

#CQ0000000000000000013
def calculate_area(length, width):
    area = length * width
    return area

#CQ0000000000000000014
"4"

#CQ0000000000000000015
def is_palindrome(word):
    # Eliminar espacios y convertir a minúsculas
    word = word.replace(" ", "").lower()
    
    # Verificar si la cadena es igual a su reverso
    if word == word[::-1]:
        return True
    else:
        return False
    
#CQ0000000000000000016
"1"

#CQ0000000000000000017
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

#CQ0000000000000000018
"[5, 4, 3, 2, 1]"

#CQ0000000000000000019
def count_vowels(string):
    vowels = 'aeiouAEIOU'
    count = 0

    for char in string:
        if char in vowels:
            count += 1

    return count

#CQ0000000000000000020
"4"

#CQ0000000000000000021
def is_prime(number):
    if number <= 1:
        return False

    for i in range(2, int(number**0.5) + 1):
        if number % i == 0:
            return False

    return True

#CQ0000000000000000022
"0", "1", "2"

#CQ0000000000000000023
def sum_list(numbers):
    sum = 0
    for number in numbers:
        sum += number
    return sum

#CQ0000000000000000024
"4"

#CQ0000000000000000025
def reverse_string(string):
    reversed_string = ''
    for char in string:
        reversed_string = char + reversed_string
    return reversed_string

#CQ0000000000000000026
"9"

#CQ0000000000000000027
def fibonacci(n):
    sequence = [0, 1]  # Inicializamos la secuencia con los primeros dos números: 0 y 1
    
    if n <= 1:
        return sequence[:n + 1]  # Devolvemos la secuencia hasta el n-ésimo término
    
    while len(sequence) <= n:
        next_number = sequence[-1] + sequence[-2]  # Calculamos el siguiente número sumando los dos últimos
        sequence.append(next_number)  # Agregamos el siguiente número a la secuencia
    
    return sequence

#CQ0000000000000000028
"Hello, world!"

#CQ0000000000000000029
def find_maximum(numbers):
    if not numbers:  # Verificar si la lista está vacía
        return None
    
    maximum = numbers[0]  # Inicializar el máximo con el primer número de la lista
    
    for number in numbers:
        if number > maximum:
            maximum = number  # Actualizar el máximo si encontramos un número mayor
    
    return maximum

#CQ0000000000000000030
"2"

#CQ0000000000000000031
def is_anagram(str1, str2):
    # Convertir las cadenas a minúsculas y eliminar los espacios en blanco
    str1 = str1.lower().replace(" ", "")
    str2 = str2.lower().replace(" ", "")
    
    # Verificar si las cadenas tienen la misma longitud
    if len(str1) != len(str2):
        return False
    
    # Crear un diccionario para contar la frecuencia de cada caracter en la primera cadena
    char_count = {}
    for char in str1:
        if char in char_count:
            char_count[char] += 1
        else:
            char_count[char] = 1
    
    # Verificar si los caracteres de la segunda cadena están en el diccionario
    # y si tienen la misma frecuencia que en la primera cadena
    for char in str2:
        if char in char_count and char_count[char] > 0:
            char_count[char] -= 1
        else:
            return False
    
    return True

#CQ0000000000000000032
"x is greater than 5"

#CQ0000000000000000033
def calculate_average(numbers):
    if len(numbers) == 0:
        return 0

    total = sum(numbers)
    average = total / len(numbers)
    return average

#CQ0000000000000000034
"4"

#CQ0000000000000000035
def is_even(number):
    if number % 2 == 0:
        return True
    else:
        return False

#CQ0000000000000000036
"4"

#CQ0000000000000000037
def find_second_largest(numbers):
    largest = float('-inf')
    second_largest = float('-inf')
    
    for num in numbers:
        if num > largest:
            second_largest = largest
            largest = num
        elif num > second_largest and num != largest:
            second_largest = num
    
    return second_largest

#CQ0000000000000000038
"4"

#CQ0000000000000000039
def remove_duplicates(lst):
    return list(set(lst))

#CQ0000000000000000040
"8"

#CQ0000000000000000041
def count_occurrences(lst, item):
    count = 0
    for element in lst:
        if element == item:
            count += 1
    return count

#CQ0000000000000000042
"2"

#CQ0000000000000000043
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

#CQ0000000000000000044
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

#CQ0000000000000000045
"int"

#CQ0000000000000000046
def is_palindrome(text):
    # Eliminar los espacios en blanco y convertir a minúsculas
    text = text.replace(" ", "").lower()
    # Verificar si la cadena es igual a su reverso
    return text == text[::-1]

#CQ0000000000000000047
"2"

#CQ0000000000000000048
def sum_of_digits(number):
    # Convertir el número a cadena de texto
    number_str = str(number)
    # Inicializar la suma
    digit_sum = 0
    # Iterar sobre cada dígito en la cadena
    for digit in number_str:
        # Convertir el dígito de nuevo a número y sumarlo
        digit_sum += int(digit)
    # Retornar la suma de los dígitos
    return digit_sum

#CQ0000000000000000049
"[1, 2, 3, 4, 5, 6]"

#CQ0000000000000000050
def are_anagrams(str1, str2):
    # Convertir las cadenas a listas de caracteres
    str1_list = list(str1)
    str2_list = list(str2)
    
    # Ordenar las listas de caracteres
    str1_list.sort()
    str2_list.sort()
    
    # Verificar si las listas ordenadas son iguales
    if str1_list == str2_list:
        return True
    else:
        return False

#CQ0000000000000000051
"oh"

#CQ0000000000000000052
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

#CQ0000000000000000053
"4"

#CQ0000000000000000054
import math

def calcular_area_circulo(radio):
    area = math.pi * radio**2
    return area

#CQ0000000000000000055
"3"

#CQ0000000000000000056
def contar_vocales(cadena):
    vocales = 'aeiouAEIOU'
    count = 0
    for char in cadena:
        if char in vocales:
            count += 1
    return count

#CQ0000000000000000057
"14"

#CQ0000000000000000058
def es_primo(numero):
    if numero < 2:
        return False
    for i in range(2, int(numero**0.5) + 1):
        if numero % i == 0:
            return False
    return True

def generar_primos(rango_inicio, rango_fin):
    primos = []
    for numero in range(rango_inicio, rango_fin + 1):
        if es_primo(numero):
            primos.append(numero)
    return primos

#CQ0000000000000000059
"1"