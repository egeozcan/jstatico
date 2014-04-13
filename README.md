jstatico
==========================
creates a json tree from a directory, applies the built-in filters and
puts the output in the destination directory.

    npm install jstatico

and then

    jstatico inputDirectory outputDirectory

to run tests

    npm test

That's it!

I use this to generate egeozcan.com

An example site is included. See the folder named "test".

TODO
----
* Add support for custom processors and preprocessors
* Add documentation for custom generators (example available in test/src/blog)

License: MIT