#events
The events extension exposes three methods on the component prototype, `on`, `off` and `trigger`.

These methods facilitate the majority of the other extensions, enable thrid-party extensions, and allow for arbitrary events to be raised on a component.

All triggered events also become DOM events and bubble by default.

##component.prototype.trigger
Trigger, or raise events on a component. Most extensions raise their own events. This feature allows extension and component authors raise custom arbitrary events on the component. Events raised by the trigger method become DOM events that bubble by default.

```
component.trigger('recieveMessage', {
    body: 'Dear component ...'
});
```

##component.prototype.on
Listen for events raised by the component. Most extensions raise their own events. This feature allows for extensions and features such as the following which listens for the `data` event raised by the data extension and then calls the `render` method to re-render the components shadowDOM.

```
MyComponent.prototype.on('data', function onData(data) {
    this.render(this.templateFragment, this.data);
});
```

This particular pattern is so common, that it has been turned into an extension and can be included as part of a distribution.

_Note: In order to listen for DOM events or events that bubble up from composed components, the event listener must be attached to the component instance via `addEventListner`. The listener cannot be attached via the `Constructor.prototype` pattern. The listener must also be attached via `addEventListener` currently. When doing so, the payload of the event can be found one the `detail` property of the event object per the CustomEvent spec. We hope to allow for a instance specific `on` method soon.

```
myComponent.addEventListener('my-custom-event', function (evt) {
    //do stuff with evt.detail
});
```

##component.prototype.off
Remove a listener function from a specific event type.

__Example__

```
Component.prototype.off('data', onData);
```
