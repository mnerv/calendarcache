# redis database storage

#### `calendar:{id}`

where `{id}` is the hash of the `name`.

```ts
interface ICalendar {
  name:    string
  source:  string[]
  id:      string
  created: Date
  updated: Date
}
```

where `id` is the hash of the `name`.

`souce: string[]` as array of strings add feature for merging multiple calendar sources.

#### `events:{id}`

where `{id}` is the hash of the `source`. This key stores array of `IEvent` as `JSON`.

```ts
interface IEvent {
  start: Date
  end:   Date

  title:       string
  description: string
  location:    string

  url: string
}
```

#### `cache:events:{id}`

#### `archive:{id}`

#### `archive:events:{id}`
