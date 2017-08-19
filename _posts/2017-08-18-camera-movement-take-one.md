---
layout: post
title: Day 4
subtitle: Camera Movement, Take One
---

Not much to report today. I've mostly been reading A-Frame and three.js
tutorials and trying to figure out how to move the camera. The idea is to move
the viewport towards the direction the camera is facing.

I found some issues initially, mostly because I didn't understand how local and
world coordinates work. My camera is an A-Frame component inside of an entity,
so it took me some reading to realize the coordinates and rotation of the camera
are relative to the parent entity, rather than to the scene.

I also created a component to perform the position updates every tick, which is
very easy to do in A-Frame. The downside is this increased the size considerably
(around 150 bytes so far, which is quite a lot for just getting the camera
direction and using it to move the entity). However, I should have very few
components (this one being the ship that's driven by the player), so the
overhead is manageable so far.

Finally it seemed I got the movement working on the computer. However, when I
run the program in the headset, the camera position was not updated
anymore. I'll keep trying to get this working tomorrow!
