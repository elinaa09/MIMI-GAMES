import os
import random
import math
import pygame
from os import listdir
from os.path import isfile, join

pygame.init()

pygame.display.set_caption("Platformer")

WIDTH, HEIGHT = 1000, 800
FPS = 60
PLAYER_VEL = 5

window = pygame.display.set_mode((WIDTH, HEIGHT))


def flip(sprites):
    return [pygame.transform.flip(sprite, True, False) for sprite in sprites]

#cut sprite
def load_sprite_sheet_frames(path,frame_w,frame_h):
    sheet=pygame.image.load(path).conver_alpha()
    frames=[]
    cols= sheet.get_width()//frame_w
    rows=pygame.get_height()//frame_h
    for row in range(rows):
        for col in range(cols):
            surface=pygame.Surface((frame_w, frame_h),pygame.SRCALPHA,32)
            rect=pygame.Rect(col*frame_h,frame_w,frame_h)
            surface.bilt(sheet,(0,0), rect)
            frames.append(pygame.transform.scale2x(surface))
            return frames

def get_block(size):
    path = join("assets", "terrain", "Terrain.png")

    if not os.path.isfile(path):
        path=join("assets", "blocks.png")
    image = pygame.image.load(path).convert_alpha()
    surface = pygame.Surface((size, size), pygame.SRCALPHA, 32)
    rect = pygame.Rect(96, 0, size, size)
    surface.blit(image, (0, 0), rect)
    return pygame.transform.scale2x(surface)

    def get_background(name):
       image=pygame.image.load(os.path.join("assests", "backgrounds",name))
       rect= image.get_rect()
       width= rect.width
       height= rect.height
       tiles=[]

    for i in range (WIDTH // width +1):
        for j in range (HEIGHT// height +1):
         pos= (i* width, j*height)
         tiles.append(pos)
    return tiles, image



class Player(pygame.sprite.Sprite):
        COLOR = (255, 0, 0)
        GRAVITY = 1
        SPRITES = load_sprite_sheet_frames(os.path.join("main characters", "Mimi.png"), 32,32)
        ANIMATION_DELAY = 4

        FRAME_W= 440  #dunno how works, change acc to sheet
        FRAMEH_H=580 

def __init__(self, x, y, width, height):
        super().__init__()
        self.rect = pygame.Rect(x, y, width, height)
        self.x_vel = 0
        self.y_vel = 0
        self.mask = None
        self.direction = "left"
        self.animation_count = 0
        self.fall_count = 0
        self.jump_count = 0
        self.hit = False
        self.hit_count = 0
        self.load_sprites()
        self.sprite=self.Sprites["idle_right"][0]

def load_sprites(self):
        path= join("assets","main characters","Mimi","Mimi.png")
sheet= pygame.image.load(os.path).convert_alpha()

def get_frame(col,row):
    surf=pygame.surface.Surface((self.FRAME_H), pygame.SRCALPHA,32)
surf.bilt(sheet,(0,0),pygame.Rect(col*self.FRAME_W, row* self.FRAME_H,self.FRAME_H));
returnpygame.transform.scale2x(surf)


run_frames =[get_frame(0,0), get_frame(1,0),getframe(0,1)]
jump_frame =[get_frame(1,1)]

self.SPRITES ={}

for state in ("run","idle","fall", "hit" "double_jump"):
    self.SPRITES[state+ "_right"]=run_frames
    self.SPRITES[state+ "_left"]= flip(run_frames)
    for state in ("jump","double_jump"):
        self.SPRITES[state+ "_right"]=jump_frame
        self.SPRITES[state+ "_LEFT"]= flip(jump_frames)


    def jump(self):                     #negative y goes up//
        self.y_vel = -self.GRAVITY* 8
        self.animation_count = 0
        self.jump_count += 1
        if self.jump_count == 1:
            self.fall_count = 0

    def move(self, dx, dy):
        self.rect.x += dx
        self.rect.y += dy

    def make_hit(self):
        self.hit = True

    def move_left(self, vel):
        self.x_vel = -vel
        if self.direction != "left":
            self.direction = "left"
            self.animation_count = 0

    def move_right(self, vel):
        self.x_vel = vel
        if self.direction != "right":
            self.direction = "right"
            self.animation_count = 0

    def loop(self, fps):  #puts gracity
        self.y_vel += min(1, (self.fall_count / fps) * self.GRAVITY)
        self.move(self.x_vel, self.y_vel)

        if self.hit:
            self.hit_count += 1
        if self.hit_count > fps * 2:
            self.hit = False
            self.hit_count = 0

        self.fall_count += 1
        self.update_sprite()


    def landed(self):
        self.fall_count = 0
        self.y_vel = 0
        self.jump_count = 0

    def hit_head(self):    #when hit block from below//
        self.count = 0
        self.y_vel *= -1

    def update_sprite(self):
        sprite_sheet = "idle"

        if self.hit:
            sprite_sheet = "hit"
        elif self.y_vel < 0:
            if self.jump_count == 1:
                sprite_sheet = "jump"
            elif self.jump_count == 2:
                sprite_sheet = "double_jump"
        elif self.y_vel > self.GRAVITY * 2:
            sprite_sheet = "fall"
        elif self.x_vel != 0:
            sprite_sheet ="run"

        sprite_sheet_name = sprite_sheet + "_" + self.direction
        sprites = self.SPRITES[sprite_sheet_name]
        sprite_index = (self.animation_count// self.ANIMATION_DELAY) % len(sprites)
        self.sprite = sprites[sprite_index]
        self.animation_count += 1
        self.update()

    def update(self):
        self.rect = self.sprite.get_rect(topleft=(self.rect.x, self.rect.y))
        self.mask = pygame.mask.from_surface(self.sprite)

    def draw(self, win, offset_x):
        win.blit(self.sprite, (self.rect.x - offset_x, self.rect.y))


class Object(pygame.sprite.Sprite):
    def __init__(self, x, y, width, height, name=None):
        super().__init__()
        self.rect = pygame.Rect(x, y, width, height)
        self.image = pygame.Surface((width, height), pygame.SRCALPHA)
        self.width = width
        self.height = height
        self.name = name

    def draw(self, win, offset_x):
        win.blit(self.image, (self.rect.x - offset_x, self.rect.y))


class Block(Object):
    def __init__(self, x, y, size):
        super().__init__(x, y, size, size)
        block = get_block(size)
        self.image.blit(block, (0, 0))
        self.mask = pygame.mask.from_surface(self.image)


class Fire(Object):
    ANIMATION_DELAY = 3

    def __init__(self, x, y, width, height):
        super().__init__(x, y, width, height, "fire")
        self.fire = load_sprite_sheets("Traps", "Fire", width, height)
        self.image = self.fire["off"][0]
        self.mask = pygame.mask.from_surface(self.image)
        self.animation_count = 0
        self.animation_name = "off"

    def on(self):
        self.animation_name ="on"

    def off(self):
        self.animation_name = "off"


    def loop(self):
        sprites = self.fire[self.animation_name]
        sprite_index = (self.animation_count //
                        self.ANIMATION_DELAY) % len(sprites)
        self.image = sprites[sprite_index]
        self.animation_count += 1

        self.rect = self.image.get_rect(topleft=(self.rect.x, self.rect.y))
        self.mask = pygame.mask.from_surface(self.image)

        if self.animation_count // self.ANIMATION_DELAY > len(sprites):
            self.animation_count = 0


def get_background(name):
    image = pygame.image.load(os.path.join("assets", "backgrounds", name))
    _, _, width, height = image.get_rect()
    tiles = []


    for i in range(WIDTH // width + 1):
        for j in range(HEIGHT // height + 1):
            pos = (i * width, j * height)
            tiles.append(pos)

    return tiles, images


def draw(window, background, bg_image, player, objects, offset_x):
    for tile in background:
        window.blit(bg_image, tile)

    for obj in objects:
        obj.draw(window, offset_x)

    player.draw(window, offset_x)

    pygame.display.update()


def handle_vertical_collision(player, objects, dy):
    collided_objects = []
    for obj in objects:
        if pygame.sprite.collide_mask(player, obj):
            if dy > 0:
                player.rect.bottom = obj.rect.top
                player.landed()
            elif dy < 0:
                player.rect.top = obj.rect.bottom
                player.hit_head()

            collided_objects.append(obj)

    return collided_objects


def collide(player, objects, dx):
    player.move(dx, 0)
    player.update()
    collided_object = None
    for obj in objects:
        if pygame.sprite.collide_mask(player, obj):
            collided_object = obj
            break


    player.move(-dx, 0)
    player.update()
    return collided_object


def handle_move(player, objects):
    keys = pygame.key.get_pressed()

    player.x_vel = 0
    collide_left = collide(player, objects, -PLAYER_VEL * 2)
    collide_right = collide(player, objects, PLAYER_VEL * 2)

    if keys[pygame.K_LEFT] and not collide_left:
        player.move_left(PLAYER_VEL)
    if keys[pygame.K_RIGHT] and not collide_right:
        player.move_right(PLAYER_VEL)

    vertical_collide = handle_vertical_collision(player, objects, player.y_vel)
    to_check = [collide_left, collide_right, *vertical_collide]

    for obj in to_check:
        if obj and obj.name == "fire":
            player.make_hit()

#main loop

def main(window):
    clock = pygame.time.Clock()
    background, bg_image = get_background("blue.jpg")

    block_size = 96

    player = Player(100, 100, 50, 50)
    fire = Fire(100, HEIGHT - block_size - 64, 16, 32)
    fire.off()
    floor = [Block(i * block_size, HEIGHT - block_size, block_size)
             for i in range(-WIDTH // block_size, (WIDTH * 2) // block_size)]

enemy1= Enemy (400, HEIGHT - block_size - 64,32, 32,"snake2.png")
enemy2= Enemy (700, HEIGHT- block_size - 64, 32, 32, "snake4.png")  

objects = [
        *floor,
        Block(0, HEIGHT - block_size*2, block_size),
        Block(block_size*3, HEIGHT - block-size*4, block_size),
        Block(block_size*6, HEIGHT - block_size*3, block_size),
        fire,
        enemy1,
        enemy2,
    ]

offset_x = 0
scroll_area_width = 400
    
run = True
while run:
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                break

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and player.jump_count < 2:
                    player.jump()  #double jump


        player.loop(FPS)
        fire.loop()
        enemy1.loop()
        enemy2.loop()
        handle_move(player, objects)
        draw(window, background, bg_image, player, objects, offset_x)

        if (
            (player.rect.right - offset_x >= WIDTH - scroll_area_width and player.x_vel > 0)
             or
        (player.rect.left - offset_x <= scroll_area_width and player.x_vel < 0)
        ):
            offset_x += player.x_vel

pygame.quit()
quit()

if __name__== "_ _main_ _":
    main(window)