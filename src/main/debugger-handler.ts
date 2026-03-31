import { getDebugger } from './debugger'

export async function keyboardInput(key: string) {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  const keyNum = Number.parseInt(key, 10)
  const vkCode = 48 + keyNum
  const keyCode = `Digit${key}`

  try {
    await debuggerClient.sendCommand('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key,
      code: keyCode,
      text: key,
      windowsVirtualKeyCode: vkCode,
      nativeVirtualKeyCode: vkCode,
    })

    await debuggerClient.sendCommand('Input.dispatchKeyEvent', {
      type: 'char',
      key,
      text: key,
      windowsVirtualKeyCode: vkCode,
    })

    await debuggerClient.sendCommand('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key,
      code: keyCode,
      windowsVirtualKeyCode: vkCode,
      nativeVirtualKeyCode: vkCode,
    })

    console.log(`Dispatched key event for key "${key}" (vkCode: ${vkCode})`)

    return true
  } catch (err) {
    console.error('Failed to dispatch key event:', err)
    return false
  }
}

async function getRootNodeId() {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  const { root } = (await debuggerClient.sendCommand('DOM.getDocument')) as {
    root: { nodeId: number }
  }

  return root.nodeId
}

async function getElementNodeId(hostNodeId: number, selector: string) {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  try {
    const { nodeId } = (await debuggerClient.sendCommand('DOM.querySelector', {
      nodeId: hostNodeId,
      selector,
    })) as { nodeId: number }

    return nodeId
  } catch (err) {
    console.error('Failed to get nodeId:', err)
    return false
  }
}

async function getShadowRootNodeId(hostNodeId: number, index: number = 0) {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  try {
    const { node } = await debuggerClient.sendCommand('DOM.describeNode', { nodeId: hostNodeId })
    return node.shadowRoots[index].nodeId
  } catch (err) {
    console.error('Failed to get shadow root nodeId:', err)
    return false
  }
}

export async function focusElement(
  elementId: string,
  insedShadowRootSelector: string | null = null,
) {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  try {
    const rootNodeId = await getRootNodeId()
    if (!rootNodeId) return false

    let nodeId = await getElementNodeId(rootNodeId, `#${elementId}`)
    if (!nodeId) return false

    if (insedShadowRootSelector) {
      const shadowRootNodeId = await getShadowRootNodeId(nodeId)

      nodeId = await getElementNodeId(shadowRootNodeId, insedShadowRootSelector)
    }

    await debuggerClient.sendCommand('DOM.focus', { nodeId })

    return true
  } catch (err) {
    console.error('Failed to focus element:', err)
    return false
  }
}

export type ClickPosition = 'left' | 'center' | 'right' | 'top' | 'bottom'

export async function clickElement(
  elementId: string,
  insideShadowRootSelector: string | null = null,
  position: ClickPosition = 'center',
) {
  const debuggerClient = getDebugger()
  if (!debuggerClient) return false

  try {
    const rootNodeId = await getRootNodeId()
    if (!rootNodeId) return false

    let nodeId = await getElementNodeId(rootNodeId, `#${elementId}`)
    if (!nodeId) return false

    if (insideShadowRootSelector) {
      const shadowRootNodeId = await getShadowRootNodeId(nodeId)

      nodeId = await getElementNodeId(shadowRootNodeId, insideShadowRootSelector)
    }

    const { model } = (await debuggerClient.sendCommand('DOM.getBoxModel', { nodeId: nodeId })) as {
      model: { content: [number, number, number, number, number, number, number, number] }
    }
    const [x1, y1, _x2, _y2, x3, y3, _x4, _y4] = model.content

    // use 3 percent offset from the edges to avoid clicking right on the border, which can cause issues in some cases
    const deltaY = (y3 - y1) * 0.05
    const deltaX = (x3 - x1) * 0.05

    const adjustedX1 = x1 + deltaX
    const adjustedY1 = y1 + deltaY
    const adjustedX3 = x3 - deltaX
    const adjustedY3 = y3 - deltaY

    const centerX = (x1 + x3) / 2
    const centerY = (y1 + y3) / 2
    const offsetX = position === 'left' ? adjustedX1 : position === 'right' ? adjustedX3 : centerX
    const offsetY = position === 'top' ? adjustedY1 : position === 'bottom' ? adjustedY3 : centerY

    console.log(`Clicking element at (${offsetX}, ${offsetY}) with position "${position}"`)

    // Dispatch the click events
    await debuggerClient.sendCommand('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: offsetX,
      y: offsetY,
      button: 'left',
      clickCount: 1,
    })

    await debuggerClient.sendCommand('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: offsetX,
      y: offsetY,
      button: 'left',
      clickCount: 1,
    })

    return true
  } catch (err) {
    console.error('Failed to click and focus element:', err)
    return false
  }
}
