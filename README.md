React with styles
=================

* [Demos](#demos)
* [Motivation](#motivation)
* [react-animate](#react-animate)
* [react-css](#react-css)
* [react-animate with react-css](#react-animate-with-react-css)
* [Conclusion](#conclusion)
* [Credits](#credits)

### <a name='demos'>Demos</a>

- [Simple animation](http://elie.rotenberg.io/react-styling-demo/dist/SimpleAnimation.html)
- [Simple CSS](http://elie.rotenberg.io/react-styling-demo/dist/SimpleCSS.html)
- [Simple animation and CSS combined](http://elie.rotenberg.io/react-styling-demo/dist/SimpleAnimationWithCSS.html)
- [Slightly more advanced demo (wheel spinner)](http://elie.rotenberg.io/react-styling-demo/dist/SpinWheel.html)
- [All demos in 1 page](http://elie.rotenberg.io/react-styling-demo/dist/index.html) (without code)

### <a name='motivation'>Motivation</a>
For a while now, I've been a [React](http://reactjs.org) enthusiast. However, almost every React code I had a chance to read was either very small examples from the contributors repos or contrived cases or butchery to forcefeed React into AngularJS apps.

Most of the real-life examples of React usage I've seen resolve to using [getDOMNode()](http://facebook.github.io/react/docs/component-api.html#getdomnode) to interoperate with JS DOM libs, such as jQuery, which kind of defeats the whole purpose of using React in the first place: working only on a virtual DOM, never touch the real DOM, and let the framework optimize the actual DOM mutations.

One striking example is styling and animation. React supports inline-styling injection, much like it supports any other DOM element attributes. Low-level support is there, but its simply not high level enough to be used efficiently in practice, when compared to the goodness of modern libs such as the excellent [VelocityJS](http://julian.com/research/velocity/).

My first approach was to use CSS transitions to do the job, and toggle classes in a components [render()](http://facebook.github.io/react/docs/component-specs.html#render) method. This worked okay, but writing CSS animations is a pain, compared to the very straightforward, imperative approach of Velocity, d3, or jQuery. I had recently spent time reading pretty much all the code of Velocity, which was enlightening, and decided that JS-powered animation was a viable, efficient alternative to the dreadful pain of handwriting CSS transitions. I wanted to re-use Velocity directly, but Velocity works directly on the real DOM, which I wanted to avoid. So I had to port the good ideas of Velocity into React virtual DOM, and make sure performance or usability wouldn't be lost in the process.

### <a name='react-animate'>react-animate</a>

The base idea is very simple: start an animation with an imperative method call in a component method (an `animate` method), which would be triggered by a callback (such as a `onClick` handler). `animate` would start a series of state changes ocurring a each animation frame, each change of state inducing a re-rendering of the component with the proper interpolated intermediate state. At the end of the animation, a callback would be invoked. A notable detail retained from Velocity that matches very well with React philosophy is that you should (and in `react-animate`, you _must_) always forcefeed both the initial and the final states, to avoid querying the DOM for the initial state. After all, in a React component, you should always be able to tell what the state of the DOM is, since _you_ modified in the first place!

```js
    getInitialState: function() {
        return { animating: false, animatedStyle: null };
    }
    animate: function(...) {
        var begin = Date.now(), end = Date.now() + duration;
        function nextAnimationFrame() {
            var t = (Date.now() - begin)/(end - begin);
            if(t > 1) { 
                    // Set this.state.animating to false and invoke callback
            }
            else {
                component.setState({ animating: true, animatedStyle: interpolate(beginStyle, endStyle, ease(t)) });
                requestAnimationFrame(nextAnimationFrame);
            }
        }
        requestAnimationFrame(nextAnimationFrame);
    },
    render: function() {
        return (
            <a onClick={this.animate(...)}>Click to animate</a>
            <div style={this.state.animating ? this.state.animatedStyle : null}>I am animated!</div>
        );
    }
```

With this idea in mind, the rest is just implementation details, most of which have already been solved by others (kudos to `Velocity` and `d3`):
- polyfill requestAnimationFrame for browsers that dont support it
- polish the API to make it more usable and in particular, to prevent multiple animations from interfering (in case you want to animate multiple elements/properties at once)
- use `d3` interpolators to actually interpolate values and easing,
- cache relevant values to avoid unnecessary recalculations
- stuff this into a React mixin so that any component can be upgraded with animation capabilities
- leverage hardware acceleration on mobile devices (but not on browser desktops)

You can watch the [demo](http://elie.rotenberg.io/react-styling-demo/dist/SimpleAnimation.html), and use this mixin right now by `npm install`-ing `react-animate` or from [Github](https://github.com/elierotenberg/react-animate). The repo is a bit heavy right now since I require all `d3` but I may cut the unnecessary parts at some point in the future.

### <a name='react-css'>react-css</a>

* Installation: `npm install react-css`
* Quick usage: `require("react-css").fromCSS(...)`

After solving this animation problem, I quickly faced another problem when dealing with styling in React: vendor-prefixing css properties. It is a related but fundamentally different problem.
While vendor-prefixing will ultimately become irrelevant in the happy world of evergreen browsers, many properties and values in many browsers still need to be vendor-prefixed for a significant part of our users.
Autoprefixer or CSS preprocessors have freed us from the hell of manually vendor-prefixing CSS properties and values, but in plain React, you can't use these tools directly, so you have to vendor-prefix `render()`-injected styles by hand.
This was unacceptable to me, so once again I decided to leverage the excellent work of `Autoprefixer` and `css-parse`. This would give a single function, `fromCSS`, that converts plain old non-prefixed CSS code into React-style style object, optionally (activated by default) auto-prefixed by `Autoprefixer`.

```js
var fromCSS = function fromCSS(css) {
    css = autoprefixer.process("* " + css).css; // preprend a dummy selector to transform into a parsable rule
    var rules = {};
    var parsed = parse(css);
    _.each(parsed.stylesheet.rules, function(rule) {
        _.each(rule.declarations, function(decl) {
            rules[toCamelCase(decl.property)] = decl.value;
        });
    });
    return rules;
};
```

At first glance, you might be tempted to use it like this:
```js
render: function() {
    return (
        <div style={fromCSS("{ opacity: 0.5; }")}>I am not that opaque.</div>
    );
```

This would "work" but be very unefficient, since `render()` is meant to be called very often and very agressively, and therefore needs to be super-fast. Calling `fromCSS` runs the CSS parser and the autoprefixer, both of which are relatively slow. Fortunately, most times styles can be easily cached. The previous example can be efficiently refactored into:


```js
/* ... */
reactStyle = fromCSS("{ opacity: 0.5; }");

var MyComponent = React.createClass({
    render: function() {
        return (
            <div style={reactStyle}>I am not that opaque.</div>
        )
    },
});
```

Alternatively, one can memoize fromCSS directly, for example using [`_.memoize`](http://lodash.com/docs#memoize) (watch out for memory leaking, though).

You can see the [demo](http://elie.rotenberg.io/react-styling-demo/dist/SimpleCSS.html) and use `fromCSS` right now by `npm install`-ing `react-css` or from [Github](https://github.com/elierotenberg/react-css).

### <a name='react-animate-with-react-css'>react-animate + react-css </a>

`react-animate` and `react-css` perform very well together, since many animation-related properties come vendor-prefixed. For example, if we want to animate a rotation, we can use the result of `fromCSS` as the initial and final states.

```js
var from = fromCSS("{ transform: rotate(0deg); background-color: blue; margin: 50px; width: 200px; }");

var to = fromCSS("{ transform: rotate(180deg); background-color: green; margin: 50px; width: 200px; }");

var SimpleAnimationWithCSS = React.createClass({
    mixins: [AnimateMixin],
    showOff: function showOff() {
        this.animate("my-custom-animation", from, to, "cubic-in-out", 5000, this.stopShowingOff);
    },
    stopShowingOff: ... // handle animation end
    render: function render() {
        return (
            <div>
                <a onClick={this.showOff}>Click to show off !</a>
                { this.state.showoff ? (
                    <div style={this.getAnimatedStyle("my-custom-animation")}>
                        What a show off !
                    </div>
                ) : null }
            </div>
        );
    },
});
```

You can see two demos, a [simple](http://elie.rotenberg.io/react-styling-demo/dist/SimpleAnimationWithCSS.html) and a [less simple](http://elie.rotenberg.io/react-styling-demo/dist/SpinWheel.html).


### <a name='conclusion'>Conclusion</a>

One annoying thing with react is that very often, to comply with react coding style and gain the most from its internal optimization, you can't re-use directly libs that are conceived for the DOM. You typically either have to re-write them entirely or unwrap some of their internals to make them work on react's virtual dom instead of vanilla DOM.
However, this annoyance is well compensated. First, it is an opportunity to really understand what makes these libs so efficient (or conversely, to understand whether they are really required in the first place). Second, the effort is actually minimal. It took me no more than a few hours to have react-animate work fine, since I could re-use the internals of d3, so all I had to do was to come up with a useable API and rewrap the internals of d3 to work on the render/update loop of React rather than in the imperative style of vanilla DOM APIs. I'd definitely do it again, also, since I think React is really awesome and only needs a few more bricks in its ecosystem (style being one of them, now partially solved) to be fully mature.

I'll keep `react-animate` and `react-css` up-to-date, since I use them on a daily basis for my own projects. My plans for the future include improving styling support. My next step will probably to find a way to define true CSS classes associated with the components in a declarative, in-code manner, to avoid relying only on inline-styling when some things should be kept and the class/stylesheet level, but should still be declared in a components source file instead of a stylesheet file.

### <a name='credits'>Credits</a>

Credits to:
- React core team and contributors,
- d3,
- Velocity and the amazing docs and readable code,
- [react.animate](https://github.com/pleasetrythisathome/react.animate) for the idea of using `d3` interpolators/easings,
- @Vjeux from React for the feedback,
- my company, Gameo, running [millenium.org](http://www.millenium.org).