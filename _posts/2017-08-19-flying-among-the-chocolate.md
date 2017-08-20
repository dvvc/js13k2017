---
layout: post
title: Day 5
subtitle: Flying across the chocolate
---

[![Flying!]({{site.baseurl}}/images/day5-fly.gif)](http://js13k.no-sync.com/rev/d346562)

Some progress on the camera movement front today! The direction didn't seem
totally right, but I finally figured out the problem was the coordinate
system. It really was a basic 3D issue when moving the camera entity after
having rotated it.

I also found some strange behavior because the camera would not move when
running the game in GearVR. I am still not fully sure of what fixed it, but I
think it was the combination of two issues: first, it seems I couldn't move the
camera when in VR mode, so I had to switch to move the wrapper element, and
second, I got confused because I was mixing A-Frame attributes and three.js
attributes. For example, if you do something like
`this.el.object3D.position.add(...)`, which modifies the element's position in
three.js, then `this.el.getAttribute('position')` is not updated. In the end I
had to use three.js because it comes with some nice transformation functions
like `translateZ()` or `getWorldDirection()`.

In any case, once that was fixed I got the flying effect I was aiming for: the
camera nicely travels over the terrain following the player's gaze. I reduced
the speed a lot and I think it is not too dizzying, yay!

# Next steps

One of the things I'd like to improve is the terrain generation algorithm so
that there's more height variation. I am currently scaling the mesh after I
generate the terrain, which gives it a more cartoonish look, but that also
flattens things. I think it would be great if there were a couple peaks and
valleys, but I'm not sure if I'll be able to get that just by tweaking the
parameters.

The other big milestone is to generate the lost people and make them wander
around, I'll probably attempt that next. My daughter already contributed a
drawing that I think should be doable and will not take too many resources!
