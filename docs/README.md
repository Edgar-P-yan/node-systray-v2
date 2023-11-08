node-systray-v2

# node-systray-v2

## Table of contents

### Classes

- [default](classes/default.md)

### Type Aliases

- [Action](README.md#action)
- [ClickEvent](README.md#clickevent)
- [Conf](README.md#conf)
- [Event](README.md#event)
- [Menu](README.md#menu)
- [MenuItem](README.md#menuitem)
- [ReadyEvent](README.md#readyevent)
- [UpdateItemAction](README.md#updateitemaction)
- [UpdateMenuAction](README.md#updatemenuaction)
- [UpdateMenuAndItemAction](README.md#updatemenuanditemaction)

## Type Aliases

### Action

Ƭ **Action**: [`UpdateItemAction`](README.md#updateitemaction) \| [`UpdateMenuAction`](README.md#updatemenuaction) \| [`UpdateMenuAndItemAction`](README.md#updatemenuanditemaction)

#### Defined in

[src/index.ts:58](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L58)

___

### ClickEvent

Ƭ **ClickEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `item` | [`MenuItem`](README.md#menuitem) |
| `seq_id` | `number` |
| `type` | ``"clicked"`` |

#### Defined in

[src/index.ts:27](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L27)

___

### Conf

Ƭ **Conf**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `copyDir?` | `boolean` \| `string` |
| `debug?` | `boolean` |
| `menu` | [`Menu`](README.md#menu) |

#### Defined in

[src/index.ts:63](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L63)

___

### Event

Ƭ **Event**: [`ClickEvent`](README.md#clickevent) \| [`ReadyEvent`](README.md#readyevent)

#### Defined in

[src/index.ts:37](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L37)

___

### Menu

Ƭ **Menu**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `icon` | `string` |
| `items` | [`MenuItem`](README.md#menuitem)[] |
| `title` | `string` |
| `tooltip` | `string` |

#### Defined in

[src/index.ts:20](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L20)

___

### MenuItem

Ƭ **MenuItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checked` | `boolean` |
| `enabled` | `boolean` |
| `title` | `string` |
| `tooltip` | `string` |

#### Defined in

[src/index.ts:13](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L13)

___

### ReadyEvent

Ƭ **ReadyEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"ready"`` |

#### Defined in

[src/index.ts:33](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L33)

___

### UpdateItemAction

Ƭ **UpdateItemAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `item` | [`MenuItem`](README.md#menuitem) |
| `seq_id` | `number` |
| `type` | ``"update-item"`` |

#### Defined in

[src/index.ts:39](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L39)

___

### UpdateMenuAction

Ƭ **UpdateMenuAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `menu` | [`Menu`](README.md#menu) |
| `seq_id` | `number` |
| `type` | ``"update-menu"`` |

#### Defined in

[src/index.ts:45](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L45)

___

### UpdateMenuAndItemAction

Ƭ **UpdateMenuAndItemAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `item` | [`MenuItem`](README.md#menuitem) |
| `menu` | [`Menu`](README.md#menu) |
| `seq_id` | `number` |
| `type` | ``"update-menu-and-item"`` |

#### Defined in

[src/index.ts:51](https://github.com/zaaack/node-systray/blob/ec3a387/src/index.ts#L51)
