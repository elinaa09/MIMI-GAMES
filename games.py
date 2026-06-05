import pygame
pygame.init()

# Setup a quick window
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("It Works!")


running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
