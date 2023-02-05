# typefinity

This is a personal project for my own use only. It's supposed to become a general-purposeTypeScript library to quickly draft everyday scripts.

So far, my language of choice has been AWK. It's fully geared towards getting the job done quickly. That's perfect for simple scripts that don't have a long maintenance cycle. Setting up a new application takes literally no time at all. The language itself is incredibly simple, but solving problems requires very little code to be written.

While AWK is great for rapid development, it lacks some features and pretty much all amenities of modern development. Tooling support is almost non-existent, there are no type checks, and AWK doesn't even have objects (let alone classes). This limits the manageable complexity of applications, wastes time hunting down runtime errors, and requires ugly hacks to simulate any kind of data structure beyond the built-in hash tables.

Moving forward, I want to switch to TypeScript. It has great tooling support and superior type inference. This allows writing scripts in a typesafe way with minimal boilerplate code. But JavaScript lacks some AWK features like automatic input parsing, which make prototyping in AWK so efficient. It also comes with a significantly higher setup cost. It's easy to spend an hour tweaking the `tsconfig.json`, setting up dependencies, and configuring build scripts.

typefinity is supposed to combine the best of both worlds. It's a TypeScript library with AWK-inspired features and a wizard to quickly set up new projects. The final goal is to require no manual setup at all and have a new (empty) script and build pipeline up and running in less than a minute.
