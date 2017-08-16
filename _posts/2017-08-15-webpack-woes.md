---
layout: post
title: Day 1
subtitle: Webpack Woes
---

I lasted for two days so far, yay!

Today was kind of crazy, and I didn't know if I'd have energy to do any
work. However, I finally managed to do some build setup. Everything is now ready
to start adding code and content to the game!

I found some helpful
links. [Here](https://gamedevelopment.tutsplus.com/articles/how-to-minify-your-html5-game-for-the-js13kgames-competition--cms-21883)
is an article with techniques to reduce the submission size. I also found
[JSFXR](http://github.grumdrig.com/jsfxr/), a web version of
[SFXR](http://www.drpetter.se/project_sfxr.html), which is a tool to generate
sound effects. I'll be using it to add sound to the game!

# Game idea

I haven't had much luck with the game idea yet. I am not super concerned because
I still have to spend time understanding A-Frame, so hopefully the next days
will be better. I'll probably have to sit down and do a brainstorming session,
which tends to be quite effective. One interesting thing I've noticed is, while
I usually don't have any problems coming up with game ideas for "traditional"
games, thinking in VR is making it more difficult. I am not sure if that's
because I haven't played many VR games, or just because there are a lot more
things to have in mind (What does the player see when they turn the head to a
side? What does the environment sound like? etc.)

For the past two days, every time I try to imagine what the game would look
like, I only visualize vast, dream-like landscapes. It looks great in my head,
but I'm sure going down that route is not going to be easy. The *lost* theme
does fit nicely for that, but still... perhaps too literal? It could be I'm
thinking about this type of game because one of my references for a great VR
experience is [Sechelt](https://mozvr.com/webvr-demos/demos/sechelt/).

# Build setup

I couldn't spend a lot of time today, but I think I checked all boxes for what I
had in mind. The build system is going to be what I usually use for web
development, that is, NPM, Webpack, JSLint and Babel. I am not sure it's the
best setup for this kind of constrained game, but it's what I can get working
the fastest, so if I ever find it is not good I'll deal with it.

The advantages of this setup for this particular case are:

 - Modern ES6 development
 - Code minification to save space
 - Linting
 - Hot reloading
 - Automating stuff

 Webpack has a lot of plugins, so it's likely I'll be able to find helpers for
 other tasks easily.

I implemented some NPM scripts to perform the most common tasks from now on,
namely:

 - *npm run dev*: Start the game with hot reloading enabled. This detects changes
   to the code and reloads the browser with the most up-to-date version
   automatically.
 - *npm run zip*: Generates the submission zip file. I won't need this for some
   time, but it's better to have this working now to avoid potential issues when
   the date is closer.
 - *npm run size*: A very important task to keep track of the zip file size. I
   was actually surprised to realize the current zip is already around 1KB! And
   this just includes a bare-bones index.html and a minified js file. Keeping
   this number low is going to be challenging!

# Tomorrow's plan

Now that the build system and the journal are in place, I don't have any more
excuses! Tomorrow I'll start playing around with A-Frame to get used to
it. In the WebVR track, A-Frame does not count towards the size limit, so I'll
try to understand all it does to save space!
