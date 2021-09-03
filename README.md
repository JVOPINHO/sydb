<h1>Sydb</h1>

<p>A simple local database using the Node.js file system module.</p>
<br>

<h2>Starting</h2>

```javascript
    const Sydb = require("sydb")

    const db = new Sydb(path, options)
```

|   Parameter   |   Type   | Descrirption                                   |
|:-------------:|:--------:|------------------------------------------------|
| path          | `string` | File path                                      |
| options.split | `string` | Separator for dividing to reference properties `Note: Default separator is "/"` |

<br>

<h2><a href="https://github.com/JVOPINHO/sydb/blob/master/test/test.js">Examples</a></h2>

<h3>Preparing</h3>

Json File
```json
    {
        "users": {
            "001": {
                "name": "João Oliveira",
                "nickname": "JVOPINHO"
            },
            "002": null,
            "003": {
                "name": "Luiz",
                "nickname": "luizdodibre"
            },
            "004": {
                "name": "Sayran",
                "nickname": "Polaroo"
            }
        }
    }
```

```javascript
    const Sydb = require("sydb")

    const db = new Sydb(__dirname + "/sydb.json")
```

<h4>Applying reference:</h4>

```javascript
    db.ref("reference")

    // Example

    db.ref("users/001")
```

<h3>Methods</h3>

<h4>Val</h4>
<p>The val method returns the value of the path determined by the reference</p>

```javascript
    db.ref(reference).val()
```

```javascript
    db.ref("users/004").val() // -> { name: "Sayran", nickname: "Polaroo" }
```

<br>
<h4>Set</h4>

<p>The set method changes the value of the path determined by the reference.</p>

```javascript
    db.ref(reference).set(value)
```

```javascript
    db.ref("users/002").set({
        name: "Bryan",
        nickname: "TwoNike"
    }) // -> { users: { "001": {...}, "002": { name: "Bryan", nickname: "TwoNike" }, "003": {...}, "004": {...} } }
```

<br>
<h4>Update</h4>

<p>The update method changes the desired values of a path determined by the reference.</p>
<p><strong>Note: value must be an object.</strong></p>

```javascript
    db.ref(reference).update(value)
```

```javascript
    db.ref("users/001").update({
        nickname: "JPinho"
    }) // -> { users: { "001": { name: "João Oliveira", nickname: "JPinho" }, "002": {...}, "003": {...}, "004": {...} } }
```

<br>
<h4>Delete</h4>

<p>The delete method deletes the desired values from a path determined by the reference.</p>

```javascript
    db.ref("reference").delete()
```

```javascript
    db.ref("users/003").delete() // -> { users: { "001": {...}, "002": {...}, "004": {...} } }
```
