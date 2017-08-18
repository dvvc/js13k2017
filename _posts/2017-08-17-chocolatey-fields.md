---
layout: post
title: Day 3
subtitle: Chocolatey Fields
---

[![Chocolate!]({{site.baseurl}}/images/day3-terrain.png)](http://js13k.no-sync.com/rev/8ebdcad)

Today was terrain generation day.

I did some quick investigation, and it seemed the most suitable method to
generate the terrain would be the
[Diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm). The
idea is you start subdividing a plane and then adding the corners' averaged
elevation plus some random number to the center of the subdivision . It is kind
of like repeatedly folding a paper, where the creases become mountains, just the
elevations are more accentuated and random.

I won't go into much detail, but if you are interested, the algorithm looks like
this (courtesy of Wikipedia):

![Diamond-square algorithm](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Diamond_Square.svg/1499px-Diamond_Square.svg.png)

In the end, you get a range of mountains like in the top picture. There are some
parameters to play with, like the elevation that is applied to each new point, a
dampening factor so that at every iteration the changes are less pronounced,
etc. Part of the fun when doing this is just tweaking these parameters and then
looking at the result.

The implementation was not too bad: I ended up with some quick and dirty
recursive function—not the most elegant code I've written by a long shot—but the
result seemed acceptable. The interesting thing is the whole algorithm just
added around 330 bytes to the final (minified + zipped) package.

After I got the mesh working, I played a bit to position the camera and a light
to get a good view of the terrain. Then I set a material and color for the mesh,
and that was it! I mean, it was not that easy because three.js has a ton of
materials. I ended up using a `MeshPhongMaterial` with flat shading. The A-Frame
incorporated inspector made things really easy, since one can drag entities
around, change their properties, and then export them as HTML.

The last thing I did today was to add a cursor to the center view of the
camera. I started thinking about how I'd implement movement and I found
[this great demo](https://sandbox.donmccurdy.com/checkpoints) from the
[A-Frame Extras](https://github.com/donmccurdy/aframe-extras) package. I haven't
gone too deep into the movement part, but I liked the cursor and the type of
controls.

The code to add the cursor in front of the camera is really easy:

```html
<a-camera>
  <a-entity cursor
    position="0 0 -1"
    geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03;"
    material="color: #CCC; shader: flat;">
  </a-entity>
</a-camera>
```

However this added almost 100 bytes to the zipped package! As I've mentioned
before, I really wished there wasn't a space limit to use A-Frame fully! I tried
creating the cursor element via JavaScript, but it ended up being a few bytes
larger, so I'm leaving it like that for now.

# Next steps

Starting tomorrow, I'll being implementing camera movement. After having tried
the current prototype on a Samsung GearVR I got a little dizzy, so I'm somewhat
concerned about the movement. I've also noticed my Galaxy S6 struggles a bit
when there are a lot of things in the screen, so it seems I'll have to optimize
for performance as well as space! But that will come in due time. I have also
been feeling a bit limited when doing 3D stuff, since this is the first time I
do something like this, so I'll have to spend some time learning three.js.
