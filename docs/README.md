node-systray-v2

# node-systray-v2

## Table of contents

### Classes

- [SysTray](classes/SysTray.md)

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

[src/index.ts:54](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L54)

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

[src/index.ts:23](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L23)

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

[src/index.ts:59](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L59)

___

### Event

Ƭ **Event**: [`ClickEvent`](README.md#clickevent) \| [`ReadyEvent`](README.md#readyevent)

#### Defined in

[src/index.ts:33](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L33)

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

[src/index.ts:16](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L16)

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

[src/index.ts:9](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L9)

___

### ReadyEvent

Ƭ **ReadyEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"ready"`` |

#### Defined in

[src/index.ts:29](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L29)

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

[src/index.ts:35](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L35)

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

[src/index.ts:41](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L41)

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

[src/index.ts:47](https://github.com/Edgar-P-yan/node-systray-v2/blob/0098e9b/src/index.ts#L47)
