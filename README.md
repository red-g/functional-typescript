# functional-typescript
A simple and flexible take on functional typescript programming.
<p>
This repo is my take on the some of the functional libraries and approaches to typescript & javascript that have been floating around for the past few years. I tried to aim for simplicity and ease of use, while also providing the core features that people have come to appreciate from the functional programming style.
</p>
<h2>Features</h2>
<p>
Across the hkt, utils, and struct folders you will find the functionality and typing required for higher kinded types, pattern matching, structs, piping, and type classes.<br/>I provided the option file as an example of an implementation making use of these features, while the index file shows the library and option type in use.
</p>
<h2>Future Plans</h2>
<p>
This project is still in its very early stages but I hope that I won't have to add much more, since the building blocks its provides should be flexible enough for most situations. With that said, an immediate goal is to add in automatically implemented methods with type classes (like first for an iterable, etc). 
</p>
<h2>Issues</h2>
<p>Typescript is a <i>massive</i> pain when it comes to type inference and higher kinded types. Though this library makes a lot of things more ergonomic, there are still some major pain points. I'm hoping that with some ingenuity and improvements to Typescript, these can be resolved, or at least worked around.</p>