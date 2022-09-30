# Delaunifier

Simple script I wrote that does cool things to images, because I needed a new background.

## Instructions

Usage:
`node index [flag] [value] [flag] [value]...`

Flags:

> -o: Output file.

> -f: Input file.

> -p: Point count for triangulation.

> -help: Displays help.

## How it works

Uses [Delaunator](https://github.com/mapbox/delaunator) to triangulate a set of random points in an image, then creates a new image where each triangle is filled with the average color in the image within the triangle. It's pretty simple, although I ended up rewriting most of it 3 times because of weirdness with canvas (I ended up just using [Jimp](https://github.com/oliver-moran/jimp) for image pixel data). I used to have width and height as flags, but then I realized they were entirely redundent.

# DON'T BE A DICK PUBLIC LICENSE

> Version 1.1, December 2016

> Copyright (C) 2022 Orander Robinson-Hartley

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document.

> DON'T BE A DICK PUBLIC LICENSE
> TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

1. Do whatever you like with the original work, just don't be a dick.

   Being a dick includes - but is not limited to - the following instances:

1a. Outright copyright infringement - Don't just copy this and change the name.
1b. Selling the unmodified original with no work done what-so-ever, that's REALLY being a dick.
1c. Modifying the original work to contain hidden harmful content. That would make you a PROPER dick.

2. If you become rich through modifications, related works/services, or supporting the original work,
   share the love. Only a dick would make loads off this work and not buy the original work's
   creator(s) a pint.

3. Code is provided with no warranty. Using somebody else's code and bitching when it goes wrong makes
   you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.
