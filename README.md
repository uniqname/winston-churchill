# winston-churchill

##usage

### installing Winston Churchill

```
bower install https://github.com/uniqname/winston-churchill.git
```

##documentation

###WC

The `WC` object is exposed as a global in order to provide access to it's functionality across imported components. There are only three properties on the `WC` object. All other functionality comes in the form of extensions and typically are a part of winston-churchill component prototype or instance.

###WC.register
The register method is the way components are registered with the document and is primarily a light wrapper around the native `document.registerElement` with a handful of extras. One of those extras is extending the prototype of a web component with winston-churchill extensions.

_TODO: allow for register-time extensions._

###WC.extensions
The extensions property is a dictionary of winston-churchill extensions that all winston-churchill components will have access to in their prototype. These extensions can be added directly:

```
WC.extionsions[extensionName] = function () { ... }
```

or, preferably by calling a winston-churchill extension's initialization function:

```
import someExtension from './extensions/someExtension';

someExtension();
```

These initialization functions will typically bind to the either the component's prototype or to the component instance at one of the native lifecycle events.

##component
An instance  of a winston chruchill component will have all included extensions available to it. Nearly all of these extensions are optional, with events being the one exception.

##Extensions
