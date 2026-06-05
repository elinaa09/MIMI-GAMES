import pygame
import os
import sys
from pygame.locals import *
import random

pygame.init()

width, height = 800, 600
screen_size = (width, height)
screen = pygame.display.set_mode(screen_size)
pygame.display.set_caption("Car Game")

#background
bg_image = pygame.image.load('drive/carbg.png').convert()
bg_image = pygame.transform.scale(bg_image, (width, height))
bg_y1 = 0
bg_y2 = -height


#game settings
gameover=False
speed=3
score=0

# colors
white = (255, 255, 255)
black = (0, 0, 0)
gray = (100, 100, 100)


#road and lanes
road = (150, 0, 500, height)

left_lane = 250
center_lane = 400
right_lane = 550
lanes = [left_lane, center_lane, right_lane]

marker_width = 10
marker_height = 50


#for animating moving objects
lane_marker_move_y=0

# --- SPRITESHEET HELPER ---
def get_car_from_sheet(sheet, col, row):
    sheet_w, sheet_h = sheet.get_size()
    car_w = sheet_w // 4
    car_h = sheet_h // 4
    x = col * car_w
    y = row * car_h
    return sheet.subsurface(pygame.Rect(x, y, car_w, car_h))

#load other cars from your spritesheet
spritesheet = pygame.image.load('drive/other_car.png').convert_alpha()
vehicle_images = [
    get_car_from_sheet(spritesheet, 1, 0), 
    get_car_from_sheet(spritesheet, 1, 1), 
    get_car_from_sheet(spritesheet, 2, 3)  
]

#sprite group for vehicles
vehicle_group=pygame.sprite.Group()

#load the car crash image
crash = pygame.Surface((60, 60), pygame.SRCALPHA)
pygame.draw.circle(crash, (255, 0, 0), (30, 30), 30)
pygame.draw.circle
crash_rect= crash.get_rect()

class vehicle(pygame.sprite.Sprite):
    def __init__(self, image, x, y):
        pygame.sprite.Sprite.__init__(self)
        image_scale = 85 / image.get_rect().width
        new_width = int(image.get_rect().width * image_scale)
        new_height = int(image.get_rect().height * image_scale)
        self.image = pygame.transform.scale(image, (new_width, new_height))
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

class player(vehicle):
    def __init__(self, x, y):
        image=pygame.image.load("drive/car.png").convert_alpha()
        image= pygame.transform.scale(image,(80,120))
        super().__init__(image,x,y)

#players starting position
player_x= center_lane
player_y= 500

#create players car
player_group=pygame.sprite.Group()
player=player(player_x, player_y)
player_group.add(player)

#gameloop
clock = pygame.time.Clock()
fps = 100
running = True

while running:
    screen.blit(bg_image, (0, 0))
    clock.tick(fps)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        #MOVE the car left and right
        if event.type==pygame.KEYDOWN:
            if event.key==pygame.K_LEFT and player.rect.center[0] > left_lane:
                player.rect.x-=150
            elif event.key==pygame.K_RIGHT and player.rect.center[0] < right_lane:
                player.rect.x+=150
                
            if gameover:
                if event.key==pygame.K_y:
                    gameover=False
                    vehicle_group.empty()
                    player.rect.center=(center_lane, 500)
                    score=0
                    speed=3
                elif event.key==pygame.K_n:
                    running=False

    if not gameover:
        lane_marker_move_y += speed * 2

        if lane_marker_move_y >= marker_height * 2:
            lane_marker_move_y = 0

    for y in range(-marker_height * 2, height, marker_height * 2):
        pygame.draw.rect(
            screen,
            white,
            (left_lane + 70, y + lane_marker_move_y,
             marker_width, marker_height)
        )

        pygame.draw.rect(
            screen,
            white,
            (center_lane + 70, y + lane_marker_move_y,
             marker_width, marker_height)
        )


    #draw car
    player_group.draw(screen)
    vehicle_group.draw(screen)

    if not gameover:
        #make car move
        for v in vehicle_group:
            v.rect.y+=speed
            #remove cars that have moved off the screen
            if v.rect.top>=height:
                v.kill()
                score+=1
                #speed up every 8 points
                if score>0 and score%8==0:
                    speed+=1

        #add upto two vehicles
        if len(vehicle_group)<2:
            add_vehicle=True
            for v in vehicle_group:
                if v.rect.top < v.rect.height*2:
                    add_vehicle=False

            if add_vehicle:

                #select a random lane 
                lane=random.choice(lanes)
                #select a random car image
                image=random.choice(vehicle_images)
                new_vehicle=vehicle(image, lane, -100)
                vehicle_group.add(new_vehicle)


    #check if theres a side swipe collision after changing lanes
    if pygame.sprite.spritecollide(player, vehicle_group, False):
        gameover= True
        crash_rect.center = [player.rect.center[0], player.rect.top]

    #display score
    font = pygame.font.Font(None, 36)
    text=font.render("Score: {}".format(score), True, white)
    text_rect=text.get_rect()
    text_rect.center=(90, 50)
    screen.blit(text, text_rect)

    #display game over
    if gameover:
        screen.blit(crash, crash_rect)

        
        font = pygame.font.Font(pygame.font.get_default_font(), 36)
        text = font.render('GAMEOVER. Play again? (Enter Y or N)',True,white)
        text_rect = text.get_rect()
        text_rect.center =(width/2,250)
        screen.blit(text, text_rect)

    pygame.display.update()

pygame.quit()