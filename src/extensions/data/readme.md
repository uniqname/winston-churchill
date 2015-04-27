#data

##component.data
The _data_ extension exposes a non-configurable, non-enumerable `data` property on the component that when set, also raises a `data` event.

```
component.on('data', function () {
    this.render(this.templateFragment, this.data);
});

component.data = {
    "captain": "Mal",
    "first-officer": "Zoë",
    "pilot": "Wash",
    "mechanic": "Kaylee",
    "muscle": "Jayne"
}

//the assignment to data above causes the component to render with data.
```

`on`, `render`, and `templateFragment` are exposed via the _events_, _render_ and _template_ extensions respectively.
