---
title: JS13K entry
layout: page
---

# JS13K entry

This is the journal for my entry to the [JS13KGames Competition](http://js13kgames.com).

The JS13kGames competition consists in creating a game in a month using
JavaScript. The catch is, the whole game —including code and assets—, must be
smaller than 13KB compressed as a zip.

I am planning to submit an entry for the WebVR track! I will be recording my
progress here.

The theme for this year is **"LOST"**.

## Posts
---

{% assign posts = site.posts | sort: 'date' %}
{% for post in posts %}
  - [{{ post.title }} — {{post.subtitle}}]({{ post.url | prepend: site.github.url }})
{% endfor %}
