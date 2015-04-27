#events
The events extension exposes two methods on the component prototype, `on` and `trigger`

These two methods facilitate the majority of the other extensions, enable thrid-party extensions, and allow for arbitrary events to be raised on a component.

TODO: events extension should tap into DOM events

TODO: implement `off`

##component.prototype.on
Listen for events raised by the component. Most extensions raise their own events. Doing so allows for the ability to say, re-render a component's shadow DOM whenever data is applied to the event.

__Example__

The component listens for the `data` event raised by the _data_ extension. When the event is raised, the component uses the _render_ extension to apply the data to the component's template via a property exposed by the _template_ extension.

```
component.on('data', function (data) {
    this.render(this.templateFragment, data);
})
```

##component.prototype.trigger
Trigger, or raise events on a component. Most extensions raise their own events. This feature allows extension and component authors raise custom arbitrary events on the component.

__Example__

```
component.trigger('recieveMessage', {
    body: 'Dear component ...'
});
```

TODO: Events should tie into DOM events.
