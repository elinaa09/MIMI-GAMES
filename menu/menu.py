import time
import webbrowser
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
def menu():
    menu_options = ('h', 'x', 's', '1', '2', '3', '4', '5', '0')

    while True:
        print()
        print('**MENU**')
        print('h = help')
        print('x = exit')
        print('s = start')
        print('[1] Pacmi')
        print('[2] Mimi drive')
        print('[3] Mimi the runner')
        print('[4] option 4')
        print('[5] option 5')
        print('[0] Exit the program.')

        user_input = input("Enter your option: ")

        if user_input in menu_options:
            break
        else:
            print('Invalid option')

    if user_input == '1':
        print("play pacmi with Mimi.")
        webbrowser.open('file://' + os.path.abspath('./pacmi.html'))
    elif user_input == '2':
        print("Drive with Mimi")
    elif user_input == '3':
        print("Mimi the Runner")
        webbrowser.open('file://' + os.path.join(BASE_DIR,'..', 'runner','run.html'))

    elif user_input == '4':
        print("option 4 has been called.")
    elif user_input == '5':
        print("option 5 has been called.")
    elif user_input == 's':
        print('Processing...')
        time.sleep(5)
        print()
        print('**RESULT**')
        print('Result here')
    elif user_input == 'h':
        print()
        print('**HELP**')
        print('oh nooo, Mimi doesnt know how to help ):')
        print('yes, Mimi only put the option to look good')
    elif user_input == 'x' or user_input == '0':
        print()
        print('exit? mimi will miss you')
        exit()

menu()  
print("done.")