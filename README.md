<h1>Sydb</h1>

<p>A simple local database using the Node.js file system module.</p>
<br>

<h2>Starting</h2>

```javascript
    const Sydb = require('sydb')

    const db = new Sydb(options)
```

| Parameter         | Type      | Optional | Default       | Descrirption                                                                                                      |
|-------------------|-----------|----------|---------------|-------------------------------------------------------------------------------------------------------------------|
| options.path      | `string`  | `false`  | `./sydb.json` | Database File Path                                                                                                |
| options.split     | `string`  | `true`   | `/`           | Separator for dividing to reference properties                                                                    |
| options.autoSave  | `boolean` | `true`   | `false`       | Automatically save when you hear a change                                                                         |
| options.spaceJson | `number`  | `true`   | `4`           | Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read. |

<br>

<h2>Examples</h2>

<h3>Preparing</h3>

Json File
```json
    {
        "users": {
            "002": {
                "name": "Pinho",
                "username": "jvopinho",
                "skills": [
                    "JavaScript",
                    "TypeScript",
                    "NodeJS",
                    "ReactJS",
                    "NextJS"
                ]
            }
        }
    }
```

```javascript
    const Sydb = require('sydb')

    const db = Sydb(__dirname + '/sydb.json')
```

<h4>Applying reference:</h4>

```javascript
    db.ref('reference')

    // Example

    db.ref('users/001')
```

<h3>Methods</h3>

<h4>Val</h4>
<p>The val method returns the value of the path determined by the reference</p>

```javascript
    db.ref(reference).val()
```

```javascript
    db.ref('users/002').val() // -> { name: 'Pinho', username: 'jvopinho', skills: [...] }
```
<br>
<p>The val method returns the value of the path determined by the reference in map form</p>

```javascript
    db.ref('users/').val({ type: 'map' }) // -> Map(1) { '002': [Object] }
```

<br>
<h4>Set</h4>

<p>The set method changes the value of the path determined by the reference.</p>

```javascript
    db.ref(reference).set(value)
```

```javascript
    db.ref('users/002').set({
        name: 'John Pinho',
    }) // -> { users: { '002': { name: 'John Pinho' } } }
```

<br>
<h4>Update</h4>

<p>The update method changes the desired values of a path determined by the reference.</p>
<p><strong>Note: value must be an object.</strong></p>

```javascript
    db.ref(reference).update(value)
```

```javascript
    db.ref('users/002').update({
        username: 'JPinho'
    }) // -> { users: { '002': { name: 'Pinho', username: 'JPinho', skills: [...] } } }
```

<br>
<h4>Delete</h4>

<p>The delete method deletes the desired values from a path determined by the reference.</p>

```javascript
    db.ref('reference').delete()
```

```javascript
    db.ref('users/002').delete() // -> { users: {} }
```
